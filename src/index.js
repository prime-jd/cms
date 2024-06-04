// first method to import env
// require('dotenv').config({ path : "./env"})

//second method to import env
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

connectDB()
.then(()=>
{
    app.listen(process.env.PORT, () =>{
        console.log(`Server is running on port ${process.env.PORT || 8000}`);
    })
})
.catch((error)=>
{
    console.log("ERROR :", error);
    throw error;
});


// connect env file as soon as possible
dotenv.config({
    path: "./.env",
});

















// +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
//FIRST APPROACH OF CONNECTING TO MONGODB
//++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
// ;(async() => {
//     try{
//         await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
//         app.on("error", (err) => console.log("ERROR :", err))

//         app.listen(process.env.PORT, () => {
//             console.log(`Server is running on port ${process.env.PORT}`);
//         })
//     }
//     catch(e){
//         console.log("ERROR :", e);
//         throw e;
//     }
// })()
