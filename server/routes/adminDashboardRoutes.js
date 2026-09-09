const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentAttendance,
  getDayWiseAttendance,
} = require("../controllers/adminDashboardController");

router.get("/stats", getDashboardStats);

router.get("/recent-attendance", getRecentAttendance);

router.get("/day-wise", getDayWiseAttendance);

module.exports = router;