// server/scripts/end-workshop-day-2026-09-09.js
// One-off: close workshop day 2 (workshopDate 2026-09-09). Run ONCE.
//   node scripts/end-workshop-day-2026-09-09.js            # dry-run (no writes)
//   DRY_RUN=0 node scripts/end-workshop-day-2026-09-09.js # commit writes
//
// Replicates server/controllers/attendanceController.js endDay, scoped to a
// fixed date. Does NOT change project source; only writes Ticket/Attendance.
require("dotenv").config();
const mongoose = require("mongoose");

const Workshop = require("../models/Workshop");
const Ticket = require("../models/Ticket");
const Attendance = require("../models/Attendance");

const DRY_RUN = process.env.DRY_RUN !== "0"; // default dry
// local-midnight on 2026-09-09 (server runs in IST per env)
const start = new Date(2026, 8, 9); // 2026-09-09 00:00:00 local
const end = new Date(start);
end.setHours(23, 59, 59, 999);
const LABEL = start.toISOString().slice(0, 10);

(async () => {
  let exitCode = 0;
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected");

    const workshop = await Workshop.findOne({ isActive: true });
    if (!workshop) {
      console.error("No Active Workshop Found");
      return;
    }

    const tickets = await Ticket.find({
      workshopDate: { $gte: start, $lte: end },
      isCancelled: false,
      status: "ENABLED",
    }).sort({ studentId: 1, dayNumber: 1 });

    let completed = 0,
      absent = 0,
      enabled = 0;

    for (const ticket of tickets) {
      if (!ticket.attendance) {
        // Absent: record ABSENT, cancel today + all future
        if (!DRY_RUN) {
          await Attendance.create({
            studentId: ticket.studentId,
            ticketId: ticket._id,
            workshopId: ticket.workshopId,
            workshopDate: ticket.workshopDate,
            dayNumber: ticket.dayNumber,
            status: "ABSENT",
            attendanceTime: new Date(),
            scanBy: null,
          });
          ticket.status = "CANCELLED";
          ticket.isCancelled = true;
          await ticket.save();
          await Ticket.updateMany(
            {
              studentId: ticket.studentId,
              dayNumber: { $gt: ticket.dayNumber },
              isCancelled: false,
            },
            { $set: { status: "CANCELLED", isCancelled: true } }
          );
        }
        absent++;
        continue;
      }

      // Present: mark COMPLETED, enable next day
      if (!DRY_RUN) {
        ticket.status = "COMPLETED";
        await ticket.save();
      }
      completed++;

      const next = await Ticket.findOne({
        studentId: ticket.studentId,
        dayNumber: ticket.dayNumber + 1,
        status: "UPCOMING",
        isCancelled: false,
      });
      if (next) {
        if (!DRY_RUN) {
          next.status = "ENABLED";
          await next.save();
        }
        enabled++;
      }
    }

    console.log(
      JSON.stringify(
        {
          mode: DRY_RUN ? "DRY-RUN (no writes)" : "COMMIT",
          workshop: workshop.title,
          target: LABEL,
          processed: tickets.length,
          present_completed: completed,
          absent_cancelled: absent,
          next_day_enabled: enabled,
        },
        null,
        2
      )
    );
  } catch (err) {
    console.error("ERROR:", err);
    exitCode = 1;
  } finally {
    await mongoose.disconnect();
    process.exit(exitCode);
  }
})();
