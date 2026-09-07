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
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #2563eb; text-align: center;">Password Reset Request</h2>
      <p>You requested to reset your password. Use the following OTP to proceed:</p>
      <div style="background: #f3f4f6; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 8px;">
        ${otp}
      </div>
      <p style="color: #dc2626; font-weight: bold;">This OTP will expire in 10 minutes.</p>
      <p>If you did not request a password reset, please ignore this email.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <div style="background: #eff6ff; padding: 20px; border-radius: 8px; margin-top: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">🚀 Built by a Developer, for Developers</h3>
        <p style="margin: 10px 0;">This workshop platform is custom-built with modern web technologies. Need a similar project, website, or web app for your own event or business?</p>
        <p style="margin: 10px 0;"><strong>Let's connect and build something amazing together.</strong></p>
        <p style="color: #6b7280; font-size: 14px; margin: 10px 0;">React · Node.js · MongoDB · Express</p>
        <p style="text-align: center; margin-top: 15px;">
          <a href="mailto:${process.env.EMAIL_USER || 'your-email@example.com'}" style="background: #2563eb; color: white; padding: 10px 20px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get In Touch</a>
        </p>
      </div>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="text-align: center; color: #6b7280; font-size: 12px;">Reactjs Workshop Team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: email,
    subject: "Password Reset OTP",
    html,
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
