const Section = require("../models/section");
const Course = require("../models/Course"); // Changed from 'course' to 'Course' to match import convention
const { response } = require("express");

exports.createSection = async (req, res) => {
    try {
        //data fetch
        const { sectionName, courseId } = req.body; // Changed 'course' to 'courseId'
        
        //data validation
        if (!sectionName || !courseId) {
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }
        
        //create section
        const newSection = await Section.create({ sectionName });
        
        //update course with section objectid 
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            { new: true }
        );
        
        return res.status(200).json({
            success: true,
            message: "Section created successfully",
            updatedCourseDetails,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to create section, please try again",
            error: error.message,
        });
    }
};

exports.updateSection = async (req, res) => {
    try {
        //data input
        const { sectionName, sectionId } = req.body;
        
        //data validation
        if (!sectionName || !sectionId) { // Changed 'courseId' to 'sectionId'
            return res.status(400).json({
                success: false,
                message: "Missing Properties",
            });
        }
        
        //update data 
        const section = await Section.findByIdAndUpdate(sectionId, { sectionName }, { new: true });
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            section,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to update section, please try again",
            error: error.message,
        });
    }
};

exports.deleteSection = async (req, res) => {
    try {
        //getid--assuming that we are sending id in params
        const { sectionId } = req.params;
        
        //use findByIdAndDelete
        await Section.findByIdAndDelete(sectionId); // Changed 'section' to 'Section'
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Unable to delete section, please try again",
            error: error.message,
        });
    }
};
