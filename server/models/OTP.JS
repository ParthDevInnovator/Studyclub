const mongoose = require("mongoose");
const mailSender = require("../utilis/mailSender");
const OTPSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,

    },
    otp:{
        type:String,
        required:true,
    },
    createdAt:{
        type:Date,
        default:Date.now(),
        expires:'5m',
    }
});
async function sendVerificationEmail(email,otp){
    try{
        const mailResponse = await mailSender(email,"Verification Email from studyNotion",otp);
        console.log("Email sent Successfully",mailResponse);

    }
    catch(error){
        console.log("error occured while sending mail ",error);
        throw error;
    }
}
OTPSchema.pre('save', async function (next) {
    await sendVerificationEmail(this.email, this.otp);
    next();
});

// Export the model
module.exports = mongoose.model('OTP', OTPSchema);