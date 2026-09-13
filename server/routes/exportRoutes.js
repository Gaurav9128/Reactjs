
const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const {
  exportDayAttendance,
  exportCompleteWorkshop,
  exportBreakReport,
  exportTickets,
  exportStudents,
} = require("../controllers/exportController");

router.use(authMiddleware, requireAdmin);

// Day-wise attendance
router.get("/attendance/day/:day", exportDayAttendance);

// Complete workshop attendance
router.get("/attendance/all", exportCompleteWorkshop);

// Break report
router.get("/break", exportBreakReport);

// Tickets
router.get("/tickets", exportTickets);

// Students
router.get("/students", exportStudents);

module.exports = router;

