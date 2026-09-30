
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library';
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import UserModel from '../models/user.model.js'
import { generateAccessAndRefreshTokens } from '../utils/generateTokens.js'
import { generateVerificationOtpService } from '../services/verification.service.js'
import { env } from '../config/env.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthUser = async (req, res) => {
    const { token, credential, idToken, accessToken } = req.body;
    const tokenToUse = credential || idToken || token;

    let googleUser = null;

    if (tokenToUse) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: tokenToUse,
                audience: process.env.GOOGLE_CLIENT_ID
            });
            const payload = ticket.getPayload();
            googleUser = {
                sub: payload.sub,
                email: payload.email,
                name: payload.name,
                picture: payload.picture
            };
        } catch (err) {
            console.warn('[GOOGLE AUTH VERIFY WARN]', err.message);
            try {
                const base64Payload = tokenToUse.split('.')[1];
                const decoded = JSON.parse(Buffer.from(base64Payload, 'base64').toString());
                googleUser = {
                    sub: decoded.sub,
                    email: decoded.email,
                    name: decoded.name,
                    picture: decoded.picture
                };
            } catch (e) {
                throw new ApiError(400, 'Invalid Google ID token');
            }
        }
    } else if (accessToken) {
        const response = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo?access_token=${accessToken}`);
        if (!response.ok) {
            throw new ApiError(400, 'Failed to fetch Google user profile');
        }
        googleUser = await response.json();
    } else {
        throw new ApiError(400, 'Google token or credential is required');
    }

    if (!googleUser || !googleUser.email) {
        throw new ApiError(400, 'Could not retrieve user email from Google');
    }

    let user = await UserModel.findOne({
        $or: [{ googleId: googleUser.sub }, { email: googleUser.email.toLowerCase() }]
    });

    if (!user) {
        let baseUsername = (googleUser.email.split('@')[0] || 'user').replace(/[^a-zA-Z0-9_]/g, '');
        if (baseUsername.length < 3) baseUsername += '_user';
        let username = baseUsername;
        let count = 1;
        while (await UserModel.findOne({ username })) {
            username = `${baseUsername}_${count}`;
            count++;
        }

        user = await UserModel.create({
            name: googleUser.name || 'Google User',
            email: googleUser.email.toLowerCase(),
            username,
            googleId: googleUser.sub,
            avatar: googleUser.picture,
            gender: 'other',
            isVerified: true
        });
    } else {
        if (!user.googleId || !user.avatar || !user.isVerified) {
            user = await UserModel.findByIdAndUpdate(
                user._id,
                {
                    googleId: user.googleId || googleUser.sub,
                    avatar: user.avatar || googleUser.picture,
                    isVerified: true
                },
                { new: true }
            );
        }
    }

    const { accessToken: accessTok, refreshToken: refreshTok } = await generateAccessAndRefreshTokens(user._id);

    const loggedInUser = await UserModel.findById(user._id).select('-password -refreshToken');
    const options = { httpOnly: true, secure: process.env.NODE_ENV === 'production' };

    return res
        .status(200)
        .cookie('accessToken', accessTok, options)
        .cookie('refreshToken', refreshTok, options)
        .json(
            new ApiResponse(
                200,
                { user: loggedInUser, accessToken: accessTok, refreshToken: refreshTok },
                'Google authentication successful'
            )
        );
};


const getCookieOptions = () => {
    const isProd = env.NODE_ENV === "production";
    const opts = {
        httpOnly: true,
        secure: isProd,
        sameSite: isProd ? "none" : (env.COOKIE_SAMESITE || "lax"),
        path: "/"
    };
    if (env.COOKIE_DOMAIN) {
        opts.domain = env.COOKIE_DOMAIN;
    }
    return opts;
};

const registerUser = async(req , res) => {

   const {name , username , email , dob , mobile_Number , gender , password} = req.body;

   if(!name || !username || !email || !dob || !password || !gender ){
    throw new ApiError(400 , "All required fields must be provided");
   }

   const IsAlreadyUSerExisted =  await UserModel.findOne({$or:[
    {email: email.toLowerCase()},
    {username: username.toLowerCase()}
   ]});

   if(IsAlreadyUSerExisted){
    throw new ApiError(409 , "User with this email or username already exists");
   }

   const HashPassword = await bcrypt.hash(password, 12);

   const NewUser = await UserModel.create({
    name,
    email: email.toLowerCase(),
    username: username.toLowerCase(),
    dob,
    mobile_Number,
    gender,
    password : HashPassword,
    isVerified: false
   });

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(NewUser._id);

   const { otp } = await generateVerificationOtpService(NewUser._id, "email_verify");
   console.log(`[EMAIL OTP] Verification OTP generated for user: ${otp}`);

   const createdUser = await UserModel.findById(NewUser._id).select("-password -refreshToken");

   const options = getCookieOptions();

   return res.status(201).cookie("accessToken" , accessToken , options).cookie("refreshToken", refreshToken , options).json(
    new ApiResponse(201, { user : createdUser , accessToken , refreshToken, otp } , "User registered successfully. Please verify your email OTP.")
   );
};

const loginUser = async (req , res)=> {

  const { usernameOrEmail ,email , username  ,mobile_Number  , password} = req.body;
  const identifier = usernameOrEmail || email || username || mobile_Number;

  if(!identifier || !password){
    throw new ApiError(400 , "Invalid email or password");
  }

  const User = await UserModel.findOne({ $or : [
    {email : identifier.toLowerCase() },
    {username : identifier.toLowerCase()} ,
    {mobile_Number : identifier}
  ]}).select("+password");

  if (!User) {
    // Constant time dummy compare
    await bcrypt.compare(password, "$2a$12$eImiTXuWVxfM37uY4JANj.1824f8/tUa1k6P/8W2m.x0kK.p.c1O6");
    throw new ApiError(401, "Invalid email or password");
  }

  // Account Lockout Check
  if (User.lockUntil && User.lockUntil > new Date()) {
    const remainingMins = Math.ceil((User.lockUntil - new Date()) / 60000);
    throw new ApiError(429, `Account is locked due to multiple failed login attempts. Try again in ${remainingMins} minutes.`);
  }

  const isValidPassword = await bcrypt.compare(password, User.password);

  if (!isValidPassword) {
    User.failedLoginAttempts = (User.failedLoginAttempts || 0) + 1;
    if (User.failedLoginAttempts >= 5) {
      User.lockUntil = new Date(Date.now() + 15 * 60 * 1000);
    }
    await User.save({ validateBeforeSave: false });
    throw new ApiError(401, "Invalid email or password");
  }

  // Reset Lockout Counters on success
  if (User.failedLoginAttempts > 0 || User.lockUntil) {
    User.failedLoginAttempts = 0;
    User.lockUntil = null;
    await User.save({ validateBeforeSave: false });
  }

  const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(User._id);

  const logInUser = await UserModel.findById(User._id).select("-password -refreshToken");

  const options = getCookieOptions();

  return res.status(200).cookie("accessToken" ,accessToken , options).cookie("refreshToken", refreshToken , options).json(
      new ApiResponse(200 ,{user : logInUser , accessToken , refreshToken}, "User logged in successfully")
  );
};

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



export { registerUser, loginUser, getCurrentUser, LogoutUser, googleAuthUser }