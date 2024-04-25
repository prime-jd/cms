import { asyncHandler } from "../utils/asyncHandler.js";


const registerUser = asyncHandler(async (req, res) => {
    res.status(200).json({ message: "Register User" });
    

    // get user details from frontend
    const {email,username,password,fullname}= req.body
    console.log(email)

    // check validation 
    
});

export { registerUser };