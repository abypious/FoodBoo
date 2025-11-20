// src/pages/Admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Users, Utensils, CalendarCheck, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const [summary, setSummary] = useState({
    employees: 0,
    foods: 0,
    bookings: 0,
    reviews: 0,
  });

  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emp, foods, bookings, reviews] = await Promise.all([
          API.get("/api/employees"),
          API.get("/api/foods"),
          API.get("/api/bookings/all"),
          API.get("/api/reviews"),
        ]);

        setSummary({
          employees: emp.data.data?.length ?? emp.data.length,
          foods: foods.data.data?.length ?? foods.data.length,
          bookings: bookings.data.data?.length ?? bookings.data.length,
          reviews: reviews.data.data?.length ?? reviews.data.length,
        });
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="dash-loading">Loading dashboard...</div>;

  return (
    <div className="dashboard-container">
      <h2 className="dash-title">Admin Dashboard</h2>

      <div className="dash-grid">
        <DashCard
          label="Employees"
          value={summary.employees}
          icon={<Users size={32} />}
          onClick={() => navigate("/admin/employees")}
        />

        <DashCard
          label="Foods"
          value={summary.foods}
          icon={<Utensils size={32} />}
          onClick={() => navigate("/admin/foods")}
        />

        <DashCard
          label="Bookings"
          value={summary.bookings}
          icon={<CalendarCheck size={32} />}
          onClick={() => navigate("/admin/bookings")}
        />

        <DashCard
          label="Reviews"
          value={summary.reviews}
          icon={<MessageSquare size={32} />}
          onClick={() => navigate("/admin/reviews")}
        />
      </div>
    </div>
  );
}

function DashCard({ label, value, icon, onClick }) {
  return (
    <div className="dash-card" onClick={onClick}>
      <div className="dash-icon">{icon}</div>
      <div className="dash-info">
        <div className="dash-label">{label}</div>
        <div className="dash-value">{value}</div>
      </div>
    </div>
  );
}
