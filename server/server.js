const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const adminRoutes = require("./routes/adminRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

app.post("/test", (req, res) => {
  console.log(req.body);

  res.json({
    body: req.body,
  });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.log(err));

app.use("/api/register", require("./routes/registerRoutes"));
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api/admin", require("./routes/adminRoutes"));
app.use("/api/workshop", require("./routes/workshopRoutes"));
app.use("/api/tickets",require("./routes/ticketRoutes"));
app.use("/api/attendance", require("./routes/attendanceRoutes"));
app.use("/api/admin/dashboard", require("./routes/adminDashboardRoutes"));
app.use("/api/admin/student", require("./routes/adminStudentRoutes"));
app.use("/api/break", require("./routes/breakRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));
app.use("/api/admin/students", require("./routes/adminStudentRoutes"));
app.use("/api/admin/attendance", require("./routes/adminAttendanceRoutes"));
app.use("/api/recent-scans", require("./routes/recentScanRoutes"));


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
  console.log("Admin Student Routes Loaded...");
});