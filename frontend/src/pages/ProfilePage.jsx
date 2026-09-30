import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router';
import { useProfile } from '../hooks/useProfile';

const ProfilePage = () => {
    const { user } = useSelector((state) => state.auth);
    const { profile, loading, error, loadProfileAndPreferences, handleUpdateProfile } = useProfile();
    const navigate = useNavigate();
    const fileInputRef = useRef(null);

    const [isEditing, setIsEditing] = useState(false);

    const [displayName, setDisplayName] = useState('');
    const [avatar, setAvatar] = useState('');
    const [bio, setBio] = useState('');
    const [city, setCity] = useState('');
    const [state, setState] = useState('');
    const [country, setCountry] = useState('India');
    const [gender, setGender] = useState('male');
    const [heightCm, setHeightCm] = useState(165);
    const [languages, setLanguages] = useState('');

    const [saving, setSaving] = useState(false);
    const [saveSuccess, setSaveSuccess] = useState(false);

    // Profile Picture Interactive States
    const [showAvatarMenu, setShowAvatarMenu] = useState(false);
    const [showViewModal, setShowViewModal] = useState(false);
    const [showAdjustModal, setShowAdjustModal] = useState(false);
    const [zoom, setZoom] = useState(1);
    const [rotation, setRotation] = useState(0);

    const menuTimeoutRef = useRef(null);

    useEffect(() => {
        loadProfileAndPreferences();
    }, []);

    useEffect(() => {
        if (profile) {
            setDisplayName(profile.displayName || user?.name || '');
            setAvatar(profile.avatar || '');
            setBio(profile.bio || '');
            setCity(profile.city || '');
            setState(profile.state || '');
            setCountry(profile.country || 'India');
            setGender(profile.gender || 'male');
            setHeightCm(profile.heightCm || 165);
            setLanguages(Array.isArray(profile.languages) ? profile.languages.join(', ') : '');
        }
    }, [profile, user]);

    // Handle File Input Selection
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onloadend = async () => {
            const base64Data = reader.result;
            setAvatar(base64Data);
            try {
                await handleUpdateProfile({ avatar: base64Data });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } catch (err) {
                console.error("Failed to upload avatar", err);
            }
        };
        reader.readAsDataURL(file);
    };

    // Remove Profile Picture
    const handleRemoveAvatar = async () => {
        setAvatar('');
        setShowAvatarMenu(false);
        try {
            await handleUpdateProfile({ avatar: '' });
            setSaveSuccess(true);
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to remove avatar", err);
        }
    };

    // Save Adjustments (Zoom & Rotation)
    const handleApplyAdjustments = async () => {
        if (!avatar) return;
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.src = avatar;
        img.onload = async () => {
            const canvas = document.createElement('canvas');
            const size = 300;
            canvas.width = size;
            canvas.height = size;
            const ctx = canvas.getContext('2d');

            ctx.save();
            ctx.beginPath();
            ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
            ctx.clip();

            ctx.translate(size / 2, size / 2);
            ctx.rotate((rotation * Math.PI) / 180);
            ctx.scale(zoom, zoom);

            ctx.drawImage(img, -size / 2, -size / 2, size, size);
            ctx.restore();

            const adjustedBase64 = canvas.toDataURL('image/jpeg', 0.9);
            setAvatar(adjustedBase64);
            setShowAdjustModal(false);
            setShowAvatarMenu(false);

            try {
                await handleUpdateProfile({ avatar: adjustedBase64 });
                setSaveSuccess(true);
                setTimeout(() => setSaveSuccess(false), 3000);
            } catch (err) {
                console.error("Failed to update adjusted avatar", err);
            }
        };
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSaving(true);
        setSaveSuccess(false);

        try {
            const langArray = languages
                .split(',')
                .map((lang) => lang.trim())
                .filter(Boolean);

            await handleUpdateProfile({
                displayName,
                avatar,
                bio,
                city,
                state,
                country,
                gender,
                heightCm: Number(heightCm),
                languages: langArray
            });

            setSaveSuccess(true);
            setIsEditing(false); // Return to read-only profile view mode after saving
            setTimeout(() => setSaveSuccess(false), 3000);
        } catch (err) {
            console.error("Failed to update profile", err);
        } finally {
            setSaving(false);
        }
    };

    const handleMouseEnterAvatar = () => {
        if (menuTimeoutRef.current) clearTimeout(menuTimeoutRef.current);
        setShowAvatarMenu(true);
    };

    const handleMouseLeaveAvatar = () => {
        menuTimeoutRef.current = setTimeout(() => {
            setShowAvatarMenu(false);
        }, 200);
    };

    return (
        <div className="max-w-4xl mx-auto w-full px-6 py-8 text-left selection:bg-black selection:text-white">
            <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileChange}
                accept="image/*"
                className="hidden"
            />

            {/* Back Button */}
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-xs font-bold text-neutral-600 hover:text-black transition-colors cursor-pointer mb-6"
                >
                    <span>←</span>
                    <span>Back</span>
                </button>

                {/* Header Profile Card */}
                <div className="w-full bg-white border border-neutral-200/90 rounded-3xl p-8 mb-8 shadow-xl shadow-neutral-200/60 flex flex-col sm:flex-row items-center sm:items-start justify-between gap-6 text-center sm:text-left">
                    
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
                        {/* Interactive Profile Avatar Container */}
                        <div 
                            className="relative group"
                            onMouseEnter={handleMouseEnterAvatar}
                            onMouseLeave={handleMouseLeaveAvatar}
                        >
                            <div className="w-24 h-24 rounded-full bg-neutral-900 text-white font-bold text-3xl flex items-center justify-center uppercase shadow-lg overflow-hidden border-2 border-white relative cursor-pointer">
                                {avatar ? (
                                    <img src={avatar} alt="Profile" className="w-full h-full object-cover" />
                                ) : (
                                    <span>{user?.name ? user.name.charAt(0) : 'U'}</span>
                                )}
                                
                                {/* Hover Camera Overlay */}
                                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center text-white text-[10px] font-bold uppercase tracking-wider">
                                    <span>Edit</span>
                                </div>
                            </div>

                            {/* Avatar Hover Dropdown Menu */}
                            {showAvatarMenu && (
                                <div className="absolute left-0 mt-2 w-52 bg-white border border-neutral-200 rounded-2xl p-2 shadow-2xl z-50 flex flex-col gap-1 text-left animate-in fade-in duration-150">
                                    
                                    {/* 1. Upload Profile Picture */}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowAvatarMenu(false);
                                            fileInputRef.current?.click();
                                        }}
                                        className="w-full px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-left"
                                    >
                                        Upload Profile Picture
                                    </button>

                                    {/* 2. View Profile Picture */}
                                    {avatar && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAvatarMenu(false);
                                                setShowViewModal(true);
                                            }}
                                            className="w-full px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-left"
                                        >
                                            View Profile Picture
                                        </button>
                                    )}

                                    {/* 3. Adjust Profile Picture */}
                                    {avatar && (
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setShowAvatarMenu(false);
                                                setShowAdjustModal(true);
                                            }}
                                            className="w-full px-3 py-2 text-xs font-semibold text-neutral-800 hover:bg-neutral-100 rounded-xl transition-colors cursor-pointer text-left"
                                        >
                                            Adjust Profile Picture
                                        </button>
                                    )}

                                    {/* 4. Remove Profile Picture */}
                                    {avatar && (
                                        <button
                                            type="button"
                                            onClick={handleRemoveAvatar}
                                            className="w-full px-3 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 rounded-xl transition-colors cursor-pointer text-left border-t border-neutral-100 mt-1 pt-2"
                                        >
                                            Remove Profile Picture
                                        </button>
                                    )}

                                </div>
                            )}
                        </div>

                        {/* Profile Header Details */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">
                                {displayName || user?.name || 'User Profile'}
                            </h1>
                            <p className="text-xs text-neutral-500 mt-1">
                                @{user?.username || 'username'} • {user?.email || 'email'}
                            </p>
                            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-3">
                                <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold uppercase">
                                    {gender === 'female' ? 'Female' : gender === 'male' ? 'Male' : 'Other'}
                                </span>
                                {city && (
                                    <span className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold">
                                        {city}{state ? `, ${state}` : ''}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Edit Profile Toggle Button */}
                    {!isEditing && (
                        <button
                            type="button"
                            onClick={() => setIsEditing(true)}
                            className="px-6 py-2.5 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all active:scale-95 shadow-md shadow-neutral-300 cursor-pointer"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>

                {/* Profile Display / Edit Container */}
                <div className="w-full bg-white border border-neutral-200/90 rounded-3xl p-8 shadow-2xl shadow-neutral-200/80 text-left">
                    
                    <div className="flex items-center justify-between pb-6 mb-6 border-b border-neutral-100">
                        <div>
                            <h2 className="text-lg font-bold text-neutral-900">
                                {isEditing ? "Edit Public Profile Details" : "Public Profile Details"}
                            </h2>
                            <p className="text-xs text-neutral-500 mt-0.5">
                                {isEditing ? "Customize how your profile appears during video matching" : "Your personal profile details visible during matching"}
                            </p>
                        </div>
                        {saveSuccess && (
                            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full animate-fade-in">
                                Profile Saved
                            </span>
                        )}
                    </div>

                    {/* MODE 1: READ-ONLY PROFILE DISPLAY (DEFAULT) */}
                    {!isEditing ? (
                        <div className="flex flex-col gap-6">
                            
                            {/* Bio Display */}
                            <div>
                                <h3 className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">Bio</h3>
                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200 text-sm text-neutral-800 leading-relaxed font-normal">
                                    {bio ? bio : <span className="text-neutral-400 italic">No bio provided yet. Click "Edit Profile" to add one.</span>}
                                </div>
                            </div>

                            {/* Info Overview Grid */}
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Display Name</p>
                                    <p className="text-sm font-semibold text-neutral-900">{displayName || user?.name || 'Not set'}</p>
                                </div>

                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Location</p>
                                    <p className="text-sm font-semibold text-neutral-900">
                                        {[city, state, country].filter(Boolean).join(', ') || 'Not set'}
                                    </p>
                                </div>

                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Gender & Height</p>
                                    <p className="text-sm font-semibold text-neutral-900">
                                        <span className="capitalize">{gender}</span> • {heightCm} cm
                                    </p>
                                </div>

                                <div className="p-4 bg-neutral-50 rounded-2xl border border-neutral-200">
                                    <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Languages Spoken</p>
                                    <p className="text-sm font-semibold text-neutral-900">{languages || 'English, Hindi'}</p>
                                </div>
                            </div>

                        </div>
                    ) : (
                        /* MODE 2: EDITABLE PROFILE FORM */
                        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                            
                            {/* Display Name & Bio */}
                            <div className="grid grid-cols-1 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        Display Name
                                    </label>
                                    <input
                                        type="text"
                                        value={displayName}
                                        onChange={(e) => setDisplayName(e.target.value)}
                                        placeholder="Your display name"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        Bio (Max 250 characters)
                                    </label>
                                    <textarea
                                        value={bio}
                                        onChange={(e) => setBio(e.target.value)}
                                        placeholder="Tell potential matches a little bit about yourself..."
                                        rows="3"
                                        maxLength="250"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black resize-none transition-all"
                                    />
                                </div>
                            </div>

                            {/* Location Fields: City, State, Country */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        City
                                    </label>
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => setCity(e.target.value)}
                                        placeholder="e.g. Mumbai"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        State
                                    </label>
                                    <input
                                        type="text"
                                        value={state}
                                        onChange={(e) => setState(e.target.value)}
                                        placeholder="e.g. Maharashtra"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        Country
                                    </label>
                                    <input
                                        type="text"
                                        value={country}
                                        onChange={(e) => setCountry(e.target.value)}
                                        placeholder="e.g. India"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>
                            </div>

                            {/* Gender, Height & Languages */}
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        Gender
                                    </label>
                                    <select
                                        value={gender}
                                        onChange={(e) => setGender(e.target.value)}
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm font-semibold text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    >
                                        <option value="male">Male</option>
                                        <option value="female">Female</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        Height (cm)
                                    </label>
                                    <input
                                        type="number"
                                        value={heightCm}
                                        onChange={(e) => setHeightCm(e.target.value)}
                                        placeholder="165"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-neutral-400 uppercase tracking-wider mb-2">
                                        Languages (Comma Separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={languages}
                                        onChange={(e) => setLanguages(e.target.value)}
                                        placeholder="English, Hindi"
                                        className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:border-black transition-all"
                                    />
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="pt-4 flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={() => setIsEditing(false)}
                                    className="px-6 py-3 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-8 py-3 rounded-full bg-black text-white font-semibold text-xs hover:bg-neutral-800 transition-all active:scale-95 shadow-md shadow-neutral-300 cursor-pointer"
                                >
                                    {saving ? "Saving..." : "Save Changes"}
                                </button>
                            </div>

                        </form>
                    )}

                </div>

            {/* MODAL 1: View Profile Picture Lightbox */}
            {showViewModal && (
                <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl max-w-lg w-full flex flex-col items-center relative">
                        <div className="w-full flex justify-between items-center pb-4 mb-4 border-b border-neutral-100">
                            <h3 className="text-base font-bold text-neutral-900">Profile Picture</h3>
                            <button
                                onClick={() => setShowViewModal(false)}
                                className="text-neutral-400 hover:text-black font-bold text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>
                        <div className="w-72 h-72 rounded-2xl overflow-hidden shadow-inner bg-neutral-100 flex items-center justify-center">
                            <img src={avatar} alt="Full Profile" className="w-full h-full object-cover" />
                        </div>
                    </div>
                </div>
            )}

            {/* MODAL 2: Adjust Profile Picture (Zoom & Rotate) */}
            {showAdjustModal && (
                <div className="fixed inset-0 z-50 backdrop-blur-md bg-black/60 flex items-center justify-center p-6 animate-fade-in">
                    <div className="bg-white border border-neutral-200 rounded-3xl p-6 shadow-2xl max-w-md w-full flex flex-col items-center relative">
                        <div className="w-full flex justify-between items-center pb-4 mb-4 border-b border-neutral-100">
                            <h3 className="text-base font-bold text-neutral-900">Adjust Profile Picture</h3>
                            <button
                                onClick={() => setShowAdjustModal(false)}
                                className="text-neutral-400 hover:text-black font-bold text-sm cursor-pointer"
                            >
                                ✕
                            </button>
                        </div>

                        {/* Interactive Crop / Preview Box */}
                        <div className="w-64 h-64 rounded-full overflow-hidden border-4 border-neutral-200 shadow-inner bg-neutral-900 flex items-center justify-center relative mb-6">
                            <img
                                src={avatar}
                                alt="Crop Preview"
                                style={{
                                    transform: `scale(${zoom}) rotate(${rotation}deg)`,
                                    transition: 'transform 0.1s ease-out'
                                }}
                                className="w-full h-full object-cover"
                            />
                        </div>

                        {/* Adjustment Sliders */}
                        <div className="w-full space-y-4 mb-6">
                            <div>
                                <div className="flex justify-between text-xs font-bold text-neutral-500 mb-1">
                                    <span>Zoom</span>
                                    <span>{zoom.toFixed(1)}x</span>
                                </div>
                                <input
                                    type="range"
                                    min="1"
                                    max="2.5"
                                    step="0.1"
                                    value={zoom}
                                    onChange={(e) => setZoom(parseFloat(e.target.value))}
                                    className="w-full accent-black cursor-pointer"
                                />
                            </div>

                            <div>
                                <div className="flex justify-between text-xs font-bold text-neutral-500 mb-1">
                                    <span>Rotate</span>
                                    <span>{rotation}°</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="360"
                                    step="90"
                                    value={rotation}
                                    onChange={(e) => setRotation(parseInt(e.target.value))}
                                    className="w-full accent-black cursor-pointer"
                                />
                            </div>
                        </div>

                        {/* Modal Action Buttons */}
                        <div className="flex gap-3 w-full">
                            <button
                                type="button"
                                onClick={() => setShowAdjustModal(false)}
                                className="w-1/2 py-3 rounded-full bg-neutral-100 text-neutral-700 text-xs font-semibold hover:bg-neutral-200 transition-all cursor-pointer"
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={handleApplyAdjustments}
                                className="w-1/2 py-3 rounded-full bg-black text-white text-xs font-semibold hover:bg-neutral-800 transition-all cursor-pointer shadow-md shadow-neutral-300"
                            >
                                Save Picture
                            </button>
                        </div>

                    </div>
                </div>
            )}

        </div>
    );
};

export default ProfilePage;
