import {v2 as cloudinary} from 'cloudinary';
import fs from "fs";
          
cloudinary.config({ 
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
  api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_SECRET_KEY
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
        fs.unlinkSync(locaFilePath);    // remove locally saved temp file
        return response;
        }
    catch (error) {
        fs.unlinkSync(locaFilePath); //remove locally saved temp file as the upload operation failed 
        return null;
    }
}


export { uploadOnCloudinary};