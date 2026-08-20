import { useState, useEffect } from "react";
import { API_BASE, markResolved } from "../services/api";
import CardPost from "../components/CardPost";

export default function Profile({ posts, setPosts }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [currTab, setCurrTab] = useState("posts");

  useEffect(() => {
    async function fetchUser() {
      try {
        const res = await fetch(`${API_BASE}/users/me`, {
          credentials: "include",
        });

        if (!res.ok) {
          setUser(null);
        } else {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchUser();
  }, []); 

  const profilePosts = user ? posts.filter(p => p.user_id === user.id) : [];

  const handleResolved = async (postId) => {
    await markResolved(postId);
    setPosts(prev => 
      prev.map(p => p.id === postId ? { ...p, status: "Resolved" } : p)
    );
  };

  const handleDeleted = (postId) => {
    // creates a new array of posts except the deleted post
    setPosts((prev) => prev.filter((p) => p.id !== postId));
  };

  return (
    <>
      <div className="headerWrapper">
        <h4>Profile</h4>
      </div>
      {loading && <p>Loading...</p>}
      {user && (
        <div className="profileWrapper">
          <div className="profileCard">
            <div className="contactInfo">
              <div className="rightContactInfo">
                <h2>{user.name}</h2>
                <p>{user.email}</p>
              </div>
              <div className="tempForImage"></div>
            </div>
            <div className="lowerCard">
              <div className="colWrapper">
                <div className="colBtns">
                  <button className={currTab === "posts" ? "tab active" : "tab" }
                  onClick={() => setCurrTab("posts")}>Posts</button>
                </div>
              </div>
            </div>
            <div className="postsWrapper">
            {currTab === "posts" && (
              <>
              {profilePosts.length === 0 ? (
                <p>Report a Lost/Found item</p>
              ) : (
                profilePosts.map((post) => (
                  <CardPost
                    key={post.id}
                    post={post}
                    viewMode="column"
                    isAccountOwner={true}
                    onResolved={handleResolved}
                    onDeleted={handleDeleted}
                  />
                ))
              )}
              </>
            )}
          </div>
          </div>
        </div>
      )}
    </>
  );
}
