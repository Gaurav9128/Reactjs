import QRCode from "react-qr-code";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import TicketHeader from "./TicketHeader";

const BoardingPass = ({ ticket }) => {
  const ticketRef = useRef();

  const handlePrint = useReactToPrint({
    contentRef: ticketRef,
    documentTitle: ticket.ticketNumber,
  });

  const downloadPDF = async () => {
    const canvas = await html2canvas(ticketRef.current, {
      scale: 2,
    });

    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("landscape", "mm", "a4");

    pdf.addImage(imgData, "PNG", 10, 10, 277, 180);

    pdf.save(`${ticket.ticketNumber}.pdf`);
  };

  return (
    <div className="p-10 bg-gray-100">

      <div
        ref={ticketRef}
        className="bg-white rounded-3xl shadow-2xl overflow-hidden border"
      >

        {/* Reusable Header */}

        <TicketHeader
          title="Boarding Pass"
          subtitle="React Rajasthan Workshop 2026"
          ticket={ticket}
          bgColor="bg-gradient-to-r from-blue-700 to-cyan-500"
        />

        {/* Body */}

        <div className="grid md:grid-cols-3 gap-8 p-8">

          <div className="md:col-span-2">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-gray-500 text-sm">
                  Passenger
                </p>

                <h3 className="text-xl font-bold">
                  {ticket.studentId?.fullName}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  College
                </p>

                <h3 className="text-lg">
                  {ticket.studentId?.college}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Email
                </p>

                <h3>
                  {ticket.studentId?.email}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Seat Number
                </p>

                <h3 className="font-bold">
                  {ticket.seatNumber || "TBA"}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Venue
                </p>

                <h3>
                  {ticket.workshopId?.venue}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Organizer
                </p>

                <h3>
                  {ticket.workshopId?.organizer}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Reporting Time
                </p>

                <h3>
                  {ticket.workshopId?.attendanceStartTime}
                </h3>
              </div>

              <div>
                <p className="text-gray-500 text-sm">
                  Status
                </p>

                <span
                  className={`px-4 py-1 rounded-full text-white ${
                    ticket.status === "COMPLETED"
                      ? "bg-green-600"
                      : ticket.status === "UPCOMING"
                      ? "bg-yellow-500"
                      : "bg-blue-600"
                  }`}
                >
                  {ticket.status}
                </span>
              </div>

            </div>

          </div>

          {/* QR Code */}

          <div className="flex flex-col items-center justify-center border-l">

            <QRCode
              value={ticket.ticketNumber}
              size={170}
            />

            <p className="mt-4 font-bold">
              Scan at Entry
            </p>

          </div>

        </div>

      </div>

      {/* Action Buttons */}

      <div className="flex justify-center gap-5 mt-8">

        <button
          onClick={handlePrint}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-xl transition"
        >
          🖨 Print Ticket
        </button>

        <button
          onClick={downloadPDF}
          className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-xl transition"
        >
          📄 Download PDF
        </button>

      </div>

    </div>
  );
};

export default BoardingPass;