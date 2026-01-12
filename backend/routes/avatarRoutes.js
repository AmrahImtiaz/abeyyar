import express from "express";
import multer from "multer";
import { User } from "../models/userModel.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";
import path from "path";

const router = express.Router();

// Setup multer storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

// POST /api/user/upload-avatar
router.post(
  "/upload-avatar",
  isAuthenticated,
  upload.single("avatar"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const user = await User.findByIdAndUpdate(
        req.user._id,
        { avatar: `/uploads/${req.file.filename}` },
        { new: true }
      );

      res.json({
        success: true,
        avatarUrl: user.avatar,
        message: "Avatar updated successfully",
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
);

export default router;
