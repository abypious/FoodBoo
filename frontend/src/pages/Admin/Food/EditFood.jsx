// src/pages/Admin/Food/EditFood.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

export default function EditFood() {
  const { id } = useParams();
  const nav = useNavigate();
  const [food, setFood] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    // Fetch categories
    API.get("/api/categories")
      .then((r) => setCategories(r.data.data ?? r.data))
      .catch(console.error);

    // Fetch all foods then pick the one to edit
    API.get("/api/foods")
      .then((r) => {
        const list = r.data.data ?? r.data;
        const f = list.find((x) => String(x.id) === String(id));
        if (f) {
          // Ensure imageUrls is an array
          setFood({
            ...f,
            imageUrls: Array.isArray(f.imageUrls) ? f.imageUrls : [],
          });
        } else {
          setFood({
            name: "",
            description: "",
            category: {},
            imageUrls: [],
          });
        }
      })
      .catch(console.error);
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const fd = new FormData();
      fd.append("file", file);

      const res = await API.post("/api/upload/food", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      const url = res.data.data;
      if (!url) {
        alert("Upload failed");
        return;
      }

      setFood((prev) => ({
        ...prev,
        imageUrls: [...prev.imageUrls, url],
      }));
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = (url) => {
    setFood((prev) => ({
      ...prev,
      imageUrls: prev.imageUrls.filter((img) => img !== url),
    }));
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/foods/${id}`, food);
      alert("Updated");
      nav("/admin/foods");
    } catch (err) {
      console.error(err);
      alert("Update failed — ensure backend supports updating images");
    }
  };

  if (!food) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mt-3">
      <h3>Edit Food</h3>

      <form onSubmit={submit} style={{ maxWidth: 720 }}>
        <label>Name</label>
        <input
          className="form-control"
          value={food.name}
          onChange={(e) => setFood({ ...food, name: e.target.value })}
          required
        />

        <label className="mt-2">Description</label>
        <textarea
          className="form-control"
          value={food.description}
          onChange={(e) =>
            setFood({ ...food, description: e.target.value })
          }
        />

        <label className="mt-2">Category</label>
        <select
          className="form-control"
          value={food.category?.id || ""}
          onChange={(e) =>
            setFood({ ...food, category: { id: e.target.value } })
          }
          required
        >
          <option value="">Choose category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>

        {/* MULTIPLE IMAGE UPLOAD */}
        <label className="mt-3">Food Images</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {uploading && <div>Uploading...</div>}

        <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: 12 }}>
        {food.imageUrls.map((url, index) => (
          <div key={url || `img-${index}`} style={{ position: "relative" }}>
            <img
              src={url}
              alt=""
              style={{
                width: 120,
                height: 120,
                objectFit: "cover",
                borderRadius: 8,
                border: "1px solid #ddd",
              }}
            />

            <button
              type="button"
              onClick={() => removeImage(url)}
              style={{
                position: "absolute",
                top: -6,
                right: -6,
                background: "red",
                color: "#fff",
                border: "none",
                borderRadius: "50%",
                width: 22,
                height: 22,
                cursor: "pointer",
              }}
            >
              ×
            </button>
          </div>
        ))}
      </div>


        <div style={{ marginTop: 16 }}>
          <button className="btn btn-primary" type="submit">
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
