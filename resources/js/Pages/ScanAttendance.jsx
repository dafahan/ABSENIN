import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Html5QrScanner from "../Components/Html5QrScanner";
import Layout from "../Layouts/Layout";

const ScanAttendance = () => {
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [showScanner, setShowScanner] = useState(false);

  const markAttendance = async (token) => {
    setLoading(true);
    const data = { token };

    try {
      const res = await axios.post("/api/attendance/scan", null, {
        params: data,
        headers: { "Content-Type": "application/json" },
      });

      Swal.fire("Success", res.data.message || "Attendance marked.", "success");
      setShowScanner(false); // ✅ close modal on success
      setToken(""); // Optional: reset manual input
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Failed to mark attendance", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow rounded p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-4 text-center">
          Scan QR to Mark Attendance
        </h1>

        {/* Open Scanner Modal Button */}
        <button
          onClick={() => setShowScanner(true)}
          className="bg-green-600 text-white px-4 py-2 rounded w-full mb-4"
        >
          Open QR Scanner
        </button>

        {/* Manual token input */}
        {/* <input
          type="text"
          placeholder="Enter token manually"
          value={token}
          onChange={(e) => setToken(e.target.value)}
          className="border p-2 rounded w-full mb-2"
        />
        <button
          onClick={() => markAttendance(token)}
          disabled={loading || !token}
          className="bg-primary text-white px-4 py-2 rounded w-full disabled:opacity-50"
        >
          {loading ? "Submitting..." : "Submit Token Manually"}
        </button>

        <p className="text-sm text-center mt-4 text-gray-600">
          You can scan a QR code or enter a token manually.
        </p> */}
      </div>

      {/* ✅ Modal with QR Scanner */}
      {showScanner && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-60 flex items-center justify-center">
          <div className="bg-white rounded-lg p-4 w-full max-w-md relative shadow-lg">
            <h2 className="text-lg font-semibold text-center mb-4">QR Scanner</h2>
            <Html5QrScanner
              onScanSuccess={(text) => markAttendance(text)}
            />
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
              onClick={() => setShowScanner(false)}
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

ScanAttendance.layout = (page) => <Layout>{page}</Layout>;
export default ScanAttendance;
