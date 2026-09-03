const express = require("express");

const router = express.Router();

const {
  getStudentDashboard,
  getLiveStats,
} = require("../controllers/dashboardController");

// Student Dashboard
router.get("/student", getStudentDashboard);

// Admin Live Dashboard
router.get("/live-stats", getLiveStats);

module.exports = router;