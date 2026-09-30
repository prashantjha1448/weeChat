import { loginUserService, registerUserService, getCurrentUser, logoutUserService } from '../services/auth.services.js'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router';
import { useDispatch } from 'react-redux';
import { login_user, logout_user } from '../states/authSlice.js';
import { toast } from 'sonner';


const useAuthentication = () => {

    const { register, handleSubmit, formState: { errors, isValid, isSubmitting } } = useForm({ mode: 'onChange' });

    const Navigate = useNavigate()

    const dispatch = useDispatch()

    const onRegisterSubmit = async (data) => {
        try {

            const response = await registerUserService(data);

            console.log("Success Response:", response);

            toast.success("Account Created Successfully ", {
            description: "Welcome! Your account has been registered."
        })
            dispatch(login_user(response.data.user))
            Navigate('/home')


        } catch (error) {

            const errorMessage = error.response?.data?.message || "Registration failed";
            toast.error("Registration Failed", {
            description: errorMessage
        })
        }
    };

    const onLogInSubmit = async (loginData) => {
        try {
            const response = await loginUserService(loginData)
            toast.success("Welcome Back! ", {
            description: response.message || "Signed in successfully."
        })
            dispatch(login_user(response.data.user))

            Navigate('/home')

        } catch (error) {

            const errorMessage = error.response?.data.message || "logined Failed  "
            toast.error("Authentication Failed", {
            description: errorMessage
        });

        }
    }

    const getCurrentUserStatus = async () => {
        try {
            const response = await getCurrentUser()

            if (response?.data) {
                dispatch(login_user(response.data))
            }
        } catch (error) {
            dispatch(logout_user());
            console.log(error);
        }
    }

    const onLogoutSubmit = async () => {
        try {

            const response = await logoutUserService()
            toast.success("Signed Out", {
            description: response.message || "You have been logged out successfully."
        })
            dispatch(logout_user())

            Navigate('/login')

        } catch (error) {
            const errorMessage = error.response?.data?.message || "Logout failed";
            toast.error("Logout Failed", {
            description: errorMessage
        });
        }
    }

    return { register, handleSubmit, errors, isSubmitting, isValid, onRegisterSubmit, onLogInSubmit, Navigate, getCurrentUserStatus, onLogoutSubmit }
}

export { useAuthentication }