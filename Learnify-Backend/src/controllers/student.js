const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require("crypto");


const Student = require('../models/student');
const Educator = require("../models/educator");
const Token = require("../models/token");
const sendEmail = require("../../utils/sendEmail");
const deleteFile = require("../../utils/deleteFile");
const path = require("path");
const fs = require("fs");

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

exports.userLogin = async (req, res, next) => {
    try {
        const user = await Student.findOne({email: req.body.email}).exec();

        if (!user) {
            return res.status(404).json({
                message: 'User does not exist - Student'
            });
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                    userType: 'student'
                },
                process.env.JWT_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
            );
            return res.status(200).json({
                message: 'Logged In Successfully - Student',
                token: token
            });
        } else {
            return res.status(404).json({
                message: 'Wrong Password - Student'
            });
        }
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};

exports.userEdit = async (req, res, next) => {
    try {
        const user = await Student.findOne({_id: req.userData.userId}).exec();
        if (!user) {
            return res.status(404).json({
                message: 'User not found - Student'
            });
        }

        if (req.file) {
            if (user.profilePic != null && req.body.username != user.username) {
                deleteFile.deleteFile(user.profilePic);
            }
        }
        else if (req.body.username != user.username){
            if (user.profilePic != null)
            {
                const oldPath = user.profilePic;
                const lastIndex = oldPath.lastIndexOf('\\');
                const pathWithoutFileName = oldPath.slice(0, lastIndex);
                const newPath = pathWithoutFileName + '\\' + req.body.username + path.extname(oldPath);
                await fs.rename(oldPath, newPath, function (err) {
                    if (err) throw err;
                });
                user.profilePic = newPath;
            }
        }
        req.body.profilePic = req.file ? req.file.path : user.profilePic;

        await Student.updateOne({_id: req.userData.userId}, req.body).exec();

        return res.status(200).json({
            message: 'Student updated'
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

exports.userDelete = async (req, res, next) => {
    try {
        const profilePic = await Student.findOne({email: req.userData.email}).select('profilePic').exec();
        const result = await Student.deleteOne({email: req.userData.email}).exec();

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Student not found'
            });
        }
        if (profilePic.profilePic) {
            deleteFile.deleteFile(profilePic.profilePic);
        }
        return res.status(200).json({
            message: 'Student deleted'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};