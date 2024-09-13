const subsection = require("../models/SubSection");
const section = require("../models/section");
const { uploadImageToCloudinary } = require("../utilis/imageUploader");
//create subsection
exports.createSubSection=async(req,res)=>{
    try{
        //fetch data from body
        const{sectionId,title,timeDuration,description}=req.body;
        //extract file/video
        const video = req.files.videoFile;
        //validation
        if (!sectionId||!title||!timeDuration||!description||!video) {
            return res.status(400).json({
                success:false,
                message:`All fields are required `,
            })
        }
        //upload video to cloudinary
        const uploadDetails = await uploadImageToCloudinary(video,process.env.FOLDER_NAME);
        //create a subsection
        const SubsectionDetails = await subsection.create({
            title:title,
            timeDuration:timeDuration,
            description:description,
            videoUrl:uploadDetails.secure_url,
        })
        //update subsection with this subsection objectid
        const updateSection = await Section.findByIdAndUpdate({_id:sectionId},
                                                               {$push:{
                                                                subsection:SubsectionDetails._id,

                                                               }},
                                                               {new:true}
        );
        //return response 
        return res.status(200).json({
            success:true,
            message:`Sub section created successfully`,
            updatedSection,
        })

    } catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal server error",
            error:error.message,
        })
         
    }
}
//update subsection
//delete subsection 