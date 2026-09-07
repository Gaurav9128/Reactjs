const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");

const Register = require("../models/Register");

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      mobile,
      email,
      college,
      branch,
      year,
      password,
      laptop,
    } = req.body;

    const sanitizedEmail = String(email || "").trim();
    const sanitizedPassword = String(password || "").trim();
    const sanitizedFullName = String(fullName || "").trim();

    if (!sanitizedEmail || !sanitizedPassword || !sanitizedFullName) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const existingUser = await Register.findOne({ email: sanitizedEmail });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);
    const generateTickets = require("../utils/generateTickets");

    const user = new Register({
      fullName: sanitizedFullName,
      mobile: String(mobile || "").trim(),
      email: sanitizedEmail,
      college: String(college || "").trim(),
      branch: String(branch || "").trim(),
      year: year ? Number(year) : undefined,
      password: hashedPassword,
      laptop: laptop ? String(laptop).trim() : undefined,
    });

    await user.save();
    await generateTickets(user);

    res.status(201).json({
      success: true,
      message: "Registration Successful",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

module.exports = router;