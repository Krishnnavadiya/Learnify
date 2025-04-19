const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');

const Section = require('../models/section');
const Educator = require('../models/educator');
const Course = require('../models/course');
const {deleteFolder} = require("../../utils/deleteFile");
const path = require("path");


exports.createSection = async (req, res, next) => {
    try {
        const course = await Course.findById(req.params.courseId).exec();
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

        const section = new Section({
            title: req.body.title,
            posts: []
        });

        await section.save();
        course.courseSections.push(section._id);
        await course.save();

        return res.status(201).json({
            message: 'Section created',
            sectionId: section
        });
    } catch
        (err) {
        console.log(err);
        return res.status(500).json({
            error: err
        });
    }
};

