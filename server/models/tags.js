const mongoose= require("mongoose");
const CategorySchema = new mongoose.Schema({
    name:{
        type:string,
        required:true,
    },
    description:{
        type:string,
    },
    course:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Course"
    }

});
module.exports= mongoose.model("Category",CategorySchema);