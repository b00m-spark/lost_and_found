import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../services/api";
import CardPost from "../components/CardPost";

export default function UserPost() {
  const { postId } = useParams();
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        const response = await getPostById(postId);
        setPost(response);
      } catch (err) {
        console.error("Error fetching [post]:", err);
      }
    }
    fetchPost();
  }, [postId]);

  if (!post) return null;

  return (
    <>
      <div className="headerWrapper">
        <h4>Post</h4>
      </div>
      <div className="profileWrapper">
        <div className="profileCard">
          <CardPost
            post={post}
            viewMode="column"
            isAccountOwner={false}
            clickable={false}
          />
          <p>Contact: {post.contact}</p>
        </div>
      </div>
    </>
  );
}
