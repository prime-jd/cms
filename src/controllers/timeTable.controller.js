import { asyncHandler } from "../utils/asyncHandler.js";
import { Monday } from "../models/mondaySchedule.model.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../models/user.model.js";

const updateTimeTable = asyncHandler(async (req, res) => {
    
        const { day } = req.body;
        const schedule = await Monday.find({day : 'monday'})
        console.log(schedule[0].time);  

        if (!schedule) throw new ApiError(404, "schedule not found")

        return res.json(new ApiResponse(201, "schedule found", schedule))
    
});
const onTimeTable  = asyncHandler(async (req, res) => {
    const {username, mark, status, time} = req.body;
    const user = await User.findOne({username : username})
    if(!user) throw new ApiError(404, "user not found")
    if(mark && status) throw new ApiError(400, "mark is required")
    let changeStatus = await Monday.find({time : time})
    if(!mark && !status) {
        changeStatus[0].status = true;
    }
    
    res.json(new ApiResponse(200, "time table status updated successfully", changeStatus))
});

const getTimeTable = asyncHandler(async (req, res) => {

    const {username, mark, status, time} = req.body;
    const user = await User.findOne({username : username})
    if(!user) throw new ApiError(404, "user not found")
    if(!mark && !status) throw new ApiError(400, "mark is required")
    const changeStatus = await Monday.find({time : time})
    if(mark && status) {
       
        changeStatus[0].mark = mark
        
    }
    await changeStatus[0].save({validateBeforeSave :false})
    res.json(new ApiResponse(200, "time table updated successfully",changeStatus))
});

export { updateTimeTable, onTimeTable, getTimeTable }