import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../states/authSlice';
import profileReducer from '../states/profileSlice';

export const Store = configureStore({
    reducer: {
        auth: authReducer,
        profile: profileReducer
    }
});