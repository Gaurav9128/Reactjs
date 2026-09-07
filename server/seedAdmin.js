const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

async function seedAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("MongoDB Connected for seeding...");

    const existingAdmin = await Admin.findOne({ email: "admin@test.com" });

    if (existingAdmin) {
      console.log("Admin already exists:", existingAdmin.email);
      await mongoose.disconnect();
      return;
    }

    const hashedPassword = await bcrypt.hash("Tatiyabichu@184", 10);

    const admin = new Admin({
      fullName: "Test Admin",
      email: "admin@test.com",
      password: hashedPassword,
      role: "SUPER_ADMIN",
      status: "ACTIVE",
    });

    await admin.save();
    console.log("Admin user created successfully:", admin.email);

    await mongoose.disconnect();
  } catch (err) {
    console.error("Error seeding admin:", err.message);
    process.exit(1);
  }
}

seedAdmin();
