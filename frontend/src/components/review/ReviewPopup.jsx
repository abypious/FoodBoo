import { useState } from "react";
import styles from "./ReviewPopup.module.css";

export default function ReviewPopup({ onClose, onSubmit, existing }) {
  const [rating, setRating] = useState(existing?.rating || 5);
  const [comment, setComment] = useState(existing?.comment || "");

  const submit = () => {
    if (!comment.trim()) {
      alert("Comment cannot be empty");
      return;
    }
    onSubmit(rating, comment);
  };

  return (
    <div className={styles.overlay}>
      <div className={styles.popup}>
        
        <h3>{existing ? "Edit Review" : "Give Review"}</h3>

        <div className={styles.rating}>
          {[1,2,3,4,5].map(n => (
            <span
              key={n}
              className={n <= rating ? styles.activeStar : styles.star}
              onClick={() => setRating(n)}
            >
              ★
            </span>
          ))}
        </div>

        <textarea
          placeholder="Your review..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />

        <div className={styles.actions}>
          <button onClick={submit}>Submit</button>
          <button className={styles.cancel} onClick={onClose}>Close</button>
        </div>

      </div>
    </div>
  );
}
