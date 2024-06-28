import jwt from "jsonwebtoken"

export const generateTokenAndSetCookie=(userId,res)=>{
    const token =jwt.sign({userId},process.env.JWT_SECRET,{
        expiresIn:'15d'
    })
    res.cookie("jwt",token,{
        maxAge:10*24*60*60*1000,
        httpOnly:true,//prevent xss attacks cross site scripting attack
        sameSite:"strict",//csrf attacks cross site request forgery attacks
        secure:process.env.Node_ENV !=="development",
    })
}
