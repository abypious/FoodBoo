import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../../../api/axiosConfig";
import styles from "./FoodReviews.module.css";
import { ArrowLeft } from "lucide-react";

export default function FoodReviews() {
  const { foodId } = useParams();
  const [food, setFood] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    loadFood();
    loadReviews();
  }, [foodId]);

  const loadFood = async () => {
    try {
      const res = await API.get(`/api/foods/${foodId}`);
      setFood(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const loadReviews = async () => {
    try {
      const res = await API.get(`/api/reviews/food/${foodId}`);
      setReviews(res.data.data ?? res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.container}>
      <button className={styles.backBtn} onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className={styles.title}>
        Reviews for: <span>{food?.name}</span>
      </h2>

      <div className={styles.list}>
        {reviews.length === 0 ? (
          <p className={styles.noReviews}>No reviews yet for this food.</p>
        ) : (
          reviews.map((r) => (
            <div key={r.id} className={styles.card}>
              <div className={styles.header}>
                <img
                    src="/Profile.png"
                    alt="User"
                    className={styles.userPic}
                />

                <div>
                  <div className={styles.name}>{r.user?.name || "User"}</div>
                  <div className={styles.rating}>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                </div>
              </div>

              <div className={styles.comment}>{r.comment}</div>
              <div className={styles.date}>
                {new Date(r.createdAt).toLocaleDateString()}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
