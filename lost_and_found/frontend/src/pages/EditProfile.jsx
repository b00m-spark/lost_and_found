import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { API_BASE } from "../services/api";

export default function EditProfile({currentUser, setCurrentUser}) {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({ 
    name: currentUser?.name || "", 
    email: currentUser?.email || "" 
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState(null);

  const nav = useNavigate();

  // -------------------------
  // Fetch current user
  // -------------------------
  
  useEffect(() => {
  async function loadUser() {
    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        credentials: "include",
      });

      if (!res.ok) throw new Error("Failed to fetch user");

      const data = await res.json();

      setUser(data); 
      setForm({            
        name: data.name,
        email: data.email
      });
    } catch (e) {
      setErr("Could not load profile.");
    } finally {
      setLoading(false);
    }
  }

  loadUser();
}, []);


  // -------------------------
  // Form field update
  // -------------------------
  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // -------------------------
  // Submit handler
  // -------------------------
  async function handleSave(e) {
    e.preventDefault();
    setErr(null);
    setSaving(true);

    try {
      const res = await fetch(`${API_BASE}/users/me`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          name: form.name,
          email: form.email
        })
});

      if (!res.ok) {
        throw new Error("Profile update failed");
      }

      const updated = await res.json();

      // Optional: update local user state
      //setUser((prev) => ({ ...prev, ...form }));
      setCurrentUser(updated);

      // Navigate to profile page  
      nav(`/profile/${user.id}`);
    } catch (e) {
      console.error(e);
      setErr("Failed to update profile.");
    } finally {
      setSaving(false);
    }
  }

  // -------------------------
  // Loading state
  // -------------------------
  if (loading) return <p>Loading profile...</p>;

  // -------------------------
  // UI
  // -------------------------
  return (
    <div className="edit-profile-container">
      <h2>Edit Profile</h2>

      {err && <p className="error">{err}</p>}

      <form onSubmit={handleSave}>
        <label>Name</label>
        <input
          name="name"
          value={form.name}
          onChange={onChange}
          type="text"
        />

        <label>Email</label>
        <input
          name="email"
          value={form.email}
          onChange={onChange}
          type="email"
        />

        <button disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </button>
      </form>

      <button onClick={() => nav(-1)}>Cancel</button>
    </div>
  );
}
