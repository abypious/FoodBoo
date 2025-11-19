import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "./FoodList.css";
import FoodCard from "../../../components/cards/FoodCard";


export default function FoodList() {
  const [foods, setFoods] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const nav = useNavigate();
  const { categoryId } = useParams();

  const [selectedCategory, setSelectedCategory] = useState(categoryId ?? "");

  useEffect(() => {
    loadCategories();
  }, []);

  useEffect(() => {
    loadFoods();
  }, [categoryId]);

  const loadCategories = async () => {
    const res = await API.get("/api/categories");
    setCategories(res.data.data ?? res.data);
  };

  const loadFoods = async () => {
    setLoading(true);
    const url = categoryId ? `/api/foods/category/${categoryId}` : "/api/foods";
    const res = await API.get(url);
    setFoods(res.data.data ?? res.data);
    setLoading(false);
  };

  const handleFilter = (e) => {
    const val = e.target.value;
    setSelectedCategory(val);

    if (val === "") nav("/admin/foods");
    else nav(`/admin/foods/category/${val}`);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <div className="top-bar">
        <input
          placeholder="Enter the food you are looking for"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select className="filter-dropdown" value={selectedCategory} onChange={handleFilter}>
          <option value="">All</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="grid-list">
        {foods
          .filter(f => f.name.toLowerCase().includes(search.toLowerCase()))
          .map((food) => (
            <FoodCard
              key={food.id}
              food={food}
              onClick={() => nav(`/admin/foods/edit/${food.id}`)}
            >
              <button
                className="review-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  nav(`/admin/foods/edit/${food.id}`);
                }}
              >
                Reviews →
              </button>
            </FoodCard>
        ))}
      </div>

      <button className="add-btn" onClick={() => nav("/admin/foods/add")}>
        + Add Food
      </button>
    </div>
  );
}
