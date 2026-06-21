const mongoose = require("mongoose");

const progressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    problemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Problem",
      required: true,
    },
    status: {
      type: String,
      enum: ["in_progress", "done"],
      default: "done",
    },
    completedAt: {
      type: Date,
    },
    notes: {
      type: String,
      default: "",
    },
  },
  { timestamps: true },
);

progressSchema.index({ userId: 1, problemId: 1 }, { unique: true });

module.exports = mongoose.model("Progress", progressSchema);
