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

    // Check Email Already Exists
    const existingUser = await Register.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Encrypt Password
    const hashedPassword = await bcrypt.hash(password, 10);
    const generateTickets = require("../utils/generateTickets");

    const user = new Register({
      fullName,
      mobile,
      email,
      college,
      branch,
      year,
      password: hashedPassword,
      laptop,
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