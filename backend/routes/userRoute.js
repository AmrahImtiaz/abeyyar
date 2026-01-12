import express from "express";
import { User } from "../models/userModel.js";
import { 
    changePassword, 
    forgotPassword, 
    loginUser, 
    logoutUser, 
    registerUser, 
    verification, 
    verifyOTP,
    googleLogin // <--- 1. IMPORT THIS (Make sure it exists in controller)
} from "../controllers/userController.js"; 
// Note: If you put googleLogin in authController.js, change the import path!

import { isAuthenticated } from "../middleware/isAuthenticated.js";
import { userSchema, validateUser } from "../validators/userValidate.js";

const router = express.Router();

// ----- Auth/User routes -----
router.post('/register', validateUser(userSchema), registerUser);
router.post('/verify', verification);
router.post('/login', loginUser);
router.post('/logout', isAuthenticated, logoutUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp/:email', verifyOTP);
router.post('/change-password/:email', changePassword);

// ----- 2. ADD THIS NEW ROUTE -----
router.post('/google', googleLogin); 
// This creates: POST http://localhost:8000/user/google

// ----- Profile route -----
router.get("/profile", isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    const stats = {
      rank: 0, 
      rating: user.rating || 0,
      solved: (user.solved?.easy || 0) + (user.solved?.medium || 0) + (user.solved?.hard || 0),
      easy: user.solved?.easy || 0,
      medium: user.solved?.medium || 0,
      hard: user.solved?.hard || 0,
    };

    res.json({
      username: user.username,
      avatar: user.avatar,
      googleAvatar: user.googleAvatar,
      streak: user.streak || 0,
      stats,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;