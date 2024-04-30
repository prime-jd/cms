import { asyncHandler } from "../utils/asyncHandler";
import { Monday } from "../models/mondaySchedule.model.js";
import { ApiError } from "../utils/apiError.js";

const updateTimeTable = asyncHandler(async (req, res) => {
    try {
        const { day } = req.body;

        if (!day) {
            throw new ApiError(404, "Day is Required")
        }

        let Model;
        switch (day) {
            case 'Monday':
                Model = Monday;
                break;
            case 'Tuesday':
                Model = Tuesday;
                break;
            // Add more cases for other collections as needed
            default:
                return res.status(404).json({ error: "Collection not found" });
        }


        const currentTime = new Date();


        const currentDay = currentTime.toLocaleDateString('en-US', { weekday: 'long' });
        const currentTimeString = currentTime.toLocaleTimeString('en-US', { hour12: false });

        const timetableData = await TimeTable.find({ day: currentDay });


        timetableData.forEach(async (timetableItem) => {

            const [start, end] = timetableItem.time.split(' to ');


            if (currentTimeString >= start && currentTimeString <= end) {

                await TimeTable.findByIdAndUpdate(timetableItem._id, { status: true });
            } else {

                await TimeTable.findByIdAndUpdate(timetableItem._id, { status: false });
            }
        });
    } catch (error) {
        console.error('Error updating status:', error);
    }


})