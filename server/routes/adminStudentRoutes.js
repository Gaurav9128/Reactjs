const express = require("express");
const router = express.Router();

const {
  searchStudents,
  getStudentDetails,
   deleteStudent,
} = require("../controllers/adminStudentController");

router.get("/search", searchStudents);

router.get("/:studentId", getStudentDetails);

router.delete("/:studentId", deleteStudent);


module.exports = router;