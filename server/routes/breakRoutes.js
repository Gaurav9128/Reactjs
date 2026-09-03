const express = require("express");
const router = express.Router();

const {
  breakOut,
  returnStudent,
} = require("../controllers/breakController");

router.post("/break-out", breakOut);

router.post("/return", returnStudent);

module.exports = router;