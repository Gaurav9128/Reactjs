const express = require("express");

const router = express.Router();

const {
  createWorkshop,
  getWorkshop,
  updateWorkshop,
} = require("../controllers/workshopController");

router.post("/create", createWorkshop);

router.get("/", getWorkshop);

router.put("/", updateWorkshop);

module.exports = router;