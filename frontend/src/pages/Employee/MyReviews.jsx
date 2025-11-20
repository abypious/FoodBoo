import { useEffect, useState } from "react";
import useReviewStore from "../../store/reviewStore";
import ReviewPopup from "../../components/review/ReviewPopup";
import styles from "./MyReviews.module.css";
import { ArrowLeft, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);

  const { getMyReviews, deleteReview, updateReview } = useReviewStore();
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const res = await getMyReviews();
    setReviews(res);
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this review permanently?")) return;

    await deleteReview(id);
    load();
  };

  const submitEdit = async (rating, comment) => {
    await updateReview(editing.id, rating, comment);
    setEditing(null);
    load();
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav("/employee")}>
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className={styles.title}>My Reviews</h2>
      <div className={styles.orangeBar}></div>

      <div className={styles.list}>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => (
          <div key={r.id} className={styles.card}>
            <div className={styles.row}>
              <img
                src={r.foodItem?.imageUrl || "/placeholder-food.png"}
                className={styles.foodImg}
              />

              <div className={styles.info}>
                <p className={styles.name}>{r.foodItem?.name}</p>
                
                <p className={styles.stars}>
                  {"★".repeat(r.rating)}
                  {"☆".repeat(5 - r.rating)}
                </p>

                <p className={styles.comment}>{r.comment}</p>
                <span className={styles.date}>
                  {new Date(r.createdAt).toLocaleDateString()}
                </span>
              </div>

              <div className={styles.actions}>
                <button
                  className={styles.editBtn}
                  onClick={() => setEditing(r)}
                >
                  Edit
                </button>

                <button
                  className={styles.deleteBtn}
                  onClick={() => handleDelete(r.id)}
                >
                  <Trash size={16} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {editing && (
        <ReviewPopup
          existing={editing}
          onClose={() => setEditing(null)}
          onSubmit={submitEdit}
        />
      )}
    </div>
  );
}
