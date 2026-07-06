/**
 * Audit problem briefs against titles.
 * Run: node src/scripts/audit-problem-briefs.js
 */
const { problems } = require("../data/seedData");
const staticBriefs = require("../data/staticProblemBriefs.json");
const { buildProblemBrief } = require("../utils/problemBrief");

const GENERIC_RE =
  /integer array `nums` and any extra parameters described in the title|Return the final answer the question asks for/i;

function realMismatch(problem, brief) {
  const s = (brief?.scenario || "").toLowerCase();
  const t = problem.title.toLowerCase();
  if (GENERIC_RE.test(s)) return "generic placeholder brief";
  if (/linked list/i.test(t) && !/linked|list node|pointer/.test(s)) return "linked-list title without linked-list brief";
  if (/meeting room/i.test(t) && !/meeting|room|interval/.test(s)) return "meeting-room title without interval brief";
  if (/middle.*linked/i.test(t) && !/middle/.test(s)) return "middle-of-list title without middle brief";
  return null;
}

const issues = [];

for (const p of problems) {
  const brief = staticBriefs.briefs[p.slug] || buildProblemBrief(p);
  const reason = realMismatch(p, brief);
  if (reason) {
    issues.push({
      title: p.title,
      slug: p.slug,
      reason,
      source: brief.source,
      scenario: (brief.scenario || "").slice(0, 120),
    });
  }
}

console.log(`Audited ${problems.length} problems`);
console.log(`Issues: ${issues.length}`);
if (issues.length) {
  issues.forEach((i) => console.log(`- ${i.title} [${i.reason}] (${i.source})\n  ${i.scenario}`));
  process.exit(1);
}
console.log("All briefs align with titles.");
