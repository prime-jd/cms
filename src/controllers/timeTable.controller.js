import { asyncHandler } from "../utils/asyncHandler.js";
import { Monday } from "../models/mondaySchedule.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const updateTimeTable = asyncHandler(async (req, res) => {
    
        const { username, day } = req.body;
        if(username === req.user.username){
            console.log("Authorized User")
            
         }
         else{
             throw new ApiError(404, "User Not Found")
         }
         const schedule = await Monday.find({day : day.toLowerCase()})
        console.log(schedule[0].startTime);  

        if (!schedule) throw new ApiError(404, "schedule not found")

        return res.json(new ApiResponse(201, "schedule found", schedule))
    
});
const onTimeTable  = asyncHandler(async (req, res) => {
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
    const {mark,status,startTime,endTime} = req.body;

    if(mark && status) throw new ApiError(400, "mark is required")
    let changeStatus = await Monday.find({time : time})
    
    if(!mark && status) {
        changeStatus[0].status = status;
    }
    console.log(changeStatus[0])
    await changeStatus[0].save({validateBeforeSave :false})
    return res.json(new ApiResponse(200, "time table status updated successfully", changeStatus))
});

const getTimeTable = asyncHandler(async (req, res) => {

    const { mark, status, startTime, endTime} = req.body;
    if(!mark && !status) throw new ApiError(400, "status is required to mark")

    const changeStatus = await Monday.find({startTime : startTime})

    if(mark && status) {  
        changeStatus[0].mark = mark    
    }

    await changeStatus[0].save({validateBeforeSave :false})
    return res.json(new ApiResponse(200, "time table updated successfully",changeStatus))
});

export { updateTimeTable, onTimeTable, getTimeTable }