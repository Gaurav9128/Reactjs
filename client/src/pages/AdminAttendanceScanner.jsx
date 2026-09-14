import { useState } from "react";
import { ScanLine, Camera, Keyboard } from "lucide-react";
import ScannerForm from "../components/admin/ScannerForm";
import QRScanner from "../components/admin/QRScanner";
import ScanResult from "../components/admin/ScanResult";
import RecentScans from "../components/admin/RecentScans";
import LiveStats from "../components/admin/LiveStats";
import { AdminLayout, PageHeader, Button, fieldControlClass } from "../components/ui";

const AdminAttendanceScanner = () => {
  const [result, setResult] = useState(null);
  const [mode, setMode] = useState("QR");
  const [scanType, setScanType] = useState("ENTRY");

  return (
    <AdminLayout>
      <PageHeader
        icon={ScanLine}
        title="Attendance Scanner"
        description="Scan QR codes or enter ticket numbers to mark attendance"
      />

      <LiveStats />

      {/* Controls */}
      <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-4 mb-6">
        <div className="flex gap-3 w-full lg:w-auto">
          <Button
            icon={Camera}
            variant={mode === "QR" ? "primary" : "secondary"}
            onClick={() => setMode("QR")}
            className="flex-1 sm:flex-none"
          >
            QR Scanner
          </Button>

          <Button
            icon={Keyboard}
            variant={mode === "MANUAL" ? "primary" : "secondary"}
            onClick={() => setMode("MANUAL")}
            className="flex-1 sm:flex-none"
          >
            Manual Entry
          </Button>
        </div>

        <select
          value={scanType}
          onChange={(e) => setScanType(e.target.value)}
          className={`${fieldControlClass} w-full lg:w-56`}
        >
          <option value="ENTRY">Entry</option>
          <option value="BREAK_OUT">Break Out</option>
          <option value="RETURN">Return</option>
        </select>
      </div>

      {/* Scanner Area */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {mode === "QR" ? (
          <QRScanner setResult={setResult} scanType={scanType} />
        ) : (
          <ScannerForm setResult={setResult} scanType={scanType} />
        )}

        <ScanResult result={result} />
      </div>

      {/* Recent Activity */}
      <div className="mt-8">
        <RecentScans />
      </div>
    </AdminLayout>
  );
};

export default AdminAttendanceScanner;