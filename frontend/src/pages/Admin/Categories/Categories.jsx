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
      <div className="toolbar">
        <div className="search-wrapper">
          <span className="search-icon">🔍</span>
          <input
            className="search-input"
            placeholder="Search categories..."
          />
        </div>

        <button
          className="premium-add-btn"
          onClick={() => nav("/admin/categories/add")}
        >
          ✚ Add Category
        </button>
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
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
