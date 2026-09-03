const Ticket = require("../models/Ticket");
const Attendance = require("../models/Attendance");
const BreakLog = require("../models/BreakLog");
const Workshop = require("../models/Workshop");

exports.scanAttendance = async (req, res) => {

try{

const { ticketNumber, type } = req.body;

const ticket = await Ticket.findOne({
ticketNumber
})
.populate("studentId")
.populate("workshopId");

if (!ticket) {
  return res.status(404).json({
    success: false,
    message: "Ticket Not Found",
  });
}

if (!type) {
  return res.status(400).json({
    success: false,
    message: "Scan Type Required",
  });
}

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

if (ticket.status !== "ENABLED") {
  return res.status(400).json({
    success: false,
    message: `This ticket is ${ticket.status}. Only ENABLED tickets can be scanned.`,
  });
}

if (ticket.isCancelled) {
  return res.status(400).json({
    success: false,
    message: "Ticket Cancelled",
  });
}


/* =======================
   FIRST ENTRY
======================= */

/* =======================
   ENTRY
======================= */

if (type === "ENTRY") {

    if (ticket.attendance) {

        return res.status(400).json({
            success: false,
            message: "Attendance Already Marked"
        });

    }

    await Attendance.create({

        studentId: ticket.studentId._id,
        ticketId: ticket._id,
        workshopId: ticket.workshopId._id,
        workshopDate: ticket.workshopDate,
        dayNumber: ticket.dayNumber,
        status: "PRESENT",
        attendanceTime: new Date()

    });

    ticket.attendance = true;
ticket.status = "COMPLETED";
ticket.attendanceTime = new Date();

await ticket.save();

await Ticket.findOneAndUpdate(
  {
    studentId: ticket.studentId._id,
    dayNumber: ticket.dayNumber + 1,
    status: "UPCOMING",
  },
  {
    $set: {
      status: "ENABLED",
    },
  }
);

    return res.json({

        success: true,
        action: "ENTRY",
        message: "Attendance Marked Successfully",
        ticket

    });

}

/* =======================
   BREAK OUT
======================= */

if (type === "BREAK_OUT") {

    if (!ticket.attendance) {

        return res.status(400).json({

            success: false,
            message: "Entry not marked yet."

        });

    }

    if (ticket.breakStatus === "BREAK_OUT") {

        return res.status(400).json({

            success: false,
            message: "Student already on break."

        });

    }

    ticket.breakStatus = "BREAK_OUT";
    ticket.breakOutTime = new Date();

    await ticket.save();

    await BreakLog.create({

        studentId: ticket.studentId._id,
        ticketId: ticket._id,
        workshopId: ticket.workshopId._id,
        dayNumber: ticket.dayNumber,
        breakOutTime: new Date(),
        status: "BREAK_OUT"

    });

    return res.json({

        success: true,
        action: "BREAK OUT",
        message: "Student Sent For Break",
        ticket

    });

}

/* =======================
   RETURN
======================= */

if (type === "RETURN") {

    if (ticket.breakStatus !== "BREAK_OUT") {

        return res.status(400).json({

            success: false,
            message: "Student is not on break."

        });

    }

    const workshop = await Workshop.findById(ticket.workshopId);

    const breakLog = await BreakLog.findOne({

        ticketId: ticket._id,
        status: "BREAK_OUT"

    }).sort({ createdAt: -1 });

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

        return res.json({

            success: true,
            action: "RETURN",
            message: "Student Returned Successfully",
            ticket

        });

    }

    breakLog.status = "TIMEOUT";

    ticket.breakStatus = "TIMEOUT";

    await breakLog.save();
    await ticket.save();

    await Ticket.updateMany(

        {
            studentId: ticket.studentId._id,
            dayNumber: { $gt: ticket.dayNumber }
        },

        {
            $set: {
                status: "CANCELLED",
                isCancelled: true
            }
        }

    );

    return res.json({

        success: true,
        action: "TIMEOUT",
        message: "Late Return. Remaining Tickets Cancelled.",
        ticket

    });

}

return res.status(400).json({

success:false,
message:"Invalid Ticket State"

});

}catch(err){

console.log(err);

return res.status(500).json({

success:false,
message:err.message

});

}

};

exports.endDay = async (req, res) => {
  try {

    const workshop = await Workshop.findOne({ isActive: true });

    if (!workshop) {
      return res.status(404).json({
        success: false,
        message: "No Active Workshop Found",
      });
    }

    // Today's Date Range
    const start = new Date();
    start.setHours(0, 0, 0, 0);

    const end = new Date();
    end.setHours(23, 59, 59, 999);

    // Today's Valid Tickets
    const tickets = await Ticket.find({
      workshopDate: {
        $gte: start,
        $lte: end,
      },
      isCancelled: false,
      status: {
        $in: [
          "PRESENT",
          "RETURNED",
        ],
      },
    });

    let completed = 0;
    let enabled = 0;

    for (const ticket of tickets) {

      // Complete today's ticket
      ticket.status = "COMPLETED";
      await ticket.save();

      completed++;

      // Enable next day's ticket
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
      message: `Day Completed Successfully.`,
      completedTickets: completed,
      enabledTickets: enabled,
    });

  } catch (err) {

    console.log(err);

    return res.status(500).json({
      success: false,
      message: err.message,
    });

  }
};