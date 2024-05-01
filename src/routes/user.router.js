import { Router } from "express";
import { registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getTimeTable, onTimeTable, updateTimeTable } from "../controllers/timeTable.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1}

]),registerUser)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJwt , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/schedule").post(updateTimeTable)
router.route("/schedule-in").post(onTimeTable)
router.route("/schedule-out").post(getTimeTable)

export default router;