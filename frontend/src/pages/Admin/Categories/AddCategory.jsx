import React, { useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import "./CategoryForm.css";

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

      const url = res.data.data ?? res.data;

      if (!url) {
        toast.error("Invalid upload response");
        return;
      }

      setImageUrl(url);
      toast.success("Image uploaded!");
    } catch (err) {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = () => {
    setImageUrl("");
    toast("Image removed");
  };

  const submit = async (e) => {
    e.preventDefault();

    if (!imageUrl) {
      toast.error("Please upload an image");
      return;
    }

    try {
      await API.post("/api/categories", { name, description, imageUrl });

      toast.success("Category added successfully!");
      nav("/admin/categories");
    } catch (err) {
      toast.error("Failed to add category");
    }
  };

  return (
    <div className="category-page">
       <div className="form-card">
      <button className="back-btn" onClick={() => nav(-1)}>
        <ArrowLeft size={18} /> Go Back
      </button>

      <h1 className="title">
        Add New <span>Category</span>
      </h1>

     
        {/* --- IMAGE UPLOAD SECTION --- */}
        <div className="upload-box">
          {imageUrl ? (
            <div className="preview-wrapper">
              <img src={imageUrl} className="preview-img" />

              <button className="remove-img" onClick={removeImage}>
                ×
              </button>
            </div>
          ) : (
            <label className="placeholder">
              <span className="upload-icon">⭡</span>
              <p>{uploading ? "Uploading..." : "Upload Category Image"}</p>
              <input type="file" accept="image/*" onChange={handleUpload} />
            </label>
          )}
        </div>

        {/* --- FORM FIELDS --- */}
        <form className="form-section" onSubmit={submit}>
          <label>Name of the category:</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />

          <button className="submit-btn" type="submit">
            Add Category
          </button>
        </form>
      </div>
    </div>
  );
}
