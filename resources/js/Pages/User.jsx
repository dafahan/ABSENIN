import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layouts/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import { useForm } from "react-hook-form";

import {
  useTable,
  useSortBy,
  useFilters,
  usePagination,
  useGlobalFilter,
} from "react-table";



const Users = () => {
  const [users, setUsers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);
  const modalRef = useRef(null);
  const importModalRef = useRef(null);
  const [importFile, setImportFile] = useState(null);
  const [selectedClass, setSelectedClass] = useState("");


  const {
    register,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    fetchUsers();
    fetchClasses();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get("/api/users");
      setUsers(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch users!", "error");
    }
  };

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/classes");
      setClasses(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch classes!", "error");
    }
  };
  const openModal = () => {
    modalRef.current?.showModal();
  };

  const closeModal = () => {
    modalRef.current?.close();
    resetForm();
  };

  const resetForm = () => {
    reset();
    setEditingId(null);
  };

  const onSubmit = async (data) => {
    try {
      if (editingId) {
        await axios.put(`/users/${editingId}`, data);
        Swal.fire("Updated!", "User updated successfully.", "success");
      } else {
        await axios.post("/users", data);
        Swal.fire("Added!", "User added successfully.", "success");
      }
      fetchUsers();
      closeModal();
    } catch (error) {
      Swal.fire("Error", "Failed to save user.", "error");
    }
  };

  const handleEdit = (user) => {
    setEditingId(user.id);
    setValue("name", user.name);
    setValue("role", user.role);
    setValue("uid", user.uid);
    setValue("gender", user.gender);
    setValue("dateOfBirth", user.date_of_birth);
    setValue("contactInfo", user.contact_info);
    setValue("classId", user.class_id);
    setValue("username", user.username);
    openModal();
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete",
    });

    if (confirm.isConfirmed) {
      try {
        await axios.delete(`/users/${id}`);
        Swal.fire("Deleted!", "User has been deleted.", "success");
        fetchUsers();
      } catch (error) {
        Swal.fire("Error", "Failed to delete user.", "error");
      }
    }
  };
  const globalFilterFunction = (rows, columnIds, filterValue) => {
    return rows.filter((row) => {
      const name = row.values.name?.toLowerCase() || "";
      const className = row.original.school_class?.name?.toLowerCase() || "";
      const role = row.values?.role?.toLowerCase() || "";
      const searchTerm = filterValue.toLowerCase();
  
      return name.includes(searchTerm) || className.includes(searchTerm) || role.includes(searchTerm);;
    });
  };
  

  const columns = React.useMemo(() => [
    {
      Header: "Name",
      accessor: "name",
    },
    {
      Header: "Username",
      accessor: "username",
    },
    {
      Header: "Role",
      accessor: "role",
    },
    {
      Header: "Class",
      accessor: (row) => row.school_class?.name || "-",
      id: "className", // important for filtering
    },
    {
      Header: "Actions",
      accessor: "actions",
      disableSortBy: true,
      Cell: ({ row }) => (
        <div className="space-x-4">
          <button
            onClick={() => handleEdit(row.original)}
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
  ], []);

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    prepareRow,
    page,
    state: { pageIndex, pageSize },
    canPreviousPage,
    canNextPage,
    gotoPage,
    nextPage,
    previousPage,
    pageOptions,
    setPageSize,
    setGlobalFilter, // NEW
  } = useTable(
    {
      columns,
      data: users,
      globalFilter: globalFilterFunction,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter, // NEW
    useSortBy,
    usePagination
  );
  

  useEffect(() => {
    setGlobalFilter(search);
  }, [search, setGlobalFilter]);
  


  const handleImportSubmit = async (e) => {
    e.preventDefault();
  
    if (!importFile) {
      return Swal.fire("Error", "No file selected", "error");
    }
  
    if (!selectedClass) {
      return Swal.fire("Error", "Please select a class", "error");
    }
  
    const formData = new FormData();
    formData.append("file", importFile);
    formData.append("class_id", selectedClass);
  
    try {
      await axios.post("/users/import", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      Swal.fire("Success", "Users imported successfully!", "success");
      importModalRef.current?.close();
      setImportFile(null);
      setSelectedClass("");
      fetchUsers();
    } catch (error) {
      Swal.fire("Error", "Failed to import users.", "error");
    }
  };
  
  return (
    <div className="pt-10 px-6 md:px-20 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-primary">User Management</h1>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
      <div className="space-x-2">
          <button
            onClick={() => modalRef.current?.showModal()}
            className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
          >
            Add User
          </button>
          <button
            onClick={() => importModalRef.current?.showModal()}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            Import Users
          </button>
        </div>
        <dialog ref={modalRef} className="rounded-lg w-full max-w-xl p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">
          {editingId ? "Edit User" : "Add User"}
        </h2>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            className="border p-2 rounded w-full"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name && <p className="text-red-500">{errors.name.message}</p>}

          <input
            type="text"
            placeholder="Username"
            className="border p-2 rounded w-full"
            {...register("username", { required: "Username is required" })}
          />
          {errors.username && <p className="text-red-500">{errors.username.message}</p>}

          <input
            type="password"
            placeholder="Password"
            className="border p-2 rounded w-full"
            {...register("password", { required: !editingId })}
          />
          {errors.password && !editingId && <p className="text-red-500">{errors.password.message}</p>}

          <select className="border p-2 rounded w-full" {...register("role", { required: true })}>
            <option value="">Select Role</option>
            <option value="admin">Admin</option>
            <option value="superadmin">Super Admin</option>
            <option value="user">User</option>
          </select>

          <select className="border p-2 rounded w-full" {...register("gender")}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>

          <select className="border p-2 rounded w-full" {...register("classId")}>
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>

          <input type="date" className="border p-2 rounded w-full" {...register("dateOfBirth")} />
          <input type="text" placeholder="Contact Info" className="border p-2 rounded w-full" {...register("contactInfo")} />

          <div className="flex justify-end gap-4 mt-6">
            <button
              type="button"
              onClick={closeModal}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
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
      </dialog>

      <dialog ref={importModalRef} className="rounded-lg w-full max-w-md p-6 bg-white">
        <h2 className="text-xl font-bold mb-4">Import Users from CSV/Excel</h2>
        <form onSubmit={handleImportSubmit} className="space-y-4">
        <a href="/sample/example-users.csv" className="pt-2 text-blue-500 hover:italic">Download sample file</a>

          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="border p-2 rounded w-full"
            required
          >
            <option value="">Select Class</option>
            {classes.map((cls) => (
              <option key={cls.id} value={cls.id}>
                {cls.name}
              </option>
            ))}
          </select>
          <input
            type="file"
            accept=".csv, application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/vnd.ms-excel"
            onChange={(e) => setImportFile(e.target.files[0])}
            className="border p-2 rounded w-full"
            required
          />
          <br/>
          <div className="flex justify-end gap-4 mt-4">
            <button
              type="button"
              onClick={() => importModalRef.current?.close()}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
            >
              Import
            </button>
          </div>
        </form>
      </dialog>



        <input
          type="text"
          placeholder="Search"
          className="border p-2 rounded w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="bg-white shadow rounded p-4">
        <table {...getTableProps()} className="min-w-full text-left border">
          <thead className="bg-secondary text-white">
            {headerGroups.map((headerGroup) => (
              <tr {...headerGroup.getHeaderGroupProps()}>
                  {headerGroup.headers.map((column) => {
                      const headerProps = column.getHeaderProps(column.getSortByToggleProps());
                      const { key, ...rest } = headerProps;

                      return (
                        <th key={key} {...rest} className="px-4 py-2 cursor-pointer">
                          {column.render("Header")}
                          <span>
                            {column.isSorted
                              ? column.isSortedDesc
                                ? " 🔽"
                                : " 🔼"
                              : ""}
                          </span>
                        </th>
                      );
                    })}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} className="border-t">
                  {row.cells.map((cell) => (
                    <td {...cell.getCellProps()} className="px-4 py-2">
                      {cell.render("Cell")}
                    </td>
                  ))}
                </tr>
              );
            })}
            {users.length === 0 && (
              <tr>
                <td colSpan="4" className="text-center py-4 text-gray-500">
                  No users found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <button
              onClick={() => gotoPage(0)}
              disabled={!canPreviousPage}
              className="px-2"
            >
              {"<<"}
            </button>
            <button
              onClick={() => previousPage()}
              disabled={!canPreviousPage}
              className="px-2"
            >
              {"<"}
            </button>
            <button
              onClick={() => nextPage()}
              disabled={!canNextPage}
              className="px-2"
            >
              {">"}
            </button>
            <button
              onClick={() => gotoPage(pageCount - 1)}
              disabled={!canNextPage}
              className="px-2"
            >
              {">>"}
            </button>
          </div>
          <span>
            Page{" "}
            <strong>
              {pageIndex + 1} of {pageOptions.length}
            </strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[5, 10, 20].map((size) => (
              <option key={size} value={size}>
                Show {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* The modal remains unchanged */}
          
    </div>
  );
};

Users.layout = (page) => <Layout>{page}</Layout>;
export default Users;
