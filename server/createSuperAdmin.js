const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
require("dotenv").config();

const Admin = require("./models/Admin");

mongoose.connect(process.env.MONGO_URI);

async function createAdmin() {
  const hash = await bcrypt.hash("Admin@123", 10);

  const admin = new Admin({
    fullName: "Super Admin",
    email: "admin@gmail.com",
    password: hash,
    role: "SUPER_ADMIN",
  });

  await admin.save();

  console.log("Super Admin Created");

  process.exit();
}

createAdmin();