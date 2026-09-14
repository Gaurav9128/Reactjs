import { useEffect, useState } from "react";
import { Ticket, Search } from "lucide-react";
import adminApi from "../utils/adminApi";
import {
  AdminLayout,
  PageHeader,
  DataTable,
  Avatar,
  StatusBadge,
  EmptyState,
} from "../components/ui";

const AdminTicketReport = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchTickets = async () => {
    try {
      const res = await adminApi.get("/api/report/tickets");
      return res.data.tickets || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  useEffect(() => {
    fetchTickets().then((result) => {
      setTickets(result);
      setLoading(false);
    });
  }, []);

  const filtered = tickets.filter((item) =>
    item.studentId?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (item) => (
        <div className="flex items-center gap-3">
          <Avatar name={item.studentId?.fullName} size={34} />
          <span className="font-medium text-navy whitespace-nowrap">
            {item.studentId?.fullName}
          </span>
        </div>
      ),
    },
    { key: "ticketNumber", label: "Ticket", render: (t) => t.ticketNumber },
    {
      key: "day",
      label: "Day",
      render: (item) => <span className="font-medium text-navy">Day {item.dayNumber}</span>,
    },
    { key: "seatNumber", label: "Seat", render: (t) => t.seatNumber || "-" },
    {
      key: "attendance",
      label: "Attendance",
      render: (item) => (
        <StatusBadge status={item.attendance ? "Present" : "Absent"} />
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (item) => <StatusBadge status={item.status} />,
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        icon={Ticket}
        title="Ticket Report"
        description="Generated workshop tickets overview"
      />

      <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 mb-6 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300 transition-all">
        <Search size={18} className="text-slate-400 shrink-0" />

        <input
          type="text"
          placeholder="Search student..."
          className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <DataTable
        columns={columns}
        data={filtered}
        loading={loading}
        minWidth={900}
        emptyState={
          <EmptyState
            icon={Ticket}
            title="No Tickets Found"
            description="Generated tickets will appear here once students are enrolled."
          />
        }
      />
    </AdminLayout>
  );
};

export default AdminTicketReport;