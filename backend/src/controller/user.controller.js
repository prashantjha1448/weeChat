
import bcrypt from 'bcryptjs'
import { OAuth2Client } from 'google-auth-library';
import ApiError from '../utils/ApiError.js'
import ApiResponse from '../utils/ApiResponse.js'
import UserModel from '../models/user.model.js'
import AuthSessionModel from '../models/authSession.model.js'
import { generateAccessAndRefreshTokens } from '../utils/generateTokens.js'
import { generateVerificationOtpService } from '../services/verification.service.js'
import { env } from '../config/env.js';

const googleClient = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuthUser = async (req, res) => {
    const { token, credential, idToken, accessToken, access_token } = req.body;
    const tokenToUse = credential || idToken || token;
    const accToken = accessToken || access_token;

    if (!tokenToUse && !accToken) {
        throw new ApiError(400, 'Google token is required for authentication');
    }

    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
        throw new ApiError(500, 'Google Client ID is not configured on server');
    }

    let googleUser = null;

    // 1. Verify Google ID Token cryptographically if provided
    if (tokenToUse) {
        try {
            const ticket = await googleClient.verifyIdToken({
                idToken: tokenToUse,
                audience: clientId
            });
            const payload = ticket.getPayload();

            if (payload && payload.email) {
                if (payload.email_verified === false) {
                    throw new ApiError(403, 'Google account email is not verified by Google');
                }
                googleUser = {
                    sub: payload.sub,
                    email: payload.email.toLowerCase().trim(),
                    name: payload.name || 'Google User',
                    picture: payload.picture || ''
                };
            }
        } catch (err) {
            console.warn('[GOOGLE ID_TOKEN VERIFICATION FAILED]', err.message);
            if (!accToken) {
                throw new ApiError(401, 'Invalid or expired Google authentication credential');
            }
        }
    }

    // 2. If ID Token was not provided or failed, verify OAuth2 access token with Google endpoints
    if (!googleUser && accToken) {
        try {
            // First verify token info with Google to validate audience & prevent token substitution
            const tokenInfoRes = await fetch(`https://oauth2.googleapis.com/tokeninfo?access_token=${encodeURIComponent(accToken)}`);
            if (!tokenInfoRes.ok) {
                throw new ApiError(401, 'Invalid or expired Google access token');
            }
            const tokenInfo = await tokenInfoRes.json();

            // Validate that token was issued for our Google Client ID (Confused Deputy defense)
            if (tokenInfo.aud && tokenInfo.aud !== clientId && tokenInfo.issued_to !== clientId) {
                throw new ApiError(401, 'Google token audience mismatch');
            }

            // Fetch verified profile from userinfo
            const userInfoRes = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${accToken}` }
            });

            if (!userInfoRes.ok) {
                throw new ApiError(401, 'Failed to fetch verified user profile from Google');
            }

            const userInfo = await userInfoRes.json();
            if (userInfo && userInfo.email) {
                if (userInfo.email_verified === false) {
                    throw new ApiError(403, 'Google account email is not verified by Google');
                }
                googleUser = {
                    sub: userInfo.sub,
                    email: userInfo.email.toLowerCase().trim(),
                    name: userInfo.name || 'Google User',
                    picture: userInfo.picture || ''
                };
            }
        } catch (err) {
            if (err instanceof ApiError) throw err;
            console.warn('[GOOGLE ACCESS_TOKEN VERIFICATION FAILED]', err.message);
            throw new ApiError(401, 'Google access token verification failed');
        }
    }

    // Strict validation: Reject if user information could not be cryptographically verified
    if (!googleUser || !googleUser.email || !googleUser.sub) {
        throw new ApiError(401, 'Google authentication failed: Could not verify user identity');
    }

    // 3. Check for existing user by googleId or verified email
    let user = await UserModel.findOne({
        $or: [{ googleId: googleUser.sub }, { email: googleUser.email }]
    });

    // Check account ban status
    if (user && user.isBanned) {
        throw new ApiError(403, 'Your account has been banned due to Terms of Service violations.');
    }

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
            name: googleUser.name,
            email: googleUser.email,
            username,
            googleId: googleUser.sub,
            avatar: googleUser.picture,
            gender: 'other',
            isVerified: true
        });
    } else {
        const updateFields = {};
        if (!user.googleId) updateFields.googleId = googleUser.sub;
        if (!user.avatar && googleUser.picture) updateFields.avatar = googleUser.picture;
        if (!user.isVerified) updateFields.isVerified = true;

        if (Object.keys(updateFields).length > 0) {
            user = await UserModel.findByIdAndUpdate(
                user._id,
                updateFields,
                { new: true }
            );
        }
    }

    const { accessToken: accessTok, refreshToken: refreshTok } = await generateAccessAndRefreshTokens(user._id, req);

    const loggedInUser = await UserModel.findById(user._id).select('-password -refreshToken');
    const options = getCookieOptions();

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

   const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(NewUser._id, req);

   await generateVerificationOtpService(NewUser._id, "email_verify");
   if (env.NODE_ENV !== 'production') {
       console.log(`[EMAIL OTP] Verification OTP generated for user: ${NewUser.email}`);
   }

   const createdUser = await UserModel.findById(NewUser._id).select("-password -refreshToken");

   const options = getCookieOptions();

   return res.status(201).cookie("accessToken" , accessToken , options).cookie("refreshToken", refreshToken , options).json(
    new ApiResponse(201, { user : createdUser , accessToken , refreshToken } , "User registered successfully. Please verify your email OTP.")
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

  const {accessToken , refreshToken} = await generateAccessAndRefreshTokens(User._id, req);

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
  if (req.user?._id) {
    await UserModel.findByIdAndUpdate(req.user._id, { $unset: { refreshToken: 1 } }, { new: true });
    await AuthSessionModel.updateMany({ userId: req.user._id, revokedAt: null }, { revokedAt: new Date() });
  }

  const options = getCookieOptions();

  return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged out successfully"));
}



export { registerUser, loginUser, getCurrentUser, LogoutUser, googleAuthUser }