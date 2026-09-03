const mongoose = require("mongoose");

const workshopDaySchema = new mongoose.Schema(
  {
    day: {
      type: Number,
      required: true,
      unique: true,
    },

    date: {
      type: Date,
      required: true,
    },

    startTime: {
      type: String,
      default: "09:00",
    },

    endTime: {
      type: String,
      default: "17:00",
    },

    status: {
      type: String,
      default: "Upcoming",
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("WorkshopDay", workshopDaySchema);