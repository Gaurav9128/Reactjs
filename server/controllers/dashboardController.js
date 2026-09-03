const jwt = require("jsonwebtoken");

const Register = require("../models/Register");
const Attendance = require("../models/Attendance");
const Ticket = require("../models/Ticket");
const BreakLog = require("../models/BreakLog");

// ======================================================
// Student Dashboard
// ======================================================

exports.getStudentDashboard = async (req, res) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Authorization Token Missing",
      });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET
    );

    const student = await Register.findById(decoded.id).select(
      "-password"
    );

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    const tickets = await Ticket.find({
      studentId: student._id,
    }).sort({ dayNumber: 1 });

    const attendanceCount = await Attendance.countDocuments({
      studentId: student._id,
      status: "PRESENT",
    });

    const currentTicket =
      tickets.find((t) => !t.isCancelled) || {};

    return res.status(200).json({
      success: true,

      student,

      dashboard: {
        totalTickets: tickets.length,

        attendance: attendanceCount,

        breakStatus:
          currentTicket.breakStatus || "INSIDE",

        currentDay:
          currentTicket.dayNumber || 1,
      },
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ======================================================
// Live Dashboard Stats (Admin)
// ======================================================

exports.getLiveStats = async (req, res) => {
  try {

    const present = await Attendance.countDocuments({
      status: "PRESENT",
    });

    const inside = await Ticket.countDocuments({
  attendance: true,
  breakStatus: {
    $in: ["INSIDE", "RETURNED"],
  },
});

    const onBreak = await Ticket.countDocuments({
      breakStatus: "BREAK_OUT",
    });

    const returned = await BreakLog.countDocuments({
      status: "RETURNED",
    });

    const timeout = await BreakLog.countDocuments({
      status: "TIMEOUT",
    });

    const cancelled = await Ticket.countDocuments({
      isCancelled: true,
    });

    return res.status(200).json({
      success: true,

      stats: {
        present,
        inside,
        onBreak,
        returned,
        timeout,
        cancelled,
      },
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};