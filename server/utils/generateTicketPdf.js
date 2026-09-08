const PDFDocument = require("pdfkit");

const formatDate = (date) => {
  if (!date) return "N/A";
  const d = new Date(date);
  return d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
};

const DESIGN_COLORS = {
  BOARDING_PASS: "#2563eb",
  EVENT_PASS: "#059669",
  TECH_CARD: "#7c3aed",
  CONFERENCE_BADGE: "#d97706",
  VIP_PASS: "#dc2626",
};

const generateTicketPdf = async (tickets) => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });
  const chunks = [];

  doc.on("data", (chunk) => chunks.push(chunk));
  doc.on("end", () => {});

  for (const ticket of tickets) {
    const student = ticket.studentId;
    const color = DESIGN_COLORS[ticket.designType] || "#2563eb";

    doc.addPage();

    doc.rect(0, 0, doc.page.width, doc.page.height).fill("#f8fafc");

    doc.roundedRect(40, 40, doc.page.width - 80, doc.page.height - 80, 12, {
      fill: "#ffffff",
      stroke: color,
      lineWidth: 3,
    });

    doc.roundedRect(40, 40, doc.page.width - 80, 60, 12, {
      fill: color,
    });

    doc.fill("#ffffff");
    doc.fontSize(24).font("Helvetica-Bold").text("WORKSHOP TICKET", {
      align: "center",
      y: 65,
    });

    doc.fill("#1f2937");
    doc.fontSize(10).font("Helvetica").fill("#6b7280");

    let yPos = 130;
    const qrSize = 160;
    const qrX = doc.page.width - 80 - qrSize - 20;
    const textX = 60;
    const textWidth = qrX - textX - 20;

    doc.rect(qrX - 5, yPos - 5, qrSize + 10, qrSize + 10, 5).fill("#f3f4f6");

    const qrInput = ticket.qrCode || ticket.ticketNumber;
    doc.image(qrInput, qrX, yPos, { width: qrSize, height: qrSize });

    const drawField = (label, value) => {
      doc.font("Helvetica-Bold").fontSize(10).fill(color).text(label, textX, yPos, { width: textWidth });
      doc.font("Helvetica").fontSize(12).fill("#1f2937").text(value || "N/A", textX, yPos + 16, { width: textWidth });
      yPos += 50;
    };

    drawField("STUDENT NAME", student?.fullName);
    drawField("EMAIL", student?.email);
    drawField("TICKET NUMBER", ticket.ticketNumber);
    drawField("DAY NUMBER", `Day ${ticket.dayNumber}`);
    drawField("WORKSHOP DATE", formatDate(ticket.workshopDate));
    drawField("SEAT NUMBER", ticket.seatNumber);
    drawField("STATUS", ticket.status);
    drawField("DESIGN TYPE", ticket.designType?.replace(/_/g, " "));

    yPos = doc.page.height - 100;

    doc.fontSize(8).fill("#9ca3af").text(
      "This ticket is non-transferable. Present this QR code at the venue for entry.",
      doc.page.width / 2,
      yPos,
      { align: "center", width: doc.page.width - 120 }
    );

    doc.fontSize(8).fill("#9ca3af").text(
      `Generated on ${new Date().toLocaleDateString("en-IN")} • ${ticket.ticketNumber}`,
      doc.page.width / 2,
      yPos + 16,
      { align: "center", width: doc.page.width - 120 }
    );
  }

  doc.end();

  return new Promise((resolve, reject) => {
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);
  });
};

module.exports = generateTicketPdf;
