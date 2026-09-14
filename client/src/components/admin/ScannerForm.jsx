import { useState } from "react";
import { Keyboard } from "lucide-react";
import Swal from "sweetalert2";
import adminApi from "../../utils/adminApi";
import { SectionCard, Field, fieldControlClass, Button, StatusBadge } from "../ui";

const ScannerForm = ({ setResult, scanType }) => {
  const [ticketNumber, setTicketNumber] = useState("");
  const [loading, setLoading] = useState(false);

  const handleScan = async (e) => {
    e.preventDefault();

    if (!ticketNumber.trim()) {
      Swal.fire({
        icon: "warning",
        title: "Ticket Number Required",
        text: "Please enter a valid Ticket Number.",
      });
      return;
    }

    try {
      setLoading(true);

      const res = await adminApi.post("/api/attendance/scan", {
        ticketNumber: ticketNumber.trim(),
        type: scanType,
      });

      setResult({
        success: true,
        type: scanType,
        data: res.data.ticket,
      });

      if (res.data.action === "TIMEOUT" && scanType === "RETURN") {
        const result = await Swal.fire({
          icon: "warning",
          title: "Break Timed Out",
          text: `Student was out for ${res.data.totalMinutes} minutes. Allow return?`,
          showDenyButton: true,
          confirmButtonText: "Allow",
          denyButtonText: "Cancel",
          focusDeny: false,
        });

        const action = result.isConfirmed ? "ALLOW" : "CANCEL";

        try {
          const actionRes = await adminApi.post(
            "/api/admin/tickets/return-timeout",
            {
              ticketNumber: ticketNumber.trim(),
              action,
            }
          );

          if (actionRes.data.success) {
            Swal.fire({
              icon: "success",
              title:
                action === "ALLOW"
                  ? "Tickets Re-enabled"
                  : "Tickets Cancelled",
              text: actionRes.data.message,
              timer: 1500,
              showConfirmButton: false,
            });
          }
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Action Failed",
            text: err.response?.data?.message || "Something went wrong",
          });
        }
      } else {
        Swal.fire({
          icon: "success",
          title:
            scanType === "ENTRY"
              ? "Attendance Marked"
              : scanType === "BREAK_OUT"
              ? "Break Out Successful"
              : "Student Returned",
          text: res.data.message,
          timer: 1500,
          showConfirmButton: false,
        });
      }

      setTicketNumber("");
    } catch (err) {
      const message = err.response?.data?.message || "Something went wrong";

      setResult({
        success: false,
        message,
      });

      Swal.fire({
        icon: "error",
        title: "Scan Failed",
        text: message,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <SectionCard
      icon={Keyboard}
      title="Manual Attendance Scanner"
      description={
        <>
          Current Mode:{" "}
          <StatusBadge
            status={
              scanType === "ENTRY"
                ? "Entry"
                : scanType === "BREAK_OUT"
                ? "Break Out"
                : "Return"
            }
            tone={scanType === "ENTRY" ? "green" : scanType === "BREAK_OUT" ? "orange" : "blue"}
          />
        </>
      }
    >
      <form onSubmit={handleScan}>
        <Field label="Ticket Number" required className="mb-6">
          <input
            type="text"
            value={ticketNumber}
            onChange={(e) => setTicketNumber(e.target.value)}
            placeholder="RW-XXXXXXXXXXXX-1"
            className={fieldControlClass}
          />
        </Field>

        <Button
          type="submit"
          loading={loading}
          size="lg"
          className="w-full"
          variant={
            scanType === "ENTRY"
              ? "primary"
              : scanType === "BREAK_OUT"
              ? "danger"
              : "success"
          }
        >
          {scanType === "ENTRY"
            ? "Mark Entry"
            : scanType === "BREAK_OUT"
            ? "Break Out"
            : "Return Student"}
        </Button>
      </form>
    </SectionCard>
  );
};

export default ScannerForm;