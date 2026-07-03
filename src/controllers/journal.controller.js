const mongoose = require("mongoose");
const JournalEntry = require("../models/journal.model");
const Progress = require("../models/progress.model");
const { getDateParts, resolveTimezone } = require("../utils/timezone");

const FELT = new Set(["easy", "medium", "hard"]);
const ENERGY = new Set(["great", "fine", "exhausted"]);

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

function parseObjectId(value) {
  if (value == null || value === "") return undefined;
  const id = String(value).trim();
  if (!mongoose.Types.ObjectId.isValid(id)) return undefined;
  return id;
}

function pickEnum(value, allowed) {
  const v = typeof value === "string" ? value.trim().toLowerCase() : "";
  return allowed.has(v) ? v : undefined;
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
    const entry = await JournalEntry.findOne({ userId: req.user._id, dateKey }).lean();
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
      .limit(limit)
      .lean();
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
      JournalEntry.find({ userId: req.user._id, dateKey: { $in: dayKeys } }).lean(),
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
      problemId: rawProblemId,
      problemTitle = "",
      patternSlug = "",
      patternName = "",
      problemDifficulty = "",
      winNote = "",
      difficultyFelt,
      energy,
      reflection = "",
      tomorrowPromise = false,
    } = req.body || {};

    const set = {
      problemTitle: String(problemTitle).slice(0, 300),
      patternSlug: String(patternSlug).slice(0, 120),
      patternName: String(patternName).slice(0, 120),
      problemDifficulty: String(problemDifficulty).slice(0, 40),
      winNote: String(winNote).slice(0, 2000),
      reflection: String(reflection).slice(0, 2000),
      tomorrowPromise: Boolean(tomorrowPromise),
    };

    const problemId = parseObjectId(rawProblemId);
    if (problemId) set.problemId = problemId;

    const felt = pickEnum(difficultyFelt, FELT);
    const energyLevel = pickEnum(energy, ENERGY);
    if (felt) set.difficultyFelt = felt;
    if (energyLevel) set.energy = energyLevel;

    if (tomorrowPromise) {
      set.tomorrowPromiseAt = new Date();
    }

    const entry = await JournalEntry.findOneAndUpdate(
      { userId: req.user._id, dateKey },
      { $set: { userId: req.user._id, dateKey, ...set } },
      { new: true, upsert: true, runValidators: true, setDefaultsOnInsert: true },
    ).lean();

    res.json({ success: true, data: entry });
  } catch (err) {
    if (err.name === "ValidationError") {
      return res.status(400).json({
        success: false,
        message: "Could not save journal — invalid data. Refresh the page and try again.",
      });
    }
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getToday, listEntries, getTimeline, upsertToday };
