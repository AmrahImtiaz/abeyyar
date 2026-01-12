// backend/routes/question.routes.js
import express from "express";
import multer from "multer";
import path from "path";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import {
  createQuestion,
  listQuestions,
  getQuestion,
  voteQuestion,
  addAnswer,
  voteAnswer // <--- 1. ADD THIS IMPORT
} from "../controllers/questioncontroller.js";

const router = express.Router();

// -------------------- Multer setup for file uploads --------------------
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // upload folder
  },
  filename: (req, file, cb) => {
    // unique filename: timestamp + random string + original extension
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).substring(2, 8)}${ext}`);
  }
});

// Only allow image/video/pdf files
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|svg|mp4|mov|pdf/;
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedTypes.test(ext)) cb(null, true);
  else cb(new Error("Only images, videos, and PDFs are allowed"), false);
};

const upload = multer({ storage, fileFilter });

// -------------------- Routes --------------------

// Create a question (protected route)
router.post("/", isAuthenticated, upload.array("media", 5), createQuestion);

// List all questions with optional query params: page, limit, sort, subject, search
router.get("/", listQuestions);

// Get a single question by ID
router.get("/:id", getQuestion);

// Vote on a question (up/down)
router.put("/:id/vote", isAuthenticated, voteQuestion);

// Add an answer
router.post("/:id/answers", isAuthenticated, addAnswer);

// 2. ADD THIS NEW ROUTE FOR ANSWER VOTING
router.put("/:id/answers/:answerId/vote", isAuthenticated, voteAnswer);

export default router;