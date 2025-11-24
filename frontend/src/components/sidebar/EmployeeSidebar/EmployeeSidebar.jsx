import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import useAuthStore from "../../../store/authStore";
import API from "../../../api/axiosConfig";
import styles from "./EmployeeSidebar.module.css";

export default function EmployeeSidebar() {
  const user = useAuthStore((s) => s.user);
  const [points, setPoints] = useState(0);
  const [recent, setRecent] = useState([]);
  const location = useLocation();
  const nav = useNavigate();

  useEffect(() => {
    if (!user) return;

    API.get("/api/points/my/summary")
      .then((res) => setPoints(res.data.data?.totalPoints || 0))
      .catch(() => setPoints(0));

    API.get("/api/bookings/my")
      .then((res) => {
        const list = res.data.data || [];
        const sorted = [...list].sort(
          (a, b) => new Date(b.date) - new Date(a.date)
        );
        setRecent(sorted.slice(0, 3));
      })
      .catch(() => setRecent([]));
  }, [user, location.pathname]);

  return (
    <aside className={styles.sidebar}>
      <div className={styles.container}>

        <div className={styles.pointsCard}>
          <span>Saved Points :</span>
          <strong>{points}</strong>
        </div>

        <h3 className={styles.heading}>Your Recent Bookings</h3>
        <div className={styles.underline} />

        <div className={styles.bookingList}>
          {recent.length === 0 ? (
            <div className={styles.empty}>
              <p>You don’t have any bookings yet.</p>
              <Link to="/employee/categories">Book your first meal →</Link>
            </div>
          ) : (
            recent.map((b) => (
              <div
                key={b.id}
                className={styles.bookingCard}
                onClick={() => nav("/employee/bookings")}
              >
                <img
                  src={
                    b.foodItem?.imageUrls?.[0] ||
                    b.foodItem?.imageUrl ||
                    "/placeholder-food.png"
                  }
                  alt={b.foodItem?.name}
                />

                <div className={styles.info}>
                  <p className={styles.title}>{b.foodItem?.name}</p>
                  <p className={styles.meta}><strong>{b.date}</strong></p>
                  <p className={styles.meta}><strong>{b.mealTime}</strong></p>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.seeAll}>
          <Link to="/employee/bookings">See All</Link>
        </div>

        <div className={styles.footerMenu}>
          <div className={styles.footerItem} onClick={() => nav("/contact")}>
            <i className="fa-solid fa-phone"></i>
            Contact Us
          </div>

          <div className={styles.footerItem} onClick={() => nav("/employee/faqs")}>
            <i className="fa-solid fa-circle-question"></i>
            FAQs
          </div>

          <div className={styles.footerItem} onClick={() => nav("/employee/about")}>
            <i className="fa-solid fa-circle-info"></i>
            About Us
          </div>
        </div>
      </div>
    </aside>
  );
}
