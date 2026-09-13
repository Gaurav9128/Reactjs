const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");
const { requireAdmin } = require("../middleware/roleMiddleware");

const {
  createWorkshop,
  getWorkshop,
  updateWorkshop,
} = require("../controllers/workshopController");

router.use(authMiddleware, requireAdmin);

router.post("/create", createWorkshop);

router.get("/", getWorkshop);

router.put("/", updateWorkshop);

module.exports = router;