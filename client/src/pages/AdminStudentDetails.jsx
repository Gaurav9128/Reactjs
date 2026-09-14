import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  User,
  Ticket,
  CalendarCheck,
  Coffee,
  Laptop,
} from "lucide-react";
import adminApi from "../utils/adminApi";
import {
  AdminLayout,
  PageHeader,
  SectionCard,
  DataTable,
  Avatar,
  StatusBadge,
  Button,
  Skeleton,
} from "../components/ui";

const InfoField = ({ label, value }) => (
  <div className="flex flex-col gap-1">
    <span className="text-xs font-medium text-slate-400 uppercase tracking-wide">
      {label}
    </span>
    <span className="text-sm font-medium text-navy break-words">
      {value || "-"}
    </span>
  </div>
);

const formatDateTime = (value) =>
  value ? new Date(value).toLocaleString() : "-";

const AdminStudentDetails = () => {
  const { studentId } = useParams();
  const navigate = useNavigate();

  const [student, setStudent] = useState(null);
  const [tickets, setTickets] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [breakHistory, setBreakHistory] = useState([]);

  useEffect(() => {
    adminApi
      .get(`/api/admin/students/${studentId}`)
      .then((res) => {
        setStudent(res.data.student);
        setTickets(res.data.tickets);
        setAttendance(res.data.attendance);
        setBreakHistory(res.data.breakHistory);
      })
      .catch((err) => console.log(err));
  }, [studentId]);

  const backButton = (
    <Button
      variant="secondary"
      icon={ArrowLeft}
      onClick={() => navigate("/admin/students")}
    >
      Back to Students
    </Button>
  );

  const ticketColumns = [
    {
      key: "day",
      label: "Day",
      render: (ticket) => <span className="font-medium text-navy">Day {ticket.dayNumber}</span>,
    },
    { key: "ticket", label: "Ticket", render: (t) => t.ticketNumber },
    { key: "seat", label: "Seat", render: (t) => t.seatNumber || "-" },
    {
      key: "status",
      label: "Status",
      render: (ticket) => <StatusBadge status={ticket.status} />,
    },
    {
      key: "attendance",
      label: "Attendance",
      render: (ticket) => (
        <StatusBadge status={ticket.attendance ? "Present" : "Absent"} />
      ),
    },
  ];

  const attendanceColumns = [
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
      render: (item) => <span className="text-slate-500">{formatDateTime(item.attendanceTime)}</span>,
    },
  ];

  const breakColumns = [
    {
      key: "breakOut",
      label: "Break Out",
      render: (item) => <span className="text-slate-500">{formatDateTime(item.breakOutTime)}</span>,
    },
    {
      key: "return",
      label: "Return",
      render: (item) => <span className="text-slate-500">{formatDateTime(item.returnTime)}</span>,
    },
    {
      key: "duration",
      label: "Duration",
      render: (item) =>
        item.returnTime ? (
          <span className="font-medium text-navy">
            {Math.floor(item.totalMinutes / 60)} hr {item.totalMinutes % 60} min
          </span>
        ) : (
          <span className="font-semibold text-rose-600">Still Outside</span>
        ),
    },
  ];

  if (!student) {
    return (
      <AdminLayout>
        <PageHeader
          icon={User}
          title="Student Details"
          description="Loading student information..."
          actions={backButton}
        />

        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sm:p-6">
          <div className="flex items-center gap-4 mb-6">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <PageHeader
        icon={User}
        title="Student Details"
        description={student.fullName}
        actions={backButton}
      />

      {/* Personal Information */}
      <SectionCard
        icon={User}
        title="Personal Information"
        description="Participant registration profile"
        className="mb-6"
      >
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-6">
          <Avatar name={student.fullName} size={64} />

          <div className="min-w-0">
            <h2 className="text-xl font-bold text-navy truncate">
              {student.fullName}
            </h2>

            <p className="text-sm text-slate-500 mt-0.5">
              {[student.college, student.branch].filter(Boolean).join(" • ")}
            </p>

            <div className="flex flex-wrap items-center gap-2 mt-2">
              <StatusBadge status={student.status} />
              <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 text-emerald-700 px-3 py-1 text-xs font-semibold">
                <Laptop size={13} />
                {student.laptop ? "Has Laptop" : "No Laptop"}
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-5 pt-5 border-t border-slate-100">
          <InfoField label="Full Name" value={student.fullName} />
          <InfoField label="Email" value={student.email} />
          <InfoField label="Mobile" value={student.mobile} />
          <InfoField label="College" value={student.college} />
          <InfoField label="Branch" value={student.branch} />
          <InfoField label="Year" value={student.year} />
        </div>
      </SectionCard>

      {/* Workshop Tickets */}
      <SectionCard
        icon={Ticket}
        title="Workshop Tickets"
        description="Issued tickets for each workshop day"
        className="mb-6"
      >
        <DataTable columns={ticketColumns} data={tickets} minWidth={700} />
      </SectionCard>

      {/* Attendance History */}
      <SectionCard
        icon={CalendarCheck}
        title="Attendance History"
        description="Marked attendance across all days"
        className="mb-6"
      >
        <DataTable
          columns={attendanceColumns}
          data={attendance}
          minWidth={600}
          emptyState={
            <div className="text-center py-12 text-sm text-slate-400">
              No attendance records found for this student.
            </div>
          }
        />
      </SectionCard>

      {/* Break History */}
      <SectionCard
        icon={Coffee}
        title="Break History"
        description="Break logs recorded during sessions"
      >
        <DataTable
          columns={breakColumns}
          data={breakHistory}
          minWidth={700}
          emptyState={
            <div className="text-center py-12 text-sm text-slate-400">
              No break records found for this student.
            </div>
          }
        />
      </SectionCard>
    </AdminLayout>
  );
};

export default AdminStudentDetails;