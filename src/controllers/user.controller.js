
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.model.js";
import {ApiError} from "../utils/apiError.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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

export { registerUser };