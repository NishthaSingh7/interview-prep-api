require("dotenv").config();

const connectDB = require("../config/db");
require("../models/pattern.model");
const Problem = require("../models/problem.model");
const { buildProblemBrief } = require("../utils/problemBrief");

async function main() {
  await connectDB();

  const problems = await Problem.find().populate("patternId");
  let updated = 0;

  for (const problem of problems) {
    const brief = buildProblemBrief({
      title: problem.title,
      patternName: problem.patternId?.name || "",
      tags: problem.tags || [],
      difficulty: problem.difficulty,
    });

    problem.brief = brief;
    problem.summary = brief.scenario;
    await problem.save();
    updated += 1;
  }

  console.log(`Backfilled briefs for ${updated} of ${problems.length} problems.`);
  process.exit(0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
