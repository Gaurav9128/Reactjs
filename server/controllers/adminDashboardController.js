const Register = require("../models/Register");
const Attendance = require("../models/Attendance");
const Workshop = require("../models/Workshop");

const isAdmin = (req) =>
  req.user && ["SUPER_ADMIN", "SUB_ADMIN"].includes(req.user.role);

exports.getRecentAttendance = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const attendance = await Attendance.find()
      .populate(
        "studentId",
        "fullName email college"
      )
      .sort({ attendanceTime: -1 })
      .limit(10);

    res.status(200).json({
      success: true,
      attendance,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

exports.getDashboardStats = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const totalStudents = await Register.countDocuments();

    const totalAttendance = await Attendance.countDocuments({
      status: "PRESENT",
    });

    const workshop = await Workshop.findOne({ isActive: true });

    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalAttendance,
        workingDays: workshop ? workshop.workingDays : 0,
        workshopTitle: workshop ? workshop.title : "",
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
