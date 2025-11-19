// src/pages/Admin/ReviewsOverview.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axiosConfig";

export default function ReviewsOverview() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    API.get("/api/reviews").then((r) => {
      const d = r.data.data ?? r.data;
      setReviews(d);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-4">Loading reviews...</div>;

  return (
    <div className="container mt-3">
      <h3>Reviews Overview</h3>
      {reviews.length === 0 ? <p>No reviews</p> : (
        <table className="table">
          <thead>
            <tr><th>Employee</th><th>Food</th><th>Rating</th><th>Comment</th></tr>
          </thead>
          <tbody>
            {reviews.map((r) => (
              <tr key={r.id}>
                <td>{r.user?.name || r.employee?.name || "Anonymous"}</td>
                <td>{r.food?.name}</td>
                <td>{r.rating ?? r.changeAmount ?? "-"}</td>
                <td>{r.comment || r.description}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
