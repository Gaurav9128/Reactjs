const Attendance = require("../models/Attendance");
const BreakLog = require("../models/BreakLog");

exports.getRecentScans = async (req, res) => {
  try {

    const attendance = await Attendance.find()
      .populate(
        "studentId",
        "fullName college"
      )
      .sort({ attendanceTime: -1 })
      .limit(10);

    const breaks = await BreakLog.find()
      .populate(
        "studentId",
        "fullName college"
      )
      .sort({ createdAt: -1 })
      .limit(10);

    let scans = [];

    attendance.forEach((item) => {
      scans.push({
        student: item.studentId,
        action: "ENTRY",
        time: item.attendanceTime,
      });
    });

    breaks.forEach((item) => {
      scans.push({
        student: item.studentId,
        action: item.status,
        time:
          item.status === "BREAK_OUT"
            ? item.breakOutTime
            : item.returnTime,
      });
    });

    scans.sort(
      (a, b) => new Date(b.time) - new Date(a.time)
    );

    res.json({
      success: true,
      scans: scans.slice(0, 15),
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};