import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import {
  Users,
  Building2,
  GraduationCap,
  Search,
  Mail,
  Eye,
  X,
} from "lucide-react";
import adminApi from "../utils/adminApi";
import {
  AdminLayout,
  PageHeader,
  StatCard,
  DataTable,
  Avatar,
  StatusBadge,
  EmptyState,
  Button,
} from "../components/ui";

const AdminStudents = () => {
  const [students, setStudents] = useState([]);
  const [search, setSearch] = useState("");
  const [sendingAll, setSendingAll] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const fetchStudents = async (query = "") => {
    try {
      const res = await adminApi.get(
        `/api/admin/students/search?query=${query}`
      );

      return res.data.students;
    } catch (err) {
      console.log(err);
      return null;
    }
  };

  const loadStudents = async (query = "") => {
    setLoading(true);

    const result = await fetchStudents(query);
    setStudents(result || []);
    setLoading(false);
  };

  useEffect(() => {
    fetchStudents("").then((result) => {
      if (result) {
        setStudents(result);
        setLoading(false);
      }
    });
  }, []);

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

  const totalColleges = new Set(
    students.map((s) => s.college).filter(Boolean)
  ).size;

  const totalBranches = new Set(
    students.map((s) => s.branch).filter(Boolean)
  ).size;

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (student) => (
        <div className="flex items-center gap-3">
          <Avatar name={student.fullName} size={34} />
          <span className="font-medium text-navy whitespace-nowrap">
            {student.fullName}
          </span>
        </div>
      ),
    },
    {
      key: "email",
      label: "Email",
      render: (student) => (
        <span className="text-slate-500">{student.email}</span>
      ),
    },
    { key: "mobile", label: "Mobile", render: (s) => s.mobile },
    { key: "college", label: "College", render: (s) => s.college },
    { key: "branch", label: "Branch", render: (s) => s.branch },
    {
      key: "status",
      label: "Status",
      render: (student) => <StatusBadge status={student.status} />,
    },
    {
      key: "actions",
      label: "Action",
      className: "text-center",
      render: (student) => (
        <Button
          variant="secondary"
          size="sm"
          icon={Eye}
          onClick={() => navigate(`/admin/students/${student._id}`)}
        >
          View
        </Button>
      ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        icon={Users}
        title="Student Management"
        description="Search and manage workshop students"
        actions={
          <Button
            icon={Mail}
            loading={sendingAll}
            onClick={handleBulkSendTickets}
          >
            Send All Tickets
          </Button>
        }
      />

      {/* Student Statistics */}
      <section className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-5 mb-6">
        <StatCard
          icon={Users}
          label="Total Students"
          value={students.length}
          supporting="Registered participants"
        />

        <StatCard
          icon={Building2}
          label="Colleges"
          value={totalColleges}
          supporting="Participating institutions"
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />

        <StatCard
          icon={GraduationCap}
          label="Branches"
          value={totalBranches}
          supporting="Academic streams covered"
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
        />
      </section>

      {/* Search / Filter Area */}
      <div className="mb-6">
        <div className="flex items-center gap-2.5 bg-white border border-slate-200 rounded-xl px-4 focus-within:ring-2 focus-within:ring-blue-200 focus-within:border-blue-300 transition-all">
          <Search size={18} className="text-slate-400 shrink-0" />

          <input
            type="text"
            placeholder="Search students by name, email, mobile, college or branch..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              loadStudents(e.target.value);
            }}
            className="w-full py-3 bg-transparent text-sm focus:outline-none placeholder:text-slate-400"
          />

          {search && (
            <button
              onClick={() => {
                setSearch("");
                loadStudents("");
              }}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition"
            >
              <X size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Students Table */}
      <DataTable
        columns={columns}
        data={students}
        loading={loading}
        minWidth={1000}
        emptyState={
          <EmptyState
            icon={Users}
            title="No Students Found"
            description="Students who register for the workshop will appear here. Try a different search."
          />
        }
      />
    </AdminLayout>
  );
};

export default AdminStudents;