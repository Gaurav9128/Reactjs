import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";

const AdminTicketReport = () => {

  const [tickets, setTickets] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadTickets();
  }, []);

  const loadTickets = async () => {
    try {

      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/report/tickets`
        
      );

      setTickets(res.data.tickets);

    } catch (err) {

      console.log(err);

    }
  };

  const filtered = tickets.filter((item) =>
    item.studentId?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">

      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl sm:text-3xl font-bold mb-6">
          Ticket Report
        </h1>

        {/* Search */}

        <input
          type="text"
          placeholder="Search Student..."
          className="w-full border rounded-lg p-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        {/* Table */}

        <div className="bg-white rounded-xl shadow overflow-hidden">

          <div className="overflow-x-auto">

            <table className="min-w-[850px] w-full">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Student
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Ticket
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Day
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Seat
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Attendance
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Status
                  </th>

                </tr>

              </thead>

              <tbody>

                {filtered.length === 0 ? (

                  <tr>

                    <td
                      colSpan="6"
                      className="text-center py-8 text-gray-500"
                    >
                      No Tickets Found
                    </td>

                  </tr>

                ) : (

                  filtered.map((ticket) => (

                    <tr
                      key={ticket._id}
                      className="border-b hover:bg-gray-50 transition"
                    >

                      <td className="px-4 py-3 whitespace-nowrap">
                        {ticket.studentId?.fullName}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {ticket.ticketNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        Day {ticket.dayNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {ticket.seatNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            ticket.attendance
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {ticket.attendance
                            ? "Present"
                            : "Absent"}
                        </span>

                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${
                            ticket.status === "COMPLETED"
                              ? "bg-green-600"
                              : ticket.status === "CANCELLED"
                              ? "bg-red-600"
                              : "bg-yellow-500"
                          }`}
                        >
                          {ticket.status}
                        </span>

                      </td>

                    </tr>

                  ))

                )}

              </tbody>

            </table>

          </div>

        </div>

      </div>

    </div>

  );

};

export default AdminTicketReport;