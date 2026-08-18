import express from "express";
import { findUserById } from "../models/userModel.js";

const router = express.Router();

router.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const userId = req.session.user.id;

  findUserById(userId, (err, results) => {
    if (err) return res.status(500).json({ message: "Database error" });
    if (results.length === 0) return res.status(404).json({ message: "User not found" });

    const user = results[0];
    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
    });
  });
  
});

export default router;


