const  mongoose = require("mongoose");
const { resetPasswordToken } = require("../controllers/ResetPassword");
const userSchema = new mongoose.Schema({
  firstName :{
    type:String,
    required:true,
    trim:true,
  },
  lastName :{
    type:String,
    require:true,
    trim:true,
  },
    email:{
        type:String,
         require:true,
        trim:true,
    },
    password:{
        type:String,
        require:true,
    },
    accountType:{
        type:String,
        enum:["Admin","Instructor","Student"],
        required:true
    },
    additionalDetails:{
        type:mongoose.Schema.Types.ObjectId,
        required:true,
        ref:"Profile",
    },
    courses:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",

    }],
        Image:{
            type:String,
            required:true,

        },
        token:{
            type:String,
        },
        resetPasswordExpires:{
            type:Date,
        },

    courseProgress:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:"CourseProgress",
    }]
});
module.exports = mongoose.model("User", userSchema);