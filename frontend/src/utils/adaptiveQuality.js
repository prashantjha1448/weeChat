/**
 * Adaptive WebRTC Quality & Bitrate Controller
 * Implements dynamic bandwidth budgeting for multi-slot mesh topology:
 * - Reads getStats() every 2.5s (availableOutgoingBitrate, RTT, packetsLost, limitationReason)
 * - Total upload budget = max(availableOutgoingBitrate) across all active PCs
 * - Per-peer budget = total / activePeers, clamped to 150-800 kbps
 * - Tiers: <300 kbps -> 2.0 (240p), 300-600 kbps -> 1.5, >600 kbps -> 1.0 (full 360p)
 * - Hysteresis: Immediate downgrade; upgrade only after 6s of sustained higher bandwidth
 * - Very low bandwidth (<150 kbps): sets video encoding active=false, keeps audio active
 * - Codec preferences: H264 preferred, fallback to VP8
 */

// Global registry of all active slot controllers to compute mesh-wide upload budget
const activePeerControllers = new Map();

/**
 * Configure preferred video codecs on transceiver prior to offer/answer
 * Prioritizes H264, falling back to VP8, then standard system codecs
 */
export const applyCodecPreferences = (transceiver) => {
    if (!transceiver || typeof transceiver.setCodecPreferences !== 'function') return;

    try {
        const capabilities = RTCRtpSender.getCapabilities?.('video');
        if (!capabilities || !capabilities.codecs) return;

        const allCodecs = capabilities.codecs;
        const h264Codecs = allCodecs.filter(c => c.mimeType.toLowerCase() === 'video/h264');
        const vp8Codecs = allCodecs.filter(c => c.mimeType.toLowerCase() === 'video/vp8');
        const otherCodecs = allCodecs.filter(
            c => c.mimeType.toLowerCase() !== 'video/h264' && c.mimeType.toLowerCase() !== 'video/vp8'
        );

        // Preference order: H264 (if available) -> VP8 -> remaining
        const preferredCodecs = [...h264Codecs, ...vp8Codecs, ...otherCodecs];
        if (preferredCodecs.length > 0) {
            transceiver.setCodecPreferences(preferredCodecs);
        }
    } catch (err) {
        console.warn('[ADAPTIVE QUALITY] Failed to set codec preferences, using browser defaults:', err.message);
    }
};

/**
 * Determine resolution tier from per-peer bitrate in kbps
 */
const getTierForBitrate = (kbps) => {
    if (kbps < 300) return { scaleDown: 2.0, label: '240p' };
    if (kbps <= 600) return { scaleDown: 1.5, label: 'Low 360p' };
    return { scaleDown: 1.0, label: '360p' };
};

/**
 * Creates an Adaptive Quality Controller for an RTCPeerConnection
 */
