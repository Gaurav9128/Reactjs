import { useEffect, useState } from "react";
import { Coffee, Search } from "lucide-react";
import adminApi from "../utils/adminApi";
import {
  AdminLayout,
  PageHeader,
  DataTable,
  Avatar,
  StatusBadge,
  EmptyState,
} from "../components/ui";

const AdminBreakReport = () => {
  const [breaks, setBreaks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const fetchBreaks = async () => {
    try {
      const res = await adminApi.get("/api/report/break");
      return res.data.breaks || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  useEffect(() => {
    fetchBreaks().then((result) => {
      setBreaks(result);
      setLoading(false);
    });
  }, []);

  const filtered = breaks.filter((item) =>
    item.studentId?.fullName
      ?.toLowerCase()
      .includes(search.toLowerCase())
  );

  const formatDate = (value) =>
    value ? new Date(value).toLocaleString() : "-";

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
    {
      key: "college",
      label: "College",
      render: (item) => <span className="text-slate-500">{item.studentId?.college}</span>,
    },
    {
      key: "day",
      label: "Day",
      render: (item) => <span className="font-medium text-navy">Day {item.dayNumber}</span>,
    },
    {
      key: "breakOut",
      label: "Break Out",
      render: (item) => <span className="text-slate-500">{formatDate(item.breakOutTime)}</span>,
    },
    {
      key: "return",
      label: "Return",
      render: (item) => <span className="text-slate-500">{formatDate(item.returnTime)}</span>,
    },
    {
      key: "minutes",
      label: "Minutes",
      render: (item) => (
        <span className="font-medium text-navy">
          {item.totalMinutes ?? "-"}
        </span>
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
        icon={Coffee}
        title="Break Report"
        description="Student break history across all sessions"
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
        minWidth={1000}
        emptyState={
          <EmptyState
            icon={Coffee}
            title="No Break Records Found"
            description="Break records will appear here once students take breaks."
          />
        }
      />
    </AdminLayout>
  );
};

export default AdminBreakReport;