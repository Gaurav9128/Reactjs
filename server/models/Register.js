const mongoose = require("mongoose");

const registerSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: true,
    },

    mobile: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    college: {
      type: String,
      required: true,
    },

    branch: {
      type: String,
      required: true,
    },

    year: {
      type: String,
      required: true,
    },

    password: {
      type: String,
      required: true,
    },
    status: {
  type: String,
  default: "Active",
},

role: {
  type: String,
  default: "student",
},

    laptop: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Register", registerSchema);