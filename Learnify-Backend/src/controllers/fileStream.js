const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

const Student = require('../models/student');
const Educator = require('../models/educator');
const Course = require('../models/course');
const Section = require('../models/section');
const Certificate = require('../models/certificate');

