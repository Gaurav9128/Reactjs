import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";

const AdminStudentDetails = () => {
  const { studentId } = useParams();

  const [student, setStudent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [breakHistory, setBreakHistory] = useState([]);

  useEffect(() => {
    loadStudent();
  }, []);

  const loadStudent = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/students/${studentId}`
        
      );

      setStudent(res.data.student);
      setTickets(res.data.tickets);
      setAttendance(res.data.attendance);
      setBreakHistory(res.data.breakHistory);
    } catch (err) {
      console.log(err);
    }
  };

  if (!student) {
    return (
      <div className="flex min-h-screen bg-gray-100">
        <Sidebar />

        <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            Loading...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Student Details
        </h1>

        {/* Personal Information */}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-5">
            Personal Information
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Name :</strong> {student.fullName}
            </div>

            <div>
              <strong>Email :</strong> {student.email}
            </div>

            <div>
              <strong>Mobile :</strong> {student.mobile}
            </div>

            <div>
              <strong>College :</strong> {student.college}
            </div>

            <div>
              <strong>Branch :</strong> {student.branch}
            </div>

            <div>
              <strong>Year :</strong> {student.year}
            </div>

            <div>
              <strong>Laptop :</strong>{" "}
              {student.laptop ? "Yes" : "No"}
            </div>
          </div>
        </div>

        {/* Workshop Tickets */}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-5">
            Workshop Tickets
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-[750px] w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Day
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Ticket
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Seat
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Attendance
                  </th>
                </tr>
              </thead>

              <tbody>
                {tickets.map((ticket) => (
                  <tr
                    key={ticket._id}
                    className="border-b hover:bg-gray-50 transition"
                  >
                    <td className="px-4 py-3 whitespace-nowrap">
                      Day {ticket.dayNumber}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {ticket.ticketNumber}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {ticket.seatNumber}
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          ticket.status === "ENABLED"
                            ? "bg-green-100 text-green-700"
                            : ticket.status === "COMPLETED"
                            ? "bg-blue-100 text-blue-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {ticket.status}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      {ticket.attendance ? "Present" : "Absent"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
                        {/* Attendance History */}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-8">
          <h2 className="text-lg sm:text-xl font-bold mb-5">
            Attendance History
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-[650px] w-full">
              <thead>
                <tr className="bg-green-600 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Day
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Status
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>
                {attendance.length > 0 ? (
                  attendance.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        Day {item.dayNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.attendanceTime
                          ? new Date(item.attendanceTime).toLocaleString()
                          : "-"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-8 text-gray-500"
                    >
                      No Attendance History Found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Break History */}

        <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-bold mb-5">
            Break History
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-[750px] w-full">
              <thead>
                <tr className="bg-orange-500 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Break Out
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Return
                  </th>

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Duration
                  </th>
                </tr>
              </thead>

              <tbody>
                {breakHistory.length > 0 ? (
                  breakHistory.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.breakOutTime
                          ? new Date(item.breakOutTime).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.returnTime
                          ? new Date(item.returnTime).toLocaleString()
                          : "-"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.returnTime
                          ? `${Math.floor(item.totalMinutes / 60)} hr ${
                              item.totalMinutes % 60
                            } min`
                          : (
                            <span className="text-red-600 font-semibold">
                              Still Outside
                            </span>
                          )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="3"
                      className="text-center py-8 text-gray-500"
                    >
                      No Break History Found
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

export default AdminStudentDetails;