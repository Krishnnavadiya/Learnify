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

