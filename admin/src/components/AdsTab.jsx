import React, { useState, useEffect } from 'react';
import {
    Megaphone,
    ToggleLeft,
    ToggleRight,
    ExternalLink,
    Code,
    Image,
    Eye,
    MousePointerClick,
    Smartphone,
    Monitor,
    Save,
    RefreshCw,
    Sparkles
} from 'lucide-react';
import { getAdminAds, updateAdminAds, toggleAdPlacement } from '../api/admin.api.js';
import { toast } from 'sonner';

/**
 * AdsTab — Website Ad Placement Controller & Live Preview
 * ("webiste p add laga kaha lagana all things")
 */
const AdsTab = () => {
    const [placements, setPlacements] = useState([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [activePlacementId, setActivePlacementId] = useState('TOP_BANNER');
    const [previewMode, setPreviewMode] = useState('desktop');

    useEffect(() => {
        fetchAds();
    }, []);

    const fetchAds = async () => {
        try {
            setLoading(true);
            const res = await getAdminAds();
            if (Array.isArray(res)) {
                setPlacements(res);
                if (res.length > 0 && !activePlacementId) {
                    setActivePlacementId(res[0].id);
                }
            }
        } catch (err) {
            console.error(err);
            toast.error("Failed to load ad placements", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setLoading(false);
        }
    };

    const handleToggle = async (placement) => {
        const nextState = !placement.isEnabled;
        try {
            await toggleAdPlacement(placement.id, nextState);
            setPlacements((prev) =>
                prev.map((p) => (p.id === placement.id ? { ...p, isEnabled: nextState } : p))
            );
            toast.success(`${placement.name} ${nextState ? 'Activated' : 'Paused'}`);
        } catch (err) {
            toast.error("Toggle failed", {
                description: err.response?.data?.message || err.message
            });
        }
    };

    const handleFieldChange = (field, value) => {
        setPlacements((prev) =>
            prev.map((p) => (p.id === activePlacementId ? { ...p, [field]: value } : p))
        );
    };

    const handleSaveAll = async () => {
        try {
            setSaving(true);
            await updateAdminAds(placements);
            toast.success("Ad placements saved successfully to AppConfig");
        } catch (err) {
            toast.error("Save failed", {
                description: err.response?.data?.message || err.message
            });
        } finally {
            setSaving(false);
        }
    };

    const currentAd = placements.find((p) => p.id === activePlacementId) || placements[0];

    return (
        <div className="space-y-6 animate-fade-in text-left">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                <div>
                    <h3 className="text-base font-bold tracking-tight text-neutral-900 dark:text-neutral-100 flex items-center gap-2">
                        <Megaphone className="w-4 h-4 text-amber-500" />
                        Website Ad Placements Manager
                    </h3>
                    <p className="text-xs text-neutral-500 mt-0.5">
                        Control exactly where ads appear across weeChat (Top Banner, Video Call, Rooms, Dock)
                    </p>
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={fetchAds}
                        className="p-2 rounded-xl border border-neutral-200 dark:border-neutral-700 text-neutral-500 hover:bg-neutral-100 dark:hover:bg-neutral-800 cursor-pointer"
                        title="Reload Ad Settings"
                    >
                        <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                    </button>

                    <button
                        onClick={handleSaveAll}
                        disabled={saving}
                        className="px-5 py-2 rounded-xl bg-black text-white dark:bg-white dark:text-black text-xs font-bold flex items-center gap-2 hover:opacity-90 transition-opacity cursor-pointer shadow-md disabled:opacity-50"
                    >
                        <Save className="w-3.5 h-3.5" />
                        <span>{saving ? 'Saving...' : 'Save Placements'}</span>
                    </button>
                </div>
            </div>

            {loading ? (
                <div className="py-24 flex flex-col items-center justify-center gap-3">
                    <div className="w-8 h-8 rounded-full border-2 border-neutral-300 border-t-black dark:border-t-white animate-spin" />
                    <p className="text-xs text-neutral-500 font-medium">Loading ad positions and statistics...</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    {/* Left: Placements List */}
                    <div className="lg:col-span-5 space-y-3">
                        <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider px-1">
                            Ad Locations ({placements.length})
                        </p>

                        {placements.map((p) => {
                            const isSelected = p.id === activePlacementId;
                            return (
                                <div
                                    key={p.id}
                                    onClick={() => setActivePlacementId(p.id)}
                                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                                        isSelected
                                            ? 'bg-white dark:bg-neutral-800 border-black dark:border-white shadow-md'
                                            : 'bg-white/60 dark:bg-neutral-900/60 border-neutral-200/80 dark:border-neutral-800/80 hover:bg-white dark:hover:bg-neutral-850'
                                    }`}
                                >
                                    <div className="flex items-center justify-between mb-1.5">
                                        <div className="flex items-center gap-2">
                                            <span className="text-xs font-bold text-neutral-900 dark:text-neutral-100">
                                                {p.name}
                                            </span>
                                            {p.isEnabled ? (
                                                <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 text-[10px] font-bold">
                                                    LIVE
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-500 dark:bg-neutral-800 text-[10px] font-bold">
                                                    OFF
                                                </span>
                                            )}
                                        </div>

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleToggle(p);
                                            }}
                                            className="text-neutral-400 hover:text-neutral-900 dark:hover:text-white transition-colors cursor-pointer"
                                        >
                                            {p.isEnabled ? (
                                                <ToggleRight className="w-6 h-6 text-emerald-500" />
                                            ) : (
                                                <ToggleLeft className="w-6 h-6 text-neutral-300 dark:text-neutral-600" />
                                            )}
                                        </button>
                                    </div>

                                    <p className="text-[11px] text-neutral-500 leading-snug">
                                        {p.description}
                                    </p>

                                    <div className="flex items-center gap-3 mt-3 pt-2.5 border-t border-neutral-100 dark:border-neutral-800/80 text-[10px] text-neutral-400 font-medium">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-3 h-3 text-neutral-400" />
                                            {p.impressions || 0} impressions
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <MousePointerClick className="w-3 h-3 text-neutral-400" />
                                            {p.clicks || 0} clicks
                                        </span>
                                        <span className="capitalize ml-auto font-bold text-neutral-600 dark:text-neutral-300">
                                            {p.provider}
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right: Selected Placement Editor & Live Preview */}
                    <div className="lg:col-span-7 space-y-6">
                        {currentAd && (
                            <div className="p-6 rounded-3xl bg-white/80 dark:bg-neutral-900/80 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 shadow-sm space-y-5">
                                <div className="flex items-center justify-between pb-3 border-b border-neutral-200/80 dark:border-neutral-800">
                                    <div>
                                        <h4 className="text-sm font-bold text-neutral-900 dark:text-neutral-100">
                                            Configure: {currentAd.name}
                                        </h4>
                                        <p className="text-xs text-neutral-500 font-mono">Location ID: {currentAd.id}</p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-semibold text-neutral-600 dark:text-neutral-400">
                                            Display Ad:
                                        </span>
                                        <button
                                            onClick={() => handleToggle(currentAd)}
                                            className="cursor-pointer"
                                        >
                                            {currentAd.isEnabled ? (
                                                <ToggleRight className="w-7 h-7 text-emerald-500" />
                                            ) : (
                                                <ToggleLeft className="w-7 h-7 text-neutral-300 dark:text-neutral-600" />
                                            )}
                                        </button>
                                    </div>
                                </div>

                                {/* Form Fields */}
                                <div className="space-y-4 text-xs">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                                Ad Provider Type
                                            </label>
                                            <select
                                                value={currentAd.provider}
                                                onChange={(e) => handleFieldChange('provider', e.target.value)}
                                                className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                                            >
                                                <option value="custom_image">Custom Banner Image</option>
                                                <option value="google_adsense">Google AdSense</option>
                                                <option value="script">Custom HTML / JS Code</option>
                                                <option value="affiliate">Sponsor Affiliate Link</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                                Ad Title / Sponsor Label
                                            </label>
                                            <input
                                                type="text"
                                                value={currentAd.title || ''}
                                                onChange={(e) => handleFieldChange('title', e.target.value)}
                                                placeholder="e.g. Join weeChat Creators"
                                                className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                            Subtitle / Caption
                                        </label>
                                        <input
                                            type="text"
                                            value={currentAd.caption || ''}
                                            onChange={(e) => handleFieldChange('caption', e.target.value)}
                                            placeholder="e.g. Host rooms with up to 100 members with zero lag"
                                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none"
                                        />
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div>
                                            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                                Banner Image URL
                                            </label>
                                            <input
                                                type="url"
                                                value={currentAd.imageUrl || ''}
                                                onChange={(e) => handleFieldChange('imageUrl', e.target.value)}
                                                placeholder="https://... (PNG/JPG/WebP)"
                                                className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-mono text-[11px]"
                                            />
                                        </div>

                                        <div>
                                            <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                                Target Redirect Link URL
                                            </label>
                                            <input
                                                type="url"
                                                value={currentAd.targetUrl || ''}
                                                onChange={(e) => handleFieldChange('targetUrl', e.target.value)}
                                                placeholder="https://yourlink.com"
                                                className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-mono text-[11px]"
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block font-semibold text-neutral-700 dark:text-neutral-300 mb-1">
                                            Ad Code / Script Snippet
                                        </label>
                                        <textarea
                                            rows={3}
                                            value={currentAd.scriptCode || ''}
                                            onChange={(e) => handleFieldChange('scriptCode', e.target.value)}
                                            placeholder="<ins class='adsbygoogle' ...></ins>"
                                            className="w-full px-3.5 py-2 rounded-xl bg-neutral-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 focus:outline-none font-mono text-[11px]"
                                        />
                                    </div>
                                </div>

                                {/* Live Visual Preview */}
                                <div className="pt-4 border-t border-neutral-200/80 dark:border-neutral-800">
                                    <div className="flex items-center justify-between mb-3">
                                        <h5 className="text-xs font-bold text-neutral-700 dark:text-neutral-300 flex items-center gap-1.5">
                                            <Eye className="w-3.5 h-3.5 text-neutral-400" />
                                            Live In-App Render Preview
                                        </h5>

                                        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-neutral-100 dark:bg-neutral-800">
                                            <button
                                                onClick={() => setPreviewMode('desktop')}
                                                className={`p-1 rounded-md text-xs font-medium cursor-pointer ${
                                                    previewMode === 'desktop'
                                                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs'
                                                        : 'text-neutral-400'
                                                }`}
                                            >
                                                <Monitor className="w-3.5 h-3.5" />
                                            </button>
                                            <button
                                                onClick={() => setPreviewMode('mobile')}
                                                className={`p-1 rounded-md text-xs font-medium cursor-pointer ${
                                                    previewMode === 'mobile'
                                                        ? 'bg-white dark:bg-neutral-700 text-black dark:text-white shadow-xs'
                                                        : 'text-neutral-400'
                                                }`}
                                            >
                                                <Smartphone className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                    </div>

                                    <div className="p-4 rounded-2xl bg-neutral-100/80 dark:bg-neutral-950 border border-neutral-200/80 dark:border-neutral-800 flex items-center justify-center min-h-[120px]">
                                        <div className={`w-full transition-all ${previewMode === 'mobile' ? 'max-w-xs' : 'max-w-lg'}`}>
                                            <div className="relative overflow-hidden rounded-2xl bg-white/90 dark:bg-neutral-900/90 backdrop-blur-xl border border-neutral-200/80 dark:border-neutral-800 p-4 shadow-md group">
                                                <span className="absolute top-2 right-2 px-1.5 py-0.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-500 text-[9px] font-bold uppercase tracking-wider">
                                                    Ad • Sponsored
                                                </span>

                                                <div className="flex items-center gap-3">
                                                    {currentAd.imageUrl ? (
                                                        <img
                                                            src={currentAd.imageUrl}
                                                            alt={currentAd.title}
                                                            className="w-14 h-14 rounded-xl object-cover shrink-0"
                                                        />
                                                    ) : (
                                                        <div className="w-14 h-14 rounded-xl bg-gradient-to-tr from-amber-400 to-orange-500 flex items-center justify-center text-white shrink-0">
                                                            <Sparkles className="w-6 h-6" />
                                                        </div>
                                                    )}

                                                    <div className="flex-1 min-w-0 pr-12">
                                                        <p className="text-xs font-bold text-neutral-900 dark:text-neutral-100 truncate">
                                                            {currentAd.title || 'Your Ad Title Here'}
                                                        </p>
                                                        <p className="text-[11px] text-neutral-500 line-clamp-2 mt-0.5">
                                                            {currentAd.caption || 'Engaging subtitle highlighting your partner or offer.'}
                                                        </p>
                                                    </div>
                                                </div>

                                                {currentAd.targetUrl && (
                                                    <a
                                                        href={currentAd.targetUrl}
                                                        target="_blank"
                                                        rel="noreferrer"
                                                        className="mt-3 block text-center py-1.5 rounded-xl bg-black text-white dark:bg-white dark:text-black text-[11px] font-bold hover:opacity-90 transition-opacity"
                                                    >
                                                        Visit Website →
                                                    </a>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdsTab;
