import React, { useEffect, useState, useRef, useCallback } from 'react';
import { getPreferencesApi, updatePreferencesApi, getInterestsApi } from './settings.api';
import { AppleGroupedList } from './components/AppleGroupedList';
import { SegmentedControl } from './components/SegmentedControl';
import { Check, MapPin, Crosshair, Plus, X, Globe, Tag } from 'lucide-react';

const MatchPreferencesSettings = () => {
    const [gender, setGender] = useState('any');
    const [locationMode, setLocationMode] = useState('anywhere'); // anywhere, city, state, current_location
    const [locationInput, setLocationInput] = useState('');
    const [pincode, setPincode] = useState('');
    const [savedLocationText, setSavedLocationText] = useState('');
    const [minAge, setMinAge] = useState(18);
    const [maxAge, setMaxAge] = useState(60);

    const [customTagInput, setCustomTagInput] = useState('');
    const [selectedInterests, setSelectedInterests] = useState([]);
    const [availableInterests, setAvailableInterests] = useState([
        'Coding & Tech', 'Gaming', 'Music', 'Travel & Adventure',
        'Books & Anime', 'Fitness & Gym', 'Art & Cinema', 'Startups'
    ]);

    const [isLoading, setIsLoading] = useState(true);
    const [isDetectingLoc, setIsDetectingLoc] = useState(false);
    const [saveToast, setSaveToast] = useState(false);
    const [locToast, setLocToast] = useState('');

    const debounceTimerRef = useRef(null);

    // Fetch Preferences & Interests from API
    useEffect(() => {
        let isMounted = true;

        const loadData = async () => {
            setIsLoading(true);
            try {
                const [prefRes, intRes] = await Promise.allSettled([
                    getPreferencesApi(),
                    getInterestsApi()
                ]);

                if (!isMounted) return;

                if (prefRes.status === 'fulfilled' && prefRes.value) {
                    const data = prefRes.value.data || prefRes.value;
                    setGender(data.gender || 'any');
                    setLocationMode(data.targetLocationMode || 'anywhere');
                    setLocationInput(data.locationText || data.city || '');
                    setPincode(data.pincode || '');
                    setSavedLocationText(data.locationText || data.city || (data.pincode ? `Pincode: ${data.pincode}` : ''));
                    setMinAge(data.ageRange?.minAge || 18);
                    setMaxAge(data.ageRange?.maxAge || 60);
                    if (data.interests && Array.isArray(data.interests)) {
                        setSelectedInterests(data.interests);
                    }
                }

                if (intRes.status === 'fulfilled' && intRes.value && Array.isArray(intRes.value)) {
                    // Extract tag names if items are objects or strings
                    const raw = intRes.value;
                    const parsed = raw.map(i => (typeof i === 'string' ? i : i.name || i.code)).filter(Boolean);
                    if (parsed.length > 0) {
                        setAvailableInterests(parsed);
                    }
                }
            } catch (err) {
                console.warn('Preferences API fetch notice:', err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        loadData();

        return () => {
            isMounted = false;
        };
    }, []);

    // Auto-Save Handler with 500ms Debounce
    const triggerAutoSave = useCallback((payload) => {
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        debounceTimerRef.current = setTimeout(async () => {
            try {
                await updatePreferencesApi(payload);
                setSaveToast(true);
                setTimeout(() => setSaveToast(false), 2000);
            } catch (err) {
                console.warn('Auto-save preference notice:', err);
            }
        }, 500);
    }, []);

    // Change Handlers
    const handleGenderChange = (val) => {
        setGender(val);
        triggerAutoSave({
            gender: val,
            targetLocationMode: locationMode,
            locationText: locationInput,
            pincode,
            ageRange: { minAge, maxAge },
            interests: selectedInterests
        });
    };

    const handleLocationModeChange = (val) => {
        setLocationMode(val);
        triggerAutoSave({
            gender,
            targetLocationMode: val,
            locationText: locationInput,
            pincode,
            ageRange: { minAge, maxAge },
            interests: selectedInterests
        });
    };

    const handleSaveLocation = () => {
        const text = locationInput.trim();
        setSavedLocationText(text || (pincode ? `Pincode: ${pincode}` : 'Saved'));
        triggerAutoSave({
            gender,
            targetLocationMode: locationMode,
            locationText: text,
            city: text,
            pincode: pincode.trim(),
            ageRange: { minAge, maxAge },
            interests: selectedInterests
        });
        setLocToast('Location saved!');
        setTimeout(() => setLocToast(''), 2500);
    };

    const handleDetectCurrentLocation = () => {
        if (!navigator.geolocation) {
            setLocToast('Geolocation is not supported by your browser');
            return;
        }

        setIsDetectingLoc(true);
        setLocToast('Detecting location...');

        navigator.geolocation.getCurrentPosition(
            async (pos) => {
                const { latitude, longitude } = pos.coords;
                const locStr = `Lat: ${latitude.toFixed(2)}, Lng: ${longitude.toFixed(2)}`;
                setLocationInput(locStr);
                setSavedLocationText('Current GPS Location');
                setIsDetectingLoc(false);

                triggerAutoSave({
                    gender,
                    targetLocationMode: 'current_location',
                    locationText: locStr,
                    lat: latitude,
                    lng: longitude,
                    ageRange: { minAge, maxAge },
                    interests: selectedInterests
                });
                setLocationMode('current_location');
                setLocToast('Current location detected & saved!');
                setTimeout(() => setLocToast(''), 3000);
            },
            (err) => {
                setIsDetectingLoc(false);
                setLocToast(`Unable to get location (${err.message || 'Permission denied'})`);
                setTimeout(() => setLocToast(''), 3500);
            },
            { enableHighAccuracy: true, timeout: 10000 }
        );
    };

    const handleMinAgeChange = (val) => {
        const num = Math.max(18, Math.min(Number(val) || 18, maxAge));
        setMinAge(num);
        triggerAutoSave({
            gender,
            targetLocationMode: locationMode,
            locationText: locationInput,
            pincode,
            ageRange: { minAge: num, maxAge },
            interests: selectedInterests
        });
    };

    const handleMaxAgeChange = (val) => {
        const num = Math.max(minAge, Math.min(Number(val) || 60, 99));
        setMaxAge(num);
        triggerAutoSave({
            gender,
            targetLocationMode: locationMode,
            locationText: locationInput,
            pincode,
            ageRange: { minAge, maxAge: num },
            interests: selectedInterests
        });
    };

    // Custom Tag Handlers
    const handleAddCustomTag = (e) => {
        if (e) e.preventDefault();
        const tag = customTagInput.trim();
        if (!tag) return;

        if (selectedInterests.length >= 5) {
            setLocToast('Maximum 5 interest tags allowed');
            setTimeout(() => setLocToast(''), 2500);
            return;
        }

        if (selectedInterests.includes(tag)) {
            setCustomTagInput('');
            return;
        }

        const next = [...selectedInterests, tag];
        setSelectedInterests(next);
        setCustomTagInput('');
        triggerAutoSave({
            gender,
            targetLocationMode: locationMode,
            locationText: locationInput,
            pincode,
            ageRange: { minAge, maxAge },
            interests: next
        });
    };

    const handleRemoveTag = (tag) => {
        const next = selectedInterests.filter((x) => x !== tag);
        setSelectedInterests(next);
        triggerAutoSave({
            gender,
            targetLocationMode: locationMode,
            locationText: locationInput,
            pincode,
            ageRange: { minAge, maxAge },
            interests: next
        });
    };

    const handleToggleSuggestedTag = (tag) => {
        let next;
        if (selectedInterests.includes(tag)) {
            next = selectedInterests.filter((x) => x !== tag);
        } else {
            if (selectedInterests.length >= 5) {
                setLocToast('Maximum 5 interest tags allowed');
                setTimeout(() => setLocToast(''), 2500);
                return;
            }
            next = [...selectedInterests, tag];
        }
        setSelectedInterests(next);
        triggerAutoSave({
            gender,
            targetLocationMode: locationMode,
            locationText: locationInput,
            pincode,
            ageRange: { minAge, maxAge },
            interests: next
        });
    };

    if (isLoading) {
        return (
            <div className="w-full text-left flex flex-col gap-6 animate-pulse">
                <div className="h-8 bg-neutral-200 rounded-lg w-48 mb-2" />
                <div className="h-32 bg-white rounded-2xl border border-neutral-200" />
                <div className="h-32 bg-white rounded-2xl border border-neutral-200" />
            </div>
        );
    }

    return (
        <div className="w-full text-left flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-2 duration-200 pb-10">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-semibold tracking-tight text-[#1D1D1F]">Match Preferences</h1>
                    <p className="text-sm text-[#86868B] mt-1 font-normal">
                        Configure candidate filtering for 1-on-1 random video queueing
                    </p>
                </div>
                {saveToast && (
                    <span className="px-3 py-1 rounded-full bg-neutral-900 text-white text-xs font-medium shadow-sm animate-in fade-in">
                        Saved
                    </span>
                )}
            </div>

            {/* 1. Who You Meet */}
            <AppleGroupedList header="WHO YOU MEET">
                <div className="p-4 sm:p-5 flex flex-col gap-5">
                    {/* Interested In Dropdown */}
                    <div>
                        <label className="text-xs font-medium text-[#86868B] mb-1.5 block">
                            Interested In
                        </label>
                        <select
                            value={gender}
                            onChange={(e) => handleGenderChange(e.target.value)}
                            className="w-full px-4 py-2.5 bg-neutral-100/80 border border-neutral-200 rounded-xl text-sm font-semibold text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
                        >
                            <option value="any">Anyone (All Genders)</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="non_binary">Non-Binary</option>
                            <option value="lgbtq">LGBTQ+</option>
                            <option value="other">Others</option>
                        </select>
                    </div>

                    {/* Age Range UI */}
                    <div className="pt-3 border-t border-neutral-100">
                        <div className="flex justify-between items-center mb-2.5">
                            <span className="text-xs font-medium text-[#86868B]">Age Range</span>
                            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-neutral-900 text-white">
                                {minAge} – {maxAge} years
                            </span>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                                <span className="block text-[11px] font-medium text-[#86868B] mb-1">Min Age</span>
                                <input
                                    type="number"
                                    min="18"
                                    max={maxAge}
                                    value={minAge}
                                    onChange={(e) => handleMinAgeChange(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black shadow-2xs"
                                />
                            </div>
                            <div className="bg-neutral-50 p-3 rounded-xl border border-neutral-200/80">
                                <span className="block text-[11px] font-medium text-[#86868B] mb-1">Max Age</span>
                                <input
                                    type="number"
                                    min={minAge}
                                    max="99"
                                    value={maxAge}
                                    onChange={(e) => handleMaxAgeChange(e.target.value)}
                                    className="w-full px-3 py-1.5 bg-white border border-neutral-200 rounded-lg text-sm font-bold text-[#1D1D1F] focus:outline-none focus:ring-2 focus:ring-black shadow-2xs"
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </AppleGroupedList>

            {/* 2. Matching Location */}
            <AppleGroupedList
                header="MATCHING LOCATION"
                footer="Saved location remains saved in database and filters candidate queueing. Default is Anywhere."
            >
                <div className="p-4 sm:p-5 flex flex-col gap-4">
                    {/* Location Mode Selector */}
                    <SegmentedControl
                        options={[
                            { id: 'anywhere', label: 'Anywhere' },
                            { id: 'city', label: 'City / Pincode' },
                            { id: 'state', label: 'State' },
                            { id: 'current_location', label: 'Current Location' }
                        ]}
                        value={locationMode}
                        onChange={handleLocationModeChange}
                    />

                    {/* City / Pincode / State Input Box */}
                    {(locationMode === 'city' || locationMode === 'state' || locationMode === 'pincode') && (
                        <div className="flex flex-col gap-3 pt-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                <div>
                                    <label className="block text-[11px] font-medium text-[#86868B] mb-1">
                                        City Name or Area
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. Mumbai, Delhi, Bengaluru"
                                        value={locationInput}
                                        onChange={(e) => setLocationInput(e.target.value)}
                                        className="w-full px-3.5 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[11px] font-medium text-[#86868B] mb-1">
                                        Pincode (Optional)
                                    </label>
                                    <input
                                        type="text"
                                        placeholder="e.g. 400001"
                                        value={pincode}
                                        onChange={(e) => setPincode(e.target.value)}
                                        className="w-full px-3.5 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all"
                                    />
                                </div>
                            </div>

                            <button
                                type="button"
                                onClick={handleSaveLocation}
                                className="self-end px-4 py-2 bg-[#1D1D1F] text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
                            >
                                <MapPin className="w-3.5 h-3.5" />
                                Save Location
                            </button>
                        </div>
                    )}

                    {/* Current Location Detector Button */}
                    {locationMode === 'current_location' && (
                        <div className="flex flex-col gap-3 pt-2">
                            <div className="p-3 bg-neutral-50 rounded-xl border border-neutral-200 flex items-center justify-between">
                                <div className="flex items-center gap-2 text-xs font-medium text-[#1D1D1F]">
                                    <Crosshair className="w-4 h-4 text-emerald-600 animate-spin" style={{ animationDuration: '4s' }} />
                                    <span>Detect location via browser GPS</span>
                                </div>
                                <button
                                    type="button"
                                    disabled={isDetectingLoc}
                                    onClick={handleDetectCurrentLocation}
                                    className="px-3.5 py-1.5 bg-black text-white rounded-lg text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-50"
                                >
                                    {isDetectingLoc ? 'Detecting...' : 'Detect & Save'}
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Saved Location Status Badge */}
                    {savedLocationText && (
                        <div className="flex items-center gap-2 text-xs text-[#86868B] bg-neutral-100 px-3 py-1.5 rounded-lg w-fit">
                            <MapPin className="w-3.5 h-3.5 text-neutral-600" />
                            <span>Saved Location: <strong className="text-[#1D1D1F] font-semibold">{savedLocationText}</strong></span>
                        </div>
                    )}

                    {locToast && (
                        <p className="text-xs font-medium text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200/60 animate-in fade-in">
                            {locToast}
                        </p>
                    )}
                </div>
            </AppleGroupedList>

            {/* 3. Custom Interest Tags */}
            <AppleGroupedList
                header="INTEREST TAGS"
                footer="Enter up to 5 custom interest tags to match with users sharing similar passions. Defaults to matching anyone if empty."
            >
                <div className="p-4 sm:p-5 flex flex-col gap-4">
                    {/* Add Custom Tag Form */}
                    <form onSubmit={handleAddCustomTag} className="flex gap-2">
                        <div className="relative flex-1">
                            <Tag className="w-4 h-4 text-neutral-400 absolute left-3 top-1/2 -translate-y-1/2" />
                            <input
                                type="text"
                                placeholder="Type a custom interest tag (e.g. Anime, Crypto, Football)..."
                                value={customTagInput}
                                onChange={(e) => setCustomTagInput(e.target.value)}
                                maxLength={30}
                                disabled={selectedInterests.length >= 5}
                                className="w-full pl-9 pr-3 py-2 bg-neutral-100 border border-neutral-200 rounded-xl text-xs font-semibold text-[#1D1D1F] focus:bg-white focus:outline-none focus:ring-2 focus:ring-black transition-all disabled:opacity-50"
                            />
                        </div>
                        <button
                            type="submit"
                            disabled={!customTagInput.trim() || selectedInterests.length >= 5}
                            className="px-4 py-2 bg-[#1D1D1F] text-white rounded-xl text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer disabled:opacity-40 flex items-center gap-1 shadow-sm"
                        >
                            <Plus className="w-3.5 h-3.5" />
                            Add
                        </button>
                    </form>

                    {/* Selected Custom Tag Chips */}
                    <div className="flex flex-col gap-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[11px] font-medium text-[#86868B]">
                                Active Filter Tags ({selectedInterests.length}/5)
                            </span>
                            {selectedInterests.length > 0 && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setSelectedInterests([]);
                                        triggerAutoSave({
                                            gender,
                                            targetLocationMode: locationMode,
                                            locationText: locationInput,
                                            pincode,
                                            ageRange: { minAge, maxAge },
                                            interests: []
                                        });
                                    }}
                                    className="text-[11px] text-red-600 hover:underline cursor-pointer"
                                >
                                    Clear all
                                </button>
                            )}
                        </div>

                        {selectedInterests.length === 0 ? (
                            <p className="text-xs text-[#86868B] italic bg-neutral-50 p-2.5 rounded-lg border border-dashed border-neutral-200">
                                Default: Matching with anyone (no interest filter active).
                            </p>
                        ) : (
                            <div className="flex flex-wrap gap-2">
                                {selectedInterests.map((tag) => (
                                    <span
                                        key={tag}
                                        className="px-3 py-1 bg-[#1D1D1F] text-white rounded-full text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                                    >
                                        <span>{tag}</span>
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveTag(tag)}
                                            className="hover:text-neutral-300 cursor-pointer p-0.5 rounded-full"
                                        >
                                            <X className="w-3.5 h-3.5" />
                                        </button>
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Suggested Tag Quick Selection */}
                    {availableInterests.length > 0 && (
                        <div className="pt-3 border-t border-neutral-100">
                            <span className="block text-[11px] font-medium text-[#86868B] mb-2">
                                Popular Tag Suggestions:
                            </span>
                            <div className="flex flex-wrap gap-2">
                                {availableInterests.map((tag) => {
                                    const isSelected = selectedInterests.includes(tag);
                                    return (
                                        <button
                                            key={tag}
                                            type="button"
                                            onClick={() => handleToggleSuggestedTag(tag)}
                                            className={`px-3 py-1 rounded-full text-xs font-medium transition-all duration-200 cursor-pointer flex items-center gap-1 ${
                                                isSelected
                                                    ? 'bg-neutral-800 text-white font-semibold'
                                                    : 'bg-neutral-100 text-[#1D1D1F] hover:bg-neutral-200'
                                            }`}
                                        >
                                            {isSelected ? <Check className="w-3 h-3" /> : <Plus className="w-3 h-3 text-neutral-400" />}
                                            <span>{tag}</span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    )}
                </div>
            </AppleGroupedList>
        </div>
    );
};

export default MatchPreferencesSettings;
