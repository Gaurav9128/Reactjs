const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  getRecentAttendance,
} = require("../controllers/adminDashboardController");

router.get("/stats", getDashboardStats);

router.get("/recent-attendance", getRecentAttendance);

module.exports = router;