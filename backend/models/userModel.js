import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    // --- EXISTING AUTH FIELDS ---
    username: { type: String },
    email: { type: String, required: true, unique: true },
    password: { type: String },
    googleId: { type: String },
    avatar: { type: String, default: "" }, 
    isVerified: { type: Boolean, default: false },
    isLoggedIn: { type: Boolean, default: false },
    loginDates: { type: [Date], default: [] }, 
    token: { type: String, default: null },
    otp: { type: String, default: null },
    otpExpiry: { type: Date, default: null },

    // --- NEW GAMIFICATION FIELDS ---
    streak: { type: Number, default: 0 },
    lastActive: { type: Date, default: Date.now },
    reputation: { type: Number, default: 0 },
    questions: { type: Number, default: 0 },
    answers: { type: Number, default: 0 },
    badges: { type: [String], default: [] }

}, { 
    timestamps: true,
    toJSON: { virtuals: true }, // Important: Allows frontend to see 'name'
    toObject: { virtuals: true }
});

// Virtual: If frontend asks for 'name', return 'username'
userSchema.virtual('name').get(function() {
  return this.username;
});

export const User = mongoose.models.User || mongoose.model("User", userSchema);