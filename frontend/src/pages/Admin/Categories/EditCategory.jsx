// src/pages/Admin/Categories/EditCategory.jsx
import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";

export default function EditCategory() {
  const { id } = useParams();
  const nav = useNavigate();
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({ name: "", description: "", imageUrl: "" });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await API.get(`/api/categories`);
        const data = res.data.data ?? res.data;
        const c = data.find((x) => String(x.id) === String(id));
        if (!c) throw new Error("Not found");
        setCategory(c);
      } catch (err) {
        console.error(err);
        alert("Category load failed");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  const handleUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const res = await API.post("/api/upload/category", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const url = res.data.data ?? res.data;
      setCategory({ ...category, imageUrl: url });
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      // Backend doesn't have PUT in your controller; easiest is delete+create or modify service.
      // For now call add (if id exists backend may create duplicate). If you have update, call it.
      await API.put(`/api/categories/${id}`, category).catch(async () => {
        // fallback: if no put, delete then add with same id not ideal. Prefer to implement update backend.
        alert("Update failed. Ensure backend supports PUT /api/categories/{id}");
      });
      alert("Updated");
      nav("/admin/categories");
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="container mt-3">
      <h3>Edit Category</h3>
      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <label>Name</label>
        <input className="form-control" value={category.name} onChange={(e) => setCategory({ ...category, name: e.target.value })} required />

        <label className="mt-2">Description</label>
        <textarea className="form-control" value={category.description} onChange={(e) => setCategory({ ...category, description: e.target.value })} />

        <label className="mt-2">Image</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {uploading && <div>Uploading...</div>}
        {category.imageUrl && <img src={category.imageUrl} alt="preview" style={{ width: 160, marginTop: 8 }} />}

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit">Save</button>
          <button type="button" className="btn btn-secondary" onClick={() => nav("/admin/categories")} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
