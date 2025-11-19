import { useParams, useNavigate } from "react-router-dom";
import useFoodStore from "../../store/foodStore";
import useBookingStore from "../../store/bookingStore";
import { useEffect, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight } from "lucide-react";
import styles from "./FoodDetails.module.css";

export default function FoodDetails() {
  const { foodId } = useParams();
  const { food, fetchFoodById, loading } = useFoodStore();
  const { createBooking } = useBookingStore();
  const nav = useNavigate();

  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [index, setIndex] = useState(0);

  useEffect(() => {
    fetchFoodById(foodId);
  }, [foodId]);

  if (loading || !food) return <h2>Loading...</h2>;

  const rating =
    food.reviews?.length > 0
      ? (food.reviews.reduce((sum, r) => sum + r.rating, 0) /
          food.reviews.length).toFixed(1)
      : null;

  const stars = rating ? "★".repeat(Math.round(rating)) : "★★★★★";

  const images = food.imageUrls?.length
    ? food.imageUrls
    : [food.imageUrl || "/placeholder-food.png"];

  const submit = async (e) => {
    e.preventDefault();
    await createBooking({ foodId, date, timeSlot: time });
    nav("/employee/booking-success");
  };

  return (
    <div className={styles.pageCard}>

      {/* Back Button */}
      <button className={styles.backBtn} onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> Go Back
      </button>

      <div className={styles.layout}>
        
        {/* LEFT SECTION */}
        <div className={styles.left}>

          {/* Image Slider */}
          <div className={styles.imageWrapper}>
            <img src={images[index]} className={styles.image} />

            {images.length > 1 && (
              <div className={styles.arrows}>
                <button className={styles.arrowBtn} onClick={() => setIndex((index - 1 + images.length) % images.length)}>
                  <ChevronLeft size={20} />
                </button>
                <button className={styles.arrowBtn} onClick={() => setIndex((index + 1) % images.length)}>
                  <ChevronRight size={20} />
                </button>
              </div>
            )}

            {/* Image Dots */}
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

          {/* Title */}
          <h2 className={styles.foodName}>{food.name}</h2>

          {/* Availability */}
          <div className={styles.available}>Available</div>

          {/* Ratings */}
          <div className={styles.rating}>
            {stars} <span>({rating || 0}) Average Ratings</span>
          </div>

          {/* Reservation */}
          <h3 className={styles.sectionTitle}>Make A Reservation</h3>

          <form onSubmit={submit} className={styles.formRow}>
            <input
              type="date"
              required
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className={styles.dateInput}
            />

            <select
              required
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className={styles.timeSelect}
            >
              <option value="">Time</option>
              <option value="Breakfast">Breakfast</option>
              <option value="Lunch">Lunch</option>
              <option value="Dinner">Dinner</option>
            </select>

            <button className={styles.proceedBtn}>
              Proceed →
            </button>
          </form>

          {/* Reviews Section */}
          <h3 className={styles.sectionTitle}>What People are Saying</h3>

          <div className={styles.reviewsBox}>
            {food.reviews?.map((r, idx) => (
              <div key={idx} className={styles.reviewCard}>
                <img src="/placeholder-user.png" className={styles.reviewImg} />
                <div>
                  <div className={styles.reviewName}>{r.userName}</div>
                  <div className={styles.reviewStars}>{"★".repeat(r.rating)}</div>
                  <div className={styles.reviewText}>{r.comment}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
