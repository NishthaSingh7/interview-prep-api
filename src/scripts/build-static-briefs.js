require("dotenv").config();

const fs = require("fs");
const path = require("path");
const { problems } = require("../data/seedData");
const { GFG_PROBLEM_BRIEFS, SKIP_LEETCODE_BRIEF_SLUGS } = require("../data/gfgProblemBriefs");
const { PROBLEM_BRIEF_BY_SLUG } = require("../data/problemBriefBySlug");
const { fetchLeetcodeBrief, leetcodeSlugFromUrl, sleep } = require("../utils/leetcodeContent");
const { buildProblemBrief, briefNeedsRefresh } = require("../utils/problemBrief");

const OUT = path.join(__dirname, "../data/staticProblemBriefs.json");
const DELAY_MS = 300;

function titlesMatch(a, b) {
  return normalizeTitleKey(a) === normalizeTitleKey(b);
}

function normalizeTitleKey(title) {
  return String(title).toLowerCase().replace(/\s+/g, " ").trim();
}

async function main() {
  const bySlug = {};
  const lcCache = {};
  let fetched = 0;
  let skipped = 0;
  let manual = 0;
  let slugOverride = 0;
  let fallback = 0;
  const failures = [];

  for (const problem of problems) {
    const slug = problem.slug;

    if (PROBLEM_BRIEF_BY_SLUG[slug]) {
      bySlug[slug] = { ...PROBLEM_BRIEF_BY_SLUG[slug], source: "slug-override" };
      slugOverride++;
      continue;
    }

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
      const cacheKey = lcSlug;
      const cached = lcCache[cacheKey];
      if (cached && titlesMatch(cached.title, problem.title)) {
        bySlug[slug] = { ...cached.brief, source: "leetcode-cache" };
        skipped++;
        continue;
      }

      try {
        const fallbackBrief = buildProblemBrief({
          slug,
          title: problem.title,
          tags: problem.tags || [],
          difficulty: problem.difficulty,
        });
        const brief = await fetchLeetcodeBrief(problem.leetcodeLink, fallbackBrief.examples || []);
        lcCache[cacheKey] = { title: problem.title, brief };
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
      leetcodeLink: problem.leetcodeLink,
      practiceLink: problem.practiceLink,
    });
    bySlug[slug] = { ...brief, source: failures.some((f) => f.slug === slug) ? "title-fallback" : "generated" };
    fallback++;
  }

  const payload = {
    version: 2,
    generatedAt: new Date().toISOString(),
    count: Object.keys(bySlug).length,
    briefs: bySlug,
  };

  fs.writeFileSync(OUT, JSON.stringify(payload), "utf8");
  console.log(`\nWrote ${payload.count} briefs → ${OUT}`);
  console.log(
    `LeetCode fetched: ${fetched}, LC cache hits: ${skipped}, slug overrides: ${slugOverride}, manual GFG: ${manual}, fallback: ${fallback}`,
  );
  if (failures.length) {
    console.log(`Failures: ${failures.length}`);
    failures.slice(0, 15).forEach((f) => console.log(`  - ${f.title}: ${f.error}`));
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
