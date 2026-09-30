import ProfileModel from '../models/profile.model.js';
import MatchPreferenceModel from '../models/matchPreference.model.js';

/**
 * Matchmaking Service — Real-time Queue & Weighted Matching Engine
 * Decoupled Business Logic for REST & Socket Handlers
 */

// In-Memory Waiting Queue Pool Map (Key: userId string, Value: queueCandidate object)
const waitingQueuePool = new Map();

/**
 * Calculate Match Score between Candidate A and Candidate B
 * Score Formula: GenderMatch + LocationScore + InterestOverlap + HeightCheck + WaitBonus
 */
export const calculateMatchScore = (candidateA, candidateB) => {
    let score = 0;

    const userA = candidateA.user;
    const prefA = candidateA.preference || {};
    const profA = candidateA.profile || {};

    const userB = candidateB.user;
    const prefB = candidateB.preference || {};
    const profB = candidateB.profile || {};

    // 1. Gender Filter Check (Mutual Compatibility)
    const aWantsB = !prefA.gender || prefA.gender === 'any' || prefA.gender === userB.gender;
    const bWantsA = !prefB.gender || prefB.gender === 'any' || prefB.gender === userA.gender;

    if (!aWantsB || !bWantsA) {
        return -1; // Incompatible gender filter
    }
    score += 40; // Gender compatibility pass

    // 2. Location Compatibility Score
    const cityA = (prefA.city || profA.city || '').toLowerCase();
    const cityB = (prefB.city || profB.city || '').toLowerCase();
    const stateA = (prefA.state || profA.state || '').toLowerCase();
    const stateB = (prefB.state || profB.state || '').toLowerCase();
    const pinA = (prefA.pincode || '').trim();
    const pinB = (prefB.pincode || '').trim();
    const locTextA = (prefA.locationText || '').toLowerCase();
    const locTextB = (prefB.locationText || '').toLowerCase();

    if (pinA && pinB && pinA === pinB) {
        score += 35; // Exact pincode match
    } else if (cityA && cityB && cityA === cityB) {
        score += 30; // Same city match
    } else if (locTextA && locTextB && (locTextA.includes(locTextB) || locTextB.includes(locTextA))) {
        score += 25; // Location text match
    } else if (stateA && stateB && stateA === stateB) {
        score += 20; // Same state match
    } else {
        score += 10; // Anywhere match
    }

    // 3. Interest Tag Overlap Score (Jaccard Similarity)
    const interestsA = new Set(prefA.interests || profA.interests || []);
    const interestsB = new Set(prefB.interests || profB.interests || []);

    if (interestsA.size > 0 && interestsB.size > 0) {
        let overlap = 0;
        interestsA.forEach(tag => {
            if (interestsB.has(tag)) overlap++;
        });
        const unionSize = new Set([...interestsA, ...interestsB]).size;
        const jaccardRatio = overlap / unionSize;
        score += Math.round(jaccardRatio * 30); // Max 30 pts for 100% tag overlap
    }

    // 4. Height Range Compatibility Check
    const heightB = profB.heightCm || 165;
    const minH = prefA.minHeightCm || 140;
    const maxH = prefA.maxHeightCm || 210;
    if (heightB >= minH && heightB <= maxH) {
        score += 10;
    }

    // 5. Queue Wait Time Bonus (+5 pts per 3 seconds waiting to avoid starvation)
    const waitSecondsA = Math.floor((Date.now() - candidateA.joinedAt) / 3000);
    const waitSecondsB = Math.floor((Date.now() - candidateB.joinedAt) / 3000);
    score += (waitSecondsA + waitSecondsB) * 5;

    return score;
};

// Add User to Match Queue
export const addToMatchQueue = async (user, socketId) => {
    const userIdStr = user._id.toString();

    // Fetch latest profile and target match preferences
    const profile = await ProfileModel.findOne({ userId: user._id });
    const preference = await MatchPreferenceModel.findOne({ userId: user._id });

    const candidate = {
        userId: userIdStr,
        user,
        profile: profile || {},
        preference: preference || {},
        socketId,
        joinedAt: Date.now()
    };

    waitingQueuePool.set(userIdStr, candidate);
    return candidate;
};

// Remove User from Match Queue
export const removeFromMatchQueue = (userId) => {
    const userIdStr = userId.toString();
    waitingQueuePool.delete(userIdStr);
};

// Find Best Match Candidate in Queue
export const findBestMatchInQueue = (currentUserId) => {
    const currentCandidate = waitingQueuePool.get(currentUserId.toString());
    if (!currentCandidate) return null;

    let bestMatch = null;
    let highestScore = -1;
    const MIN_THRESHOLD = 0; // Instant random match pairing for any available candidate

    for (const [id, opponentCandidate] of waitingQueuePool.entries()) {
        if (id === currentUserId.toString()) continue;

        const score = calculateMatchScore(currentCandidate, opponentCandidate);
        if (score >= MIN_THRESHOLD && score > highestScore) {
            highestScore = score;
            bestMatch = opponentCandidate;
        }
    }

    return bestMatch ? { opponent: bestMatch, matchScore: highestScore } : null;
};
