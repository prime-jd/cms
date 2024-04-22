import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    watchHistory:  {
        type : mongoose.Schema.Types.ObjectId,
        ref : "Video"
    },
    username : {
        type : String,
        required : true,
        unique : true,
        lowecase : true,
        trim : true,
        index : true
    },
    password: {
        type : String,
        required : true,
        unique : true,
        trim : true,
    },
    email : {
        type : String,
        required : true,
        unique : true,
        lowecase : true,
        trim : true,
        index : true
    }

})

export const User = mongoose.model("User", userSchema);