import React from "react";
import Layout from "../Layouts/Layout";
import { FaUserGraduate, FaChalkboardTeacher, FaCalendarCheck } from "react-icons/fa";

const Dashboard = ({ totalStudents, totalTeachers, attendancePercentage, recentAttendance, subjectsToday }) => {

  return (
    <div className="pt-10 px-6 md:px-20 bg-gray-100 min-h-screen">
      {/* Welcome */}
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-primary mb-1">Welcome to Absen Muha Dashboard</h1>
        <p className="text-gray-600">Overview of today's attendance and school stats.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-primary flex items-center gap-4">
          <FaUserGraduate className="text-primary text-3xl" />
          <div>
            <h2 className="text-2xl font-semibold">{totalStudents}</h2>
            <p className="text-sm text-gray-600">Total Students</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-secondary flex items-center gap-4">
          <FaChalkboardTeacher className="text-secondary text-3xl" />
          <div>
            <h2 className="text-2xl font-semibold">{totalTeachers}</h2>
            <p className="text-sm text-gray-600">Total Teachers</p>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow border-l-4 border-accent flex items-center gap-4">
          <FaCalendarCheck className="text-accent text-3xl" />
          <div>
            <h2 className="text-2xl font-semibold">{attendancePercentage}%</h2>
            <p className="text-sm text-gray-600">Today’s Attendance</p>
          </div>
        </div>
      </div>
      <div className="flex h-64  w-full items-center justify-center relative">
          <img src="/assets/images/logo.png" alt="logo" className="h-full opacity-20 absolute" />
          <div className="w-full mt-4">
            <h2 className="text-xl font-semibold mb-2">Today’s Subjects</h2>
            {subjectsToday.length > 0 ? (
              <table className="min-w-full bg-white rounded shadow overflow-hidden">
                <thead className="bg-primary text-white">
                  <tr>
                    <th className="text-left py-2 px-4">Subject</th>
                    <th className="text-left py-2 px-4">Teacher</th>
                    <th className="text-left py-2 px-4">Class</th>
                    <th className="text-left py-2 px-4">Schedule</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectsToday.map((subject, index) => (
                    <tr key={index} className="border-b hover:bg-gray-50">
                      <td className="py-2 px-4">{subject.name}</td>
                      <td className="py-2 px-4">{subject.teacher?.name ?? '—'}</td>
                      <td className="py-2 px-4">{subject.class?.name ?? '—'}</td>
                      <td className="py-2 px-4">{subject.schedule}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            ) : (
              <p className="text-gray-600">No subjects scheduled for today.</p>
            )}
          </div>

      </div>
  

    </div>
  );
};

Dashboard.layout = (page) => <Layout>{page}</Layout>;
export default Dashboard;
