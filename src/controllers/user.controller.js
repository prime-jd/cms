
import { asyncHandler } from "../utils/asyncHandler.js";
import {User} from "../models/user.model.js";
import {ApiError} from "../utils/ApiError.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import jwt from "jsonwebtoken";
import { Teacher } from "../models/teacher.model.js";


// Generating access and refresh tokens

const generateAccessAndRefreshToken = async(userId)=>{
    try {
           const user = (await User.findById(userId) || await Teacher.findById(userId))
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

const registerFaculty = asyncHandler(async(req,res) => {
      const {email,password,username} = req.body;
      if([ email,username,password].some((empty)=>empty?.trim()==="")){
        throw new ApiError(400,"All fields are required") }

        const userExists = (await Teacher.findOne({
            $or : [{email},{username}]
        }) || await User.findOne({
            $or : [{email},{username}]
        }))
        if(userExists){
           
            throw new ApiError(400, "User Already Exists")
        }
    
        // check for images and avatar 
        //console.log(req.files)
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
        const teacher = await Teacher.create({
            email,
            username :"T_"+username.toUpperCase(),
            password,
            avatar : avatar.url,
            coverImage : coverImage.url || "",
        })
        //check for user creation
        //remove pass and refreshToken field from response
        const createdTeacher = await Teacher.findById(teacher._id).select("-password -refreshToken");
    
        if(!createdTeacher){
            throw new ApiError(400, "Error creating user")
        }
    
        // return res
        return res.status(201).json(new ApiResponse(200, "User created successfully", createdTeacher));

    });
 

const registerUser = asyncHandler(async (req, res) => {
   // res.status(200).json({ message: "Register User" });
    

    // get user details from frontend
     
    const {email,username,password,fullname,rollno,classname,course}= req.body
    // console.log(email)
    // console.log(password)
    // console.log(req.body)                // it does not give access to file (only text)

    // check validation 
    if([fullname, email,username,password,rollno,classname,course].some((empty)=>empty?.trim()==="")){
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
    //console.log(req.files)
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
        coverImage : coverImage.url || "",
        className : classname,
        course : course,
        rollNo : rollno
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
   
   if(!username && !password){      //for or (!(email || password))
    throw new ApiError(400, "username or password is required")
   }
   console.log(username)
   const findUser =( await User.findOne({
     username : username
   }) || await Teacher.findOne({
    username : username
  }))
  //console.log(findUser)
  
   if(!findUser){
    throw new ApiError(404, "user does not exist")
   }

   //console.log(password)
   
   const isPasswordValid = await findUser.isPasswordCorrect(password)                                   // we do not use "User" because it is a mongoose object so to use methods defined in user model we have to use "findUser" which is a instance taken by User model
   
   if(!isPasswordValid){
    throw new ApiError(404, "invalid user credentials")
   }

     const {accessToken, refreshToken}=(await generateAccessAndRefreshToken(findUser._id))
  //  console.log(accessToken)

   const loggedInUser = (await User.findById(findUser._id).select("-password -refreshToken") || await Teacher.findById(findUser._id).select("-password -refreshToken")) 

   const cookieOptions = {
    httpOnly : true,
    secure : true
   }
   //console.log(loggedInUser)
   return loggedInUser.username[0]=="T" ? res.status(200).cookie("accessToken", accessToken, cookieOptions)
   .cookie("refreshToken", refreshToken, cookieOptions).cookie("userLogged","teacher",{secure :true})
   .json(new ApiResponse(200, 
    {
        user :  loggedInUser,
        accessToken,                
        refreshToken
    },
    "User logged in successfully")) : res.status(200).cookie("accessToken", accessToken, cookieOptions)
    .cookie("refreshToken", refreshToken, cookieOptions).cookie("userLogged","student",{secure :true})
    .json(new ApiResponse(200, 
     {
         user :  loggedInUser,
         accessToken,                
         refreshToken
     },
     "User logged in successfully"))
});

//LOGOUT

const logoutUser = asyncHandler(async(req, res)=>{
    const cred = "new"
  await  User.findByIdAndUpdate(req.user?._id, {
      $set :{refreshToken : ""
     }},
    {
    new : true
    }) 
    await  Teacher.findByIdAndUpdate(req.user?._id, {
        $set :{refreshToken : ""
       }},
      {
      new : true
      }) 
    const cookieOptions = {
    httpOnly : true,
    secure : true
    }
    return res.status(200).clearCookie("accessToken",cookieOptions).clearCookie("refreshToken",cookieOptions).clearCookie("userLogged",{secure :true}).clearCookie("teacherLogged",{secure :true}).json(new ApiResponse(200, "User logged out successfully"));
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

// change current user password

const userChangePassword = asyncHandler(async (req,res)=>{
    const {oldPassword, newPassword} = req.body
    const user = await User.findById(req.user._id)
    if(!user){
        throw new ApiError(404, "user not found")
    }
    const isPasswordValid = await user.isPasswordCorrect(oldPassword)
    if(!isPasswordValid){
        throw new ApiError(404, "invalid password")
    }
    user.password = newPassword
    await user.save({validateBeforeSave :false})
    return res.status(200).json(new ApiResponse(200, "password changed successfully"))
});

//get current user

const getCurrentUser = asyncHandler(async(req,res)=>{
    return res.status(200).json(new ApiResponse(200, req.user,"current user fetched successsfully"))
})

// update Account details

const updateAccountDetails = asyncHandler(async (req,res) =>{
   const {fullname, username, email} = req.body
   if(!fullname && !username && !email){
    throw new ApiError(400, "All fields are required")
   }
   const user = await User.findById(req.user._id,
    {
       $set : {
           fullname,
           username,
           email
       
       }
    },
    {  new: true  })
})

//update user avatar 

const updateUserAvatar = asyncHandler(async (req, res) =>{
    const avatarLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Please upload images")
    }
    const avatar = await uploadOnCloudinary(avatarLocalPath)
    if(!avatar.url){
        throw new ApiError(400, "Error uploading images")
    }
    const user = await User.findByIdAndUpdate(req.user._id, {
        $set : {
            avatar : avatar.url
        }
    }, {new : true}).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "avatar updated successfully"))

})

const updateUserCoverImage = asyncHandler(async (req, res) =>{
    const coverImageLocalPath = req.file?.path
    if(!avatarLocalPath){
        throw new ApiError(400, "Please upload images")
    }
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)
    if(!coverImage.url){
        throw new ApiError(400, "Error uploading images")
    }
    const user = await User.findByIdAndUpdate(req.user?._id, {
        $set : {
            coverImage : coverImage.url
        }
    }, {new : true}).select("-password");
    return res.status(200).json(new ApiResponse(200, user, "coverImageupdated successfully"))

})

export { 
       registerFaculty,
       registerUser, 
       loginUser ,
       logoutUser, 
       refreshAccessToken,
       userChangePassword,
       getCurrentUser,
       updateAccountDetails,
       updateUserAvatar,
       updateUserCoverImage
    };