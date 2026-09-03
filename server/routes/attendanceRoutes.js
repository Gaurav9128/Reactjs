const express = require("express");

const router = express.Router();

const {
  scanAttendance,
  endDay,
} = require("../controllers/attendanceController");

router.post("/scan", scanAttendance);

router.post("/end-day", endDay);

module.exports = router;