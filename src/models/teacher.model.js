import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

const teacherSchema =new mongoose.Schema({

    username :{
        type :String,
        required : true
    },
    fullName : {
        type : String,
        required : true
    },
    password : {
        type :String,
        required :true
    },
    avatar :{
        type :String,
        required :true
    },
    refreshToken :{
        type : String
    },
    coverImage :{
        type :String,
        required : true
    },
    

},{timestamps : true})

teacherSchema.pre("save", async function(next){
    if(!this.isModified("password")) return next();
        this.password =  bcrypt.hash(this.password, 10)
        next() 
    })
        
teacherSchema.methods.isPasswordCorrect = async function(password){
    return await bcrypt.compare(password, this.password);
    
}
teacherSchema.methods.generateAccessToken= function(){
   return jwt.sign(
    {
        id : this._id,
        username : this.username,
        email : this.email,
        avatar : this.avatar,
        coverImage : this.coverImage
    },
     process.env.ACCESS_TOKEN_SECRET, 
     {expiresIn : process.env.ACCESS_TOKEN_EXPIRY}) 
}

teacherSchema.methods.generateRefreshToken= function(){
    return jwt.sign({id : this._id},
         process.env.REFRESH_TOKEN_SECRET,
          {expiresIn : process.env.REFRESH_TOKEN_EXPIRY})
}

export const Teacher = mongoose.model("Teacher", teacherSchema);