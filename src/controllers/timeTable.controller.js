import { asyncHandler } from "../utils/asyncHandler.js";
import { Monday } from "../models/mondaySchedule.model.js";
import { ApiError } from '../utils/ApiError.js';
import { ApiResponse } from "../utils/ApiResponse.js";

import { Teacher } from "../models/teacher.model.js";
import { Record } from "../models/tempRecord.model.js";
import { PermRecord } from "../models/permRecord.model.js";

const getFullTable = asyncHandler(async (req,res)=>{
    const table = await Monday.find()
    //console.log(table)
    if(!table){
        throw new ApiError(400, "table not found")
    }
    return res.json(new ApiResponse(200 ,"Table sent Successfully",table))
})

const getCurrentSchedule = asyncHandler(async (req, res) => {
    
        const { username, day } = req.body;    // is it to be get
        if(username === req.user.username){
            console.log("Authorized User")
            
         }
         else{
             throw new ApiError(404, "User Not Found")
         }
         const schedule = await Monday.find({day : day.toLowerCase()})
       // console.log(schedule[0].startTime);  

        if (!schedule) throw new ApiError(404, "schedule not found")

        return res.json(new ApiResponse(201, "schedule found", schedule))
    
});
const generateRec  = asyncHandler(async (req, res) => {
    // const {username, mark, status, time} = req.body;

    // const user = await User.findOne({username : username})
    // if(!user) throw new ApiError(404, "user not found")

    // if(username === req.user.username){
    //      console.log("Authorized User")
    //    const user = req.user;
    //    res.json(new ApiResponse(202, "Authorized User",user))
    // }
    // else{
    //     throw new ApiError(404, "User Not Found")
    // }
    const {date,subject,faculty,facultyId,startTime,className,roomNo} = req.body;
    console.log(req.body)
    if(!subject && !faculty){
        throw new ApiError(400, "subject not found")
    }
    const sub = await Monday.find(
        {subject: subject})
    
    if(!sub){
        throw new ApiError(400,"no record of subject")
    }
    const teacher = await Teacher.findOne({username : facultyId})
    if(!teacher){
        throw new ApiError(400,"no record of faculty")
    }
    const rec = await Record.findOne({rollNo : req.user.rollNo});
    if(rec){await Record.deleteOne(rec);}
    
    const prox = (sub[0].faculty === faculty)
    const record = await Record.create({
        date : date,
        faculty : faculty,
        startTime : startTime,
        subject : subject,
        rollNo : req.user.rollNo,
        proxy : !prox,
        time : "",
        className,
        roomNo,
        otp : 0
    })
    return res.json(new ApiResponse(200, 'OTP sent successfully', record))
    
});

const submitOTP = asyncHandler(async (req, res) => {

    const {otp,className, time} = req.body;
    if(!className && !otp) throw new ApiError(400, "both fields are required")

    const authOTP = await Record.find({className : className})
    console.log(authOTP);
    if(authOTP.length==0) {  
        throw new ApiError(400, "Schedule not recorded")   
    }

    authOTP.map(async x =>{ 
        if(x.otp==0)
        x.time = time
        x.otp = otp
        await x.save({validateBeforeSave : false})
    })

    
    return res.json(new ApiResponse(200, "Record updated successfully",authOTP))
});


const teacherTT = asyncHandler(async (req,res)=>{
    const user = req.user
    if(user.username[0] !== "T"){
        throw new ApiError(400, "only faculty allowed")
    }
    const teacher = await Monday.find({facultyId : user.username})
    console.log(teacher);
    return res.json(new ApiResponse(200, "Data sent Successfully",teacher))
});


const authenticateOTP = asyncHandler(async (req, res) => {
    const { otp, rollNo } = req.body;
    console.log(rollNo)
    console.log(otp)
    // Convert otp from request body to a number
    const otpNumber = Number(otp);
    const auth = await Record.find({});
    console.log(auth)
    // Fetch the record based on rollNo
    const record = await Record.findOne({rollNo});
    console.log(record);

    if (!record) {
        throw new ApiError(400, "Schedule not recorded");
    }
    if (record.otp === 0) {
        throw new ApiError(400, "OTP not set");
    }
    if (record.otp === otpNumber) {
        await PermRecord.create({
            date : record.date,
            faculty : record.faculty,
            startTime : record.startTime,
            subject : record.subject,
            rollNo : record.rollNo,
            proxy : record.proxy,
            time : record.time,
            className : record.className,
            roomNo : record.roomNo
        });
        await Record.deleteOne({ _id: record._id });
    } else {
        throw new ApiError(400, "OTP not matched");
    }

    return res.json(new ApiResponse(200, "Record updated successfully", record));
});


const isSubjectChecked= asyncHandler(async (req,res)=>{
    const data = await Record.find()                                       // change record to permrecord
    return res.json(new ApiResponse(200, "Data sent Successfully", data))
})

export {getCurrentSchedule, generateRec, submitOTP,getFullTable,teacherTT ,isSubjectChecked,authenticateOTP}

