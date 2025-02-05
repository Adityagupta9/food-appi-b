const jwt = require("jsonwebtoken");
const User = require("../models/User");

const protect = async (req,res,next)=>{
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if(!token){
            return res.status(400).json({message:"Unauthorized user no token"});
        }
        const decode  = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decode.id).select("-password");
        if(!req.user){
            return res.status(400).json({message:"Unauthorized user Invalid token"});
        }
        next();
    } catch (error) {
        res.status(401).json({message:"Unauthorized token failed"})
    }
}

const adminOnly =(req,res,next)=>{
    try {
        if(req.user.role!="admin"){
            return res.status(403).json({message:"Forbidden, admin only"});
        }
        next();
    } catch (error) {
        res.status(400).json({message:"Error in admin only"});
    }
}

const staffOnly = async(req,res,next)=>{
    if(req.user.role!="staff"){
        return res.status(403).json({message:"Forbidden,Only staff"});
    }
    next();
}

module.exports = {protect,adminOnly,staffOnly};