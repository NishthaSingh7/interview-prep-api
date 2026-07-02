const mongoose = require("mongoose");

const journalSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    dateKey: {
      type: String,
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
    },
    problemTitle: { type: String, default: "" },
    patternSlug: { type: String, default: "" },
    patternName: { type: String, default: "" },
    problemDifficulty: { type: String, default: "" },
    winNote: { type: String, default: "" },
    difficultyFelt: {
      type: String,
      enum: ["easy", "medium", "hard"],
    },
    energy: {
      type: String,
      enum: ["great", "fine", "exhausted"],
    },
    reflection: { type: String, default: "" },
    tomorrowPromise: { type: Boolean, default: false },
    tomorrowPromiseAt: { type: Date },
  },
  { timestamps: true },
);

journalSchema.index({ userId: 1, dateKey: 1 }, { unique: true });

module.exports = mongoose.model("JournalEntry", journalSchema);
