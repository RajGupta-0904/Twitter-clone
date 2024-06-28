// const express=require("express");
import express from "express";
import mongoose  from "mongoose";
import dotenv from "dotenv";
import {v2 as cloudinary} from "cloudinary"
const app=express();
import authRoutes from "./routes/auth.routes.js"
import userRoutes from "./routes/user.routes.js"
import postRoutes from "./routes/post.routes.js"
import notificationRoutes from "./routes/notification.routes.js"
import cookieParser from "cookie-parser";

mongoose.connect('mongodb://127.0.0.1:27017/Twitter', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('Connected  to MongoDB');
})
.catch((error) => {
    console.error('Error connecting to MongoDB: ', error.message);
});

dotenv.config();
cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
})
const PORT=process.env.PORT || 8080;

app.use(express.json());
app.use(express.urlencoded({extended:true}))
app.use(cookieParser());

app.use("/api/auth",authRoutes);
app.use("/api/users",userRoutes);
app.use("/api/posts",postRoutes);
app.use("/api/notificatios",notificationRoutes)


app.listen(PORT,()=>{
    console.log(`server is running on port ${PORT}`)
});