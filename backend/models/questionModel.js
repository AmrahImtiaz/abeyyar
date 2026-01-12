import mongoose from 'mongoose';

const answerSchema = new mongoose.Schema({
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now },
  
  // TRACK WHO VOTED
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // TOTAL SCORE (Calculated)
  votes: { type: Number, default: 0 }, 
});

const questionSchema = new mongoose.Schema({
  title: String,
  content: String,
  tags: [String],
  subject: String,
  difficulty: String,
  
  views: { type: Number, default: 0 },
  answersCount: { type: Number, default: 0 },
  
  answers: [answerSchema],
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

  // TRACK WHO VOTED
  upvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  downvotes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  
  // TOTAL SCORE (Calculated)
  votes: { type: Number, default: 0 },
}, { timestamps: true });


export default mongoose.model('Question', questionSchema);