// import express from 'express';  
// import cookieParser from 'cookie-parser';
// import cors from 'cors';

// const app = express();

// app.use(cors({
//     origin : process.env.CORS_ORIGIN,         // accepting responses from all origins
//     credentials : true
// }));

// app.use(express.json({limit : "16kb"}));       // if data recieved from json
// app.use(express.urlencoded({extended : true, limit : "16kb"}));     // if data recieved from url
// app.use(express.static("public"));             // if  i want to save any file folder or image in public folder  
// app.use(cookieParser());


// // import router

// import useRouter from './routes/user.router.js';

// app.use("/api/v1/user", useRouter);

// export {app}


import express from 'express';  
import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

const corsOptions = {
  origin: process.env.CORS_ORIGIN, // Set the origin to the Netlify site
  credentials: true
};

app.use(cors(corsOptions));

app.use(express.json({ limit: "16kb" })); // if data received from JSON
app.use(express.urlencoded({ extended: true, limit: "16kb" })); // if data received from URL
app.use(express.static("public")); // if I want to save any file, folder, or image in the public folder  
app.use(cookieParser());

// Import router
import useRouter from './routes/user.router.js';

app.use("/api/v1/user", useRouter);

export { app };
