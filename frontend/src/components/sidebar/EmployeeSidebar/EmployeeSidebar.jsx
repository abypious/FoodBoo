// src/components/sidebar/EmployeeSidebar/EmployeeSidebar.jsx
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import API from "../../../api/axiosConfig";
import styles from "./EmployeeSidebar.module.css";

export default function EmployeeSidebar() {
  const user = useAuthStore((s) => s.user);
  const [points, setPoints] = useState(0);
  const [recent, setRecent] = useState([]);
  const location = useLocation();

  useEffect(() => {
    if (!user) return;

    // Fetch points summary
    API.get("/api/points/my/summary")
      .then((res) => setPoints(res.data.data?.totalPoints || 0))
      .catch(() => setPoints(0));

    // Fetch recent bookings
    API.get("/api/bookings/my")
      .then((res) => {
        const list = res.data.data || [];

        const sorted = [...list].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );

        setRecent(sorted.slice(0, 3)); // show last 3
      })
      .catch(() => setRecent([]));
  }, [user, location.pathname]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.container}>

        {/* POINTS CARD */}
        <div className={styles.pointsCard}>
          <span>Saved points :</span>
          <strong>{points}</strong>
        </div>

        {/* RECENT BOOKINGS */}
        <h3 className={styles.heading}>Your recent bookings</h3>
        <div className={styles.underline} />

        <div className={styles.bookingList}>
          {recent.length === 0 ? (
            <div className={styles.empty}>
              <p>You don’t have any bookings yet.</p>
              <Link to="/employee/categories">Book your first meal →</Link>
            </div>
          ) : (
            recent.map((b) => (
              <div key={b.id} className={styles.bookingCard}>
                
                {/* IMAGE */}
                <img
                  src={
                    b.foodItem?.imageUrls?.[0] ||
                    b.foodItem?.imageUrl ||
                    "/placeholder-food.png"
                  }
                  alt={b.foodItem?.name || "Food"}
                />

                {/* INFO */}
                <div className={styles.info}>
                  <p className={styles.title}>{b.foodItem?.name}</p>

                  <p className={styles.meta}>
                     <strong>{b.date}</strong>
                  </p>

                  <p className={styles.meta}>
                     <strong>{b.mealTime}</strong>
                  </p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.seeAll}>
          <Link to="/employee/bookings">See All</Link>
        </div>

        <div className={styles.footerMenu}>
          <p>📞 Contact Us</p>
          <p>❓ FAQs</p>
          <p>ℹ️ About Us</p>
        </div>
      </div>
    </aside>
  );
}
