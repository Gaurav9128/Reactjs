
const express = require("express");

const router = express.Router();

const {
  exportDayAttendance,
  exportCompleteWorkshop,
  exportBreakReport,
} = require("../controllers/exportController");

// Day-wise attendance
router.get("/attendance/day/:day", exportDayAttendance);

// Complete workshop attendance
router.get("/attendance/all", exportCompleteWorkshop);

// Break report
router.get("/break", exportBreakReport);

module.exports = router;

