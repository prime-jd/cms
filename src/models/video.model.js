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
    }
})