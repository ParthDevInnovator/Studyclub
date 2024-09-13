const Profile = require("../models/profile");
const user = require("../models/user");
const User = require("../models/user");
exports.updateProfile= async(req,res)=>{
    try{
        //getdata
        const{dateofBirth="",about="",contactNumber,gender}= req.body;
        //getuserid
        const id = req.user.id  ;    
        //validator
        if (!contactNumber||!gender||!id) {
            return res.status(400).json({
                success:"false",
                message:`All fields are required`,
            });
        }
        //findprofile
        const userDetails = await User.findById(id);
        const profileId = userDetails.additionalDetails;
        const profileDetails = await Profile.findById(profileId);

        //updateprofile
        profileDetails.dateofBirth= dateofBirth;
        profileDetails.about= about;
        profileDetails.gender = gender;
        profileDetails.contactNumber= contactNumber;
        await profileDetails.save();
        //returnres
        return res.status(200).json({
            success:true,
            message:`Profile updated successfully`,
            profileDetails,
        });

    }catch(error){
      return res.status(500).json({
        success:false,
        error:error.message,
      });
    }
};
//delete account
//how can we schedule delete operation
exports.deleteAccount = async(req,res)=>{
    try{
        //getid
        const id = req.user.id;
        //validation
        const userDetails = await User.findById(id);
        if (!userDetails) {
            return res.status(404).json({
                success:false,
                message:`User not found`,
            });
        }
        //deleteprofile
        await Profile.findByIdAndDelete({_id:userDetails.additionalDetails});
        //deleteuser
        await User.findByIdAndDelete({_id:id});
        //unenrolled user form all enrolled courses
        return res.status(200).json({
            success:true,
            message:`User Deleted successfully `
        })
    }
    catch(error){
      return res.status(500).json({
        success:false,
        message:`User cannot be Deleted successfully `,
      });
    }
}
exports.getAllUserDetails = async(req,res)=>{
    try{
      const id = req.user.id;
      const userDetails = await User.findById(id).populate("additionalDetails").execu();
      return res.status(200).json({
        success:true,
        message:`User Data Fetched Successfully`
      });
    }
    catch(error){
        return res.status(500).json({
            success:false,
            message:error.message, 
        });

    }
}
