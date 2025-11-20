import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import styles from "./Reviews.module.css";

export default function ReviewsOverview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [ratingFilter, setRatingFilter] = useState("");

  useEffect(() => {
    API.get("/api/reviews")
      .then((r) => {
        const d = r.data.data ?? r.data;
        setReviews(d);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className={styles.loading}>Loading reviews...</div>;

  // FILTER + SEARCH LOGIC
  const filteredReviews = reviews.filter((r) => {
    const matchesSearch =
      r.user?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.booking?.foodItem?.name?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase());

    const matchesRating =
      ratingFilter === "" || String(r.rating) === String(ratingFilter);

    return matchesSearch && matchesRating;
  });

  return (
    <div className={styles.container}>
      <h2 className={styles.title}>Reviews Overview</h2>

      {/* --- PREMIUM TOOLBAR --- */}
      <div className={styles.toolbar}>
        {/* Search */}
        <div className={styles.searchWrapper}>
          <span className={styles.searchIcon}>🔍</span>
          <input
            className={styles.searchInput}
            placeholder="Search by employee, food, or comment..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {/* Rating Filter */}
        <select
          className={styles.filterDropdown}
          value={ratingFilter}
          onChange={(e) => setRatingFilter(e.target.value)}
        >
          <option value="">All Ratings</option>
          <option value="5">5 ★</option>
          <option value="4">4 ★</option>
          <option value="3">3 ★</option>
          <option value="2">2 ★</option>
          <option value="1">1 ★</option>
        </select>
      </div>

      {/* ---- TABLE ---- */}
      {filteredReviews.length === 0 ? (
        <p className={styles.noData}>No reviews found.</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Employee</th>
              <th>Food</th>
              <th>Rating</th>
              <th>Comment</th>
              <th>Date</th>
            </tr>
          </thead>

          <tbody>
            {filteredReviews.map((r) => (
              <tr key={r.id}>
                <td>{r.user?.name || "Unknown"}</td>

                <td>{r.booking?.foodItem?.name || "Unknown Food"}</td>

                <td className={styles.ratingCell}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </td>

                <td>{r.comment}</td>

                <td>
                  {r.createdAt
                    ? new Date(r.createdAt).toLocaleDateString()
                    : "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
