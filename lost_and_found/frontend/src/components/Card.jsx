import { useState } from "react";

export default function Card({ onClose, onReport }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [location, setLocation] = useState("");
  const [image, setImage] = useState(null);
  const [type, setType] = useState("Lost");
  const [contact, setContact] = useState("");
  function handleSubmit(e) {
    e.preventDefault();
    const post = {
      title,
      post_type: type,
      description,
      category,
      address: location,
      contact,
      image,
    };
    const formData = new FormData();
    Object.entries(post).forEach(([key, val]) => {
      if (val) formData.append(key, val);
    });
    onReport(formData);
    onClose();
  }

  return (
    <div className="card">
      <div className="cardStylePopup" style={{ width: "400px" }}>
        <h3>Report Item</h3>
        <form onSubmit={handleSubmit} className="formContainer">
          <label htmlFor="post-title">Title</label>
          <input
            id="post-title"
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <label htmlFor="post-type">Type</label>
          <select
            id="post-type"
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>

          <label htmlFor="post-description">Description</label>
          <textarea
            id="post-description"
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />

          <label htmlFor="post-category">Category</label>
          <select
            id="post-category"
            value={category}
            required
            onChange={(e) => setCategory(e.target.value)}
          >
            <option value="">Select category</option>
            <option value="Electronics">Electronics</option>
            <option value="Clothes">Clothes</option>
            <option value="Bottle">Bottle</option>
            <option value="Keys">Keys</option>
            <option value="Bag">Bag</option>
            <option value="Wallet">Wallet</option>
            <option value="Other">Other</option>
          </select>

          <label htmlFor="post-location">Location</label>
          <input
            id="post-location"
            type="text"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
          />

          <label htmlFor="post-contact">Contact</label>
          <input
            id="post-contact"
            type="text"
            value={contact}
            required
            onChange={(e) => setContact(e.target.value)}
          />

          <label htmlFor="post-image">Picture (optional)</label>
          <input
            id="post-image"
            type="file"
            accept="image/*"
            onChange={(e) => setImage(e.target.files[0])}
          />

          <div style={{ marginTop: "10px", display: "flex", gap: "10px" }}>
            <button type="submit" className="btnStyle">
              Report
            </button>
            <button type="button" className="btnCancel" onClick={onClose}>
              Close
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
