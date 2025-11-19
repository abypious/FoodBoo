// src/pages/Admin/Categories/AddCategory.jsx
import React, { useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";

export default function AddCategory() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [uploading, setUploading] = useState(false);
  const nav = useNavigate();

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
      const url = res.data.data;
        if (!url || typeof url !== "string") {
          console.error("Upload response invalid:", res.data);
          alert("Image upload failed — invalid response");
          return;
        }
        setImageUrl(url);
 
    } catch (err) {
      console.error("Upload failed", err);
      alert("Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.post("/api/categories", { name, description, imageUrl });
      alert("Category added");
      nav("/admin/categories");
    } catch (err) {
      console.error("Add category", err);
      alert("Failed to add");
    }
  };

  return (
    <div className="container mt-3">
      <h3>Add Category</h3>
      <form onSubmit={submit} style={{ maxWidth: 600 }}>
        <label>Name</label>
        <input className="form-control" value={name} onChange={(e) => setName(e.target.value)} required />

        <label className="mt-2">Description</label>
        <textarea className="form-control" value={description} onChange={(e) => setDescription(e.target.value)} />

        <label className="mt-2">Image</label>
        <input type="file" accept="image/*" onChange={handleUpload} />
        {uploading && <div>Uploading...</div>}
        {imageUrl && <img src={imageUrl} alt="preview" style={{ width: 160, marginTop: 8 }} />}

        <div style={{ marginTop: 12 }}>
          <button className="btn btn-primary" type="submit">Create</button>
          <button type="button" className="btn btn-secondary" onClick={() => nav("/admin/categories")} style={{ marginLeft: 8 }}>Cancel</button>
        </div>
      </form>
    </div>
  );
}
