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

