import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import "./FoodForm.css";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function AddFood() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);
  const [imageUrls, setImageUrls] = useState([null, null, null, null]);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const nav = useNavigate();

  useEffect(() => {
    API.get("/api/categories")
      .then((r) => setCategories(r.data.data ?? r.data))
      .catch(() => toast.error("Failed to load categories"));
  }, []);

  const handleUpload = async (e, index) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingIndex(index);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await API.post("/api/upload/food", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data.data ?? res.data;

      setImageUrls((prev) => {
        const updated = [...prev];
        updated[index] = url;
        return updated;
      });

      toast.success(`Image ${index + 1} uploaded`);
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!imageUrls[0]) {
      toast.error("First image is required");
      return;
    }

    try {
      await API.post("/api/foods", {
        name,
        description,
        category: { id: categoryId },
        imageUrls,
      });

      toast.success("Food added successfully");
      nav("/admin/foods");
    } catch {
      toast.error("Failed to add food");
    }
  };

  return (
    <div className="food-form-page">
      <div className="form-card">
      <button className="back-btn" onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> Go Back
      </button>

      <h1 className="title">
        Add New <span>Food</span>
      </h1>

      
        <div className="upload-grid">
          {[0, 1, 2, 3].map((i) => (
            <label key={i} className="upload-box">

              {imageUrls[i] ? (
                <div className="preview-wrapper">
                  <img src={imageUrls[i]} className="preview-img" alt="Food" />

                  <button
                    type="button"
                    className="remove-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      setImageUrls((prev) => {
                        const updated = [...prev];
                        updated[i] = null;
                        return updated;
                      });
                    }}
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="placeholder">
                  <span className="upload-icon">⭡</span>
                  <p>Upload Image of the dish</p>
                </div>
              )}

              <input
                type="file"
                accept="image/*"
                onChange={(e) => handleUpload(e, i)}
              />

              {uploadingIndex === i && (
                <div className="upload-spinner">
                  <div className="spinner"></div>
                </div>
              )}
            </label>
          ))}
        </div>


        <form onSubmit={submit} className="form-section">
          <div className="form-row">
            <div>
              <label>Name of the dish:</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div><br />

            <div>
              <label>Category of the dish:</label>
              <select
                value={categoryId}
                onChange={(e) => setCategoryId(e.target.value)}
                required
              >
                <option value="">Select category</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="submit-btn">Add Food</button>
        </form>
      </div>
    </div>
  );
}
