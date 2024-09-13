const Course = require("../models/Course")
const Tag = require("../models/tags")
const User = require("../models/user")
const {uploadImageToCloudinary}= require("../utilis/imageUploader")
//create course hander
exports.createCourse = async(req,res)=>{
    try{
         //fetch data
         const {courseName, courseDescription,whatYouWillLearn,price,tag}=req.body;
         //get thumbnail
         const thumbnail= req.files.thumbnailImage;
         //validator
         if (!courseName||!courseDescription||!whatYouWillLearn||!price||!thumbnail ) {
            return res.status(400).json({
                success:false,
                message:`All things are mandatory`
            });
            
         }
         //check instructor
         const userId = req.user.id;
         const instructorDetails = await User.findById(userId);
         console.log("instructorDetails:",instructorDetails);
         if (!instructorDetails) {
            return res.status(404).json({
                success:false,
                message:`Instructor not found`,
            });
            
         }
         //check given tag is valid or not
         const tagDetails = await Tag.findById(tag);
         if (!tagDetails) {
            return res.status(404).json({
                success:false,
                message:`Tagdetails not found`,
            });
         }
         //upload image to cloudinary 
         const thumbnailImage = await uploadImageToCloudinary(thumbnail,process.env.FOLDER_NAME);
         //create an entry for new course
         const newCourse = await Course.create({
            courseName,
            courseDescription,
            instructor:instructorDetails._id,
            whatYouWillLearn:whatYouWillLearn,
            price:price,
            tag:tagDetails._id,
            thumbnail:thumbnailImage.secure_url,
         })
         //add the new course to user schema to instructor
         await User.findByIdAndUpdate(
           {_id:instructorDetails._id},
           {
            $push:{
                courses:newCourse._id,
            }
           },{new:true},
         );
         //update the tagschema
         return res.status(200).json({
            success:true,
            message:`Course Created Successfully`,
            data:newCourse,
         });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:`failed to create course`,
            error:error.message,
        })
    }
};


//get all course hander
exports.showAllCourses=async(req,res)=>{
    try{
        const allCourses = await Course.find({},{ courseName:true,
                                                  price:true,
                                                  thumbnail:true,
                                                  instructor:true,
                                                  ratingAndReviews:true,
                                                  studentsEnrolled:true,})
                                                  .populate("instructor")
                                                  .exec()
               return res.send(200).json({
                success:true,
                message:`Data from all courses fetched successfully `,
                data:allCourses,    
               })                                   
    }
    catch(error){
     console.log(error);
     return res.status(500).json({
        success:false,
        message:`cannot fetch course data`,
        error:error.message,
     })
    }
}
//get coursedetails
exports.getCourseDetails = async(req,res)=>{
    try{ 
        //get id
        const {courseId}=req.body;
        //find course details
        const courseDetails = await Course.find(
            {_id:courseId})
            .populate({
                path:"instructor",
                populate:"additionalDetails", 
            })
            .populate("category")
            .populate("ratingAndreview")
            .populate({
                path:"courseContent",
                populate:{
                    path:"subSection",
                }
            })
            .exec();
            //validation
            if (!courseDetails) {
                return res.status(400).json({
                    success:false,
                    message:`Could not find the course with ${courseId}`
                });
            }
              //return response
              return res.status(200).json({
                success:true,
                message:`Course details fetched successfully`,
                data:courseDetails,
              })

    }catch(error){
         console.log(error);
         return res.status(500).json({
            success:false,
            message:error.message,
         });
    }
}