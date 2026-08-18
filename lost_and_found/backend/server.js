import express from "express";
import session from "express-session";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import usersRouter from "./routes/users.js";   // ⭐ ADD THIS
import path from "path";

import { fileURLToPath } from "url";
import dotenv from "dotenv";
dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.FRONTEND_URL || "http://localhost:5178",
  credentials: true
}));

app.use(express.json());

app.use(session({
  secret: "h&gsk3!k023-9Afw",
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    maxAge: 1000 * 60 * 60,
  }
}));


app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);
app.use("/api/users", usersRouter);     // ⭐ MOUNT USERS ROUTES HERE

app.use("/uploads", express.static("uploads"));

// static setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});
