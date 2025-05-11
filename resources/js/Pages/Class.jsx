import React, { useEffect, useState } from "react";
import Layout from "../Layouts/Layout";
import axios from "axios";
import Swal from "sweetalert2";
import {
  useTable,
  useSortBy,
  usePagination,
  useGlobalFilter,
} from "react-table";

const Class = () => {
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      const response = await axios.get("/api/classes");
      setClasses(response.data);
    } catch (error) {
      Swal.fire("Error", "Failed to fetch classes!", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      if (editingId) {
        await axios.put(`/classes/${editingId}`, { name });
        Swal.fire("Updated!", "Class updated successfully.", "success");
      } else {
        await axios.post("/classes", { name });
        Swal.fire("Added!", "Class added successfully.", "success");
      }
      setName("");
      setEditingId(null);
      fetchClasses();
    } catch (error) {
      Swal.fire("Error", "Failed to save class.", "error");
    }
  };

  const handleEdit = (cls) => {
    setName(cls.name);
    setEditingId(cls.id);
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
        await axios.delete(`/classes/${id}`);
        Swal.fire("Deleted!", "Class has been deleted.", "success");
        fetchClasses();
      } catch (error) {
        Swal.fire("Error", "Failed to delete class.", "error");
      }
    }
  };

  const globalFilterFunction = (rows, columnIds, filterValue) => {
    return rows.filter((row) =>
      row.values.name.toLowerCase().includes(filterValue.toLowerCase())
    );
  };

  const columns = React.useMemo(() => [
    {
      Header: "ID",
      accessor: "id",
    },
    {
      Header: "Name",
      accessor: "name",
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
      data: classes,
      globalFilter: globalFilterFunction,
      initialState: { pageIndex: 0, pageSize: 5 },
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  useEffect(() => {
    setGlobalFilter(search);
  }, [search, setGlobalFilter]);

  return (
    <div className="pt-10 px-6 md:px-20 bg-gray-100 min-h-screen">
      <h1 className="text-2xl font-bold mb-4 text-primary">Class Management</h1>

      <form onSubmit={handleSubmit} className="mb-6 space-y-3">
        <input
          type="text"
          className="border p-2 rounded w-full md:w-1/2"
          placeholder="Class name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <button
          type="submit"
          className="bg-primary text-white px-4 py-2 rounded hover:bg-hover"
        >
          {editingId ? "Update Class" : "Add Class"}
        </button>
      </form>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Search by name"
          className="border p-2 rounded w-full md:w-1/2"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
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
            {classes.length === 0 && (
              <tr>
                <td colSpan="3" className="text-center py-4 text-gray-500">
                  No classes found.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Pagination Controls */}
        <div className="flex justify-between items-center mt-4">
          <div>
            <button onClick={() => gotoPage(0)} disabled={!canPreviousPage} className="px-2">{"<<"}</button>
            <button onClick={() => previousPage()} disabled={!canPreviousPage} className="px-2">{"<"}</button>
            <button onClick={() => nextPage()} disabled={!canNextPage} className="px-2">{">"}</button>
            <button onClick={() => gotoPage(pageOptions.length - 1)} disabled={!canNextPage} className="px-2">{">>"}</button>
          </div>
          <span>
            Page <strong>{pageIndex + 1} of {pageOptions.length}</strong>
          </span>
          <select
            value={pageSize}
            onChange={(e) => setPageSize(Number(e.target.value))}
            className="border rounded p-1"
          >
            {[5, 10, 20].map(size => (
              <option key={size} value={size}>Show {size}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
};

Class.layout = (page) => <Layout>{page}</Layout>;
export default Class;
