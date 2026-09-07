const express = require("express");
const rateLimit = require("express-rate-limit");

const router = express.Router();

const { loginAdmin, registerAdmin } = require("../controllers/adminController");

const adminLoginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 5,
  message: {
    success: false,
    message: "Too many login attempts, please try again after 15 minutes",
  },
});

router.use("/login", adminLoginLimiter);

router.post("/login", loginAdmin);

router.post("/register", registerAdmin);

module.exports = router;