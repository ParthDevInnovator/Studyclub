const mongoose=  require("mongoose")
const courseProgressSchema = new mongoose.Schema({
    courseID:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course",
    },
    compltedVideos:{
        type:mongoose.Schema.type.ObjectId,
        ref:"Subsection",
    }
});
module.exports=mongoose.model("Courseprogress",courseProgressSchema);