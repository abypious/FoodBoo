// src/pages/Admin/Food/AddFood.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AddFood() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [categories, setCategories] = useState([]);

  // 4 images → stored as array of urls
  const [imageUrls, setImageUrls] = useState(["", "", "", ""]);
  const [uploadingIndex, setUploadingIndex] = useState(null);

  const nav = useNavigate();

  // Load categories
  useEffect(() => {
    API.get("/api/categories")
      .then((r) => {
        const data = r.data.data ?? r.data;
        setCategories(data);
      })
      .catch(console.error);
  }, []);

  // --- Upload Handler for each slot ---
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
    } catch (err) {
      console.error("Upload failed", err);
      alert("Image upload failed");
    } finally {
      setUploadingIndex(null);
    }
  };

  // --- Submit Food ---
  const submit = async (e) => {
    e.preventDefault();

    if (!imageUrls[0]) {
      return alert("At least one image (Image 1) is required.");
    }

    try {
      await API.post("/api/foods", {
        name,
        description,
        category: { id: categoryId },
        imageUrls, // send all 4 images
      });

      alert("Food added successfully");
      nav("/admin/foods");
    } catch (err) {
      console.error(err);
      alert("Failed to add food");
    }
  };

  return (
    <div className="container mt-3">
      <h3>Add Food</h3>

      <form onSubmit={submit} style={{ maxWidth: 720 }}>
        <label>Name</label>
        <input
          className="form-control"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />

        <label className="mt-2">Description</label>
        <textarea
          className="form-control"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />

        <label className="mt-2">Category</label>
        <select
          className="form-control"
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          required
        >
          <option value="">Choose category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* ---------- IMAGE UPLOAD AREA ---------- */}
        <label className="mt-3">Food Images (1 required, 4 max)</label>

        {[0, 1, 2, 3].map((i) => (
          <div key={i} style={{ marginTop: "10px" }}>
            <strong>Image {i + 1}{i === 0 ? " *" : ""}</strong>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => handleUpload(e, i)}
            />

            {uploadingIndex === i && <p>Uploading...</p>}

            {imageUrls[i] && (
              <img
                src={imageUrls[i]}
                alt={`preview-${i}`}
                style={{
                  width: 140,
                  marginTop: 8,
                  borderRadius: 8,
                  border: "1px solid #ddd",
                }}
              />
            )}
          </div>
        ))}

        <div style={{ marginTop: 20 }}>
          <button className="btn btn-primary" type="submit">
            Create Food
          </button>
        </div>
      </form>
    </div>
  );
}
