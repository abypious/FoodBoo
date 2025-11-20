import { useParams, useNavigate } from "react-router-dom";
import useFoodStore from "../../../store/foodStore";
import { useEffect, useState } from "react";
import styles from "./FoodList.module.css";
import { ArrowLeft, Search, SlidersHorizontal } from "lucide-react";

import FoodItemCard from "../FoodItemCard/FoodItemCard";

export default function FoodList() {
  const { categoryId } = useParams();
  const { foods, fetchFoodsByCategory, loading } = useFoodStore();
  const nav = useNavigate();
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchFoodsByCategory(categoryId);
  }, [categoryId]);

  if (loading) return <div className={styles.loading}>Loading...</div>;

  return (
    <div className={styles.pageCard}>
      {/* Header */}
      <div className={styles.header}>
        <button className={styles.backBtn} onClick={() => nav(-1)}>
          <ArrowLeft size={18} />
          Go Back
        </button>

        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            className={styles.searchInput}
            placeholder="Search food..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className={styles.orangeBar}></div>

      {/* Food Grid */}
      <div className={styles.grid}>
        {foods
          .filter((f) =>
            f.name.toLowerCase().includes(search.toLowerCase())
          )
          .map((food) => (
            <FoodItemCard
              key={food.id}
              food={food}
              onClick={() => nav(`/employee/food/${food.id}`)}
            />
          ))}
      </div>
    </div>
  );
}
