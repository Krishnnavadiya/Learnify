const mongoose = require('mongoose');

const Discussion = require('../models/discussion');
const Student = require('../models/student');
const Educator = require('../models/educator');
const Course = require('../models/course');


exports.addMessage = async (req, res, next) => {
    try {
        let message;
        if (req.userData.userType === 'student') {
            message = {
                message: req.body.message,
                createdByStudent: req.userData.userId
            }
        }
        else {
            const course = await Course.findById(req.params.courseId).exec();
            if (course.createdBy.toString() !== req.userData.userId.toString()) {
                return res.status(403).json({
                    message: 'You are not authorized to add messages to this discussion forum'
                });
            }
            message = {
                message: req.body.message,
                createdByEducator: req.userData.userId
            }
        }

        const course = await Course.findById(req.params.courseId).exec();

        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        if (!course.discussionForum) {
            return res.status(404).json({
                message: 'This course does not have a discussion forum'
            });
        }

        const discussionId = course.discussionForum;
        const discussion = await Discussion.findById(discussionId).exec();

        discussion.messages.push(message);
        await discussion.save();

        return res.status(201).json({
            message: 'Message added to discussion forum'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};