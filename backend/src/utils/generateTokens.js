import jwt from "jsonwebtoken"
import UserModel from "../models/user.model.js"
import ApiError from './ApiError.js'

export const generateAccessAndRefreshTokens = async (userId) => {
    try {

        const user = await UserModel.findById(userId)

        //  Access Token Genration here ---
        const accessToken = jwt.sign(
            {
                _id: userId._id, email: user.email, username: user.username 
            },
            process.env.ACCESS_TOKEN_SECRET,
            {
                expiresIn: process.env.ACCESS_TOKEN_EXPIRY
            }
        )


        //  Refress Token Generation here  ---
        const refreshToken = jwt.sign(
            {
                id: user._id
            },
            process.env.REFRESH_TOKEN_SECRET,
            {
                expiresIn: process.env.REFRESH_TOKEN_EXPIRY
            }
        )


        //  save token in user Document 

        user.refreshToken = refreshToken;
        await user.save({ validateBeforeSave: false })


        return { accessToken, refreshToken }



    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}