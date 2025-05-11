import React, { useEffect, useRef } from "react";
import { Html5Qrcode } from "html5-qrcode";

const Html5QrScanner = ({ onScanSuccess }) => {
  const qrCodeScannerRef = useRef(null);
  const isScannerRunning = useRef(false);

  useEffect(() => {
    const qrRegionId = "qr-reader";
    const html5QrCode = new Html5Qrcode(qrRegionId);
    qrCodeScannerRef.current = html5QrCode;

    html5QrCode
      .start(
        { facingMode: "environment" },
        { fps: 10, qrbox: 250 },
        (decodedText) => {
          if (!isScannerRunning.current) return;
          onScanSuccess(decodedText);
          isScannerRunning.current = false;
          html5QrCode.stop().then(() => html5QrCode.clear()).catch(console.warn);
        },
        (errorMessage) => {
          // Optional: console.warn("QR error", errorMessage);
        }
      )
      .then(() => {
        isScannerRunning.current = true;
      })
      .catch((err) => {
        console.error("Failed to start QR scanner", err);
      });

    return () => {
      if (qrCodeScannerRef.current && isScannerRunning.current) {
        qrCodeScannerRef.current
          .stop()
          .then(() => qrCodeScannerRef.current.clear())
          .catch((err) => {
            // Handle gracefully instead of crashing
            console.warn("Error stopping scanner on unmount", err);
          });
      }
    };
  }, [onScanSuccess]);

  return <div id="qr-reader" className="w-full" />;
};

export default Html5QrScanner;
