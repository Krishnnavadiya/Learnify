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

