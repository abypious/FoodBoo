import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./EmployeesList.css";

export default function EmployeesList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
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
      console.error("Failed to load employees", err);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this employee?")) return;
    try {
      await API.delete(`/api/employees/${id}`);
      loadEmployees();
    } catch {
      alert("Delete failed");
    }
  };

  if (loading) return <div className="p-4">Loading employees...</div>;

  return (
    <div className="admin-container">
      <div className="employees-header">
        <h2>Employees</h2>
      </div>

      <div className="table-wrapper">
        <table className="employees-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {employees.length === 0 && (
              <tr>
                <td colSpan="7" className="no-data">
                  No employees found
                </td>
              </tr>
            )}

            {employees.map((e, index) => (
              <tr key={e.id}>
                <td>{index + 1}</td>
                <td>{e.name}</td>
                <td>{e.email}</td>
                <td>{e.role ?? "Employee"}</td>
                <td>

                  <button
                    className="delete-btn"
                    onClick={() => remove(e.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
