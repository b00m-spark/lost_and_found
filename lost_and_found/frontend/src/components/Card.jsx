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
          <label>Title</label>
          <input
            type="text"
            value={title}
            required
            onChange={(e) => setTitle(e.target.value)}
          />

          <label>Type</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="Lost">Lost</option>
            <option value="Found">Found</option>
          </select>

          <label>Description</label>
          <textarea
            value={description}
            required
            onChange={(e) => setDescription(e.target.value)}
          />

          <label>Category</label>
          <select
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

          <label>Location</label>
          <input
            type="text"
            value={location}
            required
            onChange={(e) => setLocation(e.target.value)}
          />

          <label>Contact</label>
          <input
            type="text"
            value={contact}
            required
            onChange={(e) => setContact(e.target.value)}
          />

          <label>Picture (optional)</label>
          <input
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
