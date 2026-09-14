import { useEffect, useState } from "react";
import Swal from "sweetalert2";
import {
  CalendarCheck,
  Users,
  UserCheck,
  UserX,
  Search,
  Download,
  Printer,
} from "lucide-react";
import adminApi from "../utils/adminApi";
import downloadBlob from "../utils/downloadBlob";
import {
  AdminLayout,
  PageHeader,
  StatCard,
  DataTable,
  Avatar,
  StatusBadge,
  Button,
  EmptyState,
} from "../components/ui";

const AdminAttendance = () => {
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState("");
  const [day, setDay] = useState("");
  const [exporting, setExporting] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchAttendance = async (searchText, selectedDay) => {
    try {
      const res = await adminApi.get("/api/admin/attendance", {
        params: {
          search: searchText,
          day: selectedDay,
        },
      });

      return res.data.attendance || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  const loadAttendance = async (searchText = search, selectedDay = day) => {
    setLoading(true);

    const result = await fetchAttendance(searchText, selectedDay);
    setAttendance(result);
    setLoading(false);
  };

  useEffect(() => {
    adminApi
      .get("/api/admin/attendance", { params: { search: "", day: "" } })
      .then((res) => {
        setAttendance(res.data.attendance || []);
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  }, []);

  const total = attendance.length;
  const present = attendance.filter(
    (item) => item.status === "PRESENT"
  ).length;
  const absent = attendance.filter(
    (item) => item.status === "ABSENT"
  ).length;

  const exportExcel = async () => {
    try {
      setExporting(true);

      const url = day
        ? `/api/export/attendance/day/${day}`
        : "/api/export/attendance/all";
      const filename = day
        ? `attendance-day-${day}.xlsx`
        : "attendance-all.xlsx";
      await downloadBlob(url, filename);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setExporting(false);
    }
  };

  const printAttendance = () => {
    window.print();
  };

  const columns = [
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
      key: "mobile",
      label: "Mobile",
      render: (item) => item.studentId?.mobile || "N/A",
    },
    {
      key: "college",
      label: "College",
      render: (item) => item.studentId?.college || "N/A",
    },
    {
      key: "branch",
      label: "Branch",
      render: (item) => item.studentId?.branch || "N/A",
    },
    {
      key: "day",
      label: "Day",
      render: (item) => <span className="font-medium text-navy">Day {item.dayNumber}</span>,
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
            : "-"}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        icon={CalendarCheck}
        title="Attendance Management"
        description="Manage and monitor workshop attendance"
        actions={
          <>
            <Button icon={Printer} variant="secondary" onClick={printAttendance}>
              Print
            </Button>

            <Button
              icon={Download}
              loading={exporting}
              onClick={exportExcel}
            >
              {day ? `Export Day ${day}` : "Export All"}
            </Button>
          </>
        }
      />

      {/* Summary cards */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 lg:gap-5 mb-6">
        <StatCard
          icon={Users}
          label="Total Records"
          value={total}
          supporting="Filtered attendance records"
        />

        <StatCard
          icon={UserCheck}
          label="Present"
          value={present}
          supporting="Marked present"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          icon={UserX}
          label="Absent"
          value={absent}
          supporting="Marked absent"
          iconBg="bg-rose-50"
          iconColor="text-rose-600"
        />
      </section>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 mb-6">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="flex items-center gap-2.5 bg-slate-50 border border-slate-200 rounded-xl px-4 flex-1 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300 transition-all">
            <Search size={18} className="text-slate-400 shrink-0" />

            <input
              type="text"
              placeholder="Search student..."
              className="w-full py-2.5 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                loadAttendance(e.target.value, day);
              }}
            />
          </div>

          <select
            className="border border-slate-200 rounded-xl px-4 py-2.5 text-sm text-navy w-full lg:w-52 bg-white focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300"
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
        </div>
      </div>

      {/* Attendance Table */}
      <DataTable
        columns={columns}
        data={attendance}
        loading={loading}
        minWidth={1100}
        emptyState={
          <EmptyState
            icon={CalendarCheck}
            title="No Attendance Found"
            description="Attendance records will appear here once students attend the workshop."
          />
        }
      />
    </AdminLayout>
  );
};

export default AdminAttendance;