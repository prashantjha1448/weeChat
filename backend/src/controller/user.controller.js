
import bcrypt from 'bcryptjs'
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import UserModel from '../models/user.model.js'
import { generateAccessAndRefreshTokens } from '../utils/generateTokens.js'


 const registerUser = async(req , res) => {

   const {name , username , email , dob , mobile_Number , gender , password} = req.body;

   if(!name || !username || !email || !dob || !password || !gender ){
    throw new ApiError(400 , "All required fields must be provided");
   }

   const IsAlreadyUSerExisted =  await UserModel.findOne({$or:[
    {email},
    {username}
   ]})

   if(IsAlreadyUSerExisted){
    throw new ApiError(409 , "User with this email or username already exists");
   }

   const HashPassword =  await bcrypt.hash(password , 10);

   const NewUser = await UserModel.create({
    name,
    email ,
    username,
    dob,
    mobile_Number,
    gender,
    password : HashPassword
   })

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(NewUser._id);

   const createdUser = await UserModel.findById(NewUser._id).select("-password -refreshToken");

   const options = { httpOnly: true, secure: process.env.NODE_ENV === "production"};

   return res.status(201).cookie("accessToken" , accessToken , options).cookie("refressToken", refreshToken , options).json(
    new ApiResponse(201, {user : createdUser , accessToken , refreshToken} , "user created sucessfully")
   )
}

const loginUser = async (req , res)=> {

  const { usernameOrEmail ,email , username  ,mobile_Number  , password} = req.body;
  
  const identifier =  usernameOrEmail || email || username || mobile_Number

  

  if(!identifier){
    throw new ApiError(400 , "Email or username or mobile number is required ")
  }


  if(!password){
    throw new ApiError(400 , "password is required")
  }

  const User = await UserModel.findOne({ $or : [
    {email : identifier.toLowerCase() },
    {username : identifier} ,
    {mobile_Number : identifier}
  ]}).select("+password")

  if(!User){
    throw new ApiError(404 , "user does not exist")
  }

  const isValidPassword =  await bcrypt.compare(password ,User.password)

  if(!isValidPassword){
    throw new ApiError(401 , "Invalid user credentials")
  }

  const {accessToken , refreshToken} = await  generateAccessAndRefreshTokens(User._id);

  const logInUser = await UserModel.findById(User._id).select("-password -refreshToken")

  const options = {httpOnly:true , secure :process.env.NODE_ENV === "production"};

  return res.status(200).cookie("accessToken" ,accessToken , options).cookie("refreshToken", refreshToken , options).json(new ApiResponse(200 ,{user : logInUser , accessToken , refreshToken}, "user login sucessfully 🎉  "))

}

const getCurrentUser = async (req , res)=>{
  return res
        .status(200)
        .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
}

const LogoutUser = async (req , res)=>{

  await UserModel.findByIdAndUpdate(req.user._id , {$unset:{refreshToken : 1}},{new : true})

  const options = {httpOnly : true , secure : process.env.NODE_ENV === "production"}

  return res.status(200).cookie("accessToken", options).cookie("refreshToken",options).json(new ApiResponse(200 , {}, "User logged out successfully"))

}



export  {registerUser , loginUser , getCurrentUser , LogoutUser }