const userSchema = new mongoose.Schema({
  username: String,
  email: String,

  avatar: String, // profile image URL

  rating: {
    type: Number,
    default: 1500,
  },

  solved: {
    easy: { type: Number, default: 0 },
    medium: { type: Number, default: 0 },
    hard: { type: Number, default: 0 },
  },
})
