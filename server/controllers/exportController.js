const ExcelJS = require("exceljs");
const Attendance = require("../models/Attendance");
const Workshop = require("../models/Workshop");
const Register = require("../models/Register");


// ==============================
// BREAK REPORT EXPORT
// ==============================
exports.exportBreakReport = async (req, res) => {
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

    const worksheet = workbook.addWorksheet("Break Report");

    // Title
    worksheet.mergeCells("A1:J1");

    worksheet.getCell("A1").value =
      `${workshop.title || "Workshop"} - Student Break Report`;

    worksheet.getCell("A1").font = {
      size: 18,
      bold: true,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    worksheet.addRow([]);

    // Columns
    worksheet.columns = [
      {
        header: "Sr No",
        key: "sr",
        width: 10,
      },
      {
        header: "Student Name",
        key: "name",
        width: 25,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Mobile",
        key: "mobile",
        width: 18,
      },
      {
        header: "College",
        key: "college",
        width: 30,
      },
      {
        header: "Branch",
        key: "branch",
        width: 18,
      },
      {
        header: "Day",
        key: "day",
        width: 10,
      },
      {
        header: "Ticket Number",
        key: "ticketNumber",
        width: 22,
      },
      {
        header: "Break Out Time",
        key: "breakOutTime",
        width: 25,
      },
      {
        header: "Return Time",
        key: "returnTime",
        width: 25,
      },
      {
        header: "Break Status",
        key: "breakStatus",
        width: 18,
      },
    ];

    /*
      IMPORTANT:

      This assumes your break information is stored
      in the Ticket collection because your system
      already uses:

      breakStatus
      breakOutTime
      returnTime
      studentId
      dayNumber
      ticketNumber
    */

    const Ticket = require("../models/Ticket");

    const tickets = await Ticket.find({
      $or: [
        {
          breakOutTime: {
            $exists: true,
            $ne: null,
          },
        },
        {
          returnTime: {
            $exists: true,
            $ne: null,
          },
        },
      ],
    })
      .populate(
        "studentId",
        "fullName email mobile college branch"
      )
      .sort({
        dayNumber: 1,
        breakOutTime: 1,
      });

    tickets.forEach((item, index) => {
      worksheet.addRow({
        sr: index + 1,

        name: item.studentId?.fullName || "-",

        email: item.studentId?.email || "-",

        mobile: item.studentId?.mobile || "-",

        college: item.studentId?.college || "-",

        branch: item.studentId?.branch || "-",

        day: item.dayNumber || "-",

        ticketNumber: item.ticketNumber || "-",

        breakOutTime: item.breakOutTime
          ? new Date(item.breakOutTime).toLocaleString("en-IN")
          : "-",

        returnTime: item.returnTime
          ? new Date(item.returnTime).toLocaleString("en-IN")
          : "-",

        breakStatus: item.breakStatus || "-",
      });
    });

    // Total break records
    worksheet.addRow([]);

    worksheet.addRow({
      name: "Total Break Records",
      status: tickets.length,
    });

    // Header formatting
    worksheet.getRow(3).font = {
      bold: true,
    };

    worksheet.getRow(3).alignment = {
      horizontal: "center",
    };

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Workshop_Break_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
    console.error("Break Export Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// TICKET REPORT EXPORT
// ==============================
exports.exportTickets = async (req, res) => {
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

    const Ticket = require("../models/Ticket");

    const tickets = await Ticket.find({})
      .populate(
        "studentId",
        "fullName email mobile college branch year"
      )
      .sort({
        dayNumber: 1,
        ticketNumber: 1,
      });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Ticket Report");

    // Title
    worksheet.mergeCells("A1:K1");

    worksheet.getCell("A1").value =
      `${workshop.title || "Workshop"} - Ticket Report`;

    worksheet.getCell("A1").font = {
      size: 18,
      bold: true,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    worksheet.addRow([]);

    // Columns
    worksheet.columns = [
      {
        header: "Sr No",
        key: "sr",
        width: 10,
      },
      {
        header: "Ticket Number",
        key: "ticketNumber",
        width: 25,
      },
      {
        header: "Student Name",
        key: "name",
        width: 25,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Mobile",
        key: "mobile",
        width: 18,
      },
      {
        header: "College",
        key: "college",
        width: 30,
      },
      {
        header: "Branch",
        key: "branch",
        width: 18,
      },
      {
        header: "Year",
        key: "year",
        width: 10,
      },
      {
        header: "Day",
        key: "day",
        width: 10,
      },
      {
        header: "Ticket Status",
        key: "status",
        width: 18,
      },
      {
        header: "Attendance",
        key: "attendance",
        width: 15,
      },
      {
        header: "Seat Number",
        key: "seatNumber",
        width: 15,
      },
    ];

    // Add ticket data
    tickets.forEach((ticket, index) => {
      worksheet.addRow({
        sr: index + 1,

        ticketNumber:
          ticket.ticketNumber || "-",

        name:
          ticket.studentId?.fullName || "-",

        email:
          ticket.studentId?.email || "-",

        mobile:
          ticket.studentId?.mobile || "-",

        college:
          ticket.studentId?.college || "-",

        branch:
          ticket.studentId?.branch || "-",

        year:
          ticket.studentId?.year || "-",

        day:
          ticket.dayNumber || "-",

        status:
          ticket.status || "-",

        attendance:
          ticket.attendance === true
            ? "Present"
            : "Not Present",

        seatNumber:
          ticket.seatNumber || "-",
      });
    });

    // Total
    worksheet.addRow([]);

    worksheet.addRow({
      ticketNumber: "Total Tickets",
      name: tickets.length,
    });

    // Header formatting
    worksheet.getRow(3).font = {
      bold: true,
    };

    worksheet.getRow(3).alignment = {
      horizontal: "center",
    };

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Workshop_Ticket_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
    console.error("Ticket Export Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// ==============================
// STUDENTS REPORT EXPORT
// ==============================
exports.exportStudents = async (req, res) => {
  try {
    const workshop = await Workshop.findOne({
      isActive: true,
    });

    const students = await Register.find({})
      .sort({
        createdAt: 1,
      });

    const workbook = new ExcelJS.Workbook();

    const worksheet = workbook.addWorksheet("Students Report");

    // Title
    worksheet.mergeCells("A1:I1");

    worksheet.getCell("A1").value =
      `${workshop?.title || "Workshop"} - Registered Students Report`;

    worksheet.getCell("A1").font = {
      size: 18,
      bold: true,
    };

    worksheet.getCell("A1").alignment = {
      horizontal: "center",
    };

    worksheet.addRow([]);

    // Columns
    worksheet.columns = [
      {
        header: "Sr No",
        key: "sr",
        width: 10,
      },
      {
        header: "Student Name",
        key: "name",
        width: 25,
      },
      {
        header: "Email",
        key: "email",
        width: 30,
      },
      {
        header: "Mobile",
        key: "mobile",
        width: 18,
      },
      {
        header: "College",
        key: "college",
        width: 30,
      },
      {
        header: "Branch",
        key: "branch",
        width: 20,
      },
      {
        header: "Year",
        key: "year",
        width: 12,
      },
      {
        header: "Registration Date",
        key: "createdAt",
        width: 22,
      },
      {
        header: "Status",
        key: "status",
        width: 15,
      },
    ];

    // Student data
    students.forEach((student, index) => {
      worksheet.addRow({
        sr: index + 1,

        name: student.fullName || "-",

        email: student.email || "-",

        mobile: student.mobile || "-",

        college: student.college || "-",

        branch: student.branch || "-",

        year: student.year || "-",

        createdAt: student.createdAt
          ? new Date(student.createdAt).toLocaleString("en-IN")
          : "-",

        status: student.status || "Registered",
      });
    });

    // Total students
    worksheet.addRow([]);

    worksheet.addRow({
      name: "Total Registered Students",
      email: students.length,
    });

    // Header formatting
    worksheet.getRow(3).font = {
      bold: true,
    };

    worksheet.getRow(3).alignment = {
      horizontal: "center",
    };

    // Response headers
    res.setHeader(
      "Content-Type",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    );

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=Registered_Students_Report.xlsx"
    );

    await workbook.xlsx.write(res);

    res.end();

  } catch (err) {
    console.error("Student Export Error:", err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

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