import { 
    loginUserService, 
    registerUserService, 
    getCurrentUser, 
    logoutUserService, 
    verifyEmailOtpService, 
    resendOtpService, 
    googleAuthService 
} from '../services/auth.services.js';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login_user, logout_user } from '../states/authSlice.js';
import { toast } from 'sonner';

const useAuthentication = () => {
    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm({ mode: 'onChange' });

    const Navigate = useNavigate();
    const dispatch = useDispatch();

    const onRegisterSubmit = async (data) => {
        try {
            const response = await registerUserService(data);
            console.log("Success Response:", response);
            if (response.data?.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
            }
            toast.success("Account Created", {
                description: "Please enter the OTP sent to your email to verify."
            });
            dispatch(login_user(response.data.user));
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Registration failed";
            toast.error("Registration Failed", {
                description: errorMessage
            });
            throw error;
        }
    };

    const verifyOtpSubmit = async (otp) => {
        try {
            const response = await verifyEmailOtpService({ otp });
            toast.success("Email Verified", {
                description: "Your email has been verified successfully."
            });
            if (response.data?.user) {
                dispatch(login_user(response.data.user));
            }
            Navigate('/home');
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Verification failed";
            toast.error("Verification Failed", {
                description: errorMessage
            });
            throw error;
        }
    };

    const resendOtpSubmit = async () => {
        try {
            const response = await resendOtpService({ type: "email_verify" });
            toast.success("OTP Sent", {
                description: "A new verification code has been generated."
            });
            return response.data;
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Resend failed";
            toast.error("Resend Failed", {
                description: errorMessage
            });
            throw error;
        }
    };

    const onLogInSubmit = async (loginData) => {
        try {
            const response = await loginUserService(loginData);
            if (response.data?.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
            }
            toast.success("Welcome Back! ", {
                description: response.message || "Signed in successfully."
            });
            dispatch(login_user(response.data.user));
            Navigate('/home');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Login failed";
            toast.error("Authentication Failed", {
                description: errorMessage
            });
        }
    };

    const onGoogleAuthSubmit = async (googleResponse) => {
        try {
            const payload = googleResponse.credential 
                ? { credential: googleResponse.credential } 
                : { accessToken: googleResponse.access_token };

            const response = await googleAuthService(payload);
            if (response.data?.accessToken) {
                localStorage.setItem('token', response.data.accessToken);
            }
            toast.success("Google Sign-In Successful", {
                description: response.message || "Welcome to weeChat!"
            });
            dispatch(login_user(response.data.user));
            Navigate('/home');
        } catch (error) {
            const errorMessage = error.response?.data?.message || "Google Authentication failed";
            toast.error("Google Sign-In Failed", {
                description: errorMessage
            });
        }
    };

    const getCurrentUserStatus = async () => {
        try {
            const response = await getCurrentUser();
            if (response?.data) {
                dispatch(login_user(response.data));
            }
        } catch (error) {
            localStorage.removeItem('token');
            dispatch(logout_user());
            console.log(error);
        }
    };

    const onLogoutSubmit = async () => {
        try {
            const response = await logoutUserService();
            localStorage.removeItem('token');
            toast.success("Signed Out", {
                description: response.message || "You have been logged out successfully."
            });
            dispatch(logout_user());
            Navigate('/login');
        } catch (error) {
            localStorage.removeItem('token');
            const errorMessage = error.response?.data?.message || "Logout failed";
            toast.error("Logout Failed", {
                description: errorMessage
            });
        }
    };

    return { 
        register, 
        handleSubmit, 
        errors, 
        isSubmitting, 
        isValid, 
        onRegisterSubmit, 
        onLogInSubmit, 
        onGoogleAuthSubmit,
        Navigate, 
        getCurrentUserStatus, 
        onLogoutSubmit,
        verifyOtpSubmit,
        resendOtpSubmit
    };
};

export { useAuthentication };