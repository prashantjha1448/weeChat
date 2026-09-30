import React, { useState } from 'react';
import { useAuthentication } from '../hooks/auth.hooks';
import GoogleAuthButton from './GoogleAuthButton';


const Login = () => {
    const { onLogInSubmit, register, handleSubmit, isSubmitting, isValid, errors, Navigate } = useAuthentication();
    const [showPassword, setShowPassword] = useState(false);

    return (
        <div className="w-full max-w-lg sm:max-w-xl p-8 sm:p-10 md:p-12 rounded-3xl bg-white border border-neutral-200/80 shadow-2xl shadow-neutral-200/50 my-auto">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 text-center">Sign In</h2>
            <p className="text-xs sm:text-sm uppercase tracking-widest text-neutral-400 text-center mt-2 mb-8 font-semibold">
                To access your account
            </p>

            <form onSubmit={handleSubmit(onLogInSubmit)} className="flex flex-col gap-6">

                {/* 1. Identifier Input (Email / Username / Phone) */}
                <div>
                    <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Username or Email</label>
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
                        className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                    />
                    {errors.usernameOrEmail && (
                        <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.usernameOrEmail.message}</p>
                    )}
                </div>

                {/* 2. Password Input */}
                <div>
                    <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs sm:text-sm font-semibold text-neutral-700">Password</label>
                        <span className="text-xs sm:text-sm text-neutral-500 hover:text-black cursor-pointer transition-colors font-medium">
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
                            className="w-full px-4 sm:px-5 py-3.5 pr-14 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-xs sm:text-sm font-semibold text-neutral-500 hover:text-black transition-colors"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.password.message}</p>
                    )}
                </div>

                {/* Apple Style Pill Button */}
                <button
                    type="submit"
                    disabled={isSubmitting || !isValid}
                    className={`w-full py-4 rounded-full text-sm sm:text-base font-semibold transition-all mt-2 cursor-pointer ${
                        isSubmitting || !isValid
                            ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                            : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-black/10'
                    }`}
                >
                    {isSubmitting ? "Signing in..." : "Continue"}
                </button>

                {/* Divider */}
                <div className="relative flex items-center my-2">
                    <div className="flex-grow border-t border-neutral-200"></div>
                    <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-neutral-400 font-semibold">Or continue with</span>
                    <div className="flex-grow border-t border-neutral-200"></div>
                </div>

                {/* Google Sign In Button */}
                <GoogleAuthButton label="Sign in with Google" />

                {/* Sign Up Redirect */}
                <p className="text-xs sm:text-sm text-neutral-500 text-center mt-2">
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
    );
};


export default Login;