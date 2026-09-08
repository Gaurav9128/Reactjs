import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import adminApi from "../utils/adminApi";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sendingAll, setSendingAll] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async (query = "") => {
    try {
      const res = await adminApi.get(
        `/api/admin/students/search?query=${query}`
        
      );

      setStudents(res.data.students);
    } catch (err) {
      console.log(err);
    }
  };

  const handleBulkSendTickets = async () => {
    try {
      setSendingAll(true);

      const res = await adminApi.post(
        "/api/admin/tickets/email/send-all"
      );

      const { sent, failed, errors } = res.data;

      let message = `Ticket emails sent successfully!\n\nSent: ${sent}`;
      if (failed > 0) {
        message += `\nFailed: ${failed}`;
        if (errors.length > 0) {
          message += "\n\nFailed emails:\n";
          errors.forEach((err) => {
            message += `- ${err.email}: ${err.error}\n`;
          });
        }
      }

      Swal.fire({
        icon: failed > 0 ? "warning" : "success",
        title: "Bulk Ticket Email",
        text: message,
      });

    } catch (err) {
      Swal.fire({
        icon: "error",
        title: err.response?.data?.message || "Failed to send tickets",
      });
    } finally {
      setSendingAll(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        {/* Heading */}

        <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">
              Student Management
            </h1>

            <p className="text-gray-500 mt-1 text-sm sm:text-base">
              Search and manage workshop students
            </p>
          </div>

          <button
            onClick={handleBulkSendTickets}
            disabled={sendingAll}
            className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition flex items-center gap-2"
          >
            {sendingAll ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Sending...
              </>
            ) : (
              "📧 Send All Tickets"
            )}
          </button>
        </div>

        {/* Search */}

        <input
          type="text"
          placeholder="Search Student..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            loadStudents(e.target.value);
          }}
          className="w-full border border-gray-300 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Table */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[850px] w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Name
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Email
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Mobile
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    College
                  </th>

                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {students.length > 0 ? (
                  students.map((student) => (
                    <tr
                      key={student._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.fullName}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.email}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.mobile}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {student.college}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        <button
                          onClick={() =>
                            navigate(`/admin/students/${student._id}`)
                          }
                          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
                        >
                          View
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      No Students Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminStudents;