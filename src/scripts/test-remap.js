require("dotenv").config();

const connectDB = require("../config/db");
const Progress = require("../models/progress.model");
const Problem = require("../models/problem.model");
const User = require("../models/user.model");
const { problems: seedProblems } = require("../data/seedData");

function objectIdCounter(id) {
  return parseInt(id.slice(-6), 16);
}

async function buildOldToNewMap() {
  const current = await Problem.find().select("_id slug").sort({ _id: 1 }).lean();
  const slugToNewId = new Map(current.map((p) => [p.slug, p._id.toString()]));

  const allProgress = await Progress.find().select("problemId").lean();
  const currentIds = new Set(current.map((p) => p._id.toString()));
  const orphanedIds = [
    ...new Set(
      allProgress.map((p) => p.problemId.toString()).filter((id) => !currentIds.has(id)),
    ),
  ];

  if (!orphanedIds.length) return new Map();

  // Old problems were insertMany in seed order; counters increase per document.
  const minCounter = Math.min(...orphanedIds.map(objectIdCounter));
  const maxCounter = Math.max(...orphanedIds.map(objectIdCounter));
  const baseCounter = minCounter - (minCounter % 1); // start from lowest orphaned

  // Infer base old id: first problem in original seed uses lowest counter in old batch.
  // Use current problems' first _id counter as reference for new batch base index 0.
  const newBaseCounter = objectIdCounter(current[0]._id.toString());
  const oldBaseCounter = objectIdCounter(orphanedIds.sort()[0]);

  // Better: derive index from relative counter offset from minimum OLD id seen in full batch.
  // We only have solved orphans; assume old batch started at counter ending ...a0f2 (from inspect).
  const OLD_BATCH_FIRST = "6a37c21a7d2c9fa198daa0f2";
  const oldBatchBase = objectIdCounter(OLD_BATCH_FIRST);

  const map = new Map();
  for (const oldId of orphanedIds) {
    const index = objectIdCounter(oldId) - oldBatchBase;
    if (index < 0 || index >= seedProblems.length) continue;
    const slug = seedProblems[index].slug;
    const newId = slugToNewId.get(slug);
    if (newId) map.set(oldId, { newId, slug, index });
  }

  return map;
}

async function main() {
  await connectDB();

  const map = await buildOldToNewMap();
  console.log("Mapping entries:", map.size);

  const user = await User.findOne({ email: "riyanishtha@gmail.com" });
  const progress = await Progress.find({ userId: user._id }).lean();

  console.log("\nNishtha remapped preview:");
  for (const p of progress) {
    const oldId = p.problemId.toString();
    const m = map.get(oldId);
    console.log(
      oldId,
      "->",
      m ? `${m.slug} (${m.newId})` : "NO MAP",
      p.completedAt?.toISOString?.().slice(0, 10),
    );
  }

  // Verify journal titles
  const JournalEntry = require("../models/journal.model");
  const journals = await JournalEntry.find({ userId: user._id, problemTitle: { $ne: "" } }).lean();
  const Problem = require("../models/problem.model");
  for (const j of journals) {
    const prob = await Problem.findOne({ title: j.problemTitle }).select("slug _id").lean();
    const inProgress = progress.some((p) => {
      const m = map.get(p.problemId.toString());
      return m && prob && m.newId === prob._id.toString();
    });
    console.log(`Journal "${j.problemTitle}" -> in remapped progress: ${inProgress}`);
  }
}

main().catch(console.error).finally(() => process.exit());
