// src/components/sidebar/EmployeeSidebar/EmployeeSidebar.jsx
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import API from "../../../api/axiosConfig";
import styles from "./EmployeeSidebar.module.css";

export default function EmployeeSidebar() {
  const user = useAuthStore((s) => s.user);
  const [points, setPoints] = useState(0);
  const [recent, setRecent] = useState([]);

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
        setRecent(list.slice(0, 2));
      })
      .catch(() => setRecent([]));
  }, [user]);

  return (
    <aside className={styles.sidebar}>

      <div className={styles.container}>
        {/* POINTS CARD */}
        <div className={styles.pointsCard}>
          <span>Saved points :</span>
          <strong>{points}</strong>
        </div>

        {/* RECENT BOOKINGS TITLE */}
        <h3 className={styles.heading}>Your recent bookings</h3>
        <div className={styles.underline} />

        {/* BOOKING LIST */}
        <div className={styles.bookingList}>
          {recent.length === 0 ? (
            <div className={styles.empty}>
              <p>You don’t have any bookings yet.</p>
              <Link to="/employee/categories">Book your first meal →</Link>
            </div>
          ) : (
            recent.map((b) => (
              <div key={b.id} className={styles.bookingCard}>
                <img src={b.food?.imageUrl} alt="" />

                <div className={styles.info}>
                  <p className={styles.title}>{b.food?.name}</p>
                  <p className={styles.stars}>★★★★★</p>
                </div>
              </div>
            ))
          )}
        </div>

        {/* SEE ALL */}
        <div className={styles.seeAll}>
          <Link to="/employee/bookings">See All</Link>
        </div>

        {/* FOOTER MENU */}
        <div className={styles.footerMenu}>
          <p>📞 Contact Us</p>
          <p>❓ FAQs</p>
          <p>ℹ️ About Us</p>
        </div>
      </div>
    </aside>
  );
}
