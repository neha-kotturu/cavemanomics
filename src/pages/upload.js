import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Auth from './auth';
import "../css/upload.css";

function Upload() {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    image: null,
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const { itemName, description, image } = formData;
    const user = JSON.parse(localStorage.getItem("user"));
    const posterId = user?.id || user?._id;


    if (!itemName || !description || !image || !posterId) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }

    const validFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!validFormats.includes(image.type)) {
      setStatus({ type: "error", message: "Only .jpg, .jpeg, .png formats allowed." });
      return;
    }

    const payload = new FormData();
    payload.append("item_name", itemName);
    payload.append("item_description", description);
    payload.append("item_image", image);
    payload.append("poster_id", posterId);

    try {
      const response = await fetch("http://localhost:5001/api/upload", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Upload failed");

      setStatus({ type: "success", message: "Item uploaded successfully!" });
      setTimeout(() => navigate("/main"), 2000);
    } catch (error) {
      console.error("Upload error:", error);
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <Auth>
      <div className="upload-container">
        <div className="upload-box">
          <h2 className="upload-heading">Upload an Item</h2>
          <p className="upload-description">Add a name, description, and image to post your item.</p>

          <form className="upload-form" onSubmit={handleSubmit}>
            <input
              type="text"
              name="itemName"
              placeholder="Item Name"
              className="upload-input"
              value={formData.itemName}
              onChange={handleChange}
              required
            />
            <textarea
              name="description"
              placeholder="Item Description"
              className="upload-input"
              value={formData.description}
              onChange={handleChange}
              required
            />
            <input
              type="file"
              name="image"
              accept=".jpg,.jpeg,.png"
              className="upload-input"
              onChange={handleChange}
              required
            />
            <button type="submit" className="upload-button">Upload</button>
          </form>

          {formData.image && (
            <div className="preview-container">
              <p>Preview:</p>
              <img
                src={URL.createObjectURL(formData.image)}
                alt="Preview"
                className="preview-image"
              />
            </div>
          )}

          {status.message && (
            <p className={`status-message ${status.type === "error" ? "error" : "success"}`}>
              {status.message}
            </p>
          )}
        </div>
      </div>
    </Auth>
  );
}

export default Upload;
