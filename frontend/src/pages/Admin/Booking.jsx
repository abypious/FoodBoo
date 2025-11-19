// src/pages/Admin/BookingOverview.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

export default function BookingOverview() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/bookings/all").then((r) => {
      const d = r.data.data ?? r.data;
      setBookings(d);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading bookings...</div>;

  return (
    <div className="container mt-3">
      <h3>Bookings</h3>
      {bookings.length === 0 ? <p>No bookings</p> : (
        <table className="table">
          <thead>
            <tr><th>Employee</th><th>Food</th><th>Date</th><th>Status</th></tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user?.name || b.employee?.name}</td>
                <td>{b.food?.name}</td>
                <td>{new Date(b.date).toLocaleString()}</td>
                <td>{b.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
