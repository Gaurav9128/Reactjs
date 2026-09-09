const Register = require("../models/Register");
const Attendance = require("../models/Attendance");
const Workshop = require("../models/Workshop");
const Ticket = require("../models/Ticket");

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

    const workshop = await Workshop.findOne({ isActive: true });

    const attendance = await Attendance.find(
      workshop ? { workshopId: workshop._id } : {}
    )
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

    const totalStudents = await Register.countDocuments({
      status: "Active",
      role: "student",
    });

    const workshop = await Workshop.findOne({ isActive: true });

    const totalAttendance = await Attendance.countDocuments({
      ...(workshop ? { workshopId: workshop._id } : {}),
      status: "PRESENT",
    });

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

// ======================================================
// Day-Wise Attendance Breakdown (Active Workshop)
// ======================================================

exports.getDayWiseAttendance = async (req, res) => {
  try {
    if (!isAdmin(req)) {
      return res.status(403).json({
        success: false,
        message: "Forbidden: Admin access required",
      });
    }

    const workshop = await Workshop.findOne({ isActive: true });

    const maxDay = workshop ? workshop.workingDays : 0;

    const days = [];

    for (let day = 1; day <= maxDay; day++) {
      const baseFilter = workshop
        ? { workshopId: workshop._id, dayNumber: day }
        : { dayNumber: day };

      const [present, absent, total] = await Promise.all([
        Attendance.countDocuments({
          ...baseFilter,
          status: "PRESENT",
        }),
        Attendance.countDocuments({
          ...baseFilter,
          status: "ABSENT",
        }),
        Ticket.countDocuments({
          ...(workshop
            ? { workshopId: workshop._id }
            : {}),
          dayNumber: day,
          isCancelled: false,
        }),
      ]);

      const rate = total > 0 ? Math.round((present / total) * 100) : 0;

      days.push({
        day,
        present,
        absent,
        total,
        rate,
      });
    }

    res.status(200).json({
      success: true,
      days,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
