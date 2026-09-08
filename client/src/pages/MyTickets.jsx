import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import TicketViewer from "../components/studentTickets/TicketViewer.jsx";

const MyTickets = () => {
  const [tickets, setTickets] = useState([]);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/tickets/my`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTickets(res.data.tickets);

    } catch (err) {
      console.log(err);
    }
  };

  const handleSendEmail = async () => {
    try {
      setSendingEmail(true);

      const token = localStorage.getItem("token");
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/tickets/email/send`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Tickets Sent",
        text: res.data.message,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed to Send",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setSendingEmail(false);
    }
  };

  const getStatusColor = (status) => {

    switch (status) {

      case "ENABLED":
        return "border-green-600 bg-green-50";

      case "UPCOMING":
        return "border-gray-300 bg-gray-100 opacity-70";

      case "COMPLETED":
        return "border-blue-600 bg-blue-50";

      case "PRESENT":
        return "border-green-600 bg-green-50";

      case "CANCELLED":
        return "border-red-600 bg-red-50";

      default:
        return "border-gray-300 bg-white";

    }

  };

  const getBadge = (status) => {

    switch (status) {

      case "ENABLED":
        return (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
            🟢 Active Today
          </span>
        );

      case "UPCOMING":
        return (
          <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm">
            🔒 Locked
          </span>
        );

      case "COMPLETED":
        return (
          <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
            ✅ Completed
          </span>
        );

      case "PRESENT":
        return (
          <span className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
            ✅ Present
          </span>
        );

      case "CANCELLED":
        return (
          <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm">
            ❌ Cancelled
          </span>
        );

      default:
        return null;

    }

  };

  return (
    <div className="min-h-screen bg-gray-100 p-10">

      <h1 className="text-4xl font-bold mb-8">
        🎟 My Tickets
      </h1>

      <div className="flex justify-end mb-6">
        <button
          onClick={handleSendEmail}
          disabled={sendingEmail}
          className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-6 py-3 rounded-xl transition flex items-center gap-2"
        >
          {sendingEmail ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              Sending...
            </>
          ) : (
            "📧 Send Tickets to Email"
          )}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

        {tickets.map((ticket) => (

          <div
            key={ticket._id}
            className={`rounded-2xl shadow-lg p-6 border-4 transition-all ${getStatusColor(ticket.status)}`}
          >

            <div className="flex justify-between items-center mb-4">

              <h2 className="text-2xl font-bold">
                Day {ticket.dayNumber}
              </h2>

              {getBadge(ticket.status)}

            </div>

            <p className="mt-3">
              <strong>Ticket :</strong>
              <br />
              {ticket.ticketNumber}
            </p>

            <p className="mt-3">
              <strong>Seat :</strong>
              {ticket.seatNumber}
            </p>

            <p className="mt-3">
              <strong>Date :</strong>{" "}
              {new Date(ticket.workshopDate).toLocaleDateString()}
            </p>

            <p className="mt-3">
              <strong>Status :</strong>{" "}
              {ticket.status}
            </p>

            <button
              disabled={ticket.status !== "ENABLED"}
              onClick={() => setSelectedTicket(ticket)}
              className={`mt-6 w-full py-3 rounded-lg text-white font-semibold ${
                ticket.status === "ENABLED"
                  ? "bg-blue-600 hover:bg-blue-700"
                  : "bg-gray-400 cursor-not-allowed"
              }`}
            >
              {ticket.status === "ENABLED"
                ? "🎫 View Ticket"
                : "Not Available"}
            </button>

          </div>

        ))}

      </div>

      {selectedTicket && (

        <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50 p-5">

          <div className="bg-white rounded-3xl w-full max-w-6xl max-h-[95vh] overflow-auto relative">

            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute top-5 right-5 w-10 h-10 rounded-full bg-red-500 text-white"
            >
              ✕
            </button>

            <TicketViewer ticket={selectedTicket} />

          </div>

        </div>

      )}

    </div>
  );
};

export default MyTickets;