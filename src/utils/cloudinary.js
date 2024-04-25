import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async (locaFilePath)=>{
    try {
        if(!locaFilePath) return null;
        const response =  await cloudinary.uploader.upload(locaFilePath, {
            resource_type : "auto",
            folder : "social-media"
        })
        //file uploaded on cloudinary
        console.log("file is uploaded on cloudinary");
        console.log(response.url);
        return response;
        }
    catch (error) {
        fs.unlinkSync(locaFilePath); //remove locally saved temp file as the upload operation failed 
        return null;
    }
}

cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
  { public_id: "olympic_flag" }, 
  function(error, result) {console.log(result); });