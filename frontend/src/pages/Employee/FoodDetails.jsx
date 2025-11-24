import { useParams, useNavigate } from "react-router-dom";
import useFoodStore from "../../store/foodStore";
import useBookingStore from "../../store/bookingStore";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import API from "../../api/axiosConfig";
import styles from "./FoodDetails.module.css";
import toast from "react-hot-toast";
import ConfirmModal from "../../components/toast/ConfirmModal"; 

export default function FoodDetails() {
  const { foodId } = useParams();
  const { food, fetchFoodById, loading } = useFoodStore();
  const { createBooking } = useBookingStore();
  const nav = useNavigate();

  const [date, setDate] = useState("");
  const [mealTime, setMealTime] = useState("");
  const [index, setIndex] = useState(0);
  const [reviews, setReviews] = useState([]);

  const [confirmOpen, setConfirmOpen] = useState(false);

  useEffect(() => {
    fetchFoodById(foodId);
  }, [foodId]);

  useEffect(() => {
    if (foodId) loadReviews();
  }, [foodId]);

  const loadReviews = async () => {
    try {
      const res = await API.get(`/api/reviews/food/${foodId}`);
      setReviews(res.data.data);
    } catch {
      toast.error("Failed to load reviews");
    }
  };

  if (loading || !food) return <h2>Loading...</h2>;

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : null;

  const stars = avgRating
    ? "★".repeat(Math.round(avgRating))
    : "★★★★★";

  const images = food.imageUrls?.length
    ? food.imageUrls
    : [food.imageUrl || "/placeholder-food.png"];

  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const nextMonth = new Date(today);
  nextMonth.setMonth(today.getMonth() + 1);

  const toDate = (d) => d.toISOString().split("T")[0];
  const minDate = toDate(tomorrow);
  const maxDate = toDate(nextMonth);

  const handleConfirmBooking = () => {
    setConfirmOpen(true);
  };

  const confirmBooking = async () => {
    setConfirmOpen(false);

    try {
      await createBooking({
        foodItemId: food.id,
        mealTime,
        date
      });

      toast.success("Booking successful!");

      nav("/employee/booking-success", {
        state: { mealTime, date, foodName: food.name }
      });

    } catch (err) {
      toast.error("Same meal is already booked on this date");
    }
  };

  return (
    <div className={styles.pageCard}>
      <button className={styles.backBtn} onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> Go Back
      </button>

      <div className={styles.layout}>
        <div className={styles.left}>

          <div className={styles.imageWrapper}>
            <img src={images[index]} className={styles.image} />

            {images.length > 1 && (
              <div className={styles.arrows}>
                <button
                  className={styles.arrowBtn}
                  onClick={() => setIndex((index - 1 + images.length) % images.length)}
                >
                  <ChevronLeft size={20} />
                </button>
                <button
                  className={styles.arrowBtn}
                  onClick={() => setIndex((index + 1) % images.length)}
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            <div className={styles.dots}>
              {images.map((_, i) => (
                <div
                  key={i}
                  className={`${styles.dot} ${i === index ? styles.activeDot : ""}`}
                  onClick={() => setIndex(i)}
                />
              ))}
            </div>
          </div>

          <h2 className={styles.foodName}>{food.name}</h2>
          <div className={styles.available}>Available</div>

          <div className={styles.rating}>
            {stars} <span>({avgRating || 0}) Average Rating</span>
          </div>

          <h3 className={styles.sectionTitle}>Make A Reservation</h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleConfirmBooking();
            }}
            className={styles.formRow}
          >
            <input
              type="date"
              min={minDate}
              max={maxDate}
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
            />

            <select
              required
              value={mealTime}
              onChange={(e) => setMealTime(e.target.value)}
              className={styles.timeSelect}
            >
              <option value="">Time</option>
              <option value="BREAKFAST">Breakfast</option>
              <option value="LUNCH">Lunch</option>
              <option value="DINNER">Dinner</option>
            </select>

            <button className={styles.proceedBtn}>Proceed →</button>
          </form>

          <h3 className={styles.sectionTitle}>What People Are Saying</h3>

          <div className={styles.reviewsBox}>
            {reviews.length === 0 && <p>No reviews yet.</p>}

            {reviews.map((r) => (
              <div key={r.id} className={styles.reviewCard}>
                <img src="/Profile.png" className={styles.reviewImg} />
                <div>
                  <div className={styles.reviewName}>{r.user?.name}</div>
                  <div className={styles.reviewStars}>
                    {"★".repeat(r.rating)}
                    {"☆".repeat(5 - r.rating)}
                  </div>
                  <div className={styles.reviewText}>{r.comment}</div>
                  <div className={styles.reviewDate}>
                    {new Date(r.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>

      {confirmOpen && (
        <ConfirmModal
          message={`Book ${food.name} for ${mealTime} on ${date}?`}
          onConfirm={confirmBooking}
          onCancel={() => setConfirmOpen(false)}
        />
      )}
    </div>
  );
}
