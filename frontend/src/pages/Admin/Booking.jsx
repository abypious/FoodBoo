import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import styles from "./Booking.module.css";

export default function BookingOverview() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/bookings/all")
      .then((r) => {
        const d = r.data.data ?? r.data;
        setBookings(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading bookings...</div>;

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Bookings Overview</h2>

      {bookings.length === 0 ? (
        <p className={styles.noData}>No bookings found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Food</th>
              <th>Date</th>
              <th>Meal</th>
              <th>Status</th>
            </tr>
          </thead>

          <tbody>
            {bookings.map((b) => (
              <tr key={b.id}>
                <td>{b.user?.name || "Unknown"}</td>

                <td>{b.foodItem?.name || "Unknown Food"}</td>

                <td>{b.date ? new Date(b.date).toLocaleDateString() : "-"}</td>

                <td>{b.mealTime}</td>

                <td>
                  <span
                    className={
                      b.status === "CONFIRMED"
                        ? styles.statusConfirmed
                        : b.status === "COMPLETED"
                        ? styles.statusCompleted
                        : b.status === "CANCELLED"
                        ? styles.statusCancelled
                        : styles.statusPending
                    }
                  >
                    {b.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
