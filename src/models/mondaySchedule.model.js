import mongoose from "mongoose";

const MondaySchema = new mongoose.Schema({
    subject: {
        type: String,
        required: true,
    },
    subjectCode : {
        type: String,
        required: true,
    },
    faculty : {
        type: String,
        required: true,
    },
    
    time: {
        type: String,
        required: true,
    },
    status: {
        type: Boolean,
        default: true,
    },
    mark : {
        type : Boolean,
        required : true
    }
    
});

export const Monday = mongoose.model("Monday", MondaySchema);

const MondayData = [
    {
        subject: "Mathematics",
        subjectCode: "MATH",
        faculty: "Dr. Rakesh",
        time: "9:30 AM - 10:20 AM",
        status :false,
        mark : false,
    },
    {
        subject: "English",
        subjectCode: "ENG",
        faculty: "Dr. Rakesh",
        time: "10:20 AM - 11:10 AM",
        status: false,
        mark  : false
    },
    {
        subject: "Science",
        subjectCode: "SCI",
        faculty: "Dr. Rakesh",
        time: "11:10 AM - 12:50 PM",
        status: false,
        mark : false
    },
    {
        subject: "Social Science",
        subjectCode: "SS",
        faculty: "Dr. Rakesh",
        time: "12:50 PM - 1:40 PM",
        status: false,
        mark : false
    },
    {
        subject: "Web Technology",
        subjectCode: "CS",
        faculty: "Ajeet Kr. Bhartee",
        time: "2:30 PM - 3:20 PM",
        status: false,
        mark : false
    },
];