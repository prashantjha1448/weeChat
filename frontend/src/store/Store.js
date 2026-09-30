import {configureStore} from '@reduxjs/toolkit'
import authReducer from '../states/authSlice'

export const Store = configureStore({
    reducer : {
       auth : authReducer
    }
})