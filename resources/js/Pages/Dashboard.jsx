import React from "react";
import Layout from "../Layouts/Layout";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck } from "react-icons/fa";

const Dashboard = () => {
  return (
    <div className="pt-10 px-6 md:px-20 bg-gray-100 min-h-screen">
      {/* Welcome */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-1">Welcome to Absenin Dashboard</h1>
        <p className="text-gray-600">Overview of today's attendance and school stats.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-primary flex items-center gap-4">
          <FaUserGraduate className="text-primary text-3xl" />
          <div>
            <h2 className="text-2xl font-semibold">1,200</h2>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-secondary flex items-center gap-4">
          <FaChalkboardTeacher className="text-secondary text-3xl" />
          <div>
            <h2 className="text-2xl font-semibold">85</h2>
            <p className="text-sm text-gray-600">Total Teachers</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-accent flex items-center gap-4">
          <FaCalendarCheck className="text-accent text-3xl" />
          <div>
            <h2 className="text-2xl font-semibold">95%</h2>
            <p className="text-sm text-gray-600">Today’s Attendance</p>
          </div>
        </div>
      </div>

      {/* Recent Attendance Table */}
      <div className="bg-white rounded-xl shadow p-6">
        <h3 className="text-xl font-semibold text-primary mb-4">Recent Attendance</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left border border-gray-200">
            <thead className="bg-primary text-white">
              <tr>
                <th className="p-3">Name</th>
                <th className="p-3">Class</th>
                <th className="p-3">Status</th>
                <th className="p-3">Time</th>
              </tr>
            </thead>
            <tbody>
              {[
                { name: "Alice Johnson", class: "10-A", status: "Present", time: "07:45 AM" },
                { name: "Bob Smith", class: "11-B", status: "Absent", time: "-" },
                { name: "Carlos Diaz", class: "12-C", status: "Late", time: "08:10 AM" },
              ].map((student, idx) => (
                <tr key={idx} className="border-b">
                  <td className="p-3">{student.name}</td>
                  <td className="p-3">{student.class}</td>
                  <td className={`p-3 font-medium ${student.status === "Present" ? "text-accent" : student.status === "Late" ? "text-secondary" : "text-danger"}`}>
                    {student.status}
                  </td>
                  <td className="p-3">{student.time}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

Dashboard.layout = (page) => <Layout>{page}</Layout>;
export default Dashboard;
