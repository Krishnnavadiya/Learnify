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


