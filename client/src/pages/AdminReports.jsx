import { useState } from "react";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import {
  FileText,
  Users,
  CalendarCheck,
  Coffee,
  Ticket,
  Eye,
  Download,
  FileSpreadsheet,
} from "lucide-react";
import downloadBlob from "../utils/downloadBlob";
import { AdminLayout, PageHeader, Button } from "../components/ui";

const reports = [
  {
    title: "Students Report",
    icon: Users,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    description: "Registered Students List",
    view: "/admin/students",
    exportUrl: "/api/export/students",
    filename: "students-report.xlsx",
  },
  {
    title: "Attendance Report",
    icon: CalendarCheck,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    description: "Day Wise Attendance",
    view: "/admin/attendance",
    exportUrl: "/api/export/attendance/all",
    filename: "attendance-all.xlsx",
  },
  {
    title: "Break Report",
    icon: Coffee,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    description: "Student Break History",
    view: "/admin/break-report",
    exportUrl: "/api/export/break",
    filename: "break-report.xlsx",
  },
  {
    title: "Ticket Report",
    icon: Ticket,
    iconBg: "bg-purple-50",
    iconColor: "text-purple-600",
    description: "Generated Workshop Tickets",
    view: "/admin/ticket-report",
    exportUrl: "/api/export/tickets",
    filename: "tickets-report.xlsx",
  },
];

const AdminReports = () => {
  const [downloading, setDownloading] = useState("");

  const handleExport = async (exportUrl, filename) => {
    try {
      setDownloading(filename);
      await downloadBlob(exportUrl, filename);
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Export Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    } finally {
      setDownloading("");
    }
  };

  return (
    <AdminLayout>
      <PageHeader
        icon={FileText}
        title="Reports"
        description="View and export workshop reports"
      />

      {/* Report Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5 lg:gap-6">
        {reports.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.filename}
              className="group bg-white rounded-2xl border border-slate-100 shadow-sm p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-300"
            >
              <div className="flex items-start justify-between gap-4">
                <div
                  className={`w-14 h-14 rounded-2xl ${item.iconBg} ${item.iconColor} flex items-center justify-center shrink-0`}
                >
                  <Icon size={26} strokeWidth={2} />
                </div>
              </div>

              <h2 className="text-xl font-bold text-navy mt-4">
                {item.title}
              </h2>

              <p className="text-sm text-slate-500 mt-1 mb-6">
                {item.description}
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <Link to={item.view} className="flex-1">
                  <Button
                    variant="secondary"
                    icon={Eye}
                    className="w-full"
                  >
                    View
                  </Button>
                </Link>

                <Button
                  icon={Download}
                  loading={downloading === item.filename}
                  onClick={() =>
                    handleExport(item.exportUrl, item.filename)
                  }
                  className="flex-1"
                >
                  Export
                </Button>
              </div>
            </div>
          );
        })}
      </section>

      {/* Complete Workshop Report */}
      <section
        className="mt-6 relative overflow-hidden bg-gradient-to-r from-[#101b4b] to-[#1e3a8a] rounded-2xl shadow-sm p-6 sm:p-8"
      >
        <div className="absolute -right-10 -top-14 w-56 h-56 rounded-full bg-white/10" />

        <div className="relative flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
          <div className="flex items-start gap-4">
            <div className="hidden sm:flex w-14 h-14 rounded-2xl bg-white/15 text-white items-center justify-center shrink-0">
              <FileSpreadsheet size={26} />
            </div>

            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-white">
                Complete Workshop Report
              </h2>

              <p className="text-sm text-blue-200 mt-1">
                Download the complete workshop attendance report
              </p>
            </div>
          </div>

          <button
            onClick={() =>
              handleExport(
                "/api/export/attendance/all",
                "workshop-complete.xlsx"
              )
            }
            disabled={downloading === "workshop-complete.xlsx"}
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-white text-[#101b4b] hover:bg-blue-50 font-semibold px-5 py-3 text-sm shadow-sm shadow-blue-900/20 shrink-0 transition-all duration-200 disabled:opacity-60"
          >
            {downloading === "workshop-complete.xlsx" ? (
              <FileSpreadsheet size={16} className="animate-pulse" />
            ) : (
              <Download size={16} strokeWidth={2.2} />
            )}
            Export Complete Report
          </button>
        </div>
      </section>
    </AdminLayout>
  );
};

export default AdminReports;