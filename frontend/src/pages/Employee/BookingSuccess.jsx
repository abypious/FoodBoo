import { useLocation, useNavigate } from "react-router-dom";
import styles from "./BookingSuccess.module.css";

export default function BookingSuccess() {
  const nav = useNavigate();
  const { state } = useLocation();

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <div className={styles.icon}>✓</div>

        <h2 className={styles.title}>Booking Successful!</h2>

        <p className={styles.subtitle}>
          Your meal has been reserved.
        </p>

        {state && (
          <div className={styles.detailsBox}>
            {state.foodName && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Food:</span>
                <span className={styles.value}>{state.foodName}</span>
              </div>
            )}

            {state.mealTime && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Meal Time:</span>
                <span className={styles.value}>{state.mealTime}</span>
              </div>
            )}

            {state.date && (
              <div className={styles.detailRow}>
                <span className={styles.label}>Date:</span>
                <span className={styles.value}>{state.date}</span>
              </div>
            )}
          </div>
        )}

        <button
          className={styles.btn}
          onClick={() => nav("/employee/categories")}
        >
          Back to Categories
        </button>
      </div>
    </div>
  );
}
