import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    user: null,
    isAuthenticated : false ,
    isLoading : false 
};

const authSclice = createSlice({
    name : 'auth',
    initialState ,
    reducers : {
        login_user : (state , action)=>{
            state.user = action.payload;
            state.isAuthenticated = true
        },
        logout_user : (state ,)=>{
            state.user = null,
            state.isAuthenticated = false
        }
    }

})
 export const {login_user , logout_user} = authSclice.actions;
 export default authSclice.reducer
