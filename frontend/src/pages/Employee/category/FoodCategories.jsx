import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useFoodCategoryStore from "../../../store/foodCategoryStore";
import CategoryCard from "../../../components/cards/CategoryCard";
import styles from "./FoodCategories.module.css";
import { Search } from "lucide-react";

export default function FoodCategories() {
  const { categories, fetchCategories, loading } = useFoodCategoryStore();
  const [query, setQuery] = useState("");
  const nav = useNavigate();

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <div>Loading...</div>;

  const filtered = categories.filter((c) =>
    c.name.toLowerCase().includes(query.toLowerCase())
  );

  const openCategory = (category) => {
    nav(`/employee/categories/${category.id}`);
  };

  return (
    <div className={styles.pageCard}>
      
      <div className={styles.searchContainer}>
        <Search size={18} className={styles.searchIcon} />
        <input
          placeholder="What kind of food you want?"
          className={styles.searchInput}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className={styles.orangeBar}></div>

      <h3 className={styles.heading}>Top Recommendations</h3>

      <div className={styles.grid}>
        {filtered.length === 0 && (
          <p className={styles.noResults}>No matching categories found.</p>
        )}

        {filtered.map((category) => (
          <CategoryCard
            key={category.id}
            category={category}
            onClick={openCategory}
          />
        ))}
      </div>
    </div>
  );
}
