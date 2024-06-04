import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken"
import { User } from "../models/user.model.js";
import { Teacher } from "../models/teacher.model.js";

export const verifyJwt = asyncHandler(async (req,_,next)=>{
    try {
        const token =req.cookies?.accessToken || req.header("Authorization")?.replace("Bearer ","")
        //console.log(token)
        if(!token){
            throw new ApiError(404, "Unauthorized Request")
        }
        const decodedToken =jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    
        const user = (await User.findById(decodedToken?.id).select("-password -refreshToken") || await Teacher.findById(decodedToken?.id).select("-password -refreshToken"))
        
        if(!user){
            //frontend ...
            throw new ApiError(404, "Unauthorized user Request")
        }
        req.user = user
        next()
        
    } catch (error) {
        throw new ApiError(401, error.message ||"Unauthorized Request")
    }
});
