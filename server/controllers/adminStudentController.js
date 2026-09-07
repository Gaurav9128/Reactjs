const Register = require("../models/Register");
const Ticket = require("../models/Ticket");
const Attendance = require("../models/Attendance");
const BreakLog = require("../models/BreakLog");

const isAdmin = (req) =>
  req.user && ["SUPER_ADMIN", "SUB_ADMIN"].includes(req.user.role);

const escapeRegExp = (string) =>
  string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

// ==========================================
// Search Students
// ==========================================

exports.searchStudents = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const { query } = req.query;

    let filter = {};

    if (query) {
      const escaped = escapeRegExp(query);
      filter = {
        $or: [
          { fullName: { $regex: escaped, $options: "i" } },
          { email: { $regex: escaped, $options: "i" } },
          { mobile: { $regex: escaped, $options: "i" } },
          { college: { $regex: escaped, $options: "i" } },
          { branch: { $regex: escaped, $options: "i" } },
        ],
      };
    }

    const students = await Register.find(filter).select("-password");

    return res.status(200).json({
      success: true,
      total: students.length,
      students,
    });
  } catch (err) {
    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==========================================
// Student Details
// ==========================================

exports.getStudentDetails = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const { studentId } = req.params;

    const student = await Register.findById(studentId).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    const tickets = await Ticket.find({
      studentId,
    }).sort({
      dayNumber: 1,
    });

    const attendance = await Attendance.find({
      studentId,
    }).sort({
      createdAt: 1,
    });

    const breakHistory = await BreakLog.find({
      studentId,
    }).sort({
      createdAt: -1,
    });

    return res.status(200).json({
      success: true,
      student,
      tickets,
      attendance,
      breakHistory,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Delete Student + All Related Data
// ==========================================

exports.deleteStudent = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const { studentId } = req.params;

    const student = await Register.findById(studentId);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student Not Found",
      });
    }

    // Delete Attendance
    await Attendance.deleteMany({
      studentId,
    });

    // Delete Break History
    await BreakLog.deleteMany({
      studentId,
    });

    // Delete Tickets
    await Ticket.deleteMany({
      studentId,
    });

    // Delete Student
    await Register.findByIdAndDelete(studentId);

    return res.status(200).json({
      success: true,
      message: "Student Deleted Successfully",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
