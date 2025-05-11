import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Html5QrScanner from "../Components/Html5QrScanner";
import Layout from "../Layouts/Layout"; // Optional if you're using a layout system

const ScanAttendance = () => {


  const markAttendance = async (token) => {
    setLoading(true);
    try {
      const res = await axios.post("/api/attendance/scan", { token });
      Swal.fire("Success", res.data.message || "Attendance marked.", "success");
    } catch (err) {
      Swal.fire("Error", err.response?.data?.error || "Failed to mark attendance", "error");
    } finally {
      setLoading(false);
      setScannedToken("");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow rounded p-6 max-w-md w-full">
        <h1 className="text-2xl font-bold text-primary mb-4 text-center">
          Scan QR to Mark Attendance
        </h1>

        <div className="border rounded overflow-hidden">
        <Html5QrScanner onScanSuccess={(text) => markAttendance(text)} />
        </div>

        <p className="text-sm text-center mt-4 text-gray-600">
          Point your camera at the QR code
        </p>
      </div>
    </div>
  );
};

ScanAttendance.layout = (page) => <Layout>{page}</Layout>;
export default ScanAttendance;
