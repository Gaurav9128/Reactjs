const Ticket = require("../models/Ticket");
const Workshop = require("../models/Workshop");
const QRCode = require("qrcode");

const designs = [
  "BOARDING_PASS",
  "EVENT_PASS",
  "TECH_CARD",
  "CONFERENCE_BADGE",
  "VIP_PASS",
];

const generateTickets = async (student) => {

  const workshop = await Workshop.findOne({ isActive: true });

  if (!workshop) {
    throw new Error("No Active Workshop Found");
  }

  const alreadyCreated = await Ticket.find({
    studentId: student._id,
    workshopId: workshop._id,
  });

  if (alreadyCreated.length > 0) {
    return;
  }

  for (let i = 0; i < workshop.workingDays; i++) {

    const date = new Date(workshop.startDate);
    date.setDate(date.getDate() + i);

    const ticketNumber = `RW-${Date.now()}-${student._id.toString().slice(-5)}-${i+1}`;

    const qr = await QRCode.toDataURL(JSON.stringify({
      ticketNumber,
      studentId: student._id,
      workshopId: workshop._id,
      day: i + 1,
    }));

    await Ticket.create({

      studentId: student._id,

      workshopId: workshop._id,

      dayNumber: i + 1,

      ticketNumber,

      workshopDate: date,

      qrCode: qr,

      designType: designs[i],

      seatNumber: `A-${100 + i + 1}`,

      status: i === 0 ? "ENABLED" : "UPCOMING"

    });

  }

};

module.exports = generateTickets;