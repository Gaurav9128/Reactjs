const express = require("express");
const router = express.Router();

const {
  getAttendance,
} = require("../controllers/adminAttendanceController");

router.get("/", getAttendance);

module.exports = router;