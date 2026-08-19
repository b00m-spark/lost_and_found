// routes handeling login and signup

import express from "express";
import session from "express-session";
import bcrypt from "bcryptjs";
import { createUser, findUserByEmail } from "../models/userModel.js";

const router = express.Router();

const MAX_NAME_LENGTH = 100;
const MAX_EMAIL_LENGTH = 100;
const MAX_PASSWORD_LENGTH = 128;

function isValidAuthText(value, maxLength) {
  return typeof value === "string" && value.trim().length > 0 && value.length <= maxLength;
}

// Signup //
router.post("/signup", (req, res) => {

  //extract name, email, and password from req.body
  const { name, email, password } = req.body;

  if (
    !isValidAuthText(name, MAX_NAME_LENGTH) ||
    !isValidAuthText(email, MAX_EMAIL_LENGTH) ||
    !isValidAuthText(password, MAX_PASSWORD_LENGTH)
  ) {
    return res.status(400).json({ message: "Invalid signup information" });
  }

  findUserByEmail(email, (err, results) => { //using callback async
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    
    // First check if the email already exists, if it does, return 400 error
    if (results.length > 0) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // Hash the password using bcrypt.hashSync, "10" is the "salt rounds" controlling how secure the hash is
    const hashedPassword = bcrypt.hashSync(password, 10);

    createUser(name, email, hashedPassword, (err2) => {
      if (err2) {
        console.error("Error creating user:", err2);
        return res.status(500).json({ message: "Could not create user" });
      }
      res.json({ message: "User registered successfully" });
    });
  });
});

// Login //
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    !isValidAuthText(email, MAX_EMAIL_LENGTH) ||
    !isValidAuthText(password, MAX_PASSWORD_LENGTH)
  ) {
    return res.status(400).json({ message: "Invalid login information" });
  }

  findUserByEmail(email, (err, results) => { //using callback async
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ message: "Server error" });
    }
    // First check if the user exists (we can find the email), if it doesn't, return 400 error
    if (results.length === 0) {
      return res.status(400).json({ message: "User not found" });
    }

    // Get the user and check if password match
    const user = results[0];
    const isMatch = bcrypt.compareSync(password, user.password);

    // If password doesn't match, return 400 error
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password" });
    }

    req.session.user = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    res.json({ message: "Login successful", user: req.session.user });
  });
});

export default router;
