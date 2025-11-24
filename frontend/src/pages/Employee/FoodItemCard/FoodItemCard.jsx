import { useState } from "react";
import styles from "./FoodItemCard.module.css";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function FoodItemCard({ food, onClick }) {
  const images = food.imageUrls?.length
    ? food.imageUrls
    : [food.imageUrl || "/placeholder-food.png"];

  const [index, setIndex] = useState(0);

  const rating =
    food.reviews?.length
      ? (
          food.reviews.reduce((sum, r) => sum + r.rating, 0) /
          food.reviews.length
        ).toFixed(1)
      : null;

  const stars = rating ? "★".repeat(Math.round(rating)) : "★★★★★";

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img src={images[index]} className={styles.image} alt={food.name} />

        {images.length > 1 && (
          <div className={styles.navArrows}>
            <button
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIndex((index - 1 + images.length) % images.length);
              }}
            >
              <ChevronLeft size={18} />
            </button>

            <button
              className={styles.arrow}
              onClick={(e) => {
                e.stopPropagation();
                setIndex((index + 1) % images.length);
              }}
            >
              <ChevronRight size={18} />
            </button>
          </div>
        )}
      </div>

      <div className={styles.name}>{food.name}</div>
      <div className={styles.stars}>{stars}</div>
      <div className={styles.available}>Available</div>
      <p className={styles.desc}>
        {food.description || "No description available"}
      </p>
    </div>
  );
}
