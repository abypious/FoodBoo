import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import "./CategoryForm.css";

export default function EditCategory() {
  const { id } = useParams();
  const nav = useNavigate();

  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState({
    name: "",
    description: "",
    imageUrl: "",
  });
  const [uploading, setUploading] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    API.get(`/api/categories`)
      .then((r) => {
        const list = r.data.data ?? r.data;
        const found = list.find((c) => String(c.id) === String(id));

        if (!found) {
          toast.error("Category not found");
          nav("/admin/categories");
          return;
        }

        setCategory(found);
      })
      .catch(() => toast.error("Failed to load category"))
      .finally(() => setLoading(false));
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

      setCategory((prev) => ({ ...prev, imageUrl: url }));
      toast.success("Image uploaded");
    } catch {
      toast.error("Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const removeImage = async () => {
    const ok = await showConfirm(
      "Remove Image",
      "Are you sure you want to remove this image?"
    );
    if (!ok) return;

    setCategory((prev) => ({ ...prev, imageUrl: "" }));
    toast.success("Image removed");
  };

  const submit = async (e) => {
    e.preventDefault();

    try {
      await API.put(`/api/categories/${id}`, category);
      toast.success("Category updated");
      nav("/admin/categories");
    } catch {
      toast.error("Failed to update category");
    }
  };

  if (loading) return <div className="p-4">Loading...</div>;

  return (
    <div className="category-page">
      <div className="form-card">
          <div className="top-row">
            <button className="back-btn" onClick={() => nav(-1)}>
              <ArrowLeft size={18} /> Go Back
            </button>
  
            <h1 className="title">
              Edit <span>Category</span>
            </h1>
  
            <button
              className="danger-btn"
              onClick={() => setConfirmDelete(true)}
            >
              Delete Category
            </button>  
          </div>


        <div className="upload-box">
          {category.imageUrl ? (
            <div className="preview-wrapper">
              <img src={category.imageUrl} className="preview-img" />

              <button className="remove-img" onClick={removeImage}>
                ×
              </button>
            </div>
          ) : (
            <label className="placeholder">
              <span className="upload-icon">⭡</span>
              <p>Upload Category Image</p>
              <input type="file" accept="image/*" onChange={handleUpload} />
            </label>
          )}
        </div>

        {uploading && <p style={{ marginTop: 10 }}>Uploading...</p>}

        <form className="form-section" onSubmit={submit}>
          <label>Name of the category:</label>
          <input
            value={category.name}
            onChange={(e) =>
              setCategory({ ...category, name: e.target.value })
            }
            required
          />

          <label>Description:</label>
          <textarea
            value={category.description}
            onChange={(e) =>
              setCategory({ ...category, description: e.target.value })
            }
          />

          <button className="submit-btn">Save Changes</button>
        </form>
      </div>
    </div>
  );
}


function showConfirm(title, message) {
  return new Promise((resolve) => {
    const modal = document.createElement("div");
    modal.className = "confirm-overlay";

    modal.innerHTML = `
      <div class="confirm-box">
        <h3>${title}</h3>
        <p>${message}</p>
        <div class="confirm-actions">
          <button class="confirm-cancel">Cancel</button>
          <button class="confirm-ok">Yes</button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);

    modal.querySelector(".confirm-cancel").onclick = () => {
      modal.remove();
      resolve(false);
    };

    modal.querySelector(".confirm-ok").onclick = () => {
      modal.remove();
      resolve(true);
    };
  });
}
