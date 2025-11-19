import { useState } from "react";
import styles from "./FoodCard.module.css";

export default function FoodCard({ food, onClick, children }) {
  const images = food.imageUrls?.length
    ? food.imageUrls
    : [food.imageUrl || "/placeholder-food.png"];

  const [index, setIndex] = useState(0);

  const next = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev + 1) % images.length);
  };

  const prev = (e) => {
    e.stopPropagation();
    setIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className={styles.card} onClick={onClick}>
      <div className={styles.imageWrapper}>
        <img src={images[index]} alt={food.name} className={styles.image} />

        {images.length > 1 && (
          <>
            <button className={`${styles.arrow} ${styles.left}`} onClick={prev}>
              ‹
            </button>
            <button className={`${styles.arrow} ${styles.right}`} onClick={next}>
              ›
            </button>
          </>
        )}
      </div>

      <div className={styles.body}>
        <h3>{food.name}</h3>
        <p>{food.description}</p>
      </div>

      {children && <div className={styles.footer}>{children}</div>}
    </div>
  );
}
