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

exports.searchFilter = async (req, res, next) => {
    try {
        let filters = {
            visibility: "public"
        };

        if (req.query.title) {
            filters.courseTitle = {$regex: new RegExp(req.query.title, 'i')};
        }
        if (req.query.price) {
            filters.coursePrice = {$lte: req.query.price};
        }
        if (req.query.tag) {
            const tags = req.query.tag.split(',');
            filters.tags = {$in: tags};
        }
        if (req.query.level) {
            filters.courseLevel = req.query.level;
        }
        if (req.query.language) {
            filters.language = req.query.language;
        }
        // if (req.query.prerequisites) {
        //     const prerequisites = req.query.prerequisites.split(',');
        //     filters.prerequisites = { $in: prerequisites };
        // }
        if (req.query.rating) {
            filters.rating = {$gte: req.query.rating};
        }
        if (req.query.courseCode) {
            filters.courseCode = {$regex: new RegExp(req.query.courseCode, 'i')};
        }

        const courses = await Course.find(filters)
            .select('_id courseTitle courseDescription coursePrice courseLevel courseCode language rating createdBy')
            .populate('createdBy', 'fname lname')
            .exec();

        if (req.headers.authorization) {
            const token = req.headers.authorization.split(" ")[1];
            const decoded = jwt.verify(token, process.env.JWT_KEY);

            if (decoded.userType === "student") {
                const newCourses = await Course.aggregate([
                    {
                        $match: filters,
                    },
                    {
                        $addFields: {
                            isEnrolled: {$in: [decoded.userId, '$enrolledStudents']},
                        },
                    },
                    {
                        $lookup: {
                            from: 'educators',
                            localField: 'createdBy',
                            foreignField: '_id',
                            as: 'educator',
                        },
                    },
                    {
                        $unwind: '$educator',
                    },
                    {
                        $project: {
                            _id: 1,
                            courseTitle: 1,
                            courseDescription: 1,
                            coursePrice: 1,
                            courseLevel: 1,
                            courseCode: 1,
                            language: 1,
                            rating: 1,
                            enrolledStudents: 1,
                            createdBy: {
                                fname: '$educator.fname',
                                lname: '$educator.lname',
                            },
                            isEnrolled: 1,
                        },
                    },
                ]);

                return res.status(200).json({
                    courses: newCourses
                });
            }
        }

        return res.status(200).json({
            courses: courses
        });
    } catch (err) {
        console.error(err);
        return res.status(500).json({
            error: err.message
        });
    }
}


exports.getDashboard = async (req, res, next) => {
    try {
        if (req.userData.userType != "educator") {
            return res.status(401).json({
                message: 'This is not an educator account'
            });
        }

        const courses = await Course.find({createdBy: req.userData.userId}).exec();

        // total Earning
        let totalEarning = 0;
        let totalStudent = 0;
        let totalCourses = courses.length;
        for (let i = 0; i < courses.length; i++) {
            totalEarning += courses[i].coursePrice * courses[i].enrolledStudents.length;
            totalStudent += courses[i].enrolledStudents.length;
            console.log(totalEarning, courses[i].coursePrice, courses[i].enrolledStudents.length);
        }

        let rate = 0;
        for (let i = 0; i < courses.length; i++) {
            rate += courses[i].rating;
        }
        let avgRating = rate / courses.length;
        return res.status(200).json({
            totalEarning: totalEarning,
            totalStudent: totalStudent,
            totalCourses: totalCourses,
            avgRating: avgRating
        });

    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

exports.getProfile = async (req, res, next) => {
    try {
        if (req.userData.userType == "educator") {
            //     select fname, lname, gender, location, dob, username, phone, email, upiID, bio, profilePic
            const educator = await Educator.findById(req.userData.userId).select('fname lname gender location dob username phone email upiID bio profilePic').exec();
            if (!educator) {
                return res.status(404).json({
                    message: 'Educator not found'
                });
            }
            return res.status(200).json({
                educator: educator
            });
        } else if (req.userData.userType == "student") {
            const student = await Student.findById(req.userData.userId).select('fname lname gender dob username phone email bio profilePic interests').exec();
            if (!student) {
                return res.status(404).json({
                    message: 'Student not found'
                });
            }
            return res.status(200).json({
                student: student
            });
        }
        return res.status(404).json({
            message: 'User not found'
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};

exports.getCourses = async (req, res, next) => {
    try {
        const courses = await Course.find({visibility: "public"}).select('_id courseTitle courseDescription coursePrice courseLevel courseCode language prerequisites').exec();
        if (!courses) {
            return res.status(404).json({
                message: 'No courses found'
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
};

exports.getEnrolledCourse = async (req, res, next) => {
    try {
        const enrolledStudent = await Student.findById(req.userData.userId)
            .populate({
                path: 'enrolledCourses',
                select: '_id courseTitle courseDescription coursePrice courseLevel enrolledStudents courseCode language rating createdBy',
                populate: {
                    path: 'createdBy',
                    select: 'fname lname',
                },
            })
            .exec();

        const enrolledCourses = enrolledStudent.enrolledCourses;

        return res.status(200).json({
            courses: enrolledCourses,
        });
    } catch (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
}

