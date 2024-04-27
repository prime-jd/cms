
import { asyncHandler } from "../utils/asyncHandler.js";
import { User} from "../models/user.model.js";
import {ApiError} from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";

// Generating access and refresh tokens

const generateAccessAndRefreshToken = async(userId)=>{
    try {
           const user = await User.findById(userId)
           const accessToken = user.generateAccessToken()
           
           const refreshToken = user.generateRefreshToken()
           
           user.refreshToken = refreshToken
           await user.save({validateBeforeSave : false})
           
           return {accessToken, refreshToken}

    } catch (error) {
       
        throw new ApiError(400, "Error generating tokens")
    }
}

//SIGN UP

const registerUser = asyncHandler(async (req, res) => {
   // res.status(200).json({ message: "Register User" });
    

    // get user details from frontend
    const {email,username,password,fullname}= req.body
    // console.log(email)
    // console.log(password)
     console.log(req.body)                // it does not give access to file (only text)

    // check validation 
    if([fullname, email,username,password].some((empty)=>empty?.trim()==="")){
        throw new ApiError(400,"All fields are required")
    }

    //check user Existence
    const userExists = await User.findOne({
        $or : [{email},{username}]
    })
    if(userExists){
        throw new ApiError(400, "User Already Exists")
    }

    // check for images and avatar 
    console.log(req.files)
    const avatarLocalPath = req.files?.avatar[0]?.path;
    const coverImageLocalPath = req.files?.coverImage[0]?.path;

    if(!avatarLocalPath ){
        throw new ApiError(400, "Please upload images")
    }
    
    // upload images on cloudinary
    const avatar =await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if(!avatar ){
        throw new ApiError(400, "Error uploading images")
    }

    // create user object in db
    const user = await User.create({
        email,
        username : username.toLowerCase(),
        password,
        fullname,
        avatar : avatar.url,
        coverImage : coverImage.url || ""
    })
    //check for user creation
    //remove pass and refreshToken field from response
    const createdUser = await User.findById(user._id).select("-password -refreshToken");

    if(!createdUser){
        throw new ApiError(400, "Error creating user")
    }

    // return res
    return res.status(201).json(new ApiResponse(200, "User created successfully", createdUser));
});

//LOGIN USER

const loginUser = asyncHandler(async(req,res)=>{
   //req body
   //username or email
   //find the user
   //password check
   //access and refresh token
   //send cookie

   const {email,password,username} = req.body
//   console.log(req.body)
//    console.log({email})
   
   if(!email && !username){      //for or (!(email || password))
    throw new ApiError(400, "username or password is required")
   }

   const findUser = await User.findOne({
      $or : [{email} || {username}]
   })
//    console.log(findUser)

   if(!findUser){
    throw new ApiError(404, "user does not exist")
   }

   const isPasswordValid = await findUser.isPasswordCorrect(password)                                    // we do not use "User" because it is a mongoose object so to use methods defined in user model we have to use "findUser" which is a instance taken by User model
   if(!isPasswordValid){
    throw new ApiError(404, "invalid user credentials")
   }

   const {accessToken, refreshToken}=await generateAccessAndRefreshToken(findUser._id)
  //  console.log(accessToken)

   const loggedInUser = await User.findById(findUser._id).select("-password -refreshToken") 

   const cookieOptions = {
    httpOnly : true,
    secure : true
   }

   return res.status(200).cookie("accessToken", accessToken, cookieOptions)
   .cookie("refreshToken", refreshToken, cookieOptions)
   .json(new ApiResponse(200, 
    {
        user :  loggedInUser,
        accessToken,                
        refreshToken
    },
    "User logged in successfully"));

    
});

//LOGOUT

const logoutUser = asyncHandler(async(req, res)=>{
  await  User.findByIdAndUpdate(req.user._id, {
      $set :{refreshToken : ""
     }},
    {
    new : true
    }) 
    const cookieOptions = {
    httpOnly : true,
    secure : true
    }
    return res.status(200).clearCookie("accessToken").clearCookie("refreshToken").json(new ApiResponse(200, "User logged out successfully"));
 });

// refresh access token 

const refreshAccessToken = asyncHandler(async(req, res)=>{
     const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

     if(!incomingRefreshToken){
        throw new ApiError(401, "unauthorized request of token")
     }
     try {
        const decoded = jwt.verify(incomingRefreshToken, process.env.REFRESH_TOKEN_SECRET)
        const user = await User.findById(decoded?._id)
   
        if(!user){
           throw new ApiError(401, "unauthorized request of user")
        }
   
        if(user.refreshToken !== incomingRefreshToken){
           throw new ApiError(401, "invalid user")
        }
        const options= {
           httpOnly : true,
           secure : true
        }
        
       const {accessToken, refreshToken}=await generateAccessAndRefreshToken(user._id)
   
       return res.status(200).cookie("accessToken", accessToken, options)
       .cookie("refreshToken", refreshToken, options)
       .json(new ApiResponse(200, {accessToken, refreshToken}, "Token refreshed successfully"));
     } catch (error) {
        throw new ApiError(401, "unauthorized request of token generation")
     }
});


export { registerUser, 
    loginUser ,
      logoutUser, refreshAccessToken};