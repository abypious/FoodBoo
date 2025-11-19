// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    employees: 0,
    foods: 0,
    bookings: 0,
    reviews: 0,
  });
  const [loading, setLoading] = useState(true);

  const nav = useNavigate();

  useEffect(() => {
    const load = async () => {
      try {
        const [emp, foods, bookings, reviews] = await Promise.all([
          API.get("/api/employees"),
          API.get("/api/foods"),
          API.get("/api/bookings/all"),
          API.get("/api/reviews"),
        ]);
        setSummary({
          employees: emp.data.data?.length ?? emp.data.length ?? 0,
          foods: foods.data.data?.length ?? foods.data.length ?? 0,
          bookings: bookings.data.data?.length ?? bookings.data.length ?? 0,
          reviews: reviews.data.data?.length ?? reviews.data.length ?? 0,
        });
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <div className="p-4">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dash-title">Admin Dashboard</h2>

      <div className="dash-grid">
        <div className="dash-card" onClick={() => nav("/admin/employees")}>
          <div className="dash-label">Employees</div>
          <div className="dash-value">{summary.employees}</div>
        </div>

        <div className="dash-card" onClick={() => nav("/admin/foods")}>
          <div className="dash-label">Foods</div>
          <div className="dash-value">{summary.foods}</div>
        </div>

        <div className="dash-card" onClick={() => nav("/admin/bookings")}>
          <div className="dash-label">Bookings</div>
          <div className="dash-value">{summary.bookings}</div>
        </div>

        <div className="dash-card" onClick={() => nav("/admin/reviews")}>
          <div className="dash-label">Reviews</div>
          <div className="dash-value">{summary.reviews}</div>
        </div>
      </div>
    </div>
  );
}
