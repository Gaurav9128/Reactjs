const Ticket = require("../models/Ticket");
const jwt = require("jsonwebtoken");
const Attendance = require("../models/Attendance");
const Register = require("../models/Register");
const TicketRequest = require("../models/TicketRequest");
const sendTicketsEmail = require("../utils/sendTicketsEmail");

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

// ==========================================
// Send Tickets Email - Helper
// ==========================================

const sendTicketsEmailForStudent = async (studentId) => {
  const student = await Register.findById(studentId);

  if (!student) {
    throw new Error("Student not found");
  }

  const tickets = await Ticket.find({ studentId }).sort({ dayNumber: 1 }).populate("studentId");

  if (!tickets.length) {
    throw new Error("No tickets found for this student");
  }

  await sendTicketsEmail(student, tickets);
};

// ==========================================
// Student Self-Serve: Send My Tickets Email
// ==========================================

exports.sendMyTicketsEmail = async (req, res) => {
  try {

    await sendTicketsEmailForStudent(req.user.id);

    return res.status(200).json({
      success: true,
      message: "Tickets sent to your email successfully",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Admin: Send Tickets Email to All Students
// ==========================================

exports.adminBulkSendTicketsEmail = async (req, res) => {
  try {

    const students = await Register.find({});

    if (!students.length) {
      return res.status(200).json({
        success: true,
        message: "No students found",
        sent: 0,
        failed: 0,
        errors: [],
      });
    }

    let sent = 0;
    let failed = 0;
    const errors = [];

    for (const student of students) {
      try {

        const tickets = await Ticket.find({ studentId: student._id })
          .sort({ dayNumber: 1 })
          .populate("studentId");

        if (!tickets.length) {
          continue;
        }

        await sendTicketsEmail(student, tickets);
        sent++;

      } catch (err) {

        failed++;
        errors.push({
          studentId: student._id,
          email: student.email,
          error: err.message,
        });

      }
    }

    return res.status(200).json({
      success: true,
      message: `Bulk ticket email completed. Sent: ${sent}, Failed: ${failed}`,
      sent,
      failed,
      errors,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Admin: Resolve Break Timeout
// ==========================================

exports.resolveBreakTimeout = async (req, res) => {
  try {

    const { ticketNumber, action } = req.body;

    if (!ticketNumber || !action) {
      return res.status(400).json({
        success: false,
        message: "Ticket Number and Action are required",
      });
    }

    if (!["ALLOW", "CANCEL"].includes(action)) {
      return res.status(400).json({
        success: false,
        message: "Action must be ALLOW or CANCEL",
      });
    }

    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    if (ticket.breakStatus !== "TIMEOUT") {
      return res.status(400).json({
        success: false,
        message: "Ticket is not in timeout state",
      });
    }

    if (action === "ALLOW") {
      // Re-enable remaining future tickets
      await Ticket.updateMany(
        {
          studentId: ticket.studentId,
          dayNumber: { $gt: ticket.dayNumber },
          isCancelled: true,
        },
        {
          $set: {
            status: "UPCOMING",
            isCancelled: false,
          },
        }
      );

      return res.status(200).json({
        success: true,
        message: "Remaining tickets re-enabled",
      });
    }

    // CANCEL: keep remaining tickets cancelled (already done)
    return res.status(200).json({
      success: true,
      message: "Remaining tickets remain cancelled",
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Student: Request Re-enable Cancelled Ticket
// ==========================================

exports.requestReEnable = async (req, res) => {
  try {

    const { ticketId, reason } = req.body;

    if (!ticketId) {
      return res.status(400).json({
        success: false,
        message: "Ticket ID is required",
      });
    }

    const ticket = await Ticket.findById(ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    if (ticket.studentId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "Access Denied",
      });
    }

    if (!ticket.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Ticket is not cancelled",
      });
    }

    // Check for existing pending request
    const existing = await TicketRequest.findOne({
      ticketId,
      studentId: req.user.id,
      status: "PENDING",
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "You already have a pending request for this ticket",
      });
    }

    const request = await TicketRequest.create({
      ticketId,
      studentId: req.user.id,
      reason: reason || "",
    });

    return res.status(201).json({
      success: true,
      message: "Re-enable request submitted",
      request,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Admin: List All Ticket Re-enable Requests
// ==========================================

exports.getTicketRequests = async (req, res) => {
  try {

    const requests = await TicketRequest.find()
      .populate("ticketId")
      .populate("studentId", "fullName email college")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      requests,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Admin: Approve Re-enable Request
// ==========================================

exports.approveTicketRequest = async (req, res) => {
  try {

    const { requestId } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const request = await TicketRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request Not Found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    request.status = "APPROVED";
    request.approvedBy = req.user.id;
    request.approvedAt = new Date();

    await request.save();

    // Fetch the ticket to get its dayNumber and workshopDate
    const ticket = await Ticket.findById(request.ticketId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    // Determine the correct status based on the ticket's workshop date
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const ticketDate = new Date(ticket.workshopDate);
    ticketDate.setHours(0, 0, 0, 0);
    const isSameDay = ticketDate.getTime() === today.getTime();

    // Re-enable the cancelled ticket and all future tickets for this student
    // If the ticket is for today, set status to ENABLED (can be scanned)
    // If the ticket is for a future day, set status to UPCOMING (locked until that day)
    const newStatus = isSameDay ? "ENABLED" : "UPCOMING";

    await Ticket.updateMany(
      {
        studentId: request.studentId,
        dayNumber: { $gte: ticket.dayNumber },
        isCancelled: true,
      },
      {
        $set: {
          status: newStatus,
          isCancelled: false,
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Request approved and ticket re-enabled",
      request,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};

// ==========================================
// Admin: Reject Re-enable Request
// ==========================================

exports.rejectTicketRequest = async (req, res) => {
  try {

    const { requestId, adminNote } = req.body;

    if (!requestId) {
      return res.status(400).json({
        success: false,
        message: "Request ID is required",
      });
    }

    const request = await TicketRequest.findById(requestId);

    if (!request) {
      return res.status(404).json({
        success: false,
        message: "Request Not Found",
      });
    }

    if (request.status !== "PENDING") {
      return res.status(400).json({
        success: false,
        message: "Request already processed",
      });
    }

    request.status = "REJECTED";
    request.adminNote = adminNote || "";
    request.approvedBy = req.user.id;
    request.approvedAt = new Date();

    await request.save();

    return res.status(200).json({
      success: true,
      message: "Request rejected",
      request,
    });

  } catch (err) {

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};
