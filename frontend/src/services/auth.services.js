import api from '../api/axios.js'

export const registerUserService = async (formData)=>{
   const response = await  api.post('auth/register' ,formData)
   return response.data
}

export const loginUserService = async (loginData)=>{
   const response = await api.post('auth/login',loginData )
   return response.data
}

export const getCurrentUser = async()=>{
   const response = await api.get('auth/get-me')
   return response.data
}

export const logoutUserService = async ()=>{
   const response =  await api.post('auth/logout')
   return response.data
}

export const verifyEmailOtpService = async (data) => {
   const response = await api.post('auth/verify-email', data)
   return response.data
}

export const resendOtpService = async (data) => {
   const response = await api.post('auth/resend-otp', data)
   return response.data
}

export const googleAuthService = async (googleData) => {
   const response = await api.post('auth/google', googleData)
   return response.data
}