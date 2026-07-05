require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { problems } = require("../data/seedData");
const { GFG_PROBLEM_BRIEFS, SKIP_LEETCODE_BRIEF_SLUGS } = require("../data/gfgProblemBriefs");
const { fetchLeetcodeBrief, leetcodeSlugFromUrl, sleep } = require("../utils/leetcodeContent");
const { buildProblemBrief } = require("../utils/problemBrief");

const OUT = path.join(__dirname, "../data/staticProblemBriefs.json");
const DELAY_MS = 300;

async function main() {
  const bySlug = {};
  const lcCache = {};
  let fetched = 0;
  let skipped = 0;
  let manual = 0;
  let fallback = 0;
  const failures = [];

  for (const problem of problems) {
    const slug = problem.slug;

    if (GFG_PROBLEM_BRIEFS[slug]) {
      bySlug[slug] = { ...GFG_PROBLEM_BRIEFS[slug], source: "manual-gfg" };
      manual++;
      continue;
    }

    const lcSlug = leetcodeSlugFromUrl(problem.leetcodeLink || "");
    const useLc =
      lcSlug &&
      !SKIP_LEETCODE_BRIEF_SLUGS.has(slug) &&
      problem.source === "LeetCode";

    if (useLc) {
      if (lcCache[lcSlug]) {
        bySlug[slug] = { ...lcCache[lcSlug], source: "leetcode-cache" };
        skipped++;
        continue;
      }

      try {
        const fallbackBrief = buildProblemBrief({
          title: problem.title,
          tags: problem.tags || [],
          difficulty: problem.difficulty,
        });
        const brief = await fetchLeetcodeBrief(problem.leetcodeLink, fallbackBrief.examples || []);
        lcCache[lcSlug] = brief;
        bySlug[slug] = { ...brief, source: "leetcode" };
        fetched++;
        process.stdout.write(`✓ ${problem.title}\n`);
        await sleep(DELAY_MS);
        continue;
      } catch (err) {
        failures.push({ title: problem.title, slug, error: err.message });
        process.stdout.write(`✗ ${problem.title}: ${err.message}\n`);
      }
    }

    const brief = buildProblemBrief({
      slug,
      title: problem.title,
      tags: problem.tags || [],
      difficulty: problem.difficulty,
    });
    bySlug[slug] = { ...brief, source: "generated" };
    fallback++;
  }

  const payload = {
    version: 1,
    generatedAt: new Date().toISOString(),
    count: Object.keys(bySlug).length,
    briefs: bySlug,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload), "utf8");
  console.log(`\nWrote ${payload.count} briefs → ${OUT}`);
  console.log(`LeetCode fetched: ${fetched}, LC cache hits: ${skipped}, manual: ${manual}, fallback: ${fallback}`);
  if (failures.length) {
    console.log(`Failures: ${failures.length}`);
    failures.slice(0, 10).forEach((f) => console.log(`  - ${f.title}: ${f.error}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
