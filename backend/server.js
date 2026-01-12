import express from "express";
import "dotenv/config";
import connectDB from "./database/db.js";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

// Import routes
import userRoute from "./routes/userRoute.js";
import authRoute from "./routes/authRoute.js";
import questionRoutes from "./routes/question.routes.js";
import chatRoutes from "./routes/chat.routes.js"; 

// Import passport config
import "./config/passport.js";
import avatarRoutes from "./routes/avatarRoutes.js";

const app = express();
const PORT = process.env.PORT || 8000;

// For __dirname in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173", // your frontend URL
    credentials: true,
  })
);

// Serve uploaded files (you already have this)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Simple request logger
app.use((req, res, next) => {
  console.log(new Date().toISOString(), req.method, req.originalUrl);
  next();
});

// Routes
app.use("/auth", authRoute);
app.use("/user", userRoute);
app.use("/api/questions", questionRoutes);
app.use("/api/chat", chatRoutes); // 👈 include chat routes here
app.use("/api/user", avatarRoutes);



// Start server & connect to DB
app.listen(PORT, () => {
  connectDB();
  console.log(`Server is listening at port ${PORT}`);
});
