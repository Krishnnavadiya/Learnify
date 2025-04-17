const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Course = require('../models/course');
const Educator = require('../models/educator');
const Student = require('../models/student');
const Assignment = require("../models/assignment");

exports.getAllCourse = async (req, res, next) => {
    try {
        const courses = await Course.find();

        return res.status(200).json({
            courses: courses
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

exports.getCourseByEducator = async (req, res, next) => {
    try {
        const courses = await Course.find({createdBy: req.userData.userId}).select('_id courseTitle courseDescription coursePrice enrolledStudents courseLevel courseCode language rating createdBy').populate('createdBy', 'fname lname').exec();

        if (!courses) {
            return res.status(404).json({
                message: 'This educator has no courses'
            });
        }

        return res.status(200).json({
            courses: courses
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

