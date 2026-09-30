import React, { useState } from 'react';
import { useAuthentication } from '../hooks/auth.hooks';

const Login = () => {
    const { onLogInSubmit, register, handleSubmit, isSubmitting, isValid, errors, Navigate } = useAuthentication();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased flex items-center justify-center p-6 selection:bg-black selection:text-white">
            
            {/* Apple Light Card Container */}
            <div className="w-full max-w-md p-8 sm:p-10 rounded-3xl bg-white border border-neutral-200/80 shadow-2xl shadow-neutral-200/80">
                
                {/* Header Logo */}
                <div className="flex justify-center mb-6">
                    <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center cursor-pointer hover:scale-105 transition-transform" onClick={() => Navigate('/')}>
                        <div className="w-4 h-4 rounded-full bg-white" />
                    </div>
                </div>

                <h2 className="text-3xl font-bold tracking-tight text-neutral-900 text-center">Sign In</h2>
                <p className="text-xs uppercase tracking-widest text-neutral-400 text-center mt-2 mb-8 font-semibold">
                    To access your account
                </p>

                <form onSubmit={handleSubmit(onLogInSubmit)} className="flex flex-col gap-5">

                    {/* 1. Identifier Input (Email / Username / Phone) */}
                    <div>
                        <label className="block text-xs font-semibold text-neutral-600 mb-2">Username or Email</label>
                        <input
                            {...register('usernameOrEmail', {
                                required: "Username, Email or Phone Number is required",
                                minLength: {
                                    value: 3,
                                    message: "Minimum 3 characters required"
                                }
                            })}
                            type="text"
                            placeholder="Enter username or email"
                            className="w-full px-4 py-3 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                        />
                        {errors.usernameOrEmail && (
                            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.usernameOrEmail.message}</p>
                        )}
                    </div>

                    {/* 2. Password Input */}
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <label className="block text-xs font-semibold text-neutral-600">Password</label>
                            <span className="text-xs text-neutral-500 hover:text-black cursor-pointer transition-colors font-medium">
                                Forgot password?
                            </span>
                        </div>
                        <div className="relative">
                            <input
                                {...register('password', {
                                    required: "Password is required"
                                })}
                                type={showPassword ? 'text' : 'password'}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 pr-12 bg-neutral-50 border border-neutral-200 rounded-xl text-sm text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 transition-all"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword((prev) => !prev)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-neutral-500 hover:text-black transition-colors"
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>
                        {errors.password && (
                            <p className="text-xs text-red-500 mt-1.5 font-medium">{errors.password.message}</p>
                        )}
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
                        {isSubmitting ? "Signing in..." : "Continue"}
                    </button>

                    {/* Sign Up Redirect */}
                    <p className="text-xs text-neutral-500 text-center mt-4">
                        Don't have an account?{' '}
                        <span
                            onClick={() => Navigate('/register')}
                            className="text-black font-semibold cursor-pointer hover:underline"
                        >
                            Create one now
                        </span>
                    </p>

                </form>
            </div>
        </div>
    );
};

export default Login;