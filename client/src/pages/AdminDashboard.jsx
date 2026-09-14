import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarDays,
  ChevronDown,
  Clock3,
  Rocket,
  ArrowRight,
  BarChart3,
  PieChart,
  Users,
} from "lucide-react";

import adminApi from "../utils/adminApi";

import Sidebar from "../components/admin/Sidebar";
import DashboardCard from "../components/admin/DashboardCard";
import DayWiseAttendance from "../components/admin/DayWiseAttendance";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    workingDays: 0,
    workshopTitle: "",
  });

  const [recentAttendance, setRecentAttendance] = useState([]);
  const [dayWise, setDayWise] = useState([]);

  useEffect(() => {
    loadDashboard();
    loadRecentAttendance();
    loadDayWise();
  }, []);

  const loadDashboard = async () => {
    try {
      const res = await adminApi.get(
        "/api/admin/dashboard/stats"
      );

      setStats(res.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const loadRecentAttendance = async () => {
    try {
      const res = await adminApi.get(
        "/api/admin/dashboard/recent-attendance"
      );

      setRecentAttendance(res.data.attendance);
    } catch (err) {
      console.log(err);
    }
  };

  const loadDayWise = async () => {
    try {
      const res = await adminApi.get(
        "/api/admin/dashboard/day-wise"
      );

      setDayWise(res.data.days || []);
    } catch (err) {
      console.log(err);
    }
  };

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
      const res = await adminApi.post(
        "/api/attendance/end-day"
      );

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      loadDashboard();
      loadRecentAttendance();
      loadDayWise();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text:
          err.response?.data?.message ||
          "Something went wrong",
      });
    }
  };

  /* ---------------- Attendance Overview ---------------- */

  const totalPresent = dayWise.reduce(
    (sum, day) => sum + (day.present || 0),
    0
  );

  const totalAbsent = dayWise.reduce(
    (sum, day) => sum + (day.absent || 0),
    0
  );

  const totalMarked = totalPresent + totalAbsent;

  const attendancePercentage =
    totalMarked > 0
      ? Math.round((totalPresent / totalMarked) * 100)
      : 0;

  const absentPercentage =
    totalMarked > 0
      ? Math.round((totalAbsent / totalMarked) * 100)
      : 0;

  const donutStyle = {
    background: `conic-gradient(
      #34b77a 0% ${attendancePercentage}%,
      #ef5350 ${attendancePercentage}% ${
        attendancePercentage + absentPercentage
      }%,
      #cbd5e1 ${
        attendancePercentage + absentPercentage
      }% 100%
    )`,
  };

  return (
    <div className="min-h-screen bg-[#f4f8fc] overflow-x-hidden">
      <Sidebar />

      <main className="lg:ml-64 min-h-screen">
        <div className="p-4 sm:p-6 lg:p-8 pt-20 lg:pt-7 max-w-[1600px] mx-auto">

          {/* ================================================= */}
          {/* TOP HEADER */}
          {/* ================================================= */}

          <header className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
             
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-[#101b4b]">
                  Welcome back, Admin 👋
                </h1>

                <p className="text-sm text-slate-500 mt-1">
                  Here's an overview of your workshop activities.
                </p>
              </div>
            </div>

            <div className="hidden sm:flex items-center gap-4">
              {/* Date */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-100 flex items-center justify-center text-blue-600 shadow-sm">
                  <CalendarDays size={20} />
                </div>

                <div>
                  <p className="text-xs font-semibold text-[#101b4b]">
                    {new Date().toLocaleDateString("en-IN", {
                      weekday: "long",
                      day: "2-digit",
                      month: "long",
                      year: "numeric",
                    })}
                  </p>

                  <p className="text-xs text-slate-400">
                    {new Date().toLocaleTimeString("en-IN", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              <div className="w-px h-10 bg-slate-200" />

              
            </div>
          </header>

          {/* ================================================= */}
          {/* HERO */}
          {/* ================================================= */}

          <section
            className="
              relative overflow-hidden
              rounded-2xl
              bg-gradient-to-r
              from-[#dbeeff]
              via-[#eaf5ff]
              to-[#d7ebff]
              border border-blue-100
              p-6 sm:p-7 lg:p-8
              mb-6
            "
          >
            {/* Background decoration */}
            <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-white/30" />

            <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

              <div className="flex items-start gap-4">
                <div className="hidden sm:flex w-16 h-16 rounded-full bg-white/80 shadow-sm items-center justify-center text-blue-600">
                  <Users size={30} />
                </div>

                <div>
                  <p className="text-xs uppercase tracking-[0.15em] font-bold text-blue-600">
                    Workshop Overview
                  </p>

                  <h2 className="text-2xl sm:text-3xl font-bold text-[#101b4b] mt-1">
                    {stats.workshopTitle ||
                      "ReactJS Workshop"}
                  </h2>

                  <p className="text-sm text-slate-500 mt-2 max-w-xl">
                    Track attendance, manage participants and
                    keep your workshop organized.
                  </p>

                  <div className="flex flex-wrap gap-2 mt-5">
                    <span className="bg-white/80 border border-white px-3 py-1.5 rounded-full text-xs font-medium text-[#101b4b]">
                      🎓 Manage
                    </span>

                    <span className="bg-white/80 border border-white px-3 py-1.5 rounded-full text-xs font-medium text-[#101b4b]">
                      👥 Track
                    </span>

                    <span className="bg-white/80 border border-white px-3 py-1.5 rounded-full text-xs font-medium text-[#101b4b]">
                      📊 Analyze
                    </span>
                  </div>
                </div>
              </div>

              {/* End Day */}
              <button
                onClick={endWorkshopDay}
                className="
                  shrink-0
                  flex items-center gap-3
                  bg-gradient-to-r
                  from-red-500
                  to-rose-600
                  hover:from-red-600
                  hover:to-rose-700
                  text-white
                  px-6 py-4
                  rounded-xl
                  shadow-lg shadow-red-200
                  transition-all duration-200
                  hover:-translate-y-0.5
                "
              >
                <div className="w-10 h-10 rounded-lg bg-white/15 flex items-center justify-center">
                  <Rocket size={22} />
                </div>

                <div className="text-left">
                  <p className="font-bold text-sm">
                    End Workshop Day
                  </p>

                  <p className="text-xs text-red-100">
                    Complete today's session
                  </p>
                </div>
              </button>
            </div>
          </section>

          {/* ================================================= */}
          {/* STATISTICS */}
          {/* ================================================= */}

          <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5">
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
          </section>

          {/* ================================================= */}
          {/* ANALYTICS */}
          {/* ================================================= */}

          <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 mt-5">

            {/* Day Wise */}
            <DayWiseAttendance days={dayWise} />

            {/* Attendance Overview */}
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                    <PieChart size={21} />
                  </div>

                  <div>
                    <h2 className="text-lg font-bold text-[#101b4b]">
                      Attendance Overview
                    </h2>

                    <p className="text-xs text-slate-400 mt-0.5">
                      Overall attendance statistics
                    </p>
                  </div>
                </div>

                <button className="flex items-center gap-1 border border-slate-200 rounded-lg px-3 py-2 text-xs text-slate-600">
                  This Workshop
                  <ChevronDown size={14} />
                </button>
              </div>

              {/* Donut */}
              <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-7">

                <div
                  className="
                    relative
                    w-40 h-40
                    rounded-full
                    flex items-center justify-center
                  "
                  style={donutStyle}
                >
                  <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                    <span className="text-2xl font-bold text-[#101b4b]">
                      {stats.totalAttendance}
                    </span>

                    <span className="text-xs text-slate-400">
                      Check-ins
                    </span>
                  </div>
                </div>

                {/* Stats */}
                <div className="w-full sm:w-auto min-w-[190px]">

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-500" />
                      <span className="text-sm text-slate-600">
                        Present
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#101b4b]">
                        {totalPresent}
                      </span>

                      <span className="text-xs text-slate-400 ml-2">
                        {attendancePercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3 border-b border-slate-100">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-red-400" />
                      <span className="text-sm text-slate-600">
                        Absent
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-sm font-bold text-[#101b4b]">
                        {totalAbsent}
                      </span>

                      <span className="text-xs text-slate-400 ml-2">
                        {absentPercentage}%
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between py-3">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-slate-300" />
                      <span className="text-sm text-slate-600">
                        Not Marked
                      </span>
                    </div>

                    <span className="text-sm font-bold text-[#101b4b]">
                      {Math.max(
                        stats.totalStudents * stats.workingDays -
                          totalMarked,
                        0
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* Bottom message */}
              <div className="mt-6 bg-blue-50 rounded-xl p-4 flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-blue-600">
                  <BarChart3 size={20} />
                </div>

                <div>
                  <p className="text-sm font-bold text-[#101b4b]">
                    Great Participation!
                  </p>

                  <p className="text-xs text-slate-500 mt-0.5">
                    Keep up the good work. Student engagement
                    is being tracked.
                  </p>
                </div>
              </div>
            </div>
          </section>

          {/* ================================================= */}
          {/* RECENT ATTENDANCE */}
          {/* ================================================= */}

          <section className="mt-5 bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">

            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Clock3 size={21} />
                </div>

                <div>
                  <h2 className="text-lg font-bold text-[#101b4b]">
                    Recent Attendance
                  </h2>

                  <p className="text-xs text-slate-400 mt-0.5">
                    Latest check-ins from participants
                  </p>
                </div>
              </div>

              <button className="hidden sm:flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
                View All
                <ArrowRight size={17} />
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[800px] border-collapse">

                <thead>
                  <tr className="bg-[#f1f6fc] rounded-lg">
                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 rounded-l-lg">
                      #
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                      Student
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                      Email
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                      Day
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600">
                      Status
                    </th>

                    <th className="text-left px-4 py-3 text-xs font-semibold text-slate-600 rounded-r-lg">
                      Time
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {recentAttendance.length > 0 ? (
                    recentAttendance.map((item, index) => (
                      <tr
                        key={item._id}
                        className="
                          border-b border-slate-100
                          hover:bg-slate-50
                          transition-colors
                        "
                      >
                        <td className="px-4 py-3 text-sm text-slate-500">
                          {index + 1}
                        </td>

                        <td className="px-4 py-3">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center text-xs font-bold">
                              {(
                                item.studentId?.fullName ||
                                "N"
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="text-sm font-medium text-[#101b4b] whitespace-nowrap">
                              {item.studentId?.fullName ||
                                "N/A"}
                            </span>
                          </div>
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
                          {item.studentId?.email || "N/A"}
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-600 whitespace-nowrap">
                          Day {item.dayNumber}
                        </td>

                        <td className="px-4 py-3">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {item.status}
                          </span>
                        </td>

                        <td className="px-4 py-3 text-sm text-slate-500 whitespace-nowrap">
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
                        colSpan="6"
                        className="text-center py-12 text-sm text-slate-400"
                      >
                        No Attendance Found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </section>

        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;