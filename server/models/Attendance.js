const mongoose = require("mongoose");

const attendanceSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
      required: true,
    },

    ticketId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ticket",
      required: true,
    },

    workshopId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Workshop",
      required: true,
    },

    dayNumber: {
      type: Number,
      required: true,
    },

    // ⭐ NEW
    workshopDate: {
      type: Date,
      required: true,
    },

    status: {
      type: String,
      enum: ["PRESENT", "ABSENT"],
      default: "PRESENT",
    },

    attendanceTime: {
      type: Date,
      default: Date.now,
    },

    scanBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Attendance", attendanceSchema);