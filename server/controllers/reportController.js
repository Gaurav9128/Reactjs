const Register = require("../models/Register");
const Attendance = require("../models/Attendance");
const BreakLog = require("../models/BreakLog");
const Ticket = require("../models/Ticket");

// ======================================
// Student Report
// ======================================
exports.getStudentReport = async (req, res) => {
  try {
    const students = await Register.find().sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: students.length,
      students,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// Attendance Report
// ======================================
exports.getAttendanceReport = async (req, res) => {
  try {
    const {
      dayNumber,
      college,
      branch,
      status,
    } = req.query;

    let filter = {};

    if (dayNumber) {
      filter.dayNumber = Number(dayNumber);
    }

    if (status) {
      filter.status = status;
    }

    const attendance = await Attendance.find(filter)
      .populate({
        path: "studentId",
        select: "fullName email mobile college branch year",
      })
      .sort({ attendanceTime: -1 });

    let result = attendance;

    if (college) {
      result = result.filter(
        (item) =>
          item.studentId &&
          item.studentId.college &&
          item.studentId.college.toLowerCase() === college.toLowerCase()
      );
    }

    if (branch) {
      result = result.filter(
        (item) =>
          item.studentId &&
          item.studentId.branch &&
          item.studentId.branch.toLowerCase() === branch.toLowerCase()
      );
    }

    res.status(200).json({
      success: true,
      total: result.length,
      attendance: result,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// Break Report
// ======================================
exports.getBreakReport = async (req, res) => {
  try {
    const breaks = await BreakLog.find()
      .populate(
        "studentId",
        "fullName email college branch year"
      )
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      total: breaks.length,
      breaks,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ======================================
// Ticket Report
// ======================================
exports.getTicketReport = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate(
        "studentId",
        "fullName email college branch year"
      )
      .sort({
        dayNumber: 1,
      });

    res.status(200).json({
      success: true,
      total: tickets.length,
      tickets,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};