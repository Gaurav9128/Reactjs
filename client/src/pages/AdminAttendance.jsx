import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "../components/admin/Sidebar";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async (
    searchText = search,
    selectedDay = day
  ) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/attendance`,
        {
          params: {
            search: searchText,
            day: selectedDay,
          },
        }
      );

      setAttendance(res.data.attendance || []);
    } catch (err) {
      console.log(err);
    }
  };

  const total = attendance.length;

  const present = attendance.filter(
    (item) => item.status === "PRESENT"
  ).length;

  const exportExcel = () => {
    window.location.href =
      `${import.meta.env.VITE_API_URL}/api/export/attendance/all`;
  };

  const printAttendance = () => {
    window.print();
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        {/* Heading */}

        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold">
            Attendance Management
          </h1>

          <p className="text-gray-500 mt-2 text-sm sm:text-base">
            Manage and monitor workshop attendance
          </p>
        </div>

        {/* Filters */}

        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            <input
              type="text"
              placeholder="Search Student..."
              className="border border-gray-300 rounded-lg p-3 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                loadAttendance(e.target.value, day);
              }}
            />

            <select
              className="border border-gray-300 rounded-lg p-3 w-full lg:w-48 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={day}
              onChange={(e) => {
                setDay(e.target.value);
                loadAttendance(search, e.target.value);
              }}
            >
              <option value="">All Days</option>
              <option value="1">Day 1</option>
              <option value="2">Day 2</option>
              <option value="3">Day 3</option>
              <option value="4">Day 4</option>
              <option value="5">Day 5</option>
            </select>

            <button
              onClick={exportExcel}
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition w-full lg:w-auto"
            >
              Export
            </button>

            <button
              onClick={printAttendance}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition w-full lg:w-auto"
            >
              Print
            </button>
          </div>
        </div>

        {/* Summary Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide">
              Total Attendance
            </h2>

            <p className="text-3xl sm:text-4xl font-bold mt-2">
              {total}
            </p>
          </div>

          <div className="bg-white rounded-xl shadow-md p-6">
            <h2 className="text-gray-500 text-sm uppercase tracking-wide">
              Present Students
            </h2>

            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-2">
              {present}
            </p>
          </div>
        </div>

        {/* Attendance Table */}

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[1000px] w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Student
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

                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Branch
                  </th>

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

                              {attendance.length === 0 ? (
                  <tr>
                    <td
                      colSpan="8"
                      className="text-center py-10 text-gray-500"
                    >
                      No Attendance Found
                    </td>
                  </tr>
                ) : (
                  attendance.map((item) => (
                    <tr
                      key={item._id}
                      className="border-b hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.studentId?.fullName || "N/A"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.studentId?.email || "N/A"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.studentId?.mobile || "N/A"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.studentId?.college || "N/A"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.studentId?.branch || "N/A"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        Day {item.dayNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                            item.status === "PRESENT"
                              ? "bg-green-100 text-green-700"
                              : item.status === "ABSENT"
                              ? "bg-red-100 text-red-700"
                              : "bg-yellow-100 text-yellow-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.attendanceTime
                          ? new Date(
                              item.attendanceTime
                            ).toLocaleString()
                          : "-"}
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

export default AdminAttendance;