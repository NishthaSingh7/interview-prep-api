require("dotenv").config();

const connectDB = require("../config/db");
const Pattern = require("../models/pattern.model");
const Problem = require("../models/problem.model");
const { patterns, problems } = require("../data/seedData");

const seed = async () => {
  try {
    await connectDB();

    console.log("Clearing existing patterns and problems...");
    await Problem.deleteMany({});
    await Pattern.deleteMany({});

    console.log(`Seeding ${patterns.length} patterns...`);
    const createdPatterns = await Pattern.insertMany(patterns);
    const patternMap = Object.fromEntries(createdPatterns.map((p) => [p.slug, p._id]));

    const problemsWithRefs = problems.map((problem) => {
      const { patternSlug, ...rest } = problem;
      const patternId = patternMap[patternSlug];
      if (!patternId) {
        throw new Error(`Pattern not found for slug: ${patternSlug}`);
      }
      return { ...rest, patternId };
    });

    console.log(`Seeding ${problemsWithRefs.length} problems...`);
    await Problem.insertMany(problemsWithRefs);

    console.log("Seed completed successfully.");
    console.log(`Patterns: ${patterns.length}`);
    console.log(`Problems: ${problemsWithRefs.length}`);
    process.exit(0);
  } catch (error) {
    console.error("Seed failed:", error.message);
    process.exit(1);
  }
};

seed();
