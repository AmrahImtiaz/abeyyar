import ChatSession from "../models/ChatSession.js";
import Message from "../models/Message.js";

// Create new chat
export const createChat = async (req, res) => {
  const chat = await ChatSession.create({});
  res.status(201).json(chat);
};

// Get all chats (sidebar history)
export const getChats = async (req, res) => {
  const chats = await ChatSession.find().sort({ createdAt: -1 });
  res.json(chats);
};

// Get messages of one chat
export const getChatMessages = async (req, res) => {
  const { chatId } = req.params;
  const messages = await Message.find({ sessionId: chatId });
  res.json(messages);
};

// Send message
export const sendMessage = async (req, res) => {
  const { chatId, content } = req.body;

  const userMessage = await Message.create({
    sessionId: chatId,
    sender: "user",
    content,
  });

  // Dummy AI response (replace later)
  const aiMessage = await Message.create({
    sessionId: chatId,
    sender: "ai",
    content: "This is a demo AI response. AI will be connected soon.",
  });

  res.status(201).json({
    user: userMessage,
    ai: aiMessage,
  });
};
