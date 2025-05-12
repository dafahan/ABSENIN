import React, { useEffect, useState, useRef } from "react";
import { usePage } from "@inertiajs/react";
import Layout from "../Layouts/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

const Subject = () => {
  const { teacher = [] } = usePage().props;
  const [subjects, setSubjects] = useState([]);
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState(teacher);

  const [search, setSearch] = useState("");
  

  const [name, setName] = useState("");
  const [schedule, setSchedule] = useState("");
  const [scheduleDay, setScheduleDay] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");

  const [classId, setClassId] = useState("");
  const [teacherId, setTeacherId] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetchSubjects();
    fetchClasses();
  }, []);

  const fetchSubjects = async () => {
    try {
      const response = await axios.get("/api/subject");
      setSubjects(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch subjects!", "error");
    }
  };

  const fetchClasses = async () => {
    const res = await axios.get("/api/classes");
    setClasses(res.data);
  };

  const openModal = (subject = null) => {
    if (subject) {
      setSchedule(subject.schedule || "");
      setEditingId(subject.id);
      setName(subject.name);
      setClassId(subject.class_id);
      setTeacherId(subject.teacher_id);
    } else {
      resetForm();
    }
    setIsModalOpen(true);
  };

  const closeModal = () => {
    resetForm();
    setIsModalOpen(false);
  };

  const resetForm = () => {
    setName("");
    setClassId("");
    setTeacherId("");
    setSchedule("");
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !classId || !teacherId) return;
    const fullSchedule = `${scheduleDay}, ${scheduleTime}`;

    try {
      if (editingId) {
        await axios.put(`/subject/${editingId}`, {
          name,
          class_id: classId,
          teacher_id: teacherId,
          schedule:fullSchedule,
        });
        Swal.fire("Updated!", "Subject updated successfully.", "success");
      } else {
        await axios.post("/subject", {
          name,
          class_id: classId,
          teacher_id: teacherId,
          schedule:fullSchedule
        });
        Swal.fire("Added!", "Subject added successfully.", "success");
      }
      closeModal();
      fetchSubjects();
    } catch (error) {
      Swal.fire("Error", "Failed to save subject.", "error");
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await axios.delete(`/subject/${id}`);
        Swal.fire("Deleted!", "Subject has been deleted.", "success");
        fetchSubjects();
      } catch (error) {
        Swal.fire("Error", "Failed to delete subject.", "error");
      }
    }
  };

  const globalFilterFunction = (rows, columnIds, filterValue) => {
    return rows.filter((row) =>
      row.values.name.toLowerCase().includes(filterValue.toLowerCase())||
        row.values.class_name.toLowerCase().includes(filterValue.toLowerCase())||
        row.values.teacher_name.toLowerCase().includes(filterValue.toLowerCase())

    );
  };

  const columns = React.useMemo(
    () => [
      { Header: "ID", accessor: "id" },
      { Header: "Name", accessor: "name" },
      {
        Header: "Class",
        accessor: (row) => row.class?.name || "-",
        id: "class_name",
      },
      {
        Header: "Schedule",
        accessor: "schedule",
      },
      {
        Header: "Teacher",
        accessor: (row) => row.teacher?.name || "-",
        id: "teacher_name",
      },
      {
        Header: "Actions",
        accessor: "actions",
        disableSortBy: true,
        Cell: ({ row }) => (
          <div className="space-x-4">
            <button
              onClick={() => openModal(row.original)}
              className="text-blue-600 hover:underline"
            >
              Edit
            </button>
            <button
              onClick={() => handleDelete(row.original.id)}
              className="text-red-600 hover:underline"
            >
              Delete
            </button>
          </div>
        ),
      },
    ],
    []
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    setGlobalFilter,
    state: { pageIndex, pageSize },
    gotoPage,
    previousPage,
    nextPage,
    canPreviousPage,
    canNextPage,
    pageOptions,
    setPageSize,
  } = useTable(
    {
      columns,
      data: subjects,
      globalFilter: globalFilterFunction,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setGlobalFilter(search);
  }, [search]);

  return (
    <div className="pt-10 px-6 md:px-20 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-primary">Subject Management</h1>

      <div className="mb-4 flex justify-between items-center">
        <input
          type="text"
          placeholder="Search by name"
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button
          onClick={() => openModal()}
          className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
        >
          Add Subject
        </button>
      </div>

      <div className="bg-white shadow rounded p-4">
        <table {...getTableProps()} className="min-w-full text-left border">
          <thead className="bg-secondary text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                {headerGroup.headers.map((column) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="px-4 py-2 cursor-pointer"
                  >
                    {column.render("Header")}
                    <span>
                      {column.isSorted
                        ? column.isSortedDesc
                          ? " 🔽"
                          : " 🔼"
                        : ""}
                    </span>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              const rowProps = row.getRowProps();
              return (
                <tr key={rowProps.key} {...row.getRowProps()} className="border-t">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
            {subjects.length === 0 && (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-500">
                  No subjects found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className="flex justify-between items-center mt-4">
          <div>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage}>{"<<"}</button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage}>{"<"}</button>
            <button onClick={() => nextPage()} disabled={!canNextPage}>{">"}</button>
            <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage}>{">>"}</button>
          </div>
          <span>
            Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>Show {size}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-lg">
            <h2 className="text-lg font-bold mb-4">
              {editingId ? "Edit Subject" : "Add Subject"}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Subject name"
                className="border p-2 rounded w-full"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex gap-2">
                {/* Day selector */}
                <select
                  value={scheduleDay}
                  onChange={(e) => setScheduleDay(e.target.value)}
                  className="border p-2 rounded w-1/2"
                >
                  <option value="">Select day</option>
                  <option value="Monday">Monday</option>
                  <option value="Tuesday">Tuesday</option>
                  <option value="Wednesday">Wednesday</option>
                  <option value="Thursday">Thursday</option>
                  <option value="Friday">Friday</option>
                  <option value="Saturday">Saturday</option>
                  <option value="Sunday">Sunday</option>
                </select>

                {/* Time selector */}
                <input
                  type="time"
                  value={scheduleTime}
                  onChange={(e) => setScheduleTime(e.target.value)}
                  className="border p-2 rounded w-1/2"
                />
              </div>


              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Class</option>
                {classes.map((cls) => (
                  <option key={cls.id} value={cls.id}>
                    {cls.name}
                  </option>
                ))}
              </select>

              <select
                value={teacherId}
                onChange={(e) => setTeacherId(e.target.value)}
                className="border p-2 rounded w-full"
              >
                <option value="">Select Teacher</option>
                {teachers.map((teacher) => (
                  <option key={teacher.id} value={teacher.id}>
                    {teacher.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={closeModal}
                  className="bg-gray-300 px-4 py-2 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
                >
                  {editingId ? "Update" : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

Subject.layout = (page) => <Layout>{page}</Layout>;
export default Subject;
