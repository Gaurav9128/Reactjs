import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import Icon from "./Icon.jsx";
import TicketViewer from "../studentTickets/TicketViewer.jsx";

const TicketsTab = () => {
  const navigate = useNavigate();

  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(false);
  const [ticketsError, setTicketsError] = useState("");

  const [selectedTicket, setSelectedTicket] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  /* =========================================================
     LOAD TICKETS
  ========================================================= */

  const loadTickets = async () => {
    setTicketsLoading(true);
    setTicketsError("");

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

      setTickets(res.data.tickets || []);
      setTicketsError("");
    } catch (err) {
      console.log(err);

      if (err.response?.status === 401 || err.response?.status === 404) {
        localStorage.clear();
        navigate("/login", { replace: true });
        return;
      }

      setTicketsError(
        err.response?.data?.message || "Failed to load tickets. Please try again."
      );
    } finally {
      setTicketsLoading(false);
    }
  };

  /* =========================================================
     EFFECTS
  ========================================================= */

  useEffect(() => {
    requestAnimationFrame(() => loadTickets());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* =========================================================
     ACTIONS
  ========================================================= */

  const handleRequestReEnable = async (ticketId) => {
    const result = await Swal.fire({
      title: "Request Re-enable",
      text: "Submit a request to re-enable this cancelled ticket?",
      input: "textarea",
      inputLabel: "Optional note",
      inputPlaceholder: "Add a note for the admin (optional)",
      showDenyButton: true,
      confirmButtonText: "Submit Request",
      denyButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/api/tickets/request-re-enable`,
          {
            ticketId,
            reason: result.value || "",
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Request Submitted",
            text: res.data.message,
            timer: 1500,
            showConfirmButton: false,
          });
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
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

  /* =========================================================
     STATUS BADGES
  ========================================================= */

  const getStatusBadge = (status) => {
    switch (status) {
      case "ENABLED":
      case "PRESENT":
        return (
          <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-600">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            {status === "PRESENT" ? "Present" : "Active Today"}
          </span>
        );

      case "UPCOMING":
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            Locked
          </span>
        );

      case "COMPLETED":
        return (
          <span className="inline-flex items-center rounded-full bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-600">
            Completed
          </span>
        );

      case "CANCELLED":
        return (
          <span className="inline-flex items-center rounded-full bg-red-50 px-3 py-1.5 text-xs font-bold text-red-600">
            Cancelled
          </span>
        );

      default:
        return (
          <span className="inline-flex items-center rounded-full bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-600">
            {status}
          </span>
        );
    }
  };

  /* =========================================================
     TICKET STYLE
  ========================================================= */

  const getTicketStyle = (status) => {
    switch (status) {
      case "ENABLED":
      case "PRESENT":
        return {
          card: "border-emerald-100 bg-gradient-to-br from-emerald-50 to-white",
          day: "text-emerald-600",
          number: "text-emerald-700",
          badge: "bg-emerald-500 text-white",
        };

      case "COMPLETED":
        return {
          card: "border-blue-100 bg-gradient-to-br from-blue-50 to-white",
          day: "text-blue-600",
          number: "text-blue-700",
          badge: "bg-blue-500 text-white",
        };

      case "CANCELLED":
        return {
          card: "border-red-100 bg-gradient-to-br from-red-50 to-white",
          day: "text-red-600",
          number: "text-red-700",
          badge: "bg-red-500 text-white",
        };

      default:
        return {
          card: "border-slate-200 bg-gradient-to-br from-slate-50 to-white",
          day: "text-slate-500",
          number: "text-slate-700",
          badge: "bg-slate-400 text-white",
        };
    }
  };

  const getStatusLabel = (status) => {
    switch (status) {
      case "ENABLED":
        return "Active Today";
      case "PRESENT":
        return "Present";
      case "COMPLETED":
        return "Completed";
      case "CANCELLED":
        return "Cancelled";
      default:
        return "Locked";
    }
  };

  /* =========================================================
     MAIN UI
  ========================================================= */

  return (
    <div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-full bg-blue-50 text-blue-600">
            <Icon name="ticket" size={22} />
          </div>

          <h2 className="text-2xl font-extrabold text-[#0b1935]">My Tickets</h2>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          {tickets.length > 0 && (
            <span className="w-fit rounded-full bg-blue-50 px-4 py-2 text-sm font-bold text-blue-700">
              {tickets.length} {tickets.length === 1 ? "Ticket" : "Tickets"}
            </span>
          )}

          <button
            type="button"
            onClick={handleSendEmail}
            disabled={sendingEmail}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-blue-400 sm:w-auto"
          >
            {sendingEmail ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                Sending...
              </>
            ) : (
              "Send Tickets to Email"
            )}
          </button>
        </div>
      </div>

      {ticketsError ? (
        <div className="rounded-2xl border border-red-200 bg-red-50 py-12 text-center">
          <h3 className="text-lg font-extrabold text-red-700">
            Unable to load tickets
          </h3>
          <p className="mt-2 text-sm font-medium text-red-600">{ticketsError}</p>
        </div>
      ) : ticketsLoading ? (
        <div className="flex min-h-[300px] items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
            <p className="text-sm font-semibold text-slate-500">
              Loading tickets...
            </p>
          </div>
        </div>
      ) : tickets.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-slate-50 py-20 text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
            <Icon name="ticket" size={30} />
          </div>

          <h3 className="mt-5 text-lg font-extrabold text-slate-700">
            No tickets found
          </h3>

          <p className="mt-1 text-sm text-slate-500">
            Your workshop tickets will appear here.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2 xl:grid-cols-3">
          {tickets.map((ticket) => {
            const style = getTicketStyle(ticket.status);

            return (
              <div
                key={ticket._id}
                className={`overflow-hidden rounded-2xl border shadow-sm transition hover:-translate-y-1 hover:shadow-lg ${style.card}`}
              >
                <div className="grid grid-cols-[96px_1fr] sm:grid-cols-[105px_1fr]">
                  {/* DAY */}

                  <div className="flex flex-col items-center justify-center border-r border-white/70 bg-white/30 p-5 text-center">
                    <span
                      className={`text-sm font-extrabold uppercase tracking-wider ${style.day}`}
                    >
                      Day
                    </span>

                    <span className={`mt-1 text-5xl font-black ${style.number}`}>
                      {ticket.dayNumber}
                    </span>

                    <span
                      className={`mt-4 rounded-full px-3 py-1.5 text-[11px] font-bold ${style.badge}`}
                    >
                      {getStatusLabel(ticket.status)}
                    </span>
                  </div>

                  {/* DETAILS */}

                  <div className="relative p-5">
                    <div className="absolute right-4 top-4 opacity-10">
                      <Icon name="ticket" size={70} />
                    </div>

                    <div className="relative space-y-5">
                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          Ticket Number
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-[#17213a]">
                          {ticket.ticketNumber || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          Seat Number
                        </p>

                        <p className="mt-1 text-sm font-extrabold text-[#17213a]">
                          {ticket.seatNumber || "-"}
                        </p>
                      </div>

                      <div>
                        <p className="text-xs font-semibold text-slate-400">
                          Workshop Date
                        </p>

                        <p className="mt-1 flex items-center gap-2 text-sm font-extrabold text-[#17213a]">
                          <Icon name="calendar" size={16} />
                          {ticket.workshopDate
                            ? new Date(ticket.workshopDate).toLocaleDateString()
                            : "-"}
                        </p>
                      </div>

                      <div className="border-t border-slate-200/60 pt-3">
                        <p className="text-xs font-semibold text-slate-400">
                          Status
                        </p>

                        <div className="mt-2">{getStatusBadge(ticket.status)}</div>
                      </div>

                      <button
                        type="button"
                        disabled={ticket.status !== "ENABLED"}
                        onClick={() => setSelectedTicket(ticket)}
                        className={`w-full rounded-xl py-3 text-sm font-bold text-white transition ${
                          ticket.status === "ENABLED"
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "cursor-not-allowed bg-slate-300"
                        }`}
                      >
                        {ticket.status === "ENABLED"
                          ? "View Ticket"
                          : "Not Available"}
                      </button>

                      {ticket.isCancelled && (
                        <button
                          type="button"
                          onClick={() => handleRequestReEnable(ticket._id)}
                          className="w-full rounded-xl bg-orange-600 py-2.5 text-sm font-bold text-white transition hover:bg-orange-700"
                        >
                          Request Re-enable
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-3 sm:p-5">
          <div className="relative max-h-[95vh] w-full max-w-6xl overflow-auto rounded-3xl bg-white">
            <div className="flex justify-end p-3 sm:hidden">
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                aria-label="Close ticket viewer"
                className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white"
              >
                <Icon name="x" size={20} />
              </button>
            </div>

            <button
              type="button"
              onClick={() => setSelectedTicket(null)}
              aria-label="Close ticket viewer"
              className="absolute right-5 top-5 z-10 hidden h-10 w-10 items-center justify-center rounded-full bg-red-500 text-white sm:flex"
            >
              <Icon name="x" size={20} />
            </button>

            <TicketViewer ticket={selectedTicket} />
          </div>
        </div>
      )}
    </div>
  );
};

export default TicketsTab;
