import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Html5QrScanner from "../Components/Html5QrScanner";
import Layout from "../Layouts/Layout";

const ScanAttendance = () => {
  const [token, setToken] = useState(""); // ✅ manual debug token
  const [loading, setLoading] = useState(false);

  const markAttendance = async (token) => {
    alert("Submitting token: " + token); // ✅ debug alert
    setLoading(true);
    try {
      const res = await axios.post("/api/attendance/scan", { token });
      alert(res.data.message); // ✅ debug success
      Swal.fire("Success", res.data.message || "Attendance marked.", "success");
    } catch (err) {
      alert(err.response?.data?.error || err.message); // ✅ debug error
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

        {/* QR Scanner */}
        <div className="border rounded overflow-hidden">
          <Html5QrScanner onScanSuccess={(text) => markAttendance(text)} />
        </div>

        {/* ✅ Manual token input for debugging */}
        <div className="mt-6">
          <input
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
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Point your camera at the QR code or use the manual input above.
        </p>
      </div>
    </div>
  );
};

ScanAttendance.layout = (page) => <Layout>{page}</Layout>;
export default ScanAttendance;
