import TicketHeader from "./TicketHeader";
import QRCode from "react-qr-code";

const VipPass = ({ ticket }) => {
  return (
    <div className="p-10 bg-black">

      <div className="rounded-3xl overflow-hidden shadow-2xl border-2 border-yellow-500 bg-gradient-to-br from-black via-gray-900 to-black text-white">

        <TicketHeader
          title="VIP Pass"
          subtitle="React Rajasthan Workshop 2026"
          ticket={ticket}
          bgColor="bg-gradient-to-r from-yellow-500 to-amber-600"
        />

        <div className="grid md:grid-cols-3 gap-8 p-8">

          <div className="md:col-span-2">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-gray-400">VIP Guest</p>
                <h3 className="text-3xl font-bold text-yellow-400">
                  {ticket.studentId?.fullName}
                </h3>
              </div>

              <div>
                <p className="text-gray-400">College</p>
                <h3>{ticket.studentId?.college}</h3>
              </div>

              <div>
                <p className="text-gray-400">Ticket Number</p>
                <h3>{ticket.ticketNumber}</h3>
              </div>

              <div>
                <p className="text-gray-400">Seat</p>
                <h3>{ticket.seatNumber || "VIP"}</h3>
              </div>

              <div>
                <p className="text-gray-400">Workshop Date</p>
                <h3>
                  {new Date(ticket.workshopDate).toLocaleDateString()}
                </h3>
              </div>

              <div>
                <p className="text-gray-400">Status</p>

                <span className="bg-yellow-500 text-black px-4 py-1 rounded-full font-bold">
                  {ticket.status}
                </span>
              </div>

            </div>

          </div>

          <div className="flex justify-center items-center border-l border-yellow-500">

            <QRCode
              value={ticket.ticketNumber}
              size={170}
              bgColor="#111111"
              fgColor="#FFD700"
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default VipPass;