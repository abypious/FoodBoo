import { useEffect, useState } from "react";
import { ArrowLeft, Trash } from "lucide-react";
import { useNavigate } from "react-router-dom";
import useReviewStore from "../../store/reviewStore";
import ReviewPopup from "../../components/review/ReviewPopup";
import ConfirmModal from "../../components/toast/ConfirmModal";
import styles from "./MyReviews.module.css";

export default function MyReviews() {
  const [reviews, setReviews] = useState([]);
  const [editing, setEditing] = useState(null);

  // Confirm modal state
  const [confirmState, setConfirmState] = useState({
    visible: false,
    reviewId: null
  });

  const { getMyReviews, deleteReview, updateReview } = useReviewStore();
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const res = await getMyReviews();
      setReviews(res);
    } catch {
      console.error("Failed to load reviews");
    }
  };

  // Open confirm modal
  const askDelete = (id) => {
    setConfirmState({ visible: true, reviewId: id });
  };

  // Confirm delete
  const confirmDelete = async () => {
    const id = confirmState.reviewId;

    setConfirmState({ visible: false, reviewId: null });

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
      <button className={styles.backBtn} onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className={styles.title}>My Reviews</h2>
      <div className={styles.orangeBar}></div>

      <div className={styles.list}>
        {reviews.length === 0 && <p>No reviews yet.</p>}

        {reviews.map((r) => {
          const food = r.booking?.foodItem;

          return (
            <div key={r.id} className={styles.card}>
              <div className={styles.row}>
                <img
                  src={
                    food?.imageUrls?.[0] ||
                    food?.imageUrl ||
                    "/placeholder-food.png"
                  }
                  alt={food?.name}
                  className={styles.foodImg}
                />

                <div className={styles.info}>
                  <p className={styles.name}>{food?.name}</p>

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
                    onClick={() => askDelete(r.id)}
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Edit Review Popup */}
      {editing && (
        <ReviewPopup
          existing={editing}
          onClose={() => setEditing(null)}
          onSubmit={submitEdit}
        />
      )}

      {/* Confirm Delete Modal */}
      {confirmState.visible && (
        <ConfirmModal
          message="Do you really want to delete this review?"
          onCancel={() =>
            setConfirmState({ visible: false, reviewId: null })
          }
          onConfirm={confirmDelete}
        />
      )}
    </div>
  );
}
