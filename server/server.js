const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const helmet = require("helmet");
const adminRoutes = require("./routes/adminRoutes");
const adminStudentRoutes = require("./routes/adminStudentRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const { requireRole, requireAdmin } = require("./middleware/roleMiddleware");
const { adminBulkSendTicketsEmail, resolveBreakTimeout, getTicketRequests, approveTicketRequest, rejectTicketRequest } = require("./controllers/ticketController");
require("dotenv").config();

const app = express();

app.use(helmet());
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
app.use(
  "/api/admin/dashboard",
  authMiddleware,
  requireAdmin,
  require("./routes/adminDashboardRoutes")
);
app.use(
  "/api/admin/student",
  authMiddleware,
  requireAdmin,
  require("./routes/adminStudentRoutes")
);
app.use("/api/break", require("./routes/breakRoutes"));
app.use("/api/dashboard", require("./routes/dashboardRoutes"));
app.use("/api/report", require("./routes/reportRoutes"));
app.use("/api/export", require("./routes/exportRoutes"));
app.use(
  "/api/admin/students",
  authMiddleware,
  requireAdmin,
  require("./routes/adminStudentRoutes")
);
app.use(
  "/api/admin/attendance",
  authMiddleware,
  requireAdmin,
  require("./routes/adminAttendanceRoutes")
);
app.use("/api/recent-scans", require("./routes/recentScanRoutes"));

app.post(
  "/api/admin/tickets/email/send-all",
  authMiddleware,
  requireAdmin,
  adminBulkSendTicketsEmail
);

app.post(
  "/api/admin/tickets/return-timeout",
  authMiddleware,
  requireAdmin,
  resolveBreakTimeout
);

app.get(
  "/api/admin/ticket-requests",
  authMiddleware,
  requireAdmin,
  getTicketRequests
);

app.post(
  "/api/admin/tickets/approve-request",
  authMiddleware,
  requireAdmin,
  approveTicketRequest
);

app.post(
  "/api/admin/tickets/reject-request",
  authMiddleware,
  requireAdmin,
  rejectTicketRequest
);


const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Running on ${PORT}`);
  console.log("Admin Student Routes Loaded...");
});