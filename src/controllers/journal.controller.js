const JournalEntry = require("../models/journal.model");
const Progress = require("../models/progress.model");
const { getDateParts, resolveTimezone } = require("../utils/timezone");

function shiftDateKey(dateKey, deltaDays) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + deltaDays);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function lastNDays(dateKey, n) {
  const keys = [];
  let key = dateKey;
  for (let i = 0; i < n; i++) {
    keys.push(key);
    key = shiftDateKey(key, -1);
  }
  return keys;
}

async function getActiveDateKeys(userId, timezone) {
  const progress = await Progress.find({ userId, status: "done" }).select(
    "completedAt updatedAt createdAt",
  );
  const keys = new Set();
  for (const row of progress) {
    const at = row.completedAt || row.updatedAt || row.createdAt;
    if (!at) continue;
    keys.add(getDateParts(new Date(at), timezone).dateKey);
  }
  return keys;
}

const getToday = async (req, res) => {
  try {
    const timezone = resolveTimezone(req.user, req);
    const dateKey = getDateParts(new Date(), timezone).dateKey;
    const entry = await JournalEntry.findOne({ userId: req.user._id, dateKey });
    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const listEntries = async (req, res) => {
  try {
    const limit = Math.min(Number(req.query.limit) || 30, 60);
    const entries = await JournalEntry.find({ userId: req.user._id })
      .sort({ dateKey: -1 })
      .limit(limit);
    res.json({ success: true, count: entries.length, data: entries });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const getTimeline = async (req, res) => {
  try {
    const timezone = resolveTimezone(req.user, req);
    const todayKey = getDateParts(new Date(), timezone).dateKey;
    const days = Math.min(Number(req.query.days) || 30, 60);
    const dayKeys = lastNDays(todayKey, days);

    const [entries, activeDays] = await Promise.all([
      JournalEntry.find({ userId: req.user._id, dateKey: { $in: dayKeys } }),
      getActiveDateKeys(req.user._id, timezone),
    ]);

    const entryMap = Object.fromEntries(entries.map((e) => [e.dateKey, e]));

    const timeline = dayKeys.map((dateKey) => {
      const entry = entryMap[dateKey];
      if (entry) {
        return { type: "entry", dateKey, entry };
      }
      if (activeDays.has(dateKey)) {
        return { type: "solved", dateKey };
      }
      if (dateKey === todayKey) {
        return { type: "pending", dateKey };
      }
      return { type: "skipped", dateKey };
    });

    res.json({ success: true, data: timeline });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const upsertToday = async (req, res) => {
  try {
    const timezone = resolveTimezone(req.user, req);
    const dateKey = getDateParts(new Date(), timezone).dateKey;
    const {
      problemId,
      problemTitle = "",
      patternSlug = "",
      patternName = "",
      problemDifficulty = "",
      winNote = "",
      difficultyFelt = null,
      energy = null,
      reflection = "",
      tomorrowPromise = false,
    } = req.body;

    const update = {
      problemTitle,
      patternSlug,
      patternName,
      problemDifficulty,
      winNote,
      reflection,
      tomorrowPromise: Boolean(tomorrowPromise),
    };

    if (problemId) update.problemId = problemId;
    if (difficultyFelt) update.difficultyFelt = difficultyFelt;
    if (energy) update.energy = energy;

    if (tomorrowPromise) {
      update.tomorrowPromiseAt = new Date();
    }

    const entry = await JournalEntry.findOneAndUpdate(
      { userId: req.user._id, dateKey },
      { userId: req.user._id, dateKey, ...update },
      { new: true, upsert: true, runValidators: true },
    );

    res.json({ success: true, data: entry });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getToday, listEntries, getTimeline, upsertToday };
