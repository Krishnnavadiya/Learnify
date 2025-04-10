const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


const Student = require('../models/student');
const Educator = require("../models/educator");
const Token = require("../models/token");


exports.userSignup = async (req, res, next) => {
    try {
        let user = await Student.findOne({email: req.body.email}).exec();

        if (user) {
            if (req.file)
                deleteFile.deleteFile(req.file.path);
            return res.status(409).json({
                message: 'Mail is already in use - Student'
            });
        }

        user = await Student.findOne({username: req.body.username}).exec();

        if (user) {
            if (req.file)
                deleteFile.deleteFile(req.file.path);
            return res.status(409).json({
                message: 'Username is already in use - Student'
            });
        }

        user = await Student.findOne({phone: req.body.phone}).exec();

        if (user) {
            if (req.file)
                deleteFile.deleteFile(req.file.path);
            return res.status(409).json({
                message: 'Phone number is already in use - Student'
            });
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        let profilePic = null;
        if (req.file) {
            profilePic = req.file.path;
        }

        const newUser = new Student({
            fname: req.body.fname,
            lname: req.body.lname,
            gender: req.body.gender,
            location: req.body.location,
            dob: req.body.dob,
            username: req.body.username,
            password: hash,
            phone: req.body.phone,
            email: req.body.email,
            profilePic: profilePic,
            interests: req.body.interests,
            bookmarkedCourses: req.body.bookmarkedCourses,
            enrolledCourses: req.body.enrolledCourses
        });

        const result = await newUser.save();

        return res.status(201).json({
            message: 'Student created'
        });
    } catch (err) {
        console.log(err);
        if (req.file) {
            deleteFile.deleteFile(req.file.path);
        }
        return res.status(500).json({
            error: err
        });
    }
};
