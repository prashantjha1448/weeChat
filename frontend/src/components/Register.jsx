import React from 'react';
import { useAuthentication } from '../hooks/auth.hooks';

const Register = () => {
    const { onRegisterSubmit, register, handleSubmit, isSubmitting, isValid, errors, Navigate } = useAuthentication();

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased flex items-center justify-center p-6 selection:bg-black selection:text-white">
            
            {/* Apple Light Card Container */}
            <div className="w-full max-w-xl p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200/80 shadow-2xl shadow-neutral-200/80">
                
                {/* Header Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={() => Navigate('/')}>
                        <div className="w-4 h-4 rounded-full bg-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 text-center">Create Account</h2>
                <p className="text-xs uppercase tracking-widest text-neutral-400 text-center mt-2 mb-8 font-semibold">
                    Join the next-generation chat platform
                </p>

                <form onSubmit={handleSubmit(onRegisterSubmit)} className="flex flex-col gap-5">

                    {/* 1. Full Name */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-2">Full Name</label>
                        <input
                            {...register('name', { 
                                required: "Name is required", 
                                minLength: { value: 3, message: "Min 3 characters" } 
                            })}
                            type="text"
                            placeholder="Full Name"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                        />
                        {errors.name && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.name.message}</p>}
                    </div>

                    {/* Grid: Username & Email */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 2. Username */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-2">Username</label>
                            <input
                                {...register('username', { 
                                    required: "Username is required",
                                    minLength: { value: 3, message: "Min 3 characters" } 
                                })}
                                type="text"
                                placeholder="Username"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            {errors.username && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.username.message}</p>}
                        </div>

                        {/* 3. Email */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-2">Email Address</label>
                            <input
                                {...register('email', { 
                                    required: "Email is required", 
                                    pattern: { 
                                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, 
                                        message: "Enter a valid email address" 
                                    } 
                                })}
                                type="email"
                                placeholder="Email Address"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            {errors.email && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
                        </div>
                    </div>

                    {/* Grid: DOB & Mobile Number */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 4. Date of Birth */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-2">Date of Birth</label>
                            <input
                                {...register('dob', { required: "Date of Birth is required" })}
                                type="date"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            {errors.dob && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.dob.message}</p>}
                        </div>

                        {/* 5. Mobile Number */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-2">Mobile Number</label>
                            <input
                                {...register('mobile_Number', { 
                                    pattern: { 
                                        value: /^[6-9]\d{9}$/, 
                                        message: "Enter valid 10-digit phone number" 
                                    } 
                                })}
                                type="text"
                                placeholder="Mobile Number"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            {errors.mobile_Number && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.mobile_Number.message}</p>}
                        </div>
                    </div>

                    {/* Grid: Gender & Password */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* 6. Gender */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-2">Gender</label>
                            <select
                                {...register('gender', { required: "Gender is required" })}
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                                <option value="other">Other</option>
                            </select>
                            {errors.gender && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.gender.message}</p>}
                        </div>

                        {/* 7. Password */}
                        <div>
                            <label className="block text-xs font-semibold text-neutral-600 mb-2">Password</label>
                            <input
                                {...register('password', { 
                                    required: "Password is required", 
                                    minLength: { value: 6, message: "Password must be at least 6 characters" } 
                                })}
                                type="password"
                                placeholder="Password"
                                className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            {errors.password && <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
                        </div>
                    </div>

                    {/* Apple Style Pill Button */}
                    <button
                        type="submit"
                        disabled={isSubmitting || !isValid}
                        className={`w-full py-3.5 rounded-full text-sm font-semibold transition-all mt-4 cursor-pointer ${
                            isSubmitting || !isValid 
                                ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                                : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98] shadow-md shadow-neutral-300'
                        }`}
                    >
                        {isSubmitting ? "Creating Account..." : "Create Account"}
                    </button>

                    {/* Login Redirect */}
                    <p className="text-xs text-neutral-500 text-center mt-2">
                        Already have an account?{' '}
                        <span
                            onClick={() => Navigate('/login')}
                            className="text-black font-semibold cursor-pointer hover:underline"
                        >
                            Sign in
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Register;