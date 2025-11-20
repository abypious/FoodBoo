import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/toast/ConfirmModal";
import "./EmployeesList.css";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [confirmState, setConfirmState] = useState({
    visible: false,
    employeeId: null,
  });

  const nav = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await API.get("/api/employees");
      const data = res.data.data ?? res.data;
      setEmployees(data);
    } catch (err) {
      toast.error("Failed to load employees");
    } finally {
      setLoading(false);
    }
  };

  // Ask confirmation
  const askDelete = (id) => {
    setConfirmState({ visible: true, employeeId: id });
  };

  // Perform deletion
  const confirmDelete = async () => {
    const id = confirmState.employeeId;

    setConfirmState({ visible: false, employeeId: null });

    try {
      await API.delete(`/api/employees/${id}`);
      toast.success("Employee deleted");
      loadEmployees();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.email.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-4">Loading employees...</div>;

  return (
    <div className="admin-container">

      {/* PREMIUM TOOLBAR */}
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th>Role</th>
              <th style={{ textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="no-data">No employees found</td>
              </tr>
            )}

            {filtered.map((e, index) => (
              <tr key={e.id}>
                <td>{index + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role ?? "Employee"}</td>

                <td className="actions-col">
                  <button
                    className="delete-btn"
                    onClick={() => askDelete(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>

        </table>
      </div>

      {/* CONFIRM MODAL */}
      {confirmState.visible && (
        <ConfirmModal
          message="Do you really want to delete this employee?"
          onCancel={() =>
            setConfirmState({ visible: false, employeeId: null })
          }
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
