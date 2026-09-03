const mongoose = require("mongoose");

const workshopSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    startDate: {
      type: Date,
      required: true,
    },

    workingDays: {
      type: Number,
      default: 5,
    },

    startTime: {
      type: String,
      default: "09:00",
    },

    endTime: {
      type: String,
      default: "17:00",
    },

    // ⭐ NEW
    allowedBreakMinutes: {
      type: Number,
      default: 15,
    },

    // ⭐ NEW
    attendanceStartTime: {
      type: String,
      default: "08:30",
    },

    // ⭐ NEW
    attendanceEndTime: {
      type: String,
      default: "10:00",
    },

    // ⭐ NEW
    venue: {
      type: String,
      default: "",
    },

    // ⭐ NEW
    organizer: {
      type: String,
      default: "",
    },

    status: {
      type: String,
      enum: ["UPCOMING", "ONGOING", "COMPLETED"],
      default: "UPCOMING",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Workshop", workshopSchema);