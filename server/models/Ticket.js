const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema(
  {
    studentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Register",
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

    ticketNumber: {
      type: String,
      unique: true,
      required: true,
    },

    workshopDate: {
      type: Date,
      required: true,
    },

    qrCode: {
      type: String,
      default: "",
    },

    designType: {
      type: String,
      enum: [
        "BOARDING_PASS",
        "EVENT_PASS",
        "TECH_CARD",
        "CONFERENCE_BADGE",
        "VIP_PASS",
      ],
      required: true,
    },

    status: {
      type: String,
      enum: [
        "UPCOMING",
        "ENABLED",
        "PRESENT",
        "ABSENT",
        "COMPLETED",
        "CANCELLED",
      ],
      default: "UPCOMING",
    },

    attendance: {
      type: Boolean,
      default: false,
    },

    attendanceTime: {
      type: Date,
      default: null,
    },

    breakStatus: {
      type: String,
      enum: [
        "INSIDE",
        "BREAK_OUT",
        "RETURNED",
        "TIMEOUT",
      ],
      default: "INSIDE",
    },

    breakOutTime: {
      type: Date,
      default: null,
    },

    returnTime: {
      type: Date,
      default: null,
    },

    seatNumber: {
      type: String,
      default: "",
    },

    isCancelled: {
      type: Boolean,
      default: false,
    },

    remarks: {
      type: String,
      default: "",
    }
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Ticket", ticketSchema);