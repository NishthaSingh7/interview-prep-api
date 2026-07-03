const path = require("path");
const fs = require("fs");
const { problems, patterns } = require("../data/seedData");
const { generateAllGuides } = require("../utils/studyGuideGenerator");

const outDir = path.join(__dirname, "../../public/data");
const outFile = path.join(outDir, "study-guides.json");

const payload = generateAllGuides(problems, patterns);

fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(outFile, JSON.stringify(payload), "utf8");

console.log(`Wrote ${payload.count} study guides → ${outFile}`);
