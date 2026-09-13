const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const {
  scanAttendance,
  endDay,
  getMyAttendanceHistory,
} = require("../controllers/attendanceController");

router.post("/scan", scanAttendance);

router.post("/end-day", authMiddleware, requireAdmin, endDay);

router.get("/history", authMiddleware, getMyAttendanceHistory);

module.exports = router;