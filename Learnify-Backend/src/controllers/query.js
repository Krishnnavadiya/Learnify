const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

const Course = require('../models/course');
const Educator = require('../models/educator');
const Student = require('../models/student');
const Assignment = require("../models/assignment");

