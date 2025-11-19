import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./Categories.css";

export default function CategoriesList() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const nav = useNavigate();

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    setLoading(true);
    try {
      const res = await API.get("/api/categories");
      setCategories(res.data.data ?? res.data);
    } finally {
      setLoading(false);
    }
  };

  const remove = async (id) => {
    if (!confirm("Delete this category?")) return;
    await API.delete(`/api/categories/${id}`);
    load();
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="admin-container">
      <div className="top-bar">
        <input placeholder="What kind of category are you looking for?" />
        <button className="filter-btn">Filter ▼</button>
      </div>

      <h4 className="list-title">Categories</h4>

      <div className="grid-list">
        {categories.map((c) => (
          <div
            key={c.id}
            className="item-card"
            onClick={() => nav(`/admin/foods/category/${c.id}`)}
          >
            <img
              src={c.imageUrl || "/placeholder-food.png"}
              className="item-img"
            />

            <div className="item-content">
              <h5>{c.name}</h5>
              <p>{c.description}</p>

              <div className="actions" onClick={(e) => e.stopPropagation()}>
                <button
                  className="edit-btn"
                  onClick={() => nav(`/admin/categories/edit/${c.id}`)}
                >
                  Edit
                </button>
                <button className="delete-btn" onClick={() => remove(c.id)}>
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button className="add-btn" onClick={() => nav("/admin/categories/add")}>
        + Add Category
      </button>
    </div>
  );
}
