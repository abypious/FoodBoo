import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useBookingStore from "../../store/bookingStore";
import ReviewPopup from "../../components/review/ReviewPopup";
import ConfirmModal from "../../components/toast/ConfirmModal";
import styles from "./MyBookings.module.css";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [reviewTarget, setReviewTarget] = useState(null);
  const [confirmState, setConfirmState] = useState({
    visible: false,
    bookingId: null
  });

  const nav = useNavigate();

  const { getMyBookings, cancelBooking, addReview, updateReview } =
    useBookingStore();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const data = await getMyBookings();
      setBookings(data);
    } catch (err) {
      toast.error("Failed to load bookings");
    }
  };

  const askCancel = (id) => {
    setConfirmState({ visible: true, bookingId: id });
  };

  const confirmCancel = async () => {
    const id = confirmState.bookingId;

    setConfirmState({ visible: false, bookingId: null });

    try {
      await cancelBooking(id);
      toast.success("Booking cancelled");
      load();
    } catch (err) {
      toast.error("Failed to cancel booking");
    }
  };

  const openReview = (booking) => {
    setReviewTarget(booking);
  };

  const submitReview = async (rating, comment) => {
    const b = reviewTarget;

    try {
      if (b.hasReview && b.reviewId) {
        await updateReview(b.reviewId, rating, comment);
        toast.success("Review updated!");
      } else {
        await addReview(b.id, rating, comment);
        toast.success("Review added!");
      }
    } catch (err) {
      toast.error("Failed to submit review");
    }

    setReviewTarget(null);
    load();
  };

  return (
    <div className={styles.page}>
      <button className={styles.backBtn} onClick={() => nav("/employee")}>
        <ArrowLeft size={18} /> Back
      </button>

      <h2 className={styles.title}>My Bookings</h2>
      <div className={styles.orangeBar}></div>

      <div className={styles.list}>
        {bookings.map((b) => (
          <div key={b.id} className={styles.card}>
            <div className={styles.row}>
              <div className={styles.food}>{b.foodItem?.name}</div>
              <div className={styles.status}>{b.status}</div>
            </div>

            <div className={styles.details}>
              <span>Date: {b.date}</span>
              <span>Meal: {b.mealTime}</span>
            </div>

            {b.status === "CONFIRMED" && (
              <button
                className={styles.cancelBtn}
                onClick={() => askCancel(b.id)}
              >
                Cancel Booking
              </button>
            )}

            {b.status === "COMPLETED" && (
              <button
                className={styles.reviewBtn}
                onClick={() => openReview(b)}
              >
                {b.hasReview ? "Edit Review" : "Give Review"}
              </button>
            )}
          </div>
        ))}
      </div>

      {reviewTarget && (
        <ReviewPopup
          existing={reviewTarget.hasReview ? reviewTarget : null}
          onClose={() => setReviewTarget(null)}
          onSubmit={submitReview}
        />
      )}

      {confirmState.visible && (
        <ConfirmModal
          message="Do you really want to cancel this booking?"
          onCancel={() => setConfirmState({ visible: false, bookingId: null })}
          onConfirm={confirmCancel}
        />
      )}
    </div>
  );
}
