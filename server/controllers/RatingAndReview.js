const ratingAndreview = require("../models/RatingAndReview");
const course = require("../models/Course");
const RatingAndReview = require("../models/RatingAndReview");
//create rating
exports.createRating = async(req,res)=>{
    try{ 
        //get userid
        const userId= req.user.id;
        //fetchdata from reqbody
        const{rating,review,courseId} = req.body;
        //check if user is enrolled
        const courseDetails=await course.findOne(
                            {_id:courseId,
                                studentsEnrolled:{$elemMatch:{$eq:userId}},
                            } );
                            if (!courseDetails) {
                                return res.status(404).json({
                                    success:false,
                                    message:`Student is not enrolled in the course`
                                })
                            }
        //check if user has already reviewed the course
        const alreadyReviewed = await RatingAndReview.findOne({
                                                 user:userId,
                                                 course:courseId,});
                                                 
                                                 if (alreadyReviewed) {
                                                    return res.status(403).json({
                                                        success:false,
                                                        message:`You have already reviewed the course`,
                                                    });
                                                }
        //create rating review
        const ratingReviews = await RatingReview.create({
                                               rating,review,
                                               course:courseId,
                                               user:userId,
        });
        //update course with rating review 
         const updatedCourseDetails =   await Course.findByIdAndUpdate(courseId ,{
                                  $push:{
                                    ratingAndReviews:ratingReviews._id,
                                  }
        },
    {new:true});
    console.log(updatedCourseDetails);
        //return response
        return res.status(200).json({
            success:true,
            message:`Rating and review created successfully `,
            ratingReviews,
        })

    }
    catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}
//get average rating
exports.getAverageRating = async(req,res)=>{
    try{
         //get course id
         const courseId = req.body.courseId;
         //calculate average rating
         const result = await RatingAndReview.aggregate([
            {
                $match:{
                    course: new mongoose.Types.ObjectId(courseId)
                },
            },
            [
                $group,{
                    _id:null,
                    averageRating:{
                        $avg:"$rating"
                    },
                }
            ]
         ])
         //return rating
         if (result.lenght>0) {
            return res.status(200).json({
                success:true,
                averageRating:result[0].averageRating,
            })
         }
         //if no rating review exist
         return res.status(200).json({
            success:true,
            message:`Average rating is 0, no rating given till now`,
            averageRating:0,
         })
    }     catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })

}
}
//get all rating and review
exports.getAllRating = async(req,res)=>{
    try{ 
        const allReview = await RatingAndReview.find({})
                                 .sort({rating:"desc"})
                                 .populate({
                                    path:"user",
                                    select:"firstName lastName email image",
                                 })
                                 .populate({
                                    path:"course",
                                    select:"courseName",
                                 })
                                 .exec();

                                 return res.status(200).json({
                                    success:true,
                                    message:`All reviews fetch successfully`,
                                    data:allReview,
                                 });
    }catch(error){
        console.log(error)
        return res.status(500).json({
            success:false,
            message:error.message,
        })

    }
}