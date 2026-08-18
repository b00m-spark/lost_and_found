//Helper functions that interact with mysql database

import db from "../db/connection.js"
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

export const createPost = (user_id, post_type, title, description, category, address, contact, callback) => {
  const sql = `
    INSERT INTO posts (user_id, post_type, title, description, category, address, contact)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  db.query(sql, [user_id, post_type, title, description, category, address, contact], callback);
};

export const createImage = (post_id, file_path, file_name, callback) => {
  const sql = `
    INSERT INTO images (post_id, file_path, file_name)
    VALUES (?, ?, ?)
  `;
  db.query(sql, [post_id, file_path, file_name], callback);
};

export const getAllPosts = (callback) => {
  const sql = `SELECT p.*, i.file_path, u.name AS user_name
    FROM posts p
    LEFT JOIN images i ON p.id = i.post_id
    LEFT JOIN users u ON p.user_id = u.id
    ORDER BY p.created_at DESC`;
  db.query(sql, callback);
};

export const getPostById = (id, callback) => {
  const sql = `SELECT p.*, i.file_path, u.name AS user_name
    FROM posts p
    LEFT JOIN images i ON p.id = i.post_id 
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.id = ?  
    ORDER BY p.created_at DESC`;
  db.query(sql, [id], callback);
};

export const getPostsByType = (post_type, callback) => {
  const sql = `SELECT p.*, i.file_path
    FROM posts p
    LEFT JOIN images i ON p.id = i.post_id 
    WHERE p.post_type = ? 
    ORDER BY p.created_at DESC`;
  db.query(sql, [post_type], callback);
};

export const getPostsByUserId = (user_id, callback) => {
  const sql = `SELECT p.*, i.file_path, u.name AS user_name
    FROM posts p
    LEFT JOIN images i ON p.id = i.post_id 
    LEFT JOIN users u ON p.user_id = u.id
    WHERE p.user_id = ? 
    ORDER BY p.created_at DESC`;
  db.query(sql, [user_id], callback);
};

export const updatePost = (id, title, description, category, address, contact, callback) => {
  const sql = `
    UPDATE posts
    SET title=?, description=?, category=?, address=?, contact=?
    WHERE id=?
  `;
  db.query(sql, [title, description, category, address, contact, id], callback);
};

export const markPostResolved = (id, callback) => {
  const sql = `
    UPDATE posts
    SET status = 'Resolved'
    WHERE id = ?
  `;
  db.query(sql, [id], callback);
};


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function deletePost(id, callback) {
  // 1. Check if post exists
  db.query("SELECT * FROM posts WHERE id = ?", [id], async (err, postRows) => {
    if (err) return callback(err);

    if (postRows.length === 0) {
      return callback(new Error("Post not found"));
    }

    // 2. Check if image exists
    db.query("SELECT file_path FROM images WHERE post_id = ?", [id], async (err, imageRows) => {
      if (err) return callback(err);

      const filePath = imageRows.length > 0 ? imageRows[0].file_path : null;

      // 3. Delete image database row
      db.query("DELETE FROM images WHERE post_id = ?", [id], async (err) => {
        if (err) return callback(err);

        // 4. Delete post database row
        db.query("DELETE FROM posts WHERE id = ?", [id], async (err) => {
          if (err) return callback(err);

          // 5. Delete actual image file if it exists
          if (filePath) {
            const absolutePath = path.join(process.cwd(), filePath);
            try {
              fs.unlink(absolutePath, err => {
                if (err) {
                  console.error("Warning: image file deletion failed:", err.message);
                }
              });
            } catch (err) {
              console.error("Warning: file deletion failed:", err.message);
              // Delete will not fail if image file failed to get deleted, instead will throw warning
            }
          }

          callback(null, { success: true });
        });
      });
    });
  });
}
