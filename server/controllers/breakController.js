const Ticket = require("../models/Ticket");
const BreakLog = require("../models/BreakLog");
const Workshop = require("../models/Workshop");

// Break Out
exports.breakOut = async (req, res) => {
  try {
    const { ticketNumber } = req.body;

    const ticket = await Ticket.findOne({ ticketNumber });
    const workshop = await Workshop.findById(ticket.workshopId);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    if (!ticket.attendance) {
      return res.status(400).json({
        success: false,
        message: "Attendance First Required",
      });
    }

    if (ticket.breakStatus === "BREAK_OUT") {
      return res.status(400).json({
        success: false,
        message: "Already On Break",
      });
    }

    ticket.breakStatus = "BREAK_OUT";
    ticket.breakOutTime = new Date();

    await ticket.save();

    await BreakLog.create({
      studentId: ticket.studentId,
      ticketId: ticket._id,
      workshopId: ticket.workshopId,
      dayNumber: ticket.dayNumber,
      breakOutTime: new Date(),
      status: "BREAK_OUT",
    });

    res.status(200).json({
      success: true,
      message: "Break Out Successful",
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};


// Return Student
exports.returnStudent = async (req, res) => {
  try {

    const { ticketNumber } = req.body;

    const ticket = await Ticket.findOne({ ticketNumber });

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: "Ticket Not Found",
      });
    }

    if (!workshop) {
    return res.status(404).json({
        success:false,
        message:"Workshop Not Found"
    });
}

    const breakLog = await BreakLog.findOne({
      ticketId: ticket._id,
      status: "BREAK_OUT",
    }).sort({ createdAt: -1 });

    if (!breakLog) {
      return res.status(404).json({
        success: false,
        message: "Break Log Not Found",
      });
    }

    const returnTime = new Date();

    const minutes = Math.floor(
      (returnTime - breakLog.breakOutTime) / (1000 * 60)
    );

    breakLog.returnTime = returnTime;
    breakLog.totalMinutes = minutes;

    ticket.returnTime = returnTime;

    if (minutes <= workshop.allowedBreakMinutes) {

      breakLog.status = "RETURNED";
      ticket.breakStatus = "RETURNED";

      await breakLog.save();
      await ticket.save();

      return res.status(200).json({
        success: true,
        message: "Returned Successfully",
        totalMinutes: minutes,
      });

    }

    breakLog.status = "TIMEOUT";
    ticket.breakStatus = "TIMEOUT";

    await breakLog.save();
    await ticket.save();

    // Cancel Remaining Tickets
    await Ticket.updateMany(
      {
        studentId: ticket.studentId,
        dayNumber: { $gt: ticket.dayNumber },
      },
      {
        $set: {
          isCancelled: true,
          status: "CANCELLED",
        },
      }
    );

    return res.status(200).json({
      success: true,
      message: "Late Return. Remaining Tickets Cancelled.",
      totalMinutes: minutes,
    });

  } catch (err) {

    res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};