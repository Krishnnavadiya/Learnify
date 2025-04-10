const express = require("express");
const router = express.Router();

const StudentController = require("../controllers/student");

router.post("/signup", profileUpload, StudentController.userSignup);
router.post("/login", StudentController.userLogin);
router.post('/reset-password', StudentController.resetPassword);
router.post('/update-password', StudentController.updatePassword);
router.patch("/edit-profile", checkAuth, profileUpload, StudentController.userEdit);
router.delete("/:email", checkAuth, StudentController.userDelete);


module.exports = router;
