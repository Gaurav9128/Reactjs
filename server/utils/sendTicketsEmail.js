const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const generateTicketPdf = require("./generateTicketPdf");

const sendTicketsEmail = async (student, tickets) => {
  if (!tickets || tickets.length === 0) {
    throw new Error("No tickets to send");
  }

  const pdfBuffer = await generateTicketPdf(tickets);

  const studentName = student.fullName || "Student";
  const subject = `Your Workshop Tickets - ${studentName}`;

  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
      <h2 style="color: #2563eb; text-align: center;">Your Workshop Tickets</h2>
      <p>Hi ${studentName},</p>
      <p>Please find attached your workshop tickets. You have <strong>${tickets.length}</strong> ticket(s) for the workshop.</p>
      <p>Present the QR code at the venue for entry on each day.</p>
      <p style="color: #dc2626; font-weight: bold;">Keep this email safe. Do not share your tickets.</p>
      <hr style="margin: 30px 0; border: none; border-top: 1px solid #e5e7eb;" />
      <p style="text-align: center; color: #6b7280; font-size: 12px;">Reactjs Workshop Team</p>
    </div>
  `;

  const mailOptions = {
    from: process.env.EMAIL_FROM || process.env.EMAIL_USER,
    to: student.email,
    subject,
    html,
    attachments: [
      {
        filename: `${studentName.replace(/\s+/g, "_")}_tickets.pdf`,
        content: pdfBuffer,
        contentType: "application/pdf",
      },
    ],
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendTicketsEmail;
