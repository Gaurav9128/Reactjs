const ExcelJS = require("exceljs");
const Attendance = require("../models/Attendance");
const Workshop = require("../models/Workshop");
const Register = require("../models/Register");

// ==============================
// DAY WISE ATTENDANCE EXPORT
// ==============================
exports.exportDayAttendance = async (req, res) => {
  try {
    const dayNumber = Number(req.params.day);

    const workshop = await Workshop.findOne({ isActive: true });

    const attendance = await Attendance.find({
      dayNumber,
    }).populate(
      "studentId",
      "fullName email mobile college branch year"
    );

    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet(`Day ${dayNumber}`);

    worksheet.mergeCells("A1:J1");
    worksheet.getCell("A1").value =
      `${workshop?.title || "Workshop"} - Day ${dayNumber} Attendance Report`;

    worksheet.getCell("A1").font = {
      size: 18,
      bold: true,
    };

    worksheet.addRow([]);

    worksheet.columns = [
      { header: "Sr No", key: "sr", width: 10 },
      { header: "Student Name", key: "name", width: 25 },
      { header: "Email", key: "email", width: 30 },
      { header: "Mobile", key: "mobile", width: 18 },
      { header: "College", key: "college", width: 30 },
      { header: "Branch", key: "branch", width: 18 },
      { header: "Year", key: "year", width: 10 },
      { header: "Status", key: "status", width: 15 },
      { header: "Attendance Time", key: "time", width: 30 },
    ];

    attendance.forEach((item, index) => {
      worksheet.addRow({
        sr: index + 1,
        name: item.studentId?.fullName,
        email: item.studentId?.email,
        mobile: item.studentId?.mobile,
        college: item.studentId?.college,
        branch: item.studentId?.branch,
        year: item.studentId?.year,
        status: item.status,
        time: item.attendanceTime,
      });
    });

    worksheet.addRow([]);
    worksheet.addRow({
      name: "Total Present",
      status: attendance.length,
    });

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Attendance_Day_${dayNumber}.xlsx`
    );

    await workbook.xlsx.write(res);
    res.end();

  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// COMPLETE WORKSHOP EXPORT
// ==============================
exports.exportCompleteWorkshop = async (req, res) => {
  try {

    const workshop = await Workshop.findOne({
      isActive: true,
    });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "No Active Workshop Found",
      });
    }

    const workbook = new ExcelJS.Workbook();

    // Summary Sheet
    const summary = workbook.addWorksheet("Summary");

    const totalStudents = await Register.countDocuments();

    summary.columns = [
      {
        header: "Title",
        key: "title",
        width: 30,
      },
      {
        header: "Value",
        key: "value",
        width: 30,
      },
      {
  header: "Workshop Date",
  key: "workshopDate",
  width: 20,
},
    ];

    summary.addRow({
      title: "Workshop",
      value: workshop.title,
    });

    summary.addRow({
      title: "Working Days",
      value: workshop.workingDays,
    });

    summary.addRow({
      title: "Start Date",
      value: workshop.startDate,
    });

    summary.addRow({
      title: "Total Registered Students",
      value: totalStudents,
    });

    // Day Wise Sheets
    for (let day = 1; day <= workshop.workingDays; day++) {

      const sheet = workbook.addWorksheet(`Day ${day}`);

      sheet.columns = [
        { header: "Sr No", key: "sr", width: 10 },
        { header: "Student Name", key: "name", width: 25 },
        { header: "Email", key: "email", width: 30 },
        { header: "Mobile", key: "mobile", width: 18 },
        { header: "College", key: "college", width: 25 },
        { header: "Branch", key: "branch", width: 18 },
        { header: "Status", key: "status", width: 15 },
        { header: "Attendance Time", key: "time", width: 30 },
      ];

      const attendance = await Attendance.find({
        dayNumber: day,
      }).populate(
        "studentId",
        "fullName email mobile college branch"
      );

      attendance.forEach((item, index) => {

        sheet.addRow({
          sr: index + 1,
          name: item.studentId?.fullName,
          email: item.studentId?.email,
          mobile: item.studentId?.mobile,
          college: item.studentId?.college,
          branch: item.studentId?.branch,
          workshopDate: item.workshopDate
    ? new Date(item.workshopDate).toLocaleDateString("en-IN")
    : "-",
          status: item.status,
          time: item.attendanceTime
    ? new Date(item.attendanceTime).toLocaleTimeString("en-IN")
    : "-",
        });

      });

      sheet.addRow([]);

      sheet.addRow({
        name: "Total Present",
        status: attendance.length,
      });
    }

    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Workshop_Attendance_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};