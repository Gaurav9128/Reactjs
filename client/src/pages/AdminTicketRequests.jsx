import { useEffect, useState } from "react";
import { Ticket, Check, X } from "lucide-react";
import adminApi from "../utils/adminApi";
import Swal from "sweetalert2";
import {
  AdminLayout,
  PageHeader,
  DataTable,
  Avatar,
  StatusBadge,
  Button,
  EmptyState,
} from "../components/ui";

const AdminTicketRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    try {
      const res = await adminApi.get("/api/admin/ticket-requests");
      return res.data.requests || [];
    } catch (err) {
      console.log(err);
      return [];
    }
  };

  useEffect(() => {
    fetchRequests().then((result) => {
      setRequests(result);
      setLoading(false);
    });
  }, []);

  const handleApprove = async (requestId) => {
    try {
      const res = await adminApi.post("/api/admin/tickets/approve-request", {
        requestId,
      });

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: "Approved",
          text: res.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
        fetchRequests().then(setRequests);
      }
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Failed",
        text: err.response?.data?.message || "Something went wrong",
      });
    }
  };

  const handleReject = async (requestId) => {
    const result = await Swal.fire({
      title: "Reject Request",
      text: "Are you sure you want to reject this re-enable request?",
      input: "textarea",
      inputLabel: "Optional note",
      inputPlaceholder: "Add a note for the student (optional)",
      showDenyButton: true,
      confirmButtonText: "Reject",
      denyButtonText: "Cancel",
    });

    if (result.isConfirmed) {
      try {
        const res = await adminApi.post("/api/admin/tickets/reject-request", {
          requestId,
          adminNote: result.value || "",
        });

        if (res.data.success) {
          Swal.fire({
            icon: "success",
            title: "Rejected",
            text: res.data.message,
            timer: 1500,
            showConfirmButton: false,
          });
          fetchRequests().then(setRequests);
        }
      } catch (err) {
        Swal.fire({
          icon: "error",
          title: "Failed",
          text: err.response?.data?.message || "Something went wrong",
        });
      }
    }
  };

  const columns = [
    {
      key: "student",
      label: "Student",
      render: (req) => (
        <div className="flex items-center gap-3">
          <Avatar name={req.studentId?.fullName} size={34} />
          <div className="min-w-0">
            <div className="font-medium text-navy whitespace-nowrap">
              {req.studentId?.fullName}
            </div>
            <div className="text-xs text-slate-400 whitespace-nowrap">
              {req.studentId?.email}
            </div>
          </div>
        </div>
      ),
    },
    {
      key: "ticket",
      label: "Ticket",
      render: (req) => req.ticketId?.ticketNumber || "-",
    },
    {
      key: "day",
      label: "Day",
      render: (req) => (
        <span className="font-medium text-navy">Day {req.ticketId?.dayNumber}</span>
      ),
    },
    {
      key: "reason",
      label: "Reason",
      className: "max-w-[240px]",
      render: (req) => (
        <span className="text-slate-500 block max-w-[240px] truncate">
          {req.reason || "-"}
        </span>
      ),
    },
    {
      key: "status",
      label: "Status",
      render: (req) => <StatusBadge status={req.status} />,
    },
    {
      key: "date",
      label: "Date",
      render: (req) => (
        <span className="text-slate-500">
          {new Date(req.createdAt).toLocaleDateString()}
        </span>
      ),
    },
    {
      key: "actions",
      label: "Action",
      className: "text-center",
      render: (req) =>
        req.status === "PENDING" ? (
          <div className="flex justify-center gap-2">
            <Button
              variant="success"
              size="sm"
              icon={Check}
              onClick={() => handleApprove(req._id)}
            >
              Approve
            </Button>

            <Button
              variant="danger"
              size="sm"
              icon={X}
              onClick={() => handleReject(req._id)}
            >
              Reject
            </Button>
          </div>
        ) : (
          <span className="text-slate-300 text-xs">—</span>
        ),
    },
  ];

  return (
    <AdminLayout>
      <PageHeader
        icon={Ticket}
        title="Ticket Re-enable Requests"
        description="Review and respond to ticket re-enable requests"
      />

      <DataTable
        columns={columns}
        data={requests}
        loading={loading}
        minWidth={1000}
        emptyState={
          <EmptyState
            icon={Ticket}
            title="No Requests Found"
            description="Ticket re-enable requests from students will appear here."
          />
        }
      />
    </AdminLayout>
  );
};

export default AdminTicketRequests;