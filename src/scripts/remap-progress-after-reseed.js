require("dotenv").config();

const connectDB = require("../config/db");
const Progress = require("../models/progress.model");
const Problem = require("../models/problem.model");
const JournalEntry = require("../models/journal.model");
const User = require("../models/user.model");
const { problems: seedProblems } = require("../data/seedData");
const { syncUserHabitStats } = require("../services/habit.service");

/** First problem ObjectId from the pre–365-expansion seed batch (insertMany order). */
const LEGACY_FIRST_PROBLEM_ID = "6a37c21a7d2c9fa198daa0f2";

function objectIdCounter(id) {
  return parseInt(String(id).slice(-6), 16);
}

function buildLegacyToSlugMap(orphanedIds) {
  const oldBatchBase = objectIdCounter(LEGACY_FIRST_PROBLEM_ID);
  const map = new Map();
  for (const oldId of orphanedIds) {
    const index = objectIdCounter(oldId) - oldBatchBase;
    if (index < 0 || index >= seedProblems.length) continue;
    map.set(oldId, seedProblems[index].slug);
  }
  return map;
}

async function remapProgress(dryRun = false) {
  await connectDB();

  const currentProblems = await Problem.find().select("_id slug title").lean();
  const currentIds = new Set(currentProblems.map((p) => p._id.toString()));
  const slugToId = new Map(currentProblems.map((p) => [p.slug, p._id]));

  const orphaned = await Progress.find().lean();
  const toFix = orphaned.filter((p) => !currentIds.has(String(p.problemId)));
  const orphanedProblemIds = [...new Set(toFix.map((p) => p.problemId.toString()))];
  const legacyToSlug = buildLegacyToSlugMap(orphanedProblemIds);

  let updated = 0;
  let merged = 0;
  let skipped = 0;
  const touchedUsers = new Set();

  for (const entry of toFix) {
    const oldId = entry.problemId.toString();
    const slug = legacyToSlug.get(oldId);
    const newProblemId = slug ? slugToId.get(slug) : null;

    if (!newProblemId) {
      skipped++;
      console.warn("No remap for progress", entry._id, "legacy problem", oldId);
      continue;
    }

    touchedUsers.add(String(entry.userId));

    const existing = await Progress.findOne({
      userId: entry.userId,
      problemId: newProblemId,
    });

    if (existing && String(existing._id) !== String(entry._id)) {
      const mergedNotes = [existing.notes, entry.notes].filter(Boolean).join("\n---\n");
      const completedAt =
        existing.completedAt && entry.completedAt
          ? existing.completedAt < entry.completedAt
            ? existing.completedAt
            : entry.completedAt
          : existing.completedAt || entry.completedAt;

      if (!dryRun) {
        await Progress.updateOne(
          { _id: existing._id },
          {
            $set: {
              notes: mergedNotes.slice(0, 2000),
              completedAt,
              status: "done",
            },
          },
        );
        await Progress.deleteOne({ _id: entry._id });
      }
      merged++;
      console.log(`MERGE user=${entry.userId} ${slug}`);
      continue;
    }

    if (!dryRun) {
      await Progress.updateOne({ _id: entry._id }, { $set: { problemId: newProblemId } });
    }
    updated++;
    console.log(`UPDATE user=${entry.userId} ${slug}`);
  }

  const journals = await JournalEntry.find().lean();
  let journalsFixed = 0;
  for (const j of journals) {
    if (!j.problemId || currentIds.has(String(j.problemId))) continue;
    const oldId = j.problemId.toString();
    const slug = legacyToSlug.get(oldId);
    const newProblemId = slug ? slugToId.get(slug) : null;
    if (!newProblemId) continue;

    if (!dryRun) {
      await JournalEntry.updateOne({ _id: j._id }, { $set: { problemId: newProblemId } });
    }
    journalsFixed++;
  }

  if (!dryRun) {
    for (const userId of touchedUsers) {
      const user = await User.findById(userId);
      if (user) await syncUserHabitStats(user);
    }
  }

  console.log("\nSummary:");
  console.log("  Progress updated:", updated);
  console.log("  Progress merged:", merged);
  console.log("  Progress skipped:", skipped);
  console.log("  Journal entries fixed:", journalsFixed);
  console.log("  Users resynced:", touchedUsers.size);
  console.log(dryRun ? "  (dry run — no writes)" : "  Done.");
}

const dryRun = process.argv.includes("--dry-run");
remapProgress(dryRun).catch((err) => {
  console.error(err);
  process.exit(1);
});
