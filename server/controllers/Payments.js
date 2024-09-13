const {instance }=require("../config/razorpay");    
const Course = require("../models/Course");
const user = require("../models/user"); 
const mailSender = require("../utilis/mailSender");
const {courseEnrollmentEmail}= require("../mail/templates/courseEnrollmentEmail");
const { json } = require("express");
//capture the payment and initialize the razorpay
exports.capturePayment = async(req,res)=>{
    //get course and user id
    const {course_id}=req.body;
    const userId = req.user.id;
    //validation
    //valid courseid
    if (!course_id) {
        return res.json({
            success:false,
            message:`Please provide a valid course Id`,
        })
        
    }
      //valid courseDetails
      let course;
      try{
        course = await Course.findById(course_id);
        if(!course){
            return res.json({
                success:false,
                message:`Could not find this course`,
            });
        }
        //user already pay for same course
    
    const uid = new mongoose.Types.ObjectId(userId);
    if (course.studenetEnrolled.includes(uid)) {
        return res.status(200).json({
            success:false,
            message:`You have already enrolled in this course`
        })
    }
    }
    catch(error){
          console.error(error);
          return res.status(500).json({
            success:false,
            message:error.message,
          });
    }
         //order create
         const amount= course.price;
         const currency = "INR";
         const option ={
            amount :amount*100,
            cuurency,
            receipt:Math.random(Date.now()).toString(),
         notes:{
            courseId:course_id,
            userId,
         }
         };
         try{
               //initiate the payment using razorpay
               const paymentResponse = await instance.orders.create(options);
               console.log(paymentResponse);
               //return res
               return res.status(200).json({
                    success:true,
                    courName:course.courseName,
                    courseDescription:course.courseDescription,
                    thumbnail:course.thumbnail,
                    orderId:paymentResponse.id,
                    currency:paymentResponse.currency,
                    amount:paymentResponse.amount,

               })
         } catch(error){
             console.log(error);
             res.json({
                success:false,
                message:"Could not initiate order ",
             });
         }
};
//verify signature of razorpay and server
exports.verifySignature = async(req,res)=>{
    const webhookSecret = "12345678";
    const signature=req.header["x-razorpay-signature"];
     const shasum = crypto.createHmac("sha256",webhookSecret)
     shasum.update(JSON.stringify(req.body));
     const digest = shasum.digest("hex");

     if (signature==digest) {
        console.log("Payment is Authorized")
        const {courseId,userId}=req.body.payload.payment.entity.notes;
        try{
            //fullfill the action
            //find the course and enroll the student
            const enrolledCourse = await Course.findOneAndUpdate(
                                                       {_id:courseId},
                                                       {$push:{studentsEnrolled:userId}},
                                                       {new:true},
            );
            if (!enrolledCourse) {
                return res.status(500).json({
                    success:false,
                    message:`Course not found`,
                })
            }
            console.log(enrolledCourse);
            //find the student and add the course to thier list enrolled course 
            const enrolledStudent= await user.findOneAndUpdate(
                {_id:userId},
                {$push:{course:courseId}},
                {new:true},
            );
            console.log(enrolledStudent);
            //mail send karo confirmation 
            const emailResponse = await mailSender(
                enrolledStudent.email,
                "successfully enrolled",
                "Congratulation you have enrolled in course",

            )
            console.log(emailResponse);
            return res.status(200).json({
                success:true,
                message:`Signature verified and course added `,
            })

        }
        catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:error.message,
        });
        }
     }
     else{
        return res.status(400).json({
            success:false,
            message:`Invalid request `,
        })
     }
}