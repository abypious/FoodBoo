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
    id: null,
  });

  const navigate = useNavigate();

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    try {
      const res = await API.get("/api/employees");
      setEmployees(res.data.data ?? res.data);
    } catch (err) {
      toast.error("Failed to load employees");
    }
    setLoading(false);
  };

  const askDelete = (id) => {
    setConfirmState({ visible: true, id });
  };

  const confirmDelete = async () => {
    const id = confirmState.id;
    setConfirmState({ visible: false, id: null });

    try {
      await API.delete(`/api/employees/${id}`);
      toast.success("Employee deleted");
      loadEmployees();
    } catch (err) {
      toast.error("Delete failed");
    }
  };

  const filtered = employees.filter((e) =>
    `${e.name} ${e.email}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="loading">Loading...</div>;

  return (
    <div className="employees-container">
      <div className="emp-toolbar">
        <div className="emp-search-wrapper">
          <span className="emp-search-icon">🔍</span>
          <input
            className="emp-search-input"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="emp-table-wrapper">
        <table className="emp-table">
          <thead>
            <tr>
              <th style={{ width: "60px" }}>#</th>
              <th>Employee</th>
              <th>Email</th>
              <th style={{ width: "150px" }}>Role</th>
              <th style={{ width: "120px", textAlign: "center" }}>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-data">
                  No employees found
                </td>
              </tr>
            ) : (
              filtered.map((e, i) => (
                <tr key={e.id}>
                  <td>{i + 1}</td>
                  <td>{e.name}</td>
                  <td>{e.email}</td>
                  <td>{e.role ?? "EMPLOYEE"}</td>
                  <td className="emp-actions">
                    <button className="emp-delete-btn" onClick={() => askDelete(e.id)}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {confirmState.visible && (
        <ConfirmModal
          message="Do you really want to delete this employee?"
          onCancel={() => setConfirmState({ visible: false, id: null })}
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
