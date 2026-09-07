const Admin = require("../models/Admin");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.registerAdmin = async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;

    const sanitizedEmail = String(email || "").trim();
    const sanitizedPassword = String(password || "").trim();
    const sanitizedFullName = String(fullName || "").trim();

    if (!sanitizedEmail || !sanitizedPassword || !sanitizedFullName) {
      return res.status(400).json({
        success: false,
        message: "Full name, email and password are required",
      });
    }

    const existingAdmin = await Admin.findOne({ email: sanitizedEmail });

    if (existingAdmin) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(sanitizedPassword, 10);

    const admin = new Admin({
      fullName: sanitizedFullName,
      email: sanitizedEmail,
      password: hashedPassword,
      role: role || "SUB_ADMIN",
      status: "ACTIVE",
    });

    await admin.save();

    res.status(201).json({
      success: true,
      message: "Admin registered successfully",
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.loginAdmin = async (req, res) => {
  try {
    const { email, password } = req.body;

    const admin = await Admin.findOne({ email });

    if (!admin) {
      return res.status(404).json({
        success: false,
        message: "Admin not found",
      });
    }

    const isMatch = await bcrypt.compare(password, admin.password);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Invalid Password",
      });
    }

    const token = jwt.sign(
      {
        id: admin._id,
        role: admin.role,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.status(200).json({
      success: true,
      token,
      role: admin.role,
      admin: {
        id: admin._id,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    });

  } catch (err) {
    console.log(err);

    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};