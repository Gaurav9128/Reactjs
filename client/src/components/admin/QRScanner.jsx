import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import Swal from "sweetalert2";
import adminApi from "../../utils/adminApi";
import { Camera } from "lucide-react";
import { SectionCard, StatusBadge } from "../ui";

const QRScanner = ({ setResult, scanType }) => {
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

  const handleTimeoutAction = async (ticketNumber, action) => {
    try {
      const res = await adminApi.post(
        "/api/admin/tickets/return-timeout",
        { ticketNumber, action }
      );

      if (res.data.success) {
        Swal.fire({
          icon: "success",
          title: action === "ALLOW" ? "Tickets Re-enabled" : "Tickets Cancelled",
          text: res.data.message,
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
  };

  useEffect(() => {
    let isMounted = true;

    const startScanner = async () => {
      try {
        // Wait until DOM is fully rendered
        await new Promise((resolve) => setTimeout(resolve, 300));

        if (!isMounted) return;

        const reader = document.getElementById("reader");

        if (!reader) {
          console.log("Reader element not found.");
          return;
        }

        // Remove old scanner UI if exists
        reader.innerHTML = "";

        const html5QrCode = new Html5Qrcode("reader");
        scannerRef.current = html5QrCode;

        const cameras = await Html5Qrcode.getCameras();

        if (!cameras || cameras.length === 0) {
          Swal.fire({
            icon: "error",
            title: "Camera Not Found",
            text: "No camera detected.",
          });
          return;
        }

        const cameraId =
          cameras.length > 1
            ? cameras[cameras.length - 1].id
            : cameras[0].id;

        await html5QrCode.start(
          cameraId,
          {
            fps: 10,
            qrbox: {
              width: 260,
              height: 260,
            },
            aspectRatio: 1,
          },

          async (decodedText) => {
            if (isScanning.current) return;
            
            isScanning.current = true;

            try {
              let ticketNumber = decodedText;

              // Support JSON QR
              try {
                const qr = JSON.parse(decodedText);
                if (qr.ticketNumber) {
                  ticketNumber = qr.ticketNumber;
                }
              } catch {
                // ignore plain ticket-number QR codes
              }

              const res = await adminApi.post(
                "/api/attendance/scan",
                {
                  ticketNumber,
                  type: scanType,
                }
              );

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
                  confirmButtonText: "✅ Allow",
                  denyButtonText: "❌ Cancel",
                  focusDeny: false,
                });

                if (result.isConfirmed) {
                  await handleTimeoutAction(ticketNumber, "ALLOW");
                } else {
                  await handleTimeoutAction(ticketNumber, "CANCEL");
                }
              } else {
                Swal.fire({
                  icon: "success",
                  title: res.data.action || "Success",
                  text: res.data.message,
                  timer: 1200,
                  showConfirmButton: false,
                });
              }

            } catch (err) {

              Swal.fire({
                icon: "error",
                title: "Scan Failed",
                text:
                  err.response?.data?.message ||
                  "Something went wrong",
                timer: 1500,
                showConfirmButton: false,
              });

            } finally {

              setTimeout(() => {
                isScanning.current = false;
              }, 1500);

            }
          },

          () => {
            // Ignore scan failure callback
          }
        );
      } catch (err) {
        console.error(err);

        Swal.fire({
          icon: "error",
          title: "Camera Error",
          text: "Unable to start camera.",
        });
      }
    };

    startScanner();

    return () => {
      isMounted = false;

      if (scannerRef.current) {
        scannerRef.current
          .stop()
          .then(() => {
            scannerRef.current.clear();
          })
          .catch(() => {
            // Ignore cleanup errors
          });
      }
    };
  }, [scanType, setResult]);

  return (
    <SectionCard
      icon={Camera}
      title="Live QR Scanner"
      description="Show the student's QR code in front of the camera"
      bodyClassName="flex flex-col items-center"
    >
      <div
        id="reader"
        className="w-full h-[360px] overflow-hidden rounded-2xl border-2 border-blue-200"
      />

      <div className="mt-5">
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
      </div>
    </SectionCard>
  );
};

export default QRScanner;