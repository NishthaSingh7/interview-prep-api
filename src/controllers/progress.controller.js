const Progress = require("../models/progress.model");
const Problem = require("../models/problem.model");
const { syncUserHabitStats, buildHabitStats, useStreakFreeze } = require("../services/habit.service");
const { resolveTimezone } = require("../utils/timezone");
const Pattern = require("../models/pattern.model");
const {
  computeUnlockState,
  isProblemLocked,
  FIRST_TIER_PATTERN_COUNT,
} = require("../utils/unlocks");

async function getUserUnlockContext(userId) {
  const [progress, patterns] = await Promise.all([
    Progress.find({ userId, status: "done" }).populate({
      path: "problemId",
      populate: { path: "patternId" },
    }),
    Pattern.find().sort({ order: 1 }),
  ]);

  const firstTierIds = new Set(
    patterns.slice(0, FIRST_TIER_PATTERN_COUNT).map((p) => p._id.toString()),
  );

  let totalDone = 0;
  let firstTierDone = 0;

  for (const entry of progress) {
    const problem = entry.problemId;
    if (!problem) continue;
    totalDone++;
    const pid = (problem.patternId?._id || problem.patternId)?.toString();
    if (pid && firstTierIds.has(pid)) firstTierDone++;
  }

  return computeUnlockState(totalDone, firstTierDone);
}

const createProgress = async (req, res) => {
  try {
    const { problemId, status = "done", notes = "", struggled = false } = req.body;

    if (!problemId) {
      return res.status(400).json({
        success: false,
        message: "Please provide a problemId.",
      });
    }

    const problem = await Problem.findById(problemId).populate("patternId");
    if (!problem) {
      return res.status(404).json({ success: false, message: "Problem not found" });
    }

    if (status === "done") {
      const unlockState = await getUserUnlockContext(req.user._id);
      if (isProblemLocked(problem, unlockState)) {
        return res.status(403).json({
          success: false,
          message: "This problem is locked. Complete more problems to unlock it.",
        });
      }
    }

    const reviewAt =
      status === "done" ? new Date(Date.now() + 7 * 86400000) : null;

    const progress = await Progress.findOneAndUpdate(
      { userId: req.user._id, problemId },
      {
        userId: req.user._id,
        problemId,
        status,
        notes,
        struggled: Boolean(struggled),
        completedAt: status === "done" ? new Date() : null,
        reviewAt: status === "done" ? reviewAt : null,
      },
      { new: true, upsert: true, runValidators: true },
    ).populate({
      path: "problemId",
      populate: { path: "patternId" },
    });

    if (status === "done") {
      await syncUserHabitStats(req.user);
    }

    res.status(201).json({ success: true, data: progress });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMyProgress = async (req, res) => {
  try {
    const { status } = req.query;
    const filter = { userId: req.user._id };
    if (status) filter.status = status;

    const progress = await Progress.find(filter)
      .populate({
        path: "problemId",
        populate: { path: "patternId" },
      })
      .sort({ updatedAt: -1 });

    res.status(200).json({
      success: true,
      count: progress.length,
      data: progress,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getProgressStats = async (req, res) => {
  try {
    const unlockState = await getUserUnlockContext(req.user._id);
    const progress = await Progress.find({ userId: req.user._id, status: "done" }).populate({
      path: "problemId",
      populate: { path: "patternId" },
    });

    const byPattern = {};
    const byDifficulty = { Easy: 0, Medium: 0, Hard: 0 };

    for (const entry of progress) {
      const problem = entry.problemId;
      if (!problem) continue;

      const patternName = problem.patternId?.name || "Unknown";
      byPattern[patternName] = (byPattern[patternName] || 0) + 1;

      if (byDifficulty[problem.difficulty] !== undefined) {
        byDifficulty[problem.difficulty]++;
      }
    }

    const timezone = resolveTimezone(req.user, req);
    if (req.user.timezone !== timezone) {
      req.user.timezone = timezone;
      try {
        await req.user.save();
      } catch (saveErr) {
        console.warn("[stats] timezone save skipped:", saveErr.message);
      }
    }

    const completedDates = progress
      .map((entry) => entry.completedAt || entry.updatedAt || entry.createdAt)
      .filter(Boolean);

    const totalProblems = await Problem.countDocuments();
    const habit = await buildHabitStats(req.user, timezone, completedDates);

    res.status(200).json({
      success: true,
      data: {
        totalCompleted: progress.length,
        totalProblems,
        byPattern,
        byDifficulty,
        unlocks: unlockState,
        timezone: habit.timezone,
        streak: habit.streak,
        bestStreak: habit.bestStreak,
        streakFreezeCredits: habit.streakFreezeCredits,
        completedToday: habit.completedToday,
        activeDaysThisMonth: habit.activeDaysThisMonth,
        activeDaysLastMonth: habit.activeDaysLastMonth,
        monthDelta: habit.monthDelta,
        activeDaysThisWeek: habit.activeDaysThisWeek,
        activeDaysLastWeek: habit.activeDaysLastWeek,
        daysSinceLastActive: habit.daysSinceLastActive,
        canUseStreakFreeze: habit.canUseStreakFreeze,
        interview: habit.interview,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProgress = async (req, res) => {
  try {
    const progress = await Progress.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress entry not found" });
    }

    const { status, notes, struggled } = req.body;
    if (status) progress.status = status;
    if (notes !== undefined) progress.notes = notes;
    if (struggled !== undefined) progress.struggled = Boolean(struggled);

    if (status === "done") {
      const problem = await Problem.findById(progress.problemId).populate("patternId");
      if (problem) {
        const unlockState = await getUserUnlockContext(req.user._id);
        if (isProblemLocked(problem, unlockState)) {
          return res.status(403).json({
            success: false,
            message: "This problem is locked. Complete more problems to unlock it.",
          });
        }
      }
      progress.completedAt = new Date();
      progress.reviewAt = new Date(Date.now() + 7 * 86400000);
    }

    await progress.save();

    if (status === "done") {
      await syncUserHabitStats(req.user);
    }

    const updated = await Progress.findById(progress._id).populate({
      path: "problemId",
      populate: { path: "patternId" },
    });

    res.status(200).json({ success: true, data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProgress = async (req, res) => {
  try {
    const progress = await Progress.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!progress) {
      return res.status(404).json({ success: false, message: "Progress entry not found" });
    }

    await syncUserHabitStats(req.user);

    res.status(200).json({ success: true, data: {} });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const applyStreakFreeze = async (req, res) => {
  try {
    const user = await useStreakFreeze(req.user);
    const timezone = resolveTimezone(user, req);
    const habit = await buildHabitStats(user, timezone);
    res.status(200).json({ success: true, data: habit });
  } catch (error) {
    res.status(error.status || 500).json({ success: false, message: error.message });
  }
};

module.exports = {
  createProgress,
  getMyProgress,
  getProgressStats,
  updateProgress,
  deleteProgress,
  applyStreakFreeze,
};
