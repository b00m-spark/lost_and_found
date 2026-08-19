//routes handling posts
import express from "express";
import { createPost, createImage, getAllPosts, getPostById, getPostsByType, getPostsByUserId, updatePost, markPostResolved, deletePost } from "../models/postModel.js";

// handling images upload
// multer helps parse the form data request, saves the uploaded file somewhere, and adds a req.file so that you could access info about the image file
import multer from "multer"
import path from "path"
import { fileURLToPath } from "url";
// Specifies an absolute file path to save uploaded files (post images) in the /uploads folder
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage = multer.diskStorage({ // tells multer to save the file onto hard drive
    destination: (req, file, cb) => { // destination: save the file in the uploads folder
        cb(null, path.join(__dirname, "../uploads"));
    },
    filename: (req, file, cb) => { // rename the file to have a unique file name (with Date)
        cb(null, Date.now() + path.extname(file.originalname));
    },
});

const upload = multer({storage});

const router = express.Router();

// Create a new post
router.post("/", upload.single("image"), (req, res) => {
  // if user not logged in, return 401 error
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  // Get actual user id from session
  const userId = req.session.user.id;
  const {post_type, title, description, category, address, contact} = req.body;
  const imagePath = req.file ? `uploads/${req.file.filename}` : null;

  createPost(userId, post_type, title, description, category, address, contact, (err, result) => {
    if (err) {
      console.error("Error creating post:", err);
      return res.status(500).json({ message: "Failed to create post" });
    }
    // the insertId field of the returned result of sql is the autoincremented id of the post (post id)
    const postId = result.insertId;
    // create image
    if (imagePath) {
      createImage(postId, imagePath, req.file.originalname, (err2) => {
        if (err2){
            console.error("Error saving image:", err2);
            return res.status(500).json({message: "Failed to save image"});
        }
        res.status(201).json({ message: "Post created successfully (with image)", postId});
      });
    } else {
    res.status(201).json({ message: "Post created successfully (no image)", postId});
    }
  });
});

// Get all posts
router.get("/", (req, res) => {
  getAllPosts((err, results) => {
    if (err) {
      console.error("Error fetching posts:", err);
      return res.status(500).json({ message: "Error fetching posts" });
    }
    res.json(results);
  });
});

// Get post by post type (Lost/Found)
router.get("/type/:type", (req, res) => {
    const {type} = req.params;
    getPostsByType(type, (err, results) => {
        if (err) {
          console.error("Error fetching posts by type:", err);
          return res.status(500).json({ message: "Error fetching posts of lost/found type" });
        }
        res.json(results);
    });
});

// Get post by user id
router.get("/user/:userid", (req, res) => {
    const {userid} = req.params;
    getPostsByUserId(userid, (err, results) => {
        if (err) {
          console.error("Error fetching posts by user:", err);
          return res.status(500).json({ message: "Error fetching posts by user"});
        }
        res.json(results);
    });
});

// Get posts for current user.
router.get("/me", (req, res) => {
  // if user not logged in, return 401 error
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }
  const userId = req.session.user.id;
  getPostsByUserId(userId, (err, results) => {
      if (err) {
        console.error("Error fetching current user's posts:", err);
        return res.status(500).json({ message: "Error fetching posts by user"});
      }
      res.json(results);
  });
});

// Get one post by post id 
router.get("/:id", (req, res) => {
  const { id } = req.params;
  getPostById(id, (err, results) => {
    if (err) {
      console.error("Error fetching post:", err);
      return res.status(500).json({ message: "Error fetching post" });
    }
    if (results.length === 0) return res.status(404).json({ message: "Post not found" });
    res.json(results[0]);
  });
});

// Update a post by post id
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { title, description, category, address, contact } = req.body;

  updatePost(id, title, description, category, address, contact, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to update post" });
    res.json({ message: "Post updated successfully" });
  });
});

// Mark a post as resolved
router.put("/:id/resolve", (req, res) => {
    const { id } = req.params;

    markPostResolved(id, (err, result) => {
      if (err) return res.status(500).json({ message: "Failed to mark post as resolved" });
      res.json({ message: "Post marked as resolved successfully" });
  });
});

// Delete a post by post id
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  deletePost(id, (err, result) => {
    if (err) return res.status(500).json({ message: "Failed to delete post" });
    res.json({ message: "Post deleted successfully" });
  });
});

export default router;
