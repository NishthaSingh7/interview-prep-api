require("dotenv").config();

const connectDB = require("../config/db");
const Progress = require("../models/progress.model");
const Problem = require("../models/problem.model");
const { problems: seedProblems } = require("../data/seedData");

async function main() {
  await connectDB();

  const current = await Problem.find().select("_id slug title").sort({ _id: 1 }).lean();
  const slugToId = new Map(current.map((p) => [p.slug, p._id.toString()]));
  const idToSlug = new Map(current.map((p) => [p._id.toString(), p.slug]));

  const allProgress = await Progress.find().select("problemId").lean();
  const currentIds = new Set(current.map((p) => p._id.toString()));

  const orphanedIds = [
    ...new Set(
      allProgress.map((p) => p.problemId.toString()).filter((id) => !currentIds.has(id)),
    ),
  ].sort();

  console.log("Current problems:", current.length);
  console.log("Seed problems:", seedProblems.length);
  console.log("Unique orphaned problemIds in progress:", orphanedIds.length);
  console.log("First orphaned:", orphanedIds[0]);
  console.log("Last orphaned:", orphanedIds[orphanedIds.length - 1]);
  console.log("First current:", current[0]?._id.toString(), current[0]?.slug);
  console.log("Last current:", current[current.length - 1]?._id.toString());

  // Try index mapping: orphaned sorted vs seed slugs (first N)
  const n = orphanedIds.length;
  let indexMatches = 0;
  const sampleMappings = [];

  for (let i = 0; i < Math.min(n, seedProblems.length); i++) {
    const slug = seedProblems[i].slug || seedProblems[i].title;
    const seedSlug = seedProblems[i].slug;
    if (slugToId.has(seedSlug)) {
      indexMatches++;
      if (sampleMappings.length < 8) {
        sampleMappings.push({
          index: i,
          seedSlug,
          newId: slugToId.get(seedSlug),
          oldId: orphanedIds[i],
        });
      }
    }
  }

  console.log("\nIndex-based slug matches (orphaned[i] -> seed[i]):", indexMatches, "of", n);
  console.log("Sample mappings:");
  sampleMappings.forEach((m) => console.log(JSON.stringify(m)));

  // Verify: do orphaned IDs increase monotonically with seed index?
  const hexParts = orphanedIds.map((id) => id.slice(-4));
  console.log("\nOrphaned id suffixes (first 10):", hexParts.slice(0, 10).join(", "));
}

main().catch(console.error).finally(() => process.exit());
