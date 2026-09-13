const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const {
  getStudentReport,
  getAttendanceReport,
  getBreakReport,
  getTicketReport,
} = require("../controllers/reportController");

router.use(authMiddleware, requireAdmin);

router.get("/students", getStudentReport);

router.get("/attendance", getAttendanceReport);

router.get("/break", getBreakReport);

router.get("/tickets", getTicketReport);

module.exports = router;