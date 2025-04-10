const express = require("express");
const router = express.Router();

const StudentController = require("../controllers/student");


router.post("/signup", profileUpload, StudentController.userSignup);
router.post("/login", StudentController.userLogin);


module.exports = router;
