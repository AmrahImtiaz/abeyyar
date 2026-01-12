import Question from "../models/questionModel.js";
import { User } from "../models/userModel.js";
import { checkBadges } from "../utils/badgeChecker.js";
import mongoose from "mongoose";

// ---------------------------------------------------------
// 1. CREATE QUESTION
// ---------------------------------------------------------
export const createQuestion = async (req, res) => {
  const { title, content, tags = [], subject, difficulty } = req.body;
  const mediaUrl = req.file ? `/uploads/${req.file.filename}` : undefined;
  
  try {
    const q = await Question.create({
      title,
      content,
      tags: Array.isArray(tags)
        ? tags
        : tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
      subject,
      difficulty,
      mediaUrl,
      author: req.user?._id,
      upvotes: [],
      downvotes: []
    });

    if (req.user && req.user._id) {
      // Update User Stats: Increment question count and update lastActive
      await User.findByIdAndUpdate(req.user._id, { 
        $inc: { questions: 1 },
        $set: { lastActive: new Date() }
      });
    }
    
    const user = await User.findById(req.user && req.user._id);
    if (user) {
      checkBadges(user);
      await user.save();
    }

    res.status(201).json(q);
  } catch (err) {
    res.status(500).json({ message: "Server error", err });
  }
};

// ---------------------------------------------------------
// 2. LIST QUESTIONS
// ---------------------------------------------------------
export const listQuestions = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const sort = req.query.sort === "votes" ? { votes: -1 } : { createdAt: -1 };

  const filter = {};
  if (req.query.search) {
    filter.$or = [
      { title: new RegExp(req.query.search, "i") },
      { content: new RegExp(req.query.search, "i") },
      { tags: new RegExp(req.query.search, "i") },
    ];
  }
  if (req.query.subject) filter.subject = req.query.subject;

  try {
    const total = await Question.countDocuments(filter);
    const questions = await Question.find(filter)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      // [FIX]: Added 'avatar' to population list
      .populate("author", "username avatar reputation badges") 
      .lean();

    res.json({ data: questions, page, limit, total });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// ---------------------------------------------------------
// 3. VOTE ON QUESTION (Strict Mode: No Double Voting)
// ---------------------------------------------------------
export const voteQuestion = async (req, res) => {
  let { id } = req.params;
  const { type } = req.body; // 'up' or 'down'
  const userId = req.user._id.toString(); // Convert Object ID to String for comparison

  if (!id || !mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: "Invalid question ID" });
  }

  if (!["up", "down"].includes(type)) {
    return res.status(400).json({ message: "Type must be 'up' or 'down'" });
  }

  try {
    const q = await Question.findById(id);
    if (!q) return res.status(404).json({ message: "Question not found" });

    // --- PREVENT SELF VOTING ---
    if (q.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot vote on your own question" });
    }

    // Check if user has already voted
    // We use .some() with toString() to ensure accurate ID comparison
    const alreadyUpvoted = q.upvotes.some(uid => uid.toString() === userId);
    const alreadyDownvoted = q.downvotes.some(uid => uid.toString() === userId);

    if (type === "up") {
      if (alreadyUpvoted) {
        return res.status(400).json({ message: "You have already upvoted this question." });
      }
      // If they were downvoted, remove from downvotes (Switching vote)
      if (alreadyDownvoted) {
        q.downvotes = q.downvotes.filter(uid => uid.toString() !== userId);
      }
      q.upvotes.push(userId);
    } 
    else if (type === "down") {
      if (alreadyDownvoted) {
        return res.status(400).json({ message: "You have already downvoted this question." });
      }
      // If they were upvoted, remove from upvotes (Switching vote)
      if (alreadyUpvoted) {
        q.upvotes = q.upvotes.filter(uid => uid.toString() !== userId);
      }
      q.downvotes.push(userId);
    }

    // Recalculate total votes
    q.votes = q.upvotes.length - q.downvotes.length;
    await q.save();

    // Update Author Reputation (Question Upvote = +3)
    // Only update points if it wasn't a switch, or handle logic as preferred. 
    // Simplified: Just add points on upvote action.
    if (type === "up") {
       await User.findByIdAndUpdate(q.author, { $inc: { reputation: 3 } });
    }
    // Optional: Deduct on downvote
    if (type === "down") {
       await User.findByIdAndUpdate(q.author, { $inc: { reputation: -2 } });
    }

    const authorUser = await User.findById(q.author);
    if (authorUser) {
      checkBadges(authorUser);
      await authorUser.save();
    }

    res.json({ votes: q.votes, upvotes: q.upvotes, downvotes: q.downvotes });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// ---------------------------------------------------------
// 4. GET SINGLE QUESTION
// ---------------------------------------------------------
export const getQuestion = async (req, res) => {
  try {
    const question = await Question.findById(req.params.id)
      // [FIX]: Added 'avatar' to both populates
      .populate("author", "username avatar reputation badges")
      .populate("answers.author", "username avatar reputation badges");

    if (!question) return res.status(404).json({ error: "Question not found" });

    // increment views
    question.views = (question.views || 0) + 1;
    await question.save();

    res.json({ question });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------------------------------------
// 5. ADD ANSWER
// ---------------------------------------------------------
export const addAnswer = async (req, res) => {
  try {
    const { content } = req.body;
    const userId = req.user._id; 

    if (!content) return res.status(400).json({ error: "Answer content required" });

    const question = await Question.findById(req.params.id);
    if (!question) return res.status(404).json({ error: "Question not found" });

    const answer = {
      content,
      author: userId,
      createdAt: new Date(),
      votes: 0,
      upvotes: [],   // Initialize empty arrays
      downvotes: []
    };

    question.answers.push(answer);
    question.answersCount = question.answers.length;
    await question.save();

    // Increment answer count for user stats
    await User.findByIdAndUpdate(userId, { $inc: { answers: 1 } });

    // [FIX]: Added 'avatar'
    await question.populate("answers.author", "username avatar reputation badges");
    
    res.json({ success: true, answer: question.answers[question.answers.length - 1] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
};

// ---------------------------------------------------------
// 6. VOTE ON ANSWER (Strict Mode: No Double Voting)
// ---------------------------------------------------------
export const voteAnswer = async (req, res) => {
  const { id, answerId } = req.params; 
  const { type } = req.body;
  const userId = req.user._id.toString();

  if (!["up", "down"].includes(type)) {
    return res.status(400).json({ message: "Type must be 'up' or 'down'" });
  }

  try {
    const question = await Question.findById(id);
    if (!question) return res.status(404).json({ message: "Question not found" });

    const answer = question.answers.id(answerId);
    if (!answer) return res.status(404).json({ message: "Answer not found" });

    // --- PREVENT SELF VOTING ---
    if (answer.author.toString() === userId) {
      return res.status(400).json({ message: "You cannot vote on your own answer" });
    }

    // Check if user has already voted
    const alreadyUpvoted = answer.upvotes.some(uid => uid.toString() === userId);
    const alreadyDownvoted = answer.downvotes.some(uid => uid.toString() === userId);

    if (type === "up") {
      if (alreadyUpvoted) {
        return res.status(400).json({ message: "You have already upvoted this answer." });
      }
      if (alreadyDownvoted) {
        // Switch vote: Remove from downvotes
        answer.downvotes = answer.downvotes.filter(uid => uid.toString() !== userId);
      }
      answer.upvotes.push(userId);
    } 
    else if (type === "down") {
      if (alreadyDownvoted) {
        return res.status(400).json({ message: "You have already downvoted this answer." });
      }
      if (alreadyUpvoted) {
        // Switch vote: Remove from upvotes
        answer.upvotes = answer.upvotes.filter(uid => uid.toString() !== userId);
      }
      answer.downvotes.push(userId);
    }

    // Recalculate total votes
    answer.votes = answer.upvotes.length - answer.downvotes.length;
    
    await question.save();

    // Update Author Reputation (Answer Upvote = +5)
    if (type === "up") {
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: 5 } });
    }
    if (type === "down") {
        await User.findByIdAndUpdate(answer.author, { $inc: { reputation: -2 } });
    }

    const answerAuthor = await User.findById(answer.author);
    if (answerAuthor) {
      checkBadges(answerAuthor);
      await answerAuthor.save();
    }

    res.json({ votes: answer.votes });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};