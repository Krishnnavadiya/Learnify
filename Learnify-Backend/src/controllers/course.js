const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');
const moment = require("moment");
const PDFDocument = require("pdfkit");

const Course = require('../models/course');
const Token = require("../models/token");
const Educator = require("../models/educator");
const Student = require("../models/student");
const Discussion = require("../models/discussion");
const Assignment = require('../models/assignment');
const Section = require('../models/section');
const Certificate = require('../models/certificate');
const Submission = require('../models/submission');

const sendEmail = require("../../utils/sendEmail");
const {deleteFile, deleteFolder} = require("../../utils/deleteFile");


exports.createCourse = async (req, res, next) => {
    try {
        if (req.userData.userType == "student") {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }
        let thumbnail = null;
        if (req.file) {
            thumbnail = req.file.path;
        }

        const course = await Course.findOne({courseCode: req.body.courseCode}).exec();
        if (course) {
            return res.status(409).json({
                message: 'Course code already exists'
            });
        }

        const newCourse = new Course({
            courseTitle: req.body.courseTitle,
            courseDescription: req.body.courseDescription,
            courseDescriptionLong: req.body.courseDescriptionLong,
            coursePrice: req.body.coursePrice,
            thumbnail: thumbnail,
            tags: req.body.tags,
            courseLevel: req.body.courseLevel,
            courseCode: req.body.courseCode,
            language: req.body.language,
            visibility: req.body.visibility,
            prerequisites: req.body.prerequisites,
            createdBy: req.userData.userId
        });

        await newCourse.save();

        let discussionId;
        if (req.body.discussionForum === "true") {
            const newDiscussion = new Discussion({
                messages: []
            });
            await newDiscussion.save();
            discussionId = newDiscussion._id;
        }
        newCourse.discussionForum = discussionId;

        await newCourse.save();

        const educator = await Educator.findById(req.userData.userId).exec();
        educator.courseCreated.push(newCourse._id);
        await educator.save();

        return res.status(201).json({
            message: 'Course created',
            course: newCourse
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: err
        });
    }
}

exports.editCourse = async (req, res, next) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId).exec();

        if (!course) {
            return res.status(404).json({
                message: 'Course not found'
            });
        }

        if (course.createdBy.toString() !== req.userData.userId.toString()) {
            return res.status(401).json({
                message: 'Unauthorized'
            });
        }

        let oldThumbLink = course.thumbnail;
        const newFolderName = `${req.body.courseCode}-${req.body.courseTitle}`;
        const newPath = path.join(__dirname, `../../uploads/course/${newFolderName}`);

        if (req.file && oldThumbLink != null && course.courseTitle != req.body.courseTitle) {
            oldThumbLink = newPath + '/' + path.basename(oldThumbLink);
            deleteFile(oldThumbLink);
            req.body.thumbnail = req.file.path;
        }

        const updateData = req.body;

        const sections = course.courseSections;
        for (let i = 0; i < sections.length; i++) {
            const section = await Section.findById(sections[i]).exec();
            if (section) {
                for (let i = 0; i < section.posts.length; i++) {
                    for (let j = 0; j < section.posts[i].attachments.length; j++) {
                        let filePath = section.posts[i].attachments[j];
                        filePath = filePath.replace(course.courseTitle, req.body.courseTitle);
                        console.log(filePath);
                        section.posts[i].attachments[j] = filePath;
                    }
                }
                await section.save();
            }
        }
        await course.save();
        await Course.updateOne({_id: courseId}, {$set: updateData}).exec();

        return res.status(200).json({
            message: 'Course updated'
        });

    } catch (err) {
        console.log(err);

        return res.status(500).json({
            error: err
        });
    }
}
