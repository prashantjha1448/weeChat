import UserModel from "../models/user.model.js";
import ApiError from "../utils/ApiError.js";
import jwt from 'jsonwebtoken'

const authMiddleware = async (req , res , next)=> {
    try {
        const token = req.cookies?.accessToken || req.header('Authorization')?.replace("Bearer" , "")

        if(!token){
            throw new ApiError(401 , "Unauthorized request - Token missing")
        }

        const decoded = jwt.verify(token , process.env.ACCESS_TOKEN_SECRET)

        const user =  await UserModel.findById(decoded?._id).select("-password -refreshToken")

        if(!user){
            throw new ApiError(401 , "Invalid Access Token - user not found")
        }

        req.user = user

        next()
        
    } catch (error) {
        throw new ApiError(500 , error?.message || "Invalid or Expired Access Token")
    
    }
}

export default authMiddleware