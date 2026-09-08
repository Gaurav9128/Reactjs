const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");

const {
  getMyTickets,
  scanAttendance,
  getTicketReport,
  getRecentScans,
  sendMyTicketsEmail,
  adminSendTicketsEmail,
} = require("../controllers/ticketController");

router.get("/my", getMyTickets);
router.post("/attendance", scanAttendance);
router.get("/tickets", getTicketReport);
router.get("/recent-scans", getRecentScans);
router.post("/email/send", authMiddleware, sendMyTicketsEmail);

module.exports = router;