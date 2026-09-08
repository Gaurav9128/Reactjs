import { useEffect, useState } from "react";
import Sidebar from "../components/admin/Sidebar";
import adminApi from "../utils/adminApi";
import Swal from "sweetalert2";

const AdminTicketRequests = () => {
  const [requests, setRequests] = useState([]);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      const res = await adminApi.get("/api/admin/ticket-requests");
      setRequests(res.data.requests);
    } catch (err) {
      console.log(err);
    }
  };

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
        loadRequests();
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
          loadRequests();
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

  const statusBadge = (status) => {
    switch (status) {
      case "PENDING":
        return (
          <span className="px-3 py-1 rounded-full bg-yellow-100 text-yellow-700 text-xs font-semibold">
            PENDING
          </span>
        );
      case "APPROVED":
        return (
          <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-semibold">
            APPROVED
          </span>
        );
      case "REJECTED":
        return (
          <span className="px-3 py-1 rounded-full bg-red-100 text-red-700 text-xs font-semibold">
            REJECTED
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">
      <Sidebar />

      <div className="w-full lg:ml-72 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">
        <h1 className="text-2xl sm:text-3xl font-bold mb-8">
          Ticket Re-enable Requests
        </h1>

        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-[900px] w-full">
              <thead>
                <tr className="bg-blue-600 text-white">
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Ticket
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Day
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Reason
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Status
                  </th>
                  <th className="px-4 py-3 text-left whitespace-nowrap">
                    Date
                  </th>
                  <th className="px-4 py-3 text-center whitespace-nowrap">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody>
                {requests.length > 0 ? (
                  requests.map((req) => (
                    <tr
                      key={req._id}
                      className="border-b hover:bg-gray-50 transition"
                    >
                      <td className="px-4 py-3 whitespace-nowrap">
                        <div>
                          <div className="font-semibold">
                            {req.studentId?.fullName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {req.studentId?.email}
                          </div>
                        </div>
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {req.ticketId?.ticketNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        Day {req.ticketId?.dayNumber}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-600 max-w-[200px] truncate">
                        {req.reason || "-"}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap">
                        {statusBadge(req.status)}
                      </td>

                      <td className="px-4 py-3 whitespace-nowrap text-sm">
                        {new Date(req.createdAt).toLocaleDateString()}
                      </td>

                      <td className="px-4 py-3 text-center whitespace-nowrap">
                        {req.status === "PENDING" ? (
                          <div className="flex justify-center gap-2">
                            <button
                              onClick={() => handleApprove(req._id)}
                              className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(req._id)}
                              className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded-lg text-xs font-semibold transition"
                            >
                              Reject
                            </button>
                          </div>
                        ) : (
                          <span className="text-gray-400 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="7"
                      className="text-center py-10 text-gray-500"
                    >
                      No requests found
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

export default AdminTicketRequests;