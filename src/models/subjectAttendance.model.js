import mongoose from "mongoose";

const recordSchema= new mongoose.Schema({

    date : {
        type : Date,
        required : true
    },
    time : {
        type : String,
        required :true
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
        required :true   
    },
    startTime : {
        type: String,
        required : true
    },
    proxy : {
        type : Boolean,
        required : true
    }

},{timestamps : true})

export const Record = mongoose.model("Record",recordSchema);