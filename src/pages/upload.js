import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/upload.css";

function Upload() {
  const [formData, setFormData] = useState({
    itemName: "",
    description: "",
    image: null,
  });

  const [status, setStatus] = useState({ type: "", message: "" });
  const navigate = useNavigate();

  // Handle input changes for text and file fields
  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  // Submit form data to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus({ type: "", message: "" });

    const { itemName, description, image } = formData;
    const posterId = localStorage.getItem("userId");

    // Basic validation
    if (!itemName || !description || !image || !posterId) {
      setStatus({ type: "error", message: "All fields are required." });
      return;
    }

    const validFormats = ["image/png", "image/jpeg", "image/jpg"];
    if (!validFormats.includes(image.type)) {
      setStatus({ type: "error", message: "Only .jpg, .jpeg, .png formats allowed." });
      return;
    }

    // Create payload for backend
    const payload = new FormData();
    payload.append("item_name", itemName);
    payload.append("description", description);
    payload.append("image", image);
    payload.append("poster_id", posterId);

    try {
      const response = await fetch("http://localhost:5000/api/upload", {
        method: "POST",
        body: payload,
      });

      if (!response.ok) throw new Error("Upload failed");

      setStatus({ type: "success", message: "Item uploaded successfully!" });
      setTimeout(() => navigate("/"), 2000); // Redirect to homepage after success
    } catch (error) {
      console.error("Upload error:", error);
      setStatus({ type: "error", message: "Something went wrong. Please try again." });
    }
  };

  return (
    <div className="App">
      <a href="/" className="app-title">Cavemanomics</a>

      <header className="upload-header">
        <h2 className="upload-title">Upload an Item</h2>
        <p className="upload-description">Add an item name, description, and image to post it for trade.</p>

        <form className="input-container" onSubmit={handleSubmit}>
          <input
            type="text"
            name="itemName"
            placeholder="Item Name"
            className="input-field"
            value={formData.itemName}
            onChange={handleChange}
          />
          <textarea
            name="description"
            placeholder="Item Description"
            className="input-field"
            value={formData.description}
            onChange={handleChange}
          />
          <input
            type="file"
            name="image"
            accept=".jpg,.jpeg,.png"
            className="input-field"
            onChange={handleChange}
          />

          <button type="submit" className="bttn">Upload</button>
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
      </header>
    </div>
  );
}

export default Upload;
