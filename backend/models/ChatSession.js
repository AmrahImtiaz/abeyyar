import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema({
  title: {
    type: String,
    default: "New Chat",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("ChatSession", chatSessionSchema);
