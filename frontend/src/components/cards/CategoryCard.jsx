import styles from "./CategoryCard.module.css";

export default function CategoryCard({ category, onClick }) {
  return (
    <div className={styles.card} onClick={() => onClick?.(category)}>
      <img
        src={category.imageUrl || "/placeholder-food.png"}
        alt={category.name}
        className={styles.image}
      />

      <div className={styles.name}>{category.name}</div>

      {category.description && (
        <div className={styles.description}>{category.description}</div>
      )}

      {category.count !== undefined && (
        <div className={styles.count}>{category.count} items</div>
      )}
    </div>
  );
}
