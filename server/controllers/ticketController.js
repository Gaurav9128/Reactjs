const Ticket = require("../models/Ticket");
const jwt = require("jsonwebtoken");
const Attendance = require("../models/Attendance");

// ==========================================
// Get Recent Attendance Scans
// ==========================================

exports.getRecentScans = async (req, res) => {
  try {

    const attendance = await Attendance.find()
      .populate(
        "studentId",
        "fullName college email"
      )
      .sort({
        attendanceTime: -1,
      });

    // Remove orphan attendance
    const validAttendance = attendance.filter(
      (item) => item.studentId !== null
    );

    return res.status(200).json({
      success: true,
      attendance: validAttendance.slice(0, 10),
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Ticket Report
// ==========================================

exports.getTicketReport = async (req, res) => {

  try {

    const tickets = await Ticket.find()
      .populate(
        "studentId",
        "fullName college"
      )
      .sort({
        dayNumber: 1,
      });

    res.json({
      success: true,
      tickets,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ==========================================
// Get Logged-in Student Tickets
// ==========================================

exports.getMyTickets = async (req, res) => {

  try {

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization Header Missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const tickets = await Ticket.find({
      studentId: decoded.id,
    }).sort({
      dayNumber: 1,
    });

    return res.status(200).json({
      success: true,
      count: tickets.length,
      tickets,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }

};

// ==========================================
// Scan Attendance
// ==========================================

exports.scanAttendance = async (req, res) => {

  try {

    const { ticketNumber } = req.body;

    if (!ticketNumber) {

      return res.status(400).json({
        success: false,
        message: "Ticket Number Required",
      });

    }

    const ticket = await Ticket.findOne({
      ticketNumber,
    });

    if (!ticket) {

      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });

    }

    if (ticket.isCancelled) {

      return res.status(400).json({
        success: false,
        message: "Ticket Cancelled",
      });

    }

    if (ticket.attendance) {

      return res.status(400).json({
        success: false,
        message: "Attendance Already Marked",
      });

    }

    ticket.attendance = true;
    ticket.attendanceTime = new Date();
    ticket.status = "COMPLETED";

    await ticket.save();

    await Attendance.create({

      studentId: ticket.studentId,
      ticketId: ticket._id,
      workshopId: ticket.workshopId,
      dayNumber: ticket.dayNumber,
      status: "PRESENT",
      attendanceTime: new Date(),

    });

    return res.status(200).json({

      success: true,
      message: "Attendance Marked Successfully",
      ticket,

    });

  } catch (err) {

    return res.status(500).json({

      success: false,
      message: err.message,

    });

  }

};