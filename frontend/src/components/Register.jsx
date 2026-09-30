import React, { useState, useEffect, useRef } from 'react';
import { useAuthentication } from '../hooks/auth.hooks';
import { Mail, CheckCircle2, RefreshCw, ArrowRight, ShieldCheck } from 'lucide-react';
import GoogleAuthButton from './GoogleAuthButton';


const Register = () => {
    const { 
        onRegisterSubmit, 
        verifyOtpSubmit, 
        resendOtpSubmit, 
        register, 
        handleSubmit, 
        isSubmitting, 
        isValid, 
        errors, 
        Navigate 
    } = useAuthentication();

    const [step, setStep] = useState('register'); // 'register' | 'otp'
    const [registeredEmail, setRegisteredEmail] = useState('');
    const [otpSent, setOtpSent] = useState('');
    const [otpDigits, setOtpDigits] = useState(['', '', '', '', '', '']);
    const [timer, setTimer] = useState(60);
    const [isVerifying, setIsVerifying] = useState(false);
    const [isResending, setIsResending] = useState(false);
    const inputRefs = useRef([]);

    // Countdown timer for OTP resend
    useEffect(() => {
        let interval = null;
        if (step === 'otp' && timer > 0) {
            interval = setInterval(() => {
                setTimer((prev) => prev - 1);
            }, 1000);
        } else if (timer === 0) {
            clearInterval(interval);
        }
        return () => clearInterval(interval);
    }, [step, timer]);

    const handleFormSubmit = async (formData) => {
        try {
            const resData = await onRegisterSubmit(formData);
            if (resData) {
                setRegisteredEmail(formData.email);
                if (resData.otp) {
                    setOtpSent(resData.otp);
                }
                setStep('otp');
                setTimer(60);
            }
        } catch (err) {
            console.error(err);
        }
    };

    const handleOtpChange = (index, value) => {
        if (value.length > 1) {
            // Handle paste of 6-digit code
            const pasted = value.slice(0, 6).split('');
            const newDigits = [...otpDigits];
            pasted.forEach((char, i) => {
                if (i < 6) newDigits[i] = char;
            });
            setOtpDigits(newDigits);
            const nextIdx = Math.min(pasted.length, 5);
            inputRefs.current[nextIdx]?.focus();
            return;
        }

        const newDigits = [...otpDigits];
        newDigits[index] = value;
        setOtpDigits(newDigits);

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index, e) => {
        if (e.key === 'Backspace' && !otpDigits[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handleVerifyOtp = async () => {
        const fullOtp = otpDigits.join('');
        if (fullOtp.length !== 6) return;

        setIsVerifying(true);
        try {
            await verifyOtpSubmit(fullOtp);
        } catch (err) {
            console.error(err);
        } finally {
            setIsVerifying(false);
        }
    };

    const handleResend = async () => {
        if (timer > 0 || isResending) return;
        setIsResending(true);
        try {
            const resData = await resendOtpSubmit();
            if (resData?.otp) {
                setOtpSent(resData.otp);
            }
            setTimer(60);
            setOtpDigits(['', '', '', '', '', '']);
        } catch (err) {
            console.error(err);
        } finally {
            setIsResending(false);
        }
    };

    const handleUseDemoOtp = () => {
        if (!otpSent) return;
        const digits = otpSent.split('');
        setOtpDigits(digits);
        inputRefs.current[5]?.focus();
    };

    return (
        <div className="w-full max-w-xl md:max-w-2xl p-8 sm:p-10 md:p-12 rounded-3xl bg-white border border-neutral-200/80 shadow-2xl shadow-neutral-200/50 my-auto">
            
            {step === 'register' ? (
                <>
                    <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 text-center">Create Account</h2>
                    <p className="text-xs sm:text-sm uppercase tracking-widest text-neutral-400 text-center mt-2 mb-8 font-semibold">
                        Join the next-generation chat platform
                    </p>

                    <form onSubmit={handleSubmit(handleFormSubmit)} className="flex flex-col gap-5">

                        {/* 1. Full Name */}
                        <div>
                            <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Full Name</label>
                            <input
                                {...register('name', { 
                                    required: "Name is required", 
                                    minLength: { value: 3, message: "Min 3 characters" } 
                                })}
                                type="text"
                                placeholder="Full Name"
                                className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                            />
                            {errors.name && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.name.message}</p>}
                        </div>

                        {/* Grid: Username & Email */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 2. Username */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Username</label>
                                <input
                                    {...register('username', { 
                                        required: "Username is required",
                                        minLength: { value: 3, message: "Min 3 characters" } 
                                    })}
                                    type="text"
                                    placeholder="Username"
                                    className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                                />
                                {errors.username && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.username.message}</p>}
                            </div>

                            {/* 3. Email */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Email Address</label>
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
                                    className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                                />
                                {errors.email && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.email.message}</p>}
                            </div>
                        </div>

                        {/* Grid: DOB & Mobile Number */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 4. Date of Birth */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Date of Birth</label>
                                <input
                                    {...register('dob', { required: "Date of Birth is required" })}
                                    type="date"
                                    className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                                />
                                {errors.dob && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.dob.message}</p>}
                            </div>

                            {/* 5. Mobile Number */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Mobile Number</label>
                                <input
                                    {...register('mobile_Number', { 
                                        pattern: { 
                                            value: /^[6-9]\d{9}$/, 
                                            message: "Enter valid 10-digit phone number" 
                                        } 
                                    })}
                                    type="text"
                                    placeholder="Mobile Number"
                                    className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                                />
                                {errors.mobile_Number && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.mobile_Number.message}</p>}
                            </div>
                        </div>

                        {/* Grid: Gender & Password */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {/* 6. Gender */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Gender</label>
                                <select
                                    {...register('gender', { required: "Gender is required" })}
                                    className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                                >
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                </select>
                                {errors.gender && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.gender.message}</p>}
                            </div>

                            {/* 7. Password */}
                            <div>
                                <label className="block text-xs sm:text-sm font-semibold text-neutral-700 mb-2">Password</label>
                                <input
                                    {...register('password', { 
                                        required: "Password is required", 
                                        minLength: { value: 6, message: "Password must be at least 6 characters" } 
                                    })}
                                    type="password"
                                    placeholder="Password"
                                    className="w-full px-4 sm:px-5 py-3.5 bg-neutral-50 border border-neutral-200 rounded-2xl text-sm sm:text-base text-neutral-900 placeholder-neutral-400 focus:outline-none focus:bg-white focus:border-neutral-900 focus:ring-2 focus:ring-black/10 transition-all"
                                />
                                {errors.password && <p className="text-xs sm:text-sm text-red-500 mt-1.5 font-medium">{errors.password.message}</p>}
                            </div>
                        </div>

                        {/* Apple Style Pill Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting || !isValid}
                            className={`w-full py-4 rounded-full text-sm sm:text-base font-semibold transition-all mt-4 cursor-pointer flex items-center justify-center gap-2 ${
                                isSubmitting || !isValid 
                                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed' 
                                    : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-black/10'
                            }`}
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </button>

                        {/* Divider */}
                        <div className="relative flex items-center my-1">
                            <div className="flex-grow border-t border-neutral-200"></div>
                            <span className="flex-shrink mx-4 text-xs uppercase tracking-widest text-neutral-400 font-semibold">Or continue with</span>
                            <div className="flex-grow border-t border-neutral-200"></div>
                        </div>

                        {/* Google Sign Up Button */}
                        <GoogleAuthButton label="Sign up with Google" />

                        {/* Login Redirect */}
                        <p className="text-xs sm:text-sm text-neutral-500 text-center mt-2">
                            Already have an account?{' '}
                            <span
                                onClick={() => Navigate('/login')}
                                className="text-black font-semibold cursor-pointer hover:underline"
                            >
                                Sign in
                            </span>
                        </p>

                    </form>
                </>
            ) : (
                /* Step 2: Email Verification OTP Screen */
                <div className="flex flex-col items-center text-center py-2">
                    <div className="w-16 h-16 rounded-full bg-neutral-100 border border-neutral-200 flex items-center justify-center mb-5 text-neutral-900 shadow-sm">
                        <Mail className="w-8 h-8 stroke-[1.5]" />
                    </div>

                    <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-neutral-900">Verify Your Email</h2>
                    <p className="text-sm text-neutral-500 max-w-md mt-2 mb-6 leading-relaxed">
                        We sent a 6-digit verification code to <span className="font-semibold text-neutral-900">{registeredEmail || 'your email'}</span>. Enter the code below to complete your registration.
                    </p>

                    {/* Demo OTP Banner */}
                    {otpSent && (
                        <div className="w-full max-w-sm mb-6 p-3 bg-neutral-50 border border-neutral-200/80 rounded-2xl flex items-center justify-between gap-3 text-left shadow-xs">
                            <div className="flex items-center gap-2 text-xs text-neutral-700">
                                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                                <div>
                                    <span className="font-medium text-neutral-500">Verification Code: </span>
                                    <span className="font-mono font-bold text-neutral-900 text-sm tracking-widest">{otpSent}</span>
                                </div>
                            </div>
                            <button
                                type="button"
                                onClick={handleUseDemoOtp}
                                className="px-3 py-1 bg-black text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-all cursor-pointer shrink-0"
                            >
                                Fill OTP
                            </button>
                        </div>
                    )}

                    {/* 6-Digit Pin Input */}
                    <div className="flex justify-center gap-2 sm:gap-3 mb-6">
                        {otpDigits.map((digit, idx) => (
                            <input
                                key={idx}
                                ref={(el) => (inputRefs.current[idx] = el)}
                                type="text"
                                maxLength={1}
                                value={digit}
                                onChange={(e) => handleOtpChange(idx, e.target.value)}
                                onKeyDown={(e) => handleKeyDown(idx, e)}
                                className="w-11 h-13 sm:w-13 sm:h-15 text-center text-xl sm:text-2xl font-bold font-mono bg-neutral-50 border border-neutral-200 rounded-2xl focus:outline-none focus:bg-white focus:border-black focus:ring-2 focus:ring-black/10 transition-all text-neutral-900 shadow-xs"
                            />
                        ))}
                    </div>

                    {/* Resend Timer & Button */}
                    <div className="flex items-center justify-center gap-2 text-xs sm:text-sm text-neutral-500 mb-8">
                        <span>Didn't receive the code?</span>
                        {timer > 0 ? (
                            <span className="font-medium text-neutral-700">Resend in {timer}s</span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleResend}
                                disabled={isResending}
                                className="font-semibold text-black hover:underline flex items-center gap-1 cursor-pointer"
                            >
                                <RefreshCw className={`w-3.5 h-3.5 ${isResending ? 'animate-spin' : ''}`} />
                                Resend Code
                            </button>
                        )}
                    </div>

                    {/* Action Buttons */}
                    <div className="w-full flex flex-col gap-3">
                        <button
                            type="button"
                            onClick={handleVerifyOtp}
                            disabled={otpDigits.join('').length !== 6 || isVerifying}
                            className={`w-full py-4 rounded-full text-sm sm:text-base font-semibold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                                otpDigits.join('').length !== 6 || isVerifying
                                    ? 'bg-neutral-200 text-neutral-400 cursor-not-allowed'
                                    : 'bg-black text-white hover:bg-neutral-800 active:scale-[0.98] shadow-lg shadow-black/10'
                            }`}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify Email & Complete'}
                            {!isVerifying && <ArrowRight className="w-4 h-4" />}
                        </button>

                        <button
                            type="button"
                            onClick={() => Navigate('/home')}
                            className="text-xs text-neutral-400 hover:text-neutral-700 font-medium transition-colors py-2"
                        >
                            Skip for now
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Register;