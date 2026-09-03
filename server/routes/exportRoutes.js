const express = require("express");
const router = express.Router();

const {
  exportDayAttendance,
  exportCompleteWorkshop,
} = require("../controllers/exportController");

router.get("/attendance/day/:day", exportDayAttendance);

router.get("/attendance/all", exportCompleteWorkshop);

module.exports = router;