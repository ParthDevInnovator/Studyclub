const jwt = require("jsonwebtoken");
require("dotenv").config();
const user = require("../models/user");
exports.auth = async(req,res,next)=>{
    try{
        //extract token
        const token = req.cookies.token
                        || req.body.token
                        || req.header("Authorisation").replace("Bearer","");
                        //if token is missing
                        if(!token){
                            return res.status(401).json({
                                success:false,
                                message:`Token is missing`, 
                            });
                        }
                        //verify token
                        try{
                            const decode =  jwt.verify(token,process.env.JWT_SECRET);
                            console.log(decode);
                            req.user=decode;
                        }
                        catch(error){
                            return res.status(401).json({
                                success:false,
                                message:`token is invalid`
                            });
                        }
                        next();
                    }
                        catch(error){
                    return res.status(401).json({
                        success:false,
                        message:`Something went wrong while validating the token`,
                          });
                    }
               }
               //isstudent
               exports.isStudent = async(req,res,next)=>{
                try{
                    if (req.user.accountType !== "Student") {
                        return res.status(401).json({
                             success:false,
                             message:`This is a protected route for students only`,
                        });

                    }
                    next();
                }
                catch(error){
                    return res.status(401).json({
                        success:false,
                        message:`User role is not verified,please try again`
                    })
                }
               }

               exports.isInstructor = async(req,res,next)=>{
                try{
                    if (req.user.accountType !== "Instructor") {
                        return res.status(401).json({
                             success:false,
                             message:`This is a protected route for Instructor only`,
                        });

                    }
                    next();
                }
                catch(error){
                    return res.status(401).json({
                        success:false,
                        message:`User role is not verified,please try again`
                    })
                }
               }
               exports.isAdmin = async(req,res,next)=>{
                try{
                    if (req.user.accountType !== "Admin") {
                        return res.status(401).json({
                             success:false,
                             message:`This is a protected route for Admin only`,
                        });

                    }
                    next();
                }
                catch(error){
                    return res.status(401).json({
                        success:false,
                        message:`User role is not verified,please try again`
                    })
                }
               }