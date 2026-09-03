import { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

import Sidebar from "../components/admin/Sidebar";
import DashboardCard from "../components/admin/DashboardCard";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    workingDays: 0,
    workshopTitle: "",
  });

  const [recentAttendance, setRecentAttendance] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadRecentAttendance();
  }, []);

  // ===========================
  // Dashboard Stats
  // ===========================

  const loadDashboard = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard/stats`
      );

      setStats(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // Recent Attendance
  // ===========================

  const loadRecentAttendance = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_API_URL}/api/admin/dashboard/recent-attendance`
      );

      setRecentAttendance(res.data.attendance);
    } catch (err) {
      console.log(err);
    }
  };

  // ===========================
  // End Workshop Day
  // ===========================

  const endWorkshopDay = async () => {
    const result = await Swal.fire({
      title: "End Workshop Day?",
      text: "Today's workshop will be completed and tomorrow's tickets will be enabled.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#2563eb",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, End Day",
    });

    if (!result.isConfirmed) return;

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attendance/end-day`
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      loadDashboard();
      loadRecentAttendance();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        {/* Header */}

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold break-words">
          {stats.workshopTitle || "Workshop Dashboard"}
        </h1>

        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mt-3 mb-8">
          <p className="text-gray-500 text-sm sm:text-base">
            Admin Dashboard
          </p>

          <button
            onClick={endWorkshopDay}
            className="w-full sm:w-auto bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-xl shadow-lg font-semibold transition duration-300"
          >
            🚀 End Workshop Day
          </button>
        </div>

        {/* Dashboard Cards */}

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          <DashboardCard
            title="Students"
            value={stats.totalStudents}
          />

          <DashboardCard
            title="Attendance"
            value={stats.totalAttendance}
          />

          <DashboardCard
            title="Working Days"
            value={stats.workingDays}
          />

          <DashboardCard
            title="Reports"
            value="Ready"
          />
        </div>

        {/* Recent Attendance */}

        <div className="mt-10 bg-white rounded-xl shadow-md p-4 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold mb-5">
            Recent Attendance
          </h2>

          <div className="overflow-x-auto">
            <table className="min-w-[750px] w-full border-collapse">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    Student
                  </th>

                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    Email
                  </th>

                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    Day
                  </th>

                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    Status
                  </th>

                  <th className="text-left px-4 py-3 whitespace-nowrap">
                    Time
                  </th>
                </tr>
              </thead>

              <tbody>

                              {recentAttendance.length > 0 ? (
                  recentAttendance.map((item) => (
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
                        Day {item.dayNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-700">
                          {item.status}
                        </span>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {item.attendanceTime
                          ? new Date(
                              item.attendanceTime
                            ).toLocaleString()
                          : "N/A"}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="5"
                      className="text-center py-10 text-gray-500"
                    >
                      No Attendance Found
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

export default AdminDashboard;