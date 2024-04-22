import mongoose from "mongoose";
import { JsonWebTokenError } from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    watchHistory: [ {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    },],
    password : {
        type : String,
        required : [true, "password required"]
        
    },
    tokens :{
        type : String

    },
    username : {
        type : String,
        required : true,
        unique : true,
        lowecase : true,
        trim : true,
        index : true
    },
    
    email : {
        type : String,
        required : true,
        unique : true,
        lowecase : true,
        trim : true,
        index : true
    },
    fullname : {
        type : String,
        required : true,
        trim : true,
        index : true
    },
    avatar : {
        type : String,  // cloudnery url
        require : true
    },
    coverImage : {
        type : String // cloudnery url
    }

}, {timestamps : true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
        this.password = bcrypt.hash(this.password, 10);
    })
        
export const User = mongoose.model("User", userSchema);