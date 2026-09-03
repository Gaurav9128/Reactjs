import { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";
import axios from "axios";
import Swal from "sweetalert2";

const QRScanner = ({ setResult, scanType }) => {
  const scannerRef = useRef(null);
  const isScanning = useRef(false);

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
              } catch {}

              const res = await axios.post(
                `${import.meta.env.VITE_API_URL}/api/attendance/scan`,
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

              Swal.fire({
                icon: "success",
                title: res.data.action || "Success",
                text: res.data.message,
                timer: 1200,
                showConfirmButton: false,
              });

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
    <div className="bg-white rounded-3xl shadow-xl p-6">

      <h2 className="text-2xl font-bold mb-5">
        📷 Live QR Scanner
      </h2>

      <div
        id="reader"
        className="w-full h-[360px] overflow-hidden rounded-2xl border-2 border-blue-500"
      />

      <div className="mt-5 text-center">

        <span className="inline-block bg-blue-100 text-blue-700 px-5 py-2 rounded-full font-medium">

          Current Mode :{" "}

          {scanType === "ENTRY"
            ? "✅ Entry"
            : scanType === "BREAK_OUT"
            ? "🚶 Break Out"
            : "↩ Return"}

        </span>

      </div>

      <p className="text-center text-gray-500 mt-4">
        Show the student's QR Code in front of the camera.
      </p>

    </div>
  );
};

export default QRScanner;