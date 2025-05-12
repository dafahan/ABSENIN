import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Layout from "../Layouts/Layout";
import Select from 'react-select';
import QRCode from "react-qr-code";


const Attendance = () => {
  const [attendances, setAttendances] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [reason, setReason] = useState("");
  const [selectedSubjectName, setSelectedSubjectName] = useState(null);
  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const today = new Date().toISOString().split("T")[0]; // "YYYY-MM-DD"
  const [date, setDate] = useState(today);
  const [status, setStatus] = useState("Present");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);
  const subjectOptions = subjects.map((s) => ({
    value: s.id,
    label: `${s.name} - ${s.class.name}`,
  }));
  const [qrToken, setQrToken] = useState(null);

  useEffect(() => {
    fetchSubjects();
  }, []);

  useEffect(() => {
    let interval;
  
    const fetchQr = async () => {
      const res = await axios.post("/api/attendance/qr", {
        subject_id: selectedSubject || null,
      });
      setQrToken(res.data.token);
    };
  
    if (isQrModalOpen) {
      fetchQr();
      interval = setInterval(fetchQr, 15000);
    }
  
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isQrModalOpen, selectedSubject]);
  

  const fetchAttendances = async () => {

    const res = await axios.get("/api/attendance", {
      params: {
        date,
        subject: selectedSubject,
      },
    });
    if (selectedSubject !== "") {
      const subject = subjects.find((s) => s.id === selectedSubject);
      if(subject){
      setSelectedSubjectName( `${subject.name} - ${subject.class.name}`);
      }
    }else{
      setSelectedSubjectName(null);
    }
    setAttendances(res.data);
  };

  useEffect(() => {
    fetchAttendances();

  }, [date,selectedSubject]);
  

  const handleExportCSV = () => {
    const headers = ["No", "Student", "Subject", "Status", "Reason", "Date"];
    const rows = attendances.map((a, index) => [
      index + 1,
      a.student_name,
      selectedSubjectName || "Daily Attendance",
      a.status || "Absent",
      a.reason || "",
      date,
    ]);
  
    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers, ...rows].map((e) => e.map(field => `"${field}"`).join(",")).join("\n");
  
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `attendance_${date}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const fetchSubjects = async () => {
    const res = await axios.get("/api/subject");
    setSubjects(res.data);
  };

  const openModal = (item = null) => {
    if (item) {
      setEditingId(item.id);
      setStudentName(item.student_name);
      setStudentId(item.student_id);
      setStatus(item.status);
      setSelectedSubject(item.subject_id || "");
      setReason(item.reason || "");
  
      // Set selectedSubjectName directly
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const resetForm = () => {
    setStudentName("");
    setStudentId(null);
    setStatus("Present");
    setEditingId(null);
  };

  const closeQr = () =>{
    setIsQrModalOpen(false);
    fetchAttendances();
  }

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      student_name: studentName,
      student_id:studentId,
      date:date,
      status,
      reason,
      subject_id: selectedSubject || null,
    };
    try {
      
        await axios.put(`/attendance/${editingId}`, payload);
        Swal.fire("Updated!", "Attendance updated successfully.", "success");
     
      closeModal();
      
      fetchAttendances();

    } catch (err) {
      Swal.fire("Error", "Failed to save attendance.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Delete attendance?",
      showCancelButton: true,
      confirmButtonText: "Delete",
    });
    if (result.isConfirmed) {
      await axios.delete(`/attendance/${id}`);
      Swal.fire("Deleted", "Attendance deleted", "success");
      fetchAttendances();
    }
  };

  return (
    <div className="pt-10 px-6 md:px-20 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-primary">Attendance Management</h1>


      <div className="flex justify-between items-center mb-4">
        <div className="space-x-2 flex">
            <Select
            className="w-full border-black w-[300px]"
            options={subjectOptions}
            value={subjectOptions.find((opt) => opt.value === selectedSubject)}
            onChange={(selected) => setSelectedSubject(selected?.value || "")}
            isClearable
            placeholder="Select Subject..."
            />
          <input
            type="date"
            className="border p-2 rounded"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            />

        </div>
        <div className="flex gap-2">
          <button
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
            onClick={handleExportCSV}
          >
            Export
          </button>
            <button
              className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
              onClick={() => setIsQrModalOpen(true)}
            >
              Show QR
            </button>
        </div>
      </div>

      <div className="bg-white shadow rounded p-4">
        <table className="w-full text-left border">
          <thead className="bg-secondary text-white">
            <tr>
              <th className="p-2">#</th>
              <th className="p-2">Student</th>
              <th className="p-2">Subject</th>
              <th className="p-2">Status</th>
              <th className="p-2">Reason</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {attendances.length > 0 ? (
              attendances
                .map((a,index) => (
                  <tr key={a.id || `${a.student_id}-${a.subject_id || 'daily'}-${index}`}>
                    <td className="p-2">{index+1}</td>
                    <td className="p-2">{a.student_name}</td>
                    <td className="p-2">
                      {(selectedSubjectName!=null)? selectedSubjectName: "Daily Attendance"}
                    </td>
                    <td className="p-2">{(a.status)? a.status : 'Absent'}</td>
                    <td className="p-2">{a.reason}</td>
                    <td className="p-2 space-x-2">
                      <button
                        onClick={() => openModal(a)}
                        className="text-blue-600 hover:underline"
                      >
                        Edit
                      </button>
                      {/* <button
                        onClick={() => handleDelete(a.id)}
                        className="text-red-600 hover:underline"
                      >
                        Delete
                      </button> */}
                    </td>
                  </tr>
                ))
            ) : (
              <tr>
                <td colSpan={4} className="text-center py-4 text-gray-500">
                  No attendance records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {isQrModalOpen && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded shadow-md text-center">
              <h2 className="text-lg font-bold mb-4">QR Code</h2>
              {qrToken && <QRCode value={qrToken} size={256} />}
              <p className="text-sm text-gray-500 mt-2">Scan within 15 seconds</p>
              <button
                onClick={() => closeQr()}
                className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-hover"
              >
                Close
              </button>
            </div>
          </div>
        )}

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded w-full max-w-md">
            <h2 className="text-lg font-bold mb-4">
              { "Edit Attendance"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Student name"
                className="border p-2 rounded w-full"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                readOnly
              />
              <input
                type="text"
                placeholder="Reason (optional)"
                className="border p-2 rounded w-full"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />

              <select
                className="border p-2 rounded w-full"
                value={(status)?status:'Absent'}
                onChange={(e) => setStatus(e.target.value)}
              >
                <option value="Present">Present</option>
                <option value="Absent">Absent</option>
                <option value="Late">Late</option>
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  className="bg-gray-300 px-4 py-2 rounded"
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded"
                >
                  {editingId ? "Update" : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Attendance.layout = (page) => <Layout>{page}</Layout>;
export default Attendance;
