import mongoose from "mongoose";

const recordSchema= new mongoose.Schema({

    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        
    },
    subjectCode : {
        type : String,
        required :true
    },
    faculty : {
        type : String,
        required :true
    },
    rollno : {
        type : String,  
    },
    startTime : {
        type: String,
        required : true
    },
    proxy : {
        type : Boolean,

    },
    className : {
        type : String
        }

},{timestamps : true})

export const Record = mongoose.model("Record",recordSchema);