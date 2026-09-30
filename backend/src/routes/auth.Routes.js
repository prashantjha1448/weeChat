import express from "express";
import authMiddleware from '../middleware/auth.middleware.js'
import {registerUser , loginUser , getCurrentUser , LogoutUser} from '../controller/user.controller.js'

const Routes = express.Router()

Routes.post('/register' , registerUser)
Routes.post('/login' ,loginUser )
Routes.get('/get-me' ,authMiddleware , getCurrentUser)
Routes.post('/logout' , authMiddleware , LogoutUser)


export default Routes