import TicketHeader from "./TicketHeader";
import QRCode from "react-qr-code";

const TechCard = ({ ticket }) => {
  return (
    <div className="p-10 bg-slate-900">

      <div className="bg-gray-950 text-white rounded-3xl shadow-2xl overflow-hidden border border-cyan-500">

        <TicketHeader
          title="Tech Card"
          subtitle="React Rajasthan Workshop 2026"
          ticket={ticket}
          bgColor="bg-gradient-to-r from-gray-900 to-cyan-700"
        />

        <div className="grid md:grid-cols-3 gap-8 p-8">

          <div className="md:col-span-2">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-gray-400">Student</p>
                <h3 className="text-2xl font-bold text-cyan-400">
                  {ticket.studentId?.fullName}
                </h3>
              </div>

              <div>
                <p className="text-gray-400">College</p>
                <h3>{ticket.studentId?.college}</h3>
              </div>

              <div>
                <p className="text-gray-400">Ticket</p>
                <h3>{ticket.ticketNumber}</h3>
              </div>

              <div>
                <p className="text-gray-400">Seat</p>
                <h3>{ticket.seatNumber || "TBA"}</h3>
              </div>

              <div>
                <p className="text-gray-400">Workshop Date</p>
                <h3>
                  {new Date(ticket.workshopDate).toLocaleDateString()}
                </h3>
              </div>

              <div>
                <p className="text-gray-400">Status</p>

                <span className="bg-cyan-500 text-black px-4 py-1 rounded-full font-bold">
                  {ticket.status}
                </span>
              </div>

            </div>

          </div>

          <div className="flex justify-center items-center border-l border-cyan-500">

            <QRCode
              value={ticket.ticketNumber}
              size={170}
              bgColor="#111827"
              fgColor="#06b6d4"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default TechCard;