import { asyncHandler } from "../utils/asyncHandler.js";
import { Monday } from "../models/mondaySchedule.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Record } from "../models/subjectAttendance.model.js";
import { Teacher } from "../models/teacher.model.js";

const getFullTable = asyncHandler(async (req,res)=>{
    const table = await Monday.find()
    //console.log(table)
    if(!table){
        throw new ApiError(400, "table not found")
    }
    return res.json(new ApiResponse(200 ,"Table sent Successfully",table))
})

const getCurrentSchedule = asyncHandler(async (req, res) => {
    
        const { username, day } = req.body;
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
const generateOTP  = asyncHandler(async (req, res) => {
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
    const {date,subjectcode,subject,faculty,facultyid,starttime} = req.body;

    if(!subjectcode && !faculty){
        throw new ApiError(400, "subject not found")
    }
    const sub = await Monday.findOne({subject : subject})
    if(!sub){
        throw new ApiError(400,"no record of subject")
    }
    const teacher = await Teacher.find({username : facultyid})
    if(!teacher){
        throw new ApiError(400,"no record of faculty")
    }
    const proxy = (teacher.fullName === faculty)
    const record = await Record.create({
        date : date,
        faculty : faculty,
        startTime : starttime,
        subjectcode : subjectcode,
        rollNo : "",
        proxy,
        time : ""
    })
    return res.json(new ApiResponse(200, 'OTP sent successfully', record))
    
});

const submitOTP = asyncHandler(async (req, res) => {

    const { rollno,subjectcode, otp,time, classname} = req.body;
    if(!rollno && !otp) throw new ApiError(400, "both fields are required")

    const student = req.user
    
    if(student.rollNo !== rollno && student.className !== classname) {  
        throw new ApiError(400, "Wrong User Submisssion")   
    }

    const rec = await Record.find({subjectCode : subjectcode})
    rec.rollNo = rollno;
    rec.time = time;
    rec.className=classname;
    await rec.save({validateBeforeSave : false})
    return res.json(new ApiResponse(200, "time table updated successfully",changeStatus))
});

export {getCurrentSchedule, generateOTP, submitOTP,getFullTable }