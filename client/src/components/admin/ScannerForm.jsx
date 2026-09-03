import { useState } from "react";
import axios from "axios";
import { Search, Loader2 } from "lucide-react";
import Swal from "sweetalert2";

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

      const res = await axios.post(
        `${import.meta.env.VITE_API_URL}/api/attendance/scan`,
        {
          ticketNumber: ticketNumber.trim(),
          type: scanType,
        }
      );

      setResult({
        success: true,
        type: scanType,
        data: res.data.ticket,
      });

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

      setTicketNumber("");

    } catch (err) {

      const message =
        err.response?.data?.message ||
        "Something went wrong";

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
    <div className="bg-white rounded-3xl shadow-xl p-8">

      <h2 className="text-2xl font-bold mb-2">
        🎫 Manual Attendance Scanner
      </h2>

      <p className="text-gray-500 mb-6">
        Current Mode :
        {" "}
        <span
          className={`font-semibold ${
            scanType === "ENTRY"
              ? "text-blue-600"
              : scanType === "BREAK_OUT"
              ? "text-orange-500"
              : "text-green-600"
          }`}
        >
          {scanType === "ENTRY"
            ? "✅ Entry"
            : scanType === "BREAK_OUT"
            ? "🚶 Break Out"
            : "↩ Return"}
        </span>
      </p>

      <form
        onSubmit={handleScan}
        className="space-y-6"
      >

        <div>

          <label className="block mb-2 font-medium text-gray-700">
            Ticket Number
          </label>

          <input
            type="text"
            value={ticketNumber}
            onChange={(e) =>
              setTicketNumber(e.target.value)
            }
            placeholder="RW-XXXXXXXXXXXX-1"
            className="w-full border rounded-xl px-4 py-3 focus:ring-2 focus:ring-blue-500 outline-none"
          />

        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full flex justify-center items-center gap-2 py-3 rounded-xl font-semibold text-white transition-all ${
            loading
              ? "bg-gray-500 cursor-not-allowed"
              : scanType === "ENTRY"
              ? "bg-blue-600 hover:bg-blue-700"
              : scanType === "BREAK_OUT"
              ? "bg-orange-500 hover:bg-orange-600"
              : "bg-green-600 hover:bg-green-700"
          }`}
        >

          {loading ? (
            <>
              <Loader2
                size={20}
                className="animate-spin"
              />
              Processing...
            </>
          ) : (
            <>
              <Search size={20} />

              {scanType === "ENTRY"
                ? "Mark Entry"
                : scanType === "BREAK_OUT"
                ? "Break Out"
                : "Return Student"}
            </>
          )}

        </button>

      </form>

    </div>
  );
};

export default ScannerForm;