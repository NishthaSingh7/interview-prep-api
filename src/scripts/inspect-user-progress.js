require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/user.model");
const Progress = require("../models/progress.model");
const Problem = require("../models/problem.model");
const JournalEntry = require("../models/journal.model");

const nameQuery = process.argv[2] || "Nishtha Singh";

async function main() {
  await connectDB();

  const users = await User.find({
    $or: [
      { name: new RegExp(nameQuery, "i") },
      { email: new RegExp(nameQuery.replace(/\s+/g, ""), "i") },
    ],
  }).select("name email bestStreak createdAt");

  if (!users.length) {
    console.log("No users matched:", nameQuery);
    process.exit(1);
  }

  const problemIds = new Set(
    (await Problem.find().select("_id")).map((p) => p._id.toString()),
  );
  const problemsByTitle = new Map(
    (await Problem.find().select("title slug")).map((p) => [p.title.toLowerCase(), p]),
  );

  for (const user of users) {
    const progress = await Progress.find({ userId: user._id }).lean();
    const orphaned = progress.filter((p) => !problemIds.has(String(p.problemId)));
    const valid = progress.filter((p) => problemIds.has(String(p.problemId)));

    const journals = await JournalEntry.find({ userId: user._id })
      .sort({ dateKey: -1 })
      .lean();

    const journalTitles = journals
      .filter((j) => j.problemTitle)
      .map((j) => ({
        dateKey: j.dateKey,
        title: j.problemTitle,
        matchesCurrent: problemsByTitle.has(j.problemTitle.toLowerCase()),
      }));

    console.log("\n=== User ===");
    console.log(JSON.stringify(user, null, 2));
    console.log("Progress total:", progress.length);
    console.log("Valid (linked to current problems):", valid.length);
    console.log("Orphaned (broken after re-seed):", orphaned.length);
    console.log("Journal entries:", journals.length);
    console.log("Journal with problem titles:", journalTitles.length);

    if (journalTitles.length) {
      console.log("\nJournal problem titles (recent):");
      journalTitles.slice(0, 20).forEach((j) => {
        console.log(`  ${j.dateKey}: ${j.title} ${j.matchesCurrent ? "✓" : "?"}`);
      });
    }

    if (orphaned.length) {
      console.log("\nSample orphaned progress IDs (first 5):");
      orphaned.slice(0, 5).forEach((p) => {
        console.log(`  progress=${p._id} problemId=${p.problemId} completedAt=${p.completedAt}`);
      });
    }
  }

  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
