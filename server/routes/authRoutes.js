const express = require("express");
const router = express.Router();

const Register = require("../models/Register");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { requestPasswordReset, resetPasswordWithOtp } = require("../controllers/authController");

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const sanitizedEmail = String(email || "").trim();
    const sanitizedPassword = String(password || "").trim();

    if (!sanitizedEmail || !sanitizedPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const user = await Register.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Email not registered",
      });
    }

    const isMatch = await bcrypt.compare(sanitizedPassword, user.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      message: "Login Successful",
      token,
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        college: user.college,
      },
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
});

router.post("/forgot-password", requestPasswordReset);

router.post("/reset-password", resetPasswordWithOtp);

module.exports = router;