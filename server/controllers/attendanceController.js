const Ticket = require("../models/Ticket");
const Attendance = require("../models/Attendance");
const BreakLog = require("../models/BreakLog");
const Workshop = require("../models/Workshop");

exports.scanAttendance = async (req, res) => {
  try {
    const { ticketNumber, type } = req.body;

    // ==========================================
    // VALIDATION
    // ==========================================

    if (!ticketNumber) {
      return res.status(400).json({
        success: false,
        message: "Ticket Number Required",
      });
    }

    if (!type) {
      return res.status(400).json({
        success: false,
        message: "Scan Type Required",
      });
    }

    const allowedTypes = ["ENTRY", "BREAK_OUT", "RETURN"];

    if (!allowedTypes.includes(type)) {
      return res.status(400).json({
        success: false,
        message: "Invalid Scan Type",
      });
    }

    // ==========================================
    // FIND TICKET
    // ==========================================

    const ticket = await Ticket.findOne({
      ticketNumber: ticketNumber.trim(),
    })
      .populate("studentId")
      .populate("workshopId");

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    // ==========================================
    // CANCELLED CHECK
    // ==========================================

    if (ticket.isCancelled) {
      return res.status(400).json({
        success: false,
        message: "Ticket Cancelled",
      });
    }

    // ==========================================
    // STATUS CHECK
    // ==========================================

    // Ticket must remain ENABLED during the whole
    // workshop day.
    //
    // IMPORTANT:
    // ENTRY / BREAK_OUT / RETURN should NEVER
    // change ticket.status to COMPLETED.
    //
    if (ticket.status !== "ENABLED") {
      return res.status(400).json({
        success: false,
        message: `This ticket is ${ticket.status}. Only ENABLED tickets can be scanned.`,
      });
    }

    // ==========================================
    // DATE CHECK
    // ==========================================

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const workshopDate = new Date(ticket.workshopDate);
    workshopDate.setHours(0, 0, 0, 0);

    if (today.getTime() !== workshopDate.getTime()) {
      return res.status(400).json({
        success: false,
        message: "This ticket is not valid for today's workshop.",
      });
    }

    // ==========================================
    // ENTRY
    // ==========================================

    if (type === "ENTRY") {
      // Already attended
      if (ticket.attendance) {
        return res.status(400).json({
          success: false,
          message: "Attendance Already Marked",
        });
      }

      const attendanceTime = new Date();

      // Create attendance
      await Attendance.create({
        studentId: ticket.studentId._id,
        ticketId: ticket._id,
        workshopId: ticket.workshopId._id,
        workshopDate: ticket.workshopDate,
        dayNumber: ticket.dayNumber,
        status: "PRESENT",
        attendanceTime,
      });

      // Mark attendance on ticket
      ticket.attendance = true;
      ticket.attendanceTime = attendanceTime;

      // ==========================================
      // IMPORTANT
      // DO NOT DO:
      //
      // ticket.status = "COMPLETED";
      //
      // ==========================================

      ticket.status = "ENABLED";

      await ticket.save();

      return res.json({
        success: true,
        action: "ENTRY",
        message: "Attendance Marked Successfully",
        ticket,
      });
    }

    // ==========================================
    // BREAK OUT
    // ==========================================

    if (type === "BREAK_OUT") {
      // Entry must be marked first
      if (!ticket.attendance) {
        return res.status(400).json({
          success: false,
          message: "Entry not marked yet.",
        });
      }

      // Student already on break
      if (ticket.breakStatus === "BREAK_OUT") {
        return res.status(400).json({
          success: false,
          message: "Student already on break.",
        });
      }

      const breakOutTime = new Date();

      ticket.breakStatus = "BREAK_OUT";
      ticket.breakOutTime = breakOutTime;

      // IMPORTANT:
      // Ticket remains ENABLED
      ticket.status = "ENABLED";

      await ticket.save();

      await BreakLog.create({
        studentId: ticket.studentId._id,
        ticketId: ticket._id,
        workshopId: ticket.workshopId._id,
        dayNumber: ticket.dayNumber,
        breakOutTime,
        status: "BREAK_OUT",
      });

      return res.json({
        success: true,
        action: "BREAK OUT",
        message: "Student Sent For Break",
        ticket,
      });
    }

    // ==========================================
    // RETURN FROM BREAK
    // ==========================================

    if (type === "RETURN") {
      // Student must actually be on break
      if (ticket.breakStatus !== "BREAK_OUT") {
        return res.status(400).json({
          success: false,
          message: "Student is not on break.",
        });
      }

      const workshop = await Workshop.findById(ticket.workshopId);

      if (!workshop) {
        return res.status(404).json({
          success: false,
          message: "Workshop Not Found",
        });
      }

      // Find latest active break
      const breakLog = await BreakLog.findOne({
        ticketId: ticket._id,
        status: "BREAK_OUT",
      }).sort({ createdAt: -1 });

      if (!breakLog) {
        return res.status(400).json({
          success: false,
          message: "Break record not found.",
        });
      }

      const returnTime = new Date();

      const minutes = Math.floor(
        (returnTime - breakLog.breakOutTime) / (1000 * 60)
      );

      breakLog.returnTime = returnTime;
      breakLog.totalMinutes = minutes;

      ticket.returnTime = returnTime;

      // ==========================================
      // RETURN WITHIN ALLOWED BREAK TIME
      // ==========================================

      if (minutes <= workshop.allowedBreakMinutes) {
        breakLog.status = "RETURNED";

        ticket.breakStatus = "RETURNED";

        // IMPORTANT:
        // Ticket remains ENABLED
        ticket.status = "ENABLED";

        await breakLog.save();
        await ticket.save();

        return res.json({
          success: true,
          action: "RETURN",
          message: "Student Returned Successfully",
          ticket,
        });
      }

      // ==========================================
      // LATE RETURN
      // ==========================================

      breakLog.status = "TIMEOUT";

      ticket.breakStatus = "TIMEOUT";

      // Ticket itself is still enabled for today's
      // workshop, but future tickets are cancelled.
      ticket.status = "ENABLED";

      await breakLog.save();
      await ticket.save();

      // Cancel remaining future tickets
      await Ticket.updateMany(
        {
          studentId: ticket.studentId._id,
          dayNumber: { $gt: ticket.dayNumber },
          isCancelled: false,
        },
        {
          $set: {
            status: "CANCELLED",
            isCancelled: true,
          },
        }
      );

      return res.json({
        success: true,
        action: "TIMEOUT",
        message: "Late Return. Remaining Tickets Cancelled.",
        ticket,
      });
    }

    // ==========================================
    // INVALID STATE
    // ==========================================

    return res.status(400).json({
      success: false,
      message: "Invalid Ticket State",
    });

  } catch (err) {
    console.log("SCAN ATTENDANCE ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};


// =====================================================
// END WORKSHOP DAY
// =====================================================

exports.endDay = async (req, res) => {
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

    // ==========================================
    // TODAY DATE RANGE
    // ==========================================

    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // ==========================================
    // TODAY'S ACTIVE TICKETS
    // ==========================================
    //
    // IMPORTANT:
    // Earlier you were searching:
    //
    // status: ["PRESENT", "RETURNED"]
    //
    // But ticket.status is actually ENABLED.
    //
    // Attendance status is PRESENT.
    //
    // So we must search ENABLED tickets.
    //
    const tickets = await Ticket.find({
      workshopDate: {
        $gte: start,
        $lte: end,
      },
      isCancelled: false,
      status: "ENABLED",
    });

    let completed = 0;
    let enabled = 0;

    // ==========================================
    // COMPLETE TODAY'S TICKETS
    // ==========================================

    for (const ticket of tickets) {
      ticket.status = "COMPLETED";

      await ticket.save();

      completed++;

      // ==========================================
      // ENABLE NEXT DAY
      // ==========================================

      const nextTicket = await Ticket.findOne({
        studentId: ticket.studentId,
        dayNumber: ticket.dayNumber + 1,
        status: "UPCOMING",
        isCancelled: false,
      });

      if (nextTicket) {
        nextTicket.status = "ENABLED";

        await nextTicket.save();

        enabled++;
      }
    }

    return res.json({
      success: true,
      message: "Day Completed Successfully.",
      completedTickets: completed,
      enabledTickets: enabled,
    });

  } catch (err) {
    console.log("END DAY ERROR:", err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};