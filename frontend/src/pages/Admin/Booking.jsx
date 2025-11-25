import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";
import styles from "./Booking.module.css";

export default function BookingOverview() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterDate, setFilterDate] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    API.get("/api/bookings/all")
      .then((r) => {
        const d = r.data.data ?? r.data;
        const sorted = [...d].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setBookings(sorted);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  // Reset pagination when filters change
  useEffect(() => {
    setPage(1);
  }, [filterDate, statusFilter]);

  if (loading) return <div className={styles.loading}>Loading bookings...</div>;

  // Filtering
  const filteredBookings = bookings.filter((b) => {
    const matchDate = filterDate ? b.date === filterDate : true;
    const matchStatus = statusFilter ? b.status === statusFilter : true;
    return matchDate && matchStatus;
  });

  // Pagination logic
  const totalPages = Math.ceil(filteredBookings.length / pageSize);

  const paginatedBookings = filteredBookings.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className={styles.container}>
      <div className={styles.headerRow}>
        <h2 className={styles.title}>Bookings Overview</h2>

        {/* Filters */}
        <div className={styles.filterRow}>
          <input
            type="date"
            value={filterDate}
            onChange={(e) => setFilterDate(e.target.value)}
            className={styles.dateInput}
          />

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className={styles.statusSelect}
          >
            <option value="">Status</option>
            <option value="CONFIRMED">Confirmed</option>
            <option value="COMPLETED">Completed</option>
            <option value="CANCELLED">Cancelled</option>
          </select>

          {(filterDate || statusFilter) && (
            <button
              className={styles.clearBtn}
              onClick={() => {
                setFilterDate("");
                setStatusFilter("");
              }}
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* No data */}
      {filteredBookings.length === 0 ? (
        <p className={styles.noData}>No bookings found.</p>
      ) : (
        <>
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
              {paginatedBookings.map((b) => (
                <tr key={b.id}>
                  <td>{b.user?.name || "Unknown"}</td>
                  <td>{b.foodItem?.name || "Unknown Food"}</td>
                  <td>
                    {b.date ? new Date(b.date).toLocaleDateString() : "-"}
                  </td>
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

          {/* Pagination */}
          <div className={styles.pagination}>
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
            >
              Prev
            </button>

            <span>
              Page {page} / {totalPages}
            </span>

            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
            >
              Next
            </button>
          </div>
        </>
      )}
    </div>
  );
}
