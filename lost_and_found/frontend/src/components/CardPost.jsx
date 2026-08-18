import { useState } from "react";
import { ReactComponent as LocIcon } from "../images/loc.svg";
import { Link, useNavigate } from "react-router-dom";
import { BACKEND_BASE, deletePost } from "../services/api";

export default function CardPost({
  post,
  viewMode = "column",
  isAccountOwner = false,
  onResolved,
  clickable = true,
}) {
  const isResolved =
    post.status === "Resolved" || post.resolved === 1 || post.resolved === true;
  const mode = viewMode === "card" ? "cardPostCard" : "cardPostCol";
  const nav = useNavigate();
  const [showOptions, setShowOptions] = useState(false);

  const handleResolved = async () => {
    if (!onResolved) return;
    await onResolved(post.id);
  };

  const handleClick = () => {
    if (!clickable) return;
    nav(`/posts/${post.id}`);
  };

  const handleMoreClick = (e) => {
    e.stopPropagation();
    if (isAccountOwner) {
      setShowOptions(true);
    }
  };

  const handleDelete = async (e) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this post?")) {
      deletePost(post.id);
      setShowOptions(false);
    }
  };

  const closeOptions = (e) => {
    e.stopPropagation();
    setShowOptions(false);
  };

  return (
    <div className={`cardPost ${mode}`}>
      <article className="post" onClick={handleClick}>
        <div className="cardStyle">
          <div className="cardHeader">
            <div className="userInfo">
              <div className="avatar" />
              <div>
                <div className="userName">
                  <Link to={`/profile/${post.user_id}`} className="profileLink">
                    {post.user_name}
                  </Link>
                </div>
              </div>
            </div>
            <button className="moreButton" onClick={handleMoreClick}>
              ⋯
            </button>
          </div>

          {isResolved ? (
            <div className="resolved">Returned</div>
          ) : (
            <div className="category">{post.category}</div>
          )}

          <div className="cardContent">
            <h4>{post.title}</h4>
            <p>{post.description}</p>
            {post.address && (
              <div className="address">
                <LocIcon className="locIcon" width={20} height={15}></LocIcon>
                <span>{post.address}</span>
              </div>
            )}
          </div>

          {post.file_path && (
            <div className="mediaContainer">
              <img
                src={`${BACKEND_BASE}/${post.file_path}`}
                alt="Lost item"
                className="postImage"
              />
            </div>
          )}

          <div className="actionBar">
            {isAccountOwner && !isResolved && (
              <button
                className="actionButton returnedButton"
                onClick={handleResolved}
              >
                Mark as returned
              </button>
            )}
          </div>
        </div>
      </article>
      {showOptions && (
        <div className="optionsWrapper" onClick={closeOptions}>
          <div className="options" onClick={(e) => e.stopPropagation()}>
            <h3>Post Options</h3>
            <button
              className="optionButton deleteButton"
              onClick={handleDelete}
            >
              Delete Report
            </button>
            <button
              className="optionButton cancelButton"
              onClick={closeOptions}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
