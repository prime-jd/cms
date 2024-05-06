import { Router } from "express";
import { registerFaculty,registerUser,loginUser,logoutUser,refreshAccessToken } from "../controllers/user.controller.js";
import { upload } from "../middlewares/multer.middleware.js";
import { verifyJwt } from "../middlewares/auth.middleware.js";
import { getCurrentSchedule, generateOTP,submitOTP, getFullTable} from "../controllers/timeTable.controller.js";

const router = Router()

router.route("/register").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1}

]),registerUser)

router.route("/register-faculty").post(
    upload.fields([
        { name: "avatar", maxCount: 1 },
        { name: "coverImage", maxCount: 1}

]),registerFaculty)

router.route("/login").post(loginUser)

// secured routes
router.route("/logout").post(verifyJwt , logoutUser)
router.route("/refresh-token").post(refreshAccessToken)
router.route("/week-Schedule").get(getFullTable)

router.route("/schedule").post(verifyJwt,getCurrentSchedule)
router.route("/schedule-in").post(generateOTP)
router.route("/schedule-out").post(verifyJwt,submitOTP)

export default router;