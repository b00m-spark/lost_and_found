import { Routes, Route, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

import Welcome from "./components/Welcome";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import Browse from "./pages/Browse";
import Search from "./pages/Search";
import UserPost from "./pages/UserPost";
import Layout from "./layouts/Layout";
import { getPosts, fetchMe, markResolved } from "./services/api";

export default function AppRoutes() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const [posts, setPosts] = useState([]);
  const [cardOpen, setCardOpen] = useState(false);

  useEffect(() => {
    getPosts()
      .then((data) => setPosts(data))
      .catch(() => setPosts(demoPosts));
  }, []);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await fetchMe();
        setCurrentUser(user);
        console.log("Current user set");
      } catch {
        setCurrentUser(null);
      }
    }

    loadUser();
  }, []);

  const handlePostClick = () => {
    if (!currentUser) {
      navigate("/login");
      return;
    }
    setCardOpen(true);
  };

  const handleResolved = async (postId) => {
    if (currentUser) {
      await markResolved(postId);
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: "Resolved" } : p))
      );
    } else {
      setPosts((prev) =>
        prev.map((p) => (p.id === postId ? { ...p, status: "Resolved" } : p))
      );
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Welcome
            cardOpen={cardOpen}
            setCardOpen={setCardOpen}
            setPosts={setPosts}
            onPostClick={handlePostClick}
          />
        }
      />
      <Route
        path="/login"
        element={<Login setCurrentUser={setCurrentUser} />}
      />
      <Route path="/signup" element={<Signup />} />

      <Route
        element={
          <Layout
            currentUser={currentUser}
            cardOpen={cardOpen}
            setCardOpen={setCardOpen}
            setPosts={setPosts}
            onPostClick={handlePostClick}
          />
        }
      >
        <Route
          path="/browse"
          element={
            <Browse
              posts={posts}
              setPosts={setPosts}
              onResolved={handleResolved}
            />
          }
        />
        <Route
          path="/search"
          element={
            <Search
              posts={posts}
              setAllPosts={setPosts}
            />
          }
        />
        <Route
          path="/profile/:id"
          element={<Profile posts={posts} setPosts={setPosts} />}
        />
        <Route
          path="/posts/:postId"
          element={<UserPost />}
        />
        
      </Route>
    </Routes>
  );
}
