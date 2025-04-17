const mongoose = require('mongoose');
const fs = require('fs');
const path = require('path');

const Course = require('../models/course');
const Educator = require("../models/educator");
const Student = require("../models/student");
const Assignment = require('../models/assignment');
const Submission = require('../models/submission');

const sendEmail = require("../../utils/sendEmail");
const {deleteFile, deleteFolder} = require("../../utils/deleteFile");


exports.createAssignment = async (req, res, next) => {
    try {
        if (req.userData.userType !== 'educator') {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const course = await Course.findById(req.params.courseId).exec();
        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }
        const educator = await Educator.findById(req.userData.userId).exec();

        if (educator._id.toString() !== course.createdBy.toString()) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        const attachment = req.files.map(file => file.path);
        const assignment = new Assignment({
            title: req.body.title,
            description: req.body.description,
            assignedBy: req.userData.userId,
            course: req.params.courseId,
            dueDate: req.body.dueDate,
            attachment: attachment
        });

        await assignment.save();
        console.log(assignment._id);

        course.courseAssignments.push(assignment._id);

        await course.save();
        return res.status(201).json({
            message: 'Assignment created',
            assignment: assignment
        });
    } catch (err) {
        return res.status(500).json({
            error: err
        });
    }
}

// exports.editAssignment = async (req, res, next) => {
//     try {
//         const assignment = await Assignment.findById(req.params.assignmentId).exec();
//
//         if (!assignment) {
//             return res.status(404).json({
//                 message: 'Assignment not found'
//             });
//         }
//
//         let oldThumbLink = course.thumbnail;
//         const newFolderName = `${req.body.courseCode}-${req.body.courseTitle}`;
//         const newPath = path.join(__dirname, `../../uploads/course/${newFolderName}`);
//         console.log(newPath);
//
//         if (req.file && oldThumbLink != null) {
//             oldThumbLink = newPath + '/' + path.basename(oldThumbLink);
//             console.log(oldThumbLink);
//             deleteFile(oldThumbLink);
//         }
//
//         const updateData = req.body;
//
//         await Course.updateOne({_id: courseId}, {$set: updateData}).exec();
//
//         return res.status(200).json({
//             message: 'Course updated'
//         });
//
//     } catch (err) {
//         console.log(err);
//
//         return res.status(500).json({
//             error: err
//         });
//     }
// }
