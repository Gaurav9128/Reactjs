const express = require("express");

const router = express.Router();

const {
  getRecentScans,
} = require("../controllers/recentScanController");

router.get("/", getRecentScans);

module.exports = router;