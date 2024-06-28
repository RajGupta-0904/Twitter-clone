import User from "../models/user.mode..js"
import jwt from "jsonwebtoken"

export const protectRoute= async(req,res,next)=>{
    try {
        const token =req.cookies.jwt;
        if(!token){
            return res.status(401).json({error:"unauthorised : no token provided"});
        }
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        if(!decoded){
            return res.status(401).json({error:"Unauthorised : INvalid Token"});
        }
        const user =await User.findById(decoded.userId).select("-password");//isse password nhi milega .select("-passwprd")
        if(!user){
           return res.status(404).json({error:"User not found"}); 
        }
        req.user=user;
        next();

    } catch (error) {
        console.log("ERROR IN protect CONTROLLER",error.message);
        res.status(500).json({error:"internal server errer"});
    }
}