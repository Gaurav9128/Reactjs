const express = require("express");
const router = express.Router();

const {
  getStudentReport,
  getAttendanceReport,
  getBreakReport,
  getTicketReport,
} = require("../controllers/reportController");

router.get("/students", getStudentReport);

router.get("/attendance", getAttendanceReport);

router.get("/break", getBreakReport);

router.get("/tickets", getTicketReport);

module.exports = router;