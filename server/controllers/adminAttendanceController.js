const Attendance = require("../models/Attendance");

exports.getAttendance = async (req, res) => {
  try {
    const { day, search } = req.query;

    let filter = {};

    if (day) {
      filter.dayNumber = Number(day);
    }

    let attendance = await Attendance.find(filter)
      .populate(
        "studentId",
        "fullName email mobile college branch"
      )
      .sort({ attendanceTime: -1 });

    if (search) {
      const keyword = search.toLowerCase();

      attendance = attendance.filter((item) => {
        if (!item.studentId) return false;

        return (
          item.studentId.fullName.toLowerCase().includes(keyword) ||
          item.studentId.email.toLowerCase().includes(keyword)
        );
      });
    }

    res.json({
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