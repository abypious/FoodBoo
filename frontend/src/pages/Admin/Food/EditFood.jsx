import React, { useEffect, useState } from "react";
import API from "../../../api/axiosConfig";
import { useNavigate, useParams } from "react-router-dom";
import "./FoodForm.css";
import { ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";

export default function EditFood() {
  const { id } = useParams();
  const nav = useNavigate();

  const [food, setFood] = useState(null);
  const [categories, setCategories] = useState([]);
  const [uploadingIndex, setUploadingIndex] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  useEffect(() => {
    API.get("/api/categories")
      .then((r) => setCategories(r.data.data ?? r.data));

    API.get(`/api/foods/${id}`)
      .then((r) => {
        const f = r.data.data ?? r.data;
        setFood({
          ...f,
          imageUrls: Array.isArray(f.imageUrls) ? f.imageUrls : [],
        });
      });
  }, [id]);

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

      setFood((prev) => {
        const updated = [...prev.imageUrls];
        updated[index] = url;
        return { ...prev, imageUrls: updated };
      });

      toast.success("Image uploaded");
    } catch {
      toast.error("Upload failed");
    }

    setUploadingIndex(null);
  };

  const removeImage = (index) => {
    setFood((prev) => {
      const updated = [...prev.imageUrls];
      updated[index] = "";
      return { ...prev, imageUrls: updated };
    });
  };

  const submit = async (e) => {
    e.preventDefault();
    try {
      await API.put(`/api/foods/${id}`, food);
      toast.success("Food updated");
      nav("/admin/foods");
    } catch {
      toast.error("Update failed");
    }
  };

  const handleDelete = async () => {
    try {
      await API.delete(`/api/foods/${id}`);
      toast.success("Food deleted");
      nav("/admin/foods");
    } catch {
      toast.error("Delete failed");
    }
  };

  if (!food) return <div className="p-4">Loading...</div>;

  return (
    <div className="food-form-page">
      <div className="form-card">

        <div className="top-row">
          <button className="back-btn" onClick={() => nav(-1)}>
            <ArrowLeft size={18} /> Go Back
          </button>

          <h1 className="title">
            Edit <span>Food</span>
          </h1>

          <button
            className="danger-btn"
            onClick={() => setConfirmDelete(true)}
          >
            Delete Food
          </button>  
        </div>

      
        <div className="upload-grid">
          {[0, 1, 2, 3].map((i) => (
            <label key={i} className="upload-box">
              {food.imageUrls[i] ? (
                <div className="preview-wrapper">
                  <img
                    src={food.imageUrls[i]}
                    className="preview-img"
                    alt="food"
                  />

                  <button
                    type="button"
                    className="remove-img"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeImage(i);
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
            </label>
          ))}
        </div>

        <form onSubmit={submit} className="form-section">
          <div className="form-row">
            <div>
              <label>Name of the dish:</label>
              <input
                value={food.name}
                onChange={(e) => setFood({ ...food, name: e.target.value })}
                required
              />
            </div>

            <div>
              <label>Category of the dish:</label>
              <select
                value={food.category?.id || ""}
                onChange={(e) =>
                  setFood({
                    ...food,
                    category: { id: e.target.value },
                  })
                }
                required
              >
                <option value="">Select</option>
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
            value={food.description}
            onChange={(e) =>
              setFood({ ...food, description: e.target.value })
            }
          />

          <button className="submit-btn">Save Changes</button>
        </form>
      </div>

      {confirmDelete && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Delete Food?</h3>
            <p>This action cannot be undone.</p>

            <div className="modal-actions">
              <button
                className="modal-cancel"
                onClick={() => setConfirmDelete(false)}
              >
                Cancel
              </button>
              <button className="modal-delete" onClick={handleDelete}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
