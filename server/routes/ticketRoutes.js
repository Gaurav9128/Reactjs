const express = require("express");
const router = express.Router();

const {
  getMyTickets,
  scanAttendance,
  getTicketReport,
  getRecentScans,
} = require("../controllers/ticketController");

router.get("/my", getMyTickets);
router.post("/attendance", scanAttendance);
router.get("/tickets", getTicketReport);
router.get("/recent-scans", getRecentScans);

module.exports = router;