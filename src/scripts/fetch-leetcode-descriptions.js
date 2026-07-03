require("dotenv").config();

const connectDB = require("../config/db");
const Problem = require("../models/problem.model");
const { fetchLeetcodeBrief, sleep } = require("../utils/leetcodeContent");
const { buildProblemBrief } = require("../utils/problemBrief");

const DELAY_MS = 350;
const FORCE = process.argv.includes("--force");

async function main() {
  await connectDB();

  const problems = await Problem.find({
    leetcodeLink: { $exists: true, $ne: "" },
  }).sort({ title: 1 });

  let updated = 0;
  let skipped = 0;
  let failed = 0;
  const failures = [];

  for (const problem of problems) {
    if (!FORCE && problem.brief?.fromLeetcode && problem.brief?.scenario?.length > 120) {
      skipped += 1;
      continue;
    }

    try {
      const fallback = buildProblemBrief({
        title: problem.title,
        tags: problem.tags || [],
        difficulty: problem.difficulty,
      });
      const brief = await fetchLeetcodeBrief(problem.leetcodeLink, fallback.examples || []);
      problem.brief = brief;
      problem.summary = brief.scenario;
      await problem.save();
      updated += 1;
      process.stdout.write(`✓ ${problem.title}\n`);
    } catch (err) {
      failed += 1;
      failures.push({ title: problem.title, error: err.message });
      process.stdout.write(`✗ ${problem.title}: ${err.message}\n`);
    }

    await sleep(DELAY_MS);
  }

  console.log(`\nDone. Updated ${updated}, skipped ${skipped}, failed ${failed} of ${problems.length} LeetCode problems.`);

  if (failures.length) {
    console.log("\nFailures:");
    failures.slice(0, 15).forEach((f) => console.log(`  - ${f.title}: ${f.error}`));
    if (failures.length > 15) console.log(`  ... and ${failures.length - 15} more`);
  }

  process.exit(failed > 0 ? 1 : 0);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
