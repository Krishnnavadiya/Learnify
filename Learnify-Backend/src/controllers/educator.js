const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const Educator = require('../models/educator');
const Student = require("../models/student");
const Token = require("../models/token");
const sendEmail = require("../../utils/sendEmail");
const deleteFile = require("../../utils/deleteFile");

exports.userSignup = async (req, res, next) => {
    try {
        let user = await Educator.findOne({email: req.body.email}).exec();

        if (user) {
            if (req.file)
                deleteFile.deleteFile(req.file.path);
            return res.status(409).json({
                message: 'Mail is already in use - Educator'
            });
        }

        user = await Educator.findOne({username: req.body.username}).exec();

        if (user) {
            if (req.file)
                deleteFile.deleteFile(req.file.path);
            return res.status(409).json({
                message: 'Username is already in use - Educator'
            });
        }

        user = await Educator.findOne({phone: req.body.phone}).exec();

        if (user) {
            if (req.file)
                deleteFile.deleteFile(req.file.path);
            return res.status(409).json({
                message: 'Phone number is already in use - Educator'
            });
        }

        const hash = await bcrypt.hash(req.body.password, 10);

        let profilePic = null;
        if (req.file) {
            profilePic = req.file.path;
        }

        const newUser = new Educator({
            fname: req.body.fname,
            lname: req.body.lname,
            gender: req.body.gender,
            dob: req.body.dob,
            location: req.body.location,
            username: req.body.username,
            password: hash,
            phone: req.body.phone,
            email: req.body.email,
            upiID: req.body.upiID,
            bio: req.body.bio,
            profilePic: profilePic,
            courseCreated: req.body.courseCreated,
        });

        const result = await newUser.save();

        return res.status(201).json({
            message: 'Educator created'
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
        const user = await Educator.findOne({email: req.body.email}).exec();

        if (!user) {
            return res.status(404).json({
                message: 'User does not exist - Educator'
            });
        }

        const result = await bcrypt.compare(req.body.password, user.password);

        if (result) {
            const token = jwt.sign(
                {
                    email: user.email,
                    userId: user._id,
                    userType: 'educator'
                },
                process.env.JWT_KEY,
                {
                    expiresIn: process.env.JWT_EXPIRES_IN
                }
            );
            return res.status(200).json({
                message: 'Logged In Successfully - Educator',
                token: token
            });
        } else {
            return res.status(404).json({
                message: 'Wrong Password - Educator'
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
        const user = await Educator.findOne({_id: req.userData.userId}).exec();
        if (!user) {
            return res.status(404).json({
                message: 'User not found - Educator'
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

        await Educator.updateOne({_id: req.userData.userId}, req.body).exec();
        return res.status(200).json({
            message: 'Educator updated'
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
        const profilePic = await Educator.findOne({email: req.userData.email}).select('profilePic').exec();
        const result = await Educator.deleteOne({email: req.userData.email}).exec();

        if (result.deletedCount === 0) {
            return res.status(404).json({
                message: 'Educator not found'
            });
        }

        if (profilePic.profilePic) {
            deleteFile.deleteFile(profilePic.profilePic);
        }
        return res.status(200).json({
            message: 'Educator deleted'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};
