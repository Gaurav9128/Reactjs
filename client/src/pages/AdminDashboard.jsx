import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  Users,
  CalendarCheck,
  CalendarDays,
  FileText,
  PieChart,
  BarChart3,
  Clock3,
  Rocket,
} from "lucide-react";
import adminApi from "../utils/adminApi";
import DayWiseAttendance from "../components/admin/DayWiseAttendance";
import {
  AdminLayout,
  PageHeader,
  StatCard,
  SectionCard,
  DataTable,
  Avatar,
  StatusBadge,
  EmptyState,
  Button,
  Skeleton,
} from "../components/ui";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalAttendance: 0,
    workingDays: 0,
    workshopTitle: "",
  });

  const [recentAttendance, setRecentAttendance] = useState([]);
  const [dayWise, setDayWise] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAll = () =>
    Promise.all([
      adminApi.get("/api/admin/dashboard/stats"),
      adminApi.get("/api/admin/dashboard/recent-attendance"),
      adminApi.get("/api/admin/dashboard/day-wise"),
    ]);

  const applyData = ([statsRes, recentRes, dayRes]) => {
    setStats(statsRes.data.data);
    setRecentAttendance(recentRes.data.attendance);
    setDayWise(dayRes.data.days || []);
    setLoading(false);
  };

  const reload = () =>
    fetchAll()
      .then(applyData)
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });

  useEffect(() => {
    fetchAll()
      .then(applyData)
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

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
      const res = await adminApi.post("/api/attendance/end-day");

      await Swal.fire({
        icon: "success",
        title: "Success",
        text: res.data.message,
      });

      reload();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error",
        text: err.response?.data?.message || "Something went wrong",
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
    totalMarked > 0 ? Math.round((totalPresent / totalMarked) * 100) : 0;

  const absentPercentage =
    totalMarked > 0 ? Math.round((totalAbsent / totalMarked) * 100) : 0;

  const donutStyle = {
    background: `conic-gradient(
      #34b77a 0% ${attendancePercentage}%,
      #ef5350 ${attendancePercentage}% ${
        attendancePercentage + absentPercentage
      }%,
      #cbd5e1 ${attendancePercentage + absentPercentage}% 100%
    )`,
  };

  const recentColumns = [
    {
      key: "index",
      label: "#",
      render: (item) => {
        const index = recentAttendance.indexOf(item);
        return <span className="text-slate-400">{index + 1}</span>;
      },
    },
    {
      key: "student",
      label: "Student",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar name={item.studentId?.fullName} size={34} />
          <span className="font-medium text-navy whitespace-nowrap">
            {item.studentId?.fullName || "N/A"}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (item) => (
        <span className="text-slate-500">{item.studentId?.email || "N/A"}</span>
      ),
    },
    {
      key: "day",
      label: "Day",
      render: (item) => (
        <span className="font-medium text-navy">Day {item.dayNumber}</span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
    {
      key: "time",
      label: "Time",
      render: (item) => (
        <span className="text-slate-500">
          {item.attendanceTime
            ? new Date(item.attendanceTime).toLocaleString()
            : "N/A"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        icon={Users}
        title="Welcome back, Admin"
        description="Here's an overview of your workshop activities"
        actions={
          <div className="hidden sm:flex items-center gap-3 bg-white border border-slate-100 rounded-xl px-4 py-2.5 shadow-sm">
            <CalendarDays size={18} className="text-primary-blue" />
            <div>
              <p className="text-xs font-semibold text-navy">
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
        }
      />

      {/* Hero */}
      <section className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#101b4b] to-[#1e3a8a] p-6 sm:p-7 lg:p-8 mb-6">
        <div className="absolute -right-10 -top-16 w-64 h-64 rounded-full bg-white/10" />
        <div className="absolute -left-16 -bottom-24 w-64 h-64 rounded-full bg-white/5" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-16 h-16 rounded-2xl bg-white/15 text-white items-center justify-center shrink-0">
              <Users size={30} />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.15em] font-bold text-blue-300">
                Workshop Overview
              </p>

              <h2 className="text-2xl sm:text-3xl font-bold text-white mt-1">
                {stats.workshopTitle || "ReactJS Workshop"}
              </h2>

              <p className="text-sm text-blue-200 mt-2 max-w-xl">
                Track attendance, manage participants and keep your workshop
                organized.
              </p>
            </div>
          </div>

          <Button
            variant="danger"
            size="lg"
            icon={Rocket}
            onClick={endWorkshopDay}
            className="shrink-0"
          >
            End Workshop Day
          </Button>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-5 mb-6">
        <StatCard
          icon={Users}
          label="Total Students"
          value={loading ? "—" : stats.totalStudents}
          supporting="Registered participants"
        />

        <StatCard
          icon={CalendarCheck}
          label="Total Attendance"
          value={loading ? "—" : stats.totalAttendance}
          supporting="Check-ins so far"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          icon={CalendarDays}
          label="Working Days"
          value={loading ? "—" : stats.workingDays}
          supporting="Days completed"
          iconBg="bg-amber-50"
          iconColor="text-amber-600"
        />

        <StatCard
          icon={FileText}
          label="Reports"
          value="Ready"
          supporting="All reports up to date"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </section>

      {/* Analytics */}
      <section className="grid grid-cols-1 xl:grid-cols-[1.55fr_1fr] gap-5 mb-6">
        <DayWiseAttendanceSafe days={dayWise} loading={loading} />

        <SectionCard
          icon={PieChart}
          title="Attendance Overview"
          description="Overall attendance statistics"
          actions={
            <span className="px-3 py-1.5 border border-slate-200 rounded-lg text-xs font-medium text-slate-600">
              This Workshop
            </span>
          }
        >
          <div className="flex flex-col sm:flex-row items-center justify-center gap-8 mt-2">
            <div
              className="relative w-40 h-40 rounded-full flex items-center justify-center"
              style={donutStyle}
            >
              <div className="w-28 h-28 bg-white rounded-full flex flex-col items-center justify-center shadow-inner">
                <span className="text-2xl font-bold text-navy">
                  {stats.totalAttendance}
                </span>
                <span className="text-xs text-slate-400">Check-ins</span>
              </div>
            </div>

            <div className="w-full sm:w-auto min-w-[190px]">
              <div className="flex items-center justify-between py-3 border-b border-slate-100">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500" />
                  <span className="text-sm text-slate-600">Present</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-navy">
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
                  <span className="text-sm text-slate-600">Absent</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-navy">
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
                  <span className="text-sm text-slate-600">Not Marked</span>
                </div>
                <span className="text-sm font-bold text-navy">
                  {Math.max(
                    stats.totalStudents * stats.workingDays - totalMarked,
                    0
                  )}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 bg-light-blue rounded-xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-primary-blue">
              <BarChart3 size={20} />
            </div>
            <div>
              <p className="text-sm font-bold text-navy">Great Participation!</p>
              <p className="text-xs text-slate-500 mt-0.5">
                Keep up the good work. Student engagement is being tracked.
              </p>
            </div>
          </div>
        </SectionCard>
      </section>

      {/* Recent Attendance */}
      <SectionCard
        icon={Clock3}
        title="Recent Attendance"
        description="Latest check-ins from participants"
      >
        <DataTable
          columns={recentColumns}
          data={recentAttendance}
          loading={loading}
          minWidth={800}
          emptyState={
            <EmptyState
              icon={Clock3}
              title="No Attendance Found"
              description="Attendance records will appear here when available."
            />
          }
        />
      </SectionCard>
    </AdminLayout>
  );
};

/* Local wrapper so the chart can show a skeleton while loading */
const DayWiseAttendanceSafe = ({ days, loading }) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
        <Skeleton className="h-5 w-48 mb-6" />
        <Skeleton className="h-[260px] w-full" />
      </div>
    );
  }

  return <DayWiseAttendance days={days} />;
};

export default AdminDashboard;