const mongoose = require("mongoose");

const breakLogSchema = new mongoose.Schema(
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

    breakOutTime: {
      type: Date,
      default: Date.now,
    },

    returnTime: {
      type: Date,
      default: null,
    },

    totalMinutes: {
      type: Number,
      default: 0,
    },

    status: {
      type: String,
      enum: [
        "BREAK_OUT",
        "RETURNED",
        "TIMEOUT",
      ],
      default: "BREAK_OUT",
    },

    scannedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Admin",
      default: null,
    },

    remarks: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("BreakLog", breakLogSchema);