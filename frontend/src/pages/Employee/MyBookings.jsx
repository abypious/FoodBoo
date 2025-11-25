import { useEffect, useState, useMemo } from "react";
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

  // Filters
  const [filterDate, setFilterDate] = useState("");
  const [filterStatus, setFilterStatus] = useState("");

  // Pagination
  const [page, setPage] = useState(1);
  const pageSize = 5;

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

  // Ask Cancel
  const askCancel = (id) => {
    setConfirmState({ visible: true, bookingId: id });
  };

  // Confirm Cancel
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

  // Review Popup
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

  // Filtering
  const filteredBookings = useMemo(() => {
    return bookings.filter((b) => {
      const matchesDate = filterDate ? b.date === filterDate : true;
      const matchesStatus = filterStatus ? b.status === filterStatus : true;
      return matchesDate && matchesStatus;
    });
  }, [bookings, filterDate, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredBookings.length / pageSize);
  const paginated = filteredBookings.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => nav("/employee")}>
          <ArrowLeft size={18} /> Back
        </button>

        <h2 className={styles.title}>My Bookings</h2>

        <div className={styles.filters}>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => {
            setPage(1);
            setFilterDate(e.target.value);
          }}
        />

        <select
          value={filterStatus}
          onChange={(e) => {
            setPage(1);
            setFilterStatus(e.target.value);
          }}
        >
          <option value="">All Status</option>
          <option value="CONFIRMED">Confirmed</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
      </div>


        <button
          className={styles.reviewsBtn}
          onClick={() => nav("/employee/reviews")}
        >
          My Reviews
        </button>
      </div>

      <div className={styles.orangeBar}></div>

      <div className={styles.list}>
        {paginated.map((b) => (
          <div key={b.id} className={styles.card}>
            <div className={styles.row}>
              <div className={styles.food}>{b.foodItem?.name}</div>

              <div
                className={`${styles.status} ${
                  b.status === "CONFIRMED"
                    ? styles.green
                    : b.status === "CANCELLED"
                    ? styles.red
                    : ""
                }`}
              >
                {b.status}
              </div>
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

      {filteredBookings.length > pageSize && (
        <div className={styles.pagination}>
          <button disabled={page === 1} onClick={() => setPage(page - 1)}>
            Prev
          </button>

          <span>
            Page {page} of {totalPages}
          </span>

          <button
            disabled={page === totalPages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Modals */}
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
