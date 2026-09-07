const Register = require("../models/Register");
const PasswordResetOtp = require("../models/PasswordResetOtp");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateOtp = () => crypto.randomInt(100000, 999999).toString();

const sendOtpEmail = async (email, otp) => {
  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html: `<p>Your OTP for password reset is <strong>${otp}</strong>. It will expire in 10 minutes.</p>`,
  };

  await transporter.sendMail(mailOptions);
};

exports.requestPasswordReset = async (req, res) => {
  try {
    const { email } = req.body;

    const sanitizedEmail = String(email || "").trim();

    if (!sanitizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const user = await Register.findOne({ email: sanitizedEmail });

    if (!user) {
      return res.status(200).json({
        success: true,
        message: "If an account exists, an OTP has been sent",
      });
    }

    await PasswordResetOtp.deleteMany({ email: sanitizedEmail });

    const otp = generateOtp();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

    await PasswordResetOtp.create({
      email: sanitizedEmail,
      otp,
      expiresAt,
    });

    await sendOtpEmail(sanitizedEmail, otp);

    res.status(200).json({
      success: true,
      message: "If an account exists, an OTP has been sent",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.resetPasswordWithOtp = async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const sanitizedEmail = String(email || "").trim();
    const sanitizedOtp = String(otp || "").trim();
    const sanitizedPassword = String(newPassword || "").trim();

    if (!sanitizedEmail || !sanitizedOtp || !sanitizedPassword) {
      return res.status(400).json({
        success: false,
        message: "Email, OTP and new password are required",
      });
    }

    const otpRecord = await PasswordResetOtp.findOne({ email: sanitizedEmail, used: false }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return res.status(400).json({
        success: false,
        message: "Invalid or expired OTP",
      });
    }

    if (otpRecord.attempts >= 3) {
      await PasswordResetOtp.deleteMany({ email: sanitizedEmail });
      return res.status(400).json({
        success: false,
        message: "Too many attempts, please request a new OTP",
      });
    }

    if (otpRecord.expiresAt < new Date()) {
      await PasswordResetOtp.deleteMany({ email: sanitizedEmail });
      return res.status(400).json({
        success: false,
        message: "OTP has expired",
      });
    }

    if (otpRecord.otp !== sanitizedOtp) {
      await PasswordResetOtp.updateOne({ _id: otpRecord._id }, { $inc: { attempts: 1 } });
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    await Register.findOneAndUpdate({ email: sanitizedEmail }, { password: hashedPassword });
    await PasswordResetOtp.deleteMany({ email: sanitizedEmail });

    res.status(200).json({
      success: true,
      message: "Password reset successful",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};
