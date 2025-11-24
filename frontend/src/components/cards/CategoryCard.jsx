import styles from "./CategoryCard.module.css";

export default function CategoryCard({ category, onClick }) {
  return (
    <div className={styles.categoryCard} onClick={() => onClick?.(category)}>
      <img
        src={category.imageUrl || "/placeholder-food.png"}
        alt={category.name}
        className={styles.categoryImage}
      />

      <div className={styles.categoryName}>{category.name}</div>

      {category.description && (
        <div className={styles.categoryDescription}>{category.description}</div>
      )}

      {category.count !== undefined && (
        <div className={styles.categoryCount}>{category.count} items</div>
      )}
    </div>
  );
}
