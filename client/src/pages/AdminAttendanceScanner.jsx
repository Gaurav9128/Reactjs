import { useState } from "react";

import Sidebar from "../components/admin/Sidebar";
import ScannerForm from "../components/admin/ScannerForm";
import QRScanner from "../components/admin/QRScanner";
import ScanResult from "../components/admin/ScanResult";
import RecentScans from "../components/admin/RecentScans";
import LiveStats from "../components/admin/LiveStats";

const AdminAttendanceScanner = () => {

  const [result, setResult] = useState(null);

  // QR / Manual
  const [mode, setMode] = useState("QR");

  // ENTRY / BREAK_OUT / RETURN
  const [scanType, setScanType] = useState("ENTRY");

  return (

    <div className="flex min-h-screen bg-gray-100 overflow-x-hidden">

      <Sidebar />

      <div className="w-full lg:ml-72 flex-1 pt-20 lg:pt-8 p-4 sm:p-6 lg:p-8">

        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold mb-8">
          Attendance Scanner
        </h1>

        <LiveStats />

        {/* Top Controls */}

        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-8">

          {/* Scanner Type */}

          <div className="flex flex-col sm:flex-row gap-3 w-full lg:w-auto">

            <button
              onClick={() => setMode("QR")}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition ${
                mode === "QR"
                  ? "bg-blue-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              📷 QR Scanner
            </button>

            <button
              onClick={() => setMode("MANUAL")}
              className={`w-full sm:w-auto px-6 py-3 rounded-xl font-semibold transition ${
                mode === "MANUAL"
                  ? "bg-green-600 text-white"
                  : "bg-white border hover:bg-gray-100"
              }`}
            >
              ⌨ Manual Entry
            </button>

          </div>

          {/* Attendance Mode */}

          <select
            value={scanType}
            onChange={(e) => setScanType(e.target.value)}
            className="w-full lg:w-64 border rounded-xl px-5 py-3 bg-white font-semibold"
          >

            <option value="ENTRY">
              ✅ Entry
            </option>

            <option value="BREAK_OUT">
              🚶 Break Out
            </option>

            <option value="RETURN">
              ↩ Return
            </option>

          </select>

        </div>

        {/* Scanner */}

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {mode === "QR" ? (

            <QRScanner
              setResult={setResult}
              scanType={scanType}
            />

          ) : (

            <ScannerForm
              setResult={setResult}
              scanType={scanType}
            />

          )}

          <ScanResult result={result} />

        </div>

        {/* Recent Activity */}

        <div className="mt-10">

          <RecentScans />

        </div>

      </div>

    </div>

  );

};

export default AdminAttendanceScanner;