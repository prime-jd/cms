import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const userSchema = mongoose.Schema({
    // watchHistory: [ {
    //     type : mongoose.Schema.Types.ObjectId,
    //     ref : "Video"
    // },],
    password : {
        type : String,
        required : [true, "password required"]
        
    },
    refreshTokens :{
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
        
    },
    rollNo :{
        type :String,
        required : true
    },
    className : {
        type : String,
        required : true
    },
    course : {
        type : String,
        required :true
    }


}, {timestamps : true})

userSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
        this.password = await bcrypt.hash(this.password, 10)
        next()
    })
        
userSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password)
    
}
userSchema.methods.generateAccessToken= function(){
   return jwt.sign(
    {
        id : this._id,
        username : this.username,
        email : this.email,
        fullname : this.fullname,
        avatar : this.avatar,
        coverImage : this.coverImage
    },
     process.env.ACCESS_TOKEN_SECRET, 
     {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}) 
}

userSchema.methods.generateRefreshToken= function(){
    return jwt.sign({id : this._id},
         process.env.REFRESH_TOKEN_SECRET,
          {expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
}

export const User = mongoose.model("User", userSchema);