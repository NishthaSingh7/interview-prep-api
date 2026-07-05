require("dotenv").config();

const connectDB = require("../config/db");
const Pattern = require("../models/pattern.model");
const Problem = require("../models/problem.model");
const { patterns, problems } = require("../data/seedData");

const seed = async () => {
  try {
    await connectDB();

    console.log(`Upserting ${patterns.length} patterns (preserving existing IDs)...`);
    const patternMap = {};
    for (const [i, row] of patterns.entries()) {
      const doc = await Pattern.findOneAndUpdate(
        { slug: row.slug },
        { ...row, order: i + 1 },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
      patternMap[row.slug] = doc._id;
    }

    const seedSlugs = new Set();
    console.log(`Upserting ${problems.length} problems (preserving existing IDs)...`);
    for (const problem of problems) {
      const { patternSlug, ...rest } = problem;
      const patternId = patternMap[patternSlug];
      if (!patternId) {
        throw new Error(`Pattern not found for slug: ${patternSlug}`);
      }
      seedSlugs.add(rest.slug);
      await Problem.findOneAndUpdate(
        { slug: rest.slug },
        { ...rest, patternId },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      );
    }

    const removed = await Problem.deleteMany({ slug: { $nin: [...seedSlugs] } });
    if (removed.deletedCount) {
      console.log(`Removed ${removed.deletedCount} obsolete problems (no longer in seed data).`);
    }

    const counts = await Promise.all([
      Pattern.countDocuments(),
      Problem.countDocuments(),
    ]);

    console.log("Seed completed successfully.");
    console.log(`Patterns: ${counts[0]}`);
    console.log(`Problems: ${counts[1]}`);
    console.log("User progress is preserved — problems are upserted by slug, not wiped.");
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