export const createAdaptiveQualityController = (pc, slotIndex, onStatsUpdate) => {
    let intervalId = null;
    let latestAvailableBitrateBps = 0;
    let currentScaleDown = 1.0;
    let upgradeEligibleSince = null; // Timestamp for 5-10s hysteresis window
    let isVideoActive = true;

    const controller = {
        get latestAvailableBitrate() {
            return latestAvailableBitrateBps;
        }
    };

    activePeerControllers.set(slotIndex, controller);

    const pollStats = async () => {
        if (!pc || pc.connectionState === 'closed') return;

        try {
            const stats = await pc.getStats();
            let availableOutgoingBitrate = null;
            let currentRtt = null;
            let packetsLost = 0;
            let qualityLimitationReason = 'none';

            stats.forEach((report) => {
                // 1. Candidate pair stats for available bandwidth and RTT
                if (report.type === 'candidate-pair' && report.state === 'succeeded') {
                    if (typeof report.availableOutgoingBitrate === 'number') {
                        availableOutgoingBitrate = report.availableOutgoingBitrate;
                    }
                    if (typeof report.currentRoundTripTime === 'number') {
                        currentRtt = Math.round(report.currentRoundTripTime * 1000);
                    }
                }

                // 2. Outbound video stats for packet loss and quality limitations
                if (report.type === 'outbound-rtp' && report.kind === 'video') {
                    if (typeof report.qualityLimitationReason === 'string') {
                        qualityLimitationReason = report.qualityLimitationReason;
                    }
                }

                // 3. Remote inbound stats for packet loss
                if (report.type === 'remote-inbound-rtp' && report.kind === 'video') {
                    if (typeof report.packetsLost === 'number') {
                        packetsLost = report.packetsLost;
                    }
                }
            });

            if (typeof availableOutgoingBitrate === 'number') {
                latestAvailableBitrateBps = availableOutgoingBitrate;
            }

            // Calculate total budget = max(availableOutgoingBitrate) across all active PCs
            let maxAvailableBps = latestAvailableBitrateBps;
            for (const otherCtrl of activePeerControllers.values()) {
                if (otherCtrl.latestAvailableBitrate > maxAvailableBps) {
                    maxAvailableBps = otherCtrl.latestAvailableBitrate;
                }
            }

            // Default to 1200 kbps if browser hasn't reported availableOutgoingBitrate yet
            const effectiveTotalBps = maxAvailableBps > 0 ? maxAvailableBps : 1200 * 1000;
            const activePeersCount = Math.max(1, activePeerControllers.size);

            // Per-peer budget in kbps: total / activePeers, clamped 150-800 kbps
            const rawPerPeerKbps = Math.round((effectiveTotalBps / activePeersCount) / 1000);
            const clampedPerPeerKbps = Math.max(150, Math.min(800, rawPerPeerKbps));

            // Check very low bandwidth (<150 kbps raw available)
            const isVeryLow = (effectiveTotalBps / activePeersCount) < 150 * 1000;

            // Target tier based on per-peer budget
            const targetTier = getTierForBitrate(clampedPerPeerKbps);
            const targetScaleDown = targetTier.scaleDown;

            // Hysteresis logic:
            // - Downgrade immediately if target requires higher scaleDown (lower resolution)
            // - Upgrade (lower scaleDown) only after 6 seconds of sustained stable stats
            let shouldApplyScaleDown = currentScaleDown;
            const now = Date.now();

            if (targetScaleDown > currentScaleDown) {
                // Downgrade immediately
                shouldApplyScaleDown = targetScaleDown;
                upgradeEligibleSince = null;
            } else if (targetScaleDown < currentScaleDown) {
                // Potential upgrade: require 6s of stable higher bandwidth
                if (!upgradeEligibleSince) {
                    upgradeEligibleSince = now;
                } else if (now - upgradeEligibleSince >= 6000) {
                    shouldApplyScaleDown = targetScaleDown;
                    upgradeEligibleSince = null;
                }
            } else {
                upgradeEligibleSince = null;
            }

            // Apply encoding parameters to video sender
            const videoSender = pc.getSenders().find(s => s.track && s.track.kind === 'video');
            if (videoSender) {
                const params = videoSender.getParameters();
                if (params && params.encodings && params.encodings.length > 0) {
                    let paramsChanged = false;

                    // Handle very low bandwidth: set video active = false, keep audio
                    if (isVeryLow && isVideoActive) {
                        params.encodings[0].active = false;
                        isVideoActive = false;
                        paramsChanged = true;
                    } else if (!isVeryLow && !isVideoActive) {
                        params.encodings[0].active = true;
                        isVideoActive = true;
                        paramsChanged = true;
                    }

                    // Apply bitrate clamp and scaleDown
                    const targetMaxBitrateBps = clampedPerPeerKbps * 1000;
                    if (params.encodings[0].maxBitrate !== targetMaxBitrateBps) {
                        params.encodings[0].maxBitrate = targetMaxBitrateBps;
                        paramsChanged = true;
                    }

                    if (params.encodings[0].scaleResolutionDownBy !== shouldApplyScaleDown) {
                        params.encodings[0].scaleResolutionDownBy = shouldApplyScaleDown;
                        currentScaleDown = shouldApplyScaleDown;
                        paramsChanged = true;
                    }

                    // Degradation preference
                    if (params.degradationPreference !== 'balanced') {
                        params.degradationPreference = 'balanced';
                        paramsChanged = true;
                    }

                    if (paramsChanged) {
                        await videoSender.setParameters(params);
                    }
                }
            }

            // Notify UI of updated metrics
            if (typeof onStatsUpdate === 'function') {
                onStatsUpdate({
                    perPeerKbps: clampedPerPeerKbps,
                    activePeers: activePeersCount,
                    tier: targetTier.label,
                    rtt: currentRtt,
                    packetsLost,
                    qualityLimitationReason,
                    isVideoActive
                });
            }

        } catch (err) {
            // Stats polling error
        }
    };

    return {
        start() {
            if (intervalId) clearInterval(intervalId);
            intervalId = setInterval(pollStats, 2500);
            // Initial poll
            pollStats();
        },
        stop() {
            if (intervalId) {
                clearInterval(intervalId);
                intervalId = null;
            }
            activePeerControllers.delete(slotIndex);
        }
    };
};
