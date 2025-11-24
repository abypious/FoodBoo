import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Dashboard.css";
import { Users, Utensils, CalendarCheck, MessageSquare } from "lucide-react";

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [summary, setSummary] = useState({
    employees: 0,
    foods: 0,
    bookings: 0,
    reviews: 0,
  });

  const [allBookings, setAllBookings] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [todayBookings, setTodayBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const formatDate = (d) => d.toISOString().split("T")[0];

  const getHeadingLabel = () => {
    const today = formatDate(new Date());
    const tomorrow = formatDate(new Date(Date.now() + 86400000));
    const selected = formatDate(selectedDate);

    if (selected === today) return "Today's Bookings";
    if (selected === tomorrow) return "Tomorrow's Bookings";
    return `Bookings for ${selected}`;
  };

  useEffect(() => {
    const loadData = async () => {
      try {
        const [emp, foods, bookings, reviews] = await Promise.all([
          API.get("/api/employees"),
          API.get("/api/foods"),
          API.get("/api/bookings/all"),
          API.get("/api/reviews"),
        ]);

        const raw = bookings.data.data ?? bookings.data;

        setSummary({
          employees: emp.data.data?.length ?? emp.data.length,
          foods: foods.data.data?.length ?? foods.data.length,
          bookings: raw.length,
          reviews: reviews.data.data?.length ?? reviews.data.length,
        });

        setAllBookings(raw);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  useEffect(() => {
    const dateStr = formatDate(selectedDate);

    const filtered = allBookings
      .filter((b) => b.date === dateStr)
      .sort((a, b) => a.mealTime.localeCompare(b.mealTime));

    setTodayBookings(filtered);
  }, [selectedDate, allBookings]);


  const goNextDay = () => {
    const next = new Date(selectedDate);
    next.setDate(next.getDate() + 1);
    setSelectedDate(next);
  };

  const goPrevDay = () => {
    const today = formatDate(new Date());
    const current = formatDate(selectedDate);

    if (current === today) return; 

    const prev = new Date(selectedDate);
    prev.setDate(prev.getDate() - 1);
    setSelectedDate(prev);
  };


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
          value={todayBookings.length}   
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

      <div className="table-header-row">
        <h3 className="dash-subtitle">{getHeadingLabel()}</h3>

        
      </div>

      <div className="today-table-wrapper">
        <div className="filter-bar">
          <div className="day-filter">
            <button
              className={
                formatDate(selectedDate) === formatDate(new Date())
                  ? "day-btn active"
                  : "day-btn"
              }
              onClick={() => setSelectedDate(new Date())}
            >
              Today
            </button>

            <button
              className={
                formatDate(selectedDate) === formatDate(new Date(Date.now() + 86400000))
                  ? "day-btn active"
                  : "day-btn"
              }
              onClick={() =>
                setSelectedDate(new Date(Date.now() + 86400000))
              }
            >
              Tomorrow
            </button>
          </div>

          <div className="date-nav">
            <button
              className="date-btn"
              onClick={goPrevDay}
              disabled={formatDate(selectedDate) === formatDate(new Date())}
            >
              ←
            </button>

            <span className="date-label">{formatDate(selectedDate)}</span>

            <button className="date-btn" onClick={goNextDay}>
              →
            </button>
          </div>
        </div>

        <table className="today-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Employee</th>
              <th>Food</th>
              <th>Meal Time</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {todayBookings.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-bookings">
                  No bookings found
                </td>
              </tr>
            ) : (
              todayBookings.map((b, i) => (
                <tr key={b.id}>
                  <td>{i + 1}</td>
                  <td>{b.user?.name}</td>
                  <td>{b.foodItem?.name}</td>
                  <td>{b.mealTime}</td>
                  <td>
                    <span
                      className={`status-badge status-${b.status.toLowerCase()}`}
                    >
                      {b.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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
