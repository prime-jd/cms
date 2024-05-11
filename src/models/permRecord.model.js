import mongoose from "mongoose";

const permRecordSchema= new mongoose.Schema({

    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
            
    },
    subject : {
        type : String,
       
    },
    faculty : {
        type : String,
       
    },
    rollNo : {
        type : String, 
        
    },
    startTime : {
        type: String,
       
    },
    proxy : {
        type : Boolean,

    },
    className : {
        type : String,
        required : true
    },
    otp :{
        type :Number
    }

})

export const PermRecord = mongoose.model("PermRecord",permRecordSchema);