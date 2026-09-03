import TicketHeader from "./TicketHeader";
import QRCode from "react-qr-code";

const EventPass = ({ ticket }) => {
  return (
    <div className="p-10 bg-gray-100">

      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">

        <TicketHeader
          title="Event Pass"
          subtitle="React Rajasthan Workshop 2026"
          ticket={ticket}
          bgColor="bg-gradient-to-r from-purple-700 to-pink-500"
        />

        <div className="grid md:grid-cols-3 gap-8 p-8">

          <div className="md:col-span-2">

            <div className="grid grid-cols-2 gap-6">

              <div>
                <p className="text-gray-500">Student</p>
                <h3 className="font-bold text-xl">
                  {ticket.studentId?.fullName}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">College</p>
                <h3>{ticket.studentId?.college}</h3>
              </div>

              <div>
                <p className="text-gray-500">Ticket No</p>
                <h3>{ticket.ticketNumber}</h3>
              </div>

              <div>
                <p className="text-gray-500">Seat</p>
                <h3>{ticket.seatNumber || "TBA"}</h3>
              </div>

              <div>
                <p className="text-gray-500">Workshop Date</p>
                <h3>
                  {new Date(ticket.workshopDate).toLocaleDateString()}
                </h3>
              </div>

              <div>
                <p className="text-gray-500">Status</p>

                <span className="bg-purple-600 text-white px-4 py-1 rounded-full">
                  {ticket.status}
                </span>
              </div>

            </div>

          </div>

          <div className="flex justify-center items-center border-l">

            <QRCode
              value={ticket.ticketNumber}
              size={170}
            />

          </div>

        </div>

      </div>

    </div>
  );
};

export default EventPass;