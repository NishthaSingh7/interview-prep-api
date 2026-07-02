const fs = require("fs");
const path = require("path");

const file = path.join(__dirname, "../data/extraProblems.js");
let src = fs.readFileSync(file, "utf8");

// Fix double /1/1 on GeeksforGeeks paths
src = src.replace(/GFG\("([^"]+)\/1"\)/g, 'GFG("$1")');

const ibToLc = {
  "longest-substring-with-k-distinct-characters": "subarrays-with-k-different-integers",
  "triplets-with-sum-in-given-range": "3sum",
  "3-sum-closest": "3sum-closest",
  "start-of-loop-in-linked-list": "linked-list-cycle-ii",
  "insert-interval-in-sorted-list": "insert-interval",
  "attend-meetings": null, // use GFG below
  "first-missing-positive-integer": "first-missing-positive",
  "count-distinct-islands": "number-of-distinct-islands",
  "add-one-to-number": "plus-one-linked-list",
  "palindrome-linked-list": "palindrome-linked-list",
  "zigzag-level-order-traversal": "binary-tree-zigzag-level-order-traversal",
  "word-ladder": "word-ladder",
  "all-root-to-leaf-paths": "binary-tree-paths",
  "course-schedule": "course-schedule",
  "median-in-a-stream": "find-median-from-data-stream",
  "sliding-window-median": "sliding-window-median",
  "task-scheduler": "task-scheduler",
  "subset-sum": null,
  "combination-sum": "combination-sum",
  "first-and-last-position": "find-first-and-last-position-of-element-in-sorted-array",
  "minimum-days-to-make-bouquets": "minimum-number-of-days-to-make-m-bouquets",
  "count-set-bits": "counting-bits",
  "maximum-xor": "maximum-xor-of-two-numbers-in-an-array",
  "top-k-frequent-numbers": "top-k-frequent-elements",
  "kth-smallest-in-row-wise-sorted-matrix": "kth-smallest-element-in-a-sorted-matrix",
  "merge-k-sorted-lists": "merge-k-sorted-lists",
  "smallest-range-from-k-sorted-lists": "smallest-range-covering-elements-from-k-lists",
  "alien-dictionary": "alien-dictionary",
  "coin-change": "coin-change",
  "edit-distance": "edit-distance",
  "shortest-common-supersequence": "shortest-common-supersequence",
  "climb-stairs": "climbing-stairs",
  "decode-ways": "decode-ways",
  "jump-game": "jump-game",
  "partition-labels": "partition-labels",
};

const ibToGfg = {
  "attend-meetings": "attend-meeting",
  "subset-sum": "subset-sum-problem",
};

const hrToLc = {
  "partition-array-according-to-given-pivot": "partition-array-according-to-pivot",
  "sort-array-by-cyclic-swap": "find-all-numbers-disappeared-in-an-array",
  "shortest-path-in-maze": "shortest-path-in-binary-matrix",
  "sort-by-frequency": "top-k-frequent-elements",
  "longest-path-in-dag": "longest-increasing-path-in-a-matrix",
  "minimum-coins": null,
};

const hrToGfg = {
  "aggressive-cows": "aggressive-cows",
  "minimum-coins": "minimum-number-of-coins4426",
};

function lcUrl(slug) {
  return `https://leetcode.com/problems/${slug}/`;
}

function gfgUrl(path) {
  return `https://www.geeksforgeeks.org/problems/${path}/1`;
}

src = src.replace(/IB\("([^"]+)"\),\s*"InterviewBit"/g, (match, slug) => {
  if (ibToLc[slug]) {
    return `"${lcUrl(ibToLc[slug])}", "LeetCode"`;
  }
  if (ibToGfg[slug]) {
    return `"${gfgUrl(ibToGfg[slug])}", "GeeksforGeeks"`;
  }
  throw new Error(`No replacement for IB: ${slug}`);
});

src = src.replace(/HR\("([^"]+)"\),\s*"HackerRank"/g, (match, slug) => {
  if (hrToLc[slug]) {
    return `"${lcUrl(hrToLc[slug])}", "LeetCode"`;
  }
  if (hrToGfg[slug]) {
    return `"${gfgUrl(hrToGfg[slug])}", "GeeksforGeeks"`;
  }
  throw new Error(`No replacement for HR: ${slug}`);
});

// Update mapper to support leetcodeLink for LeetCode source
src = src.replace(
  /const extraProblems = extraRows\.map\(\(\[patternSlug, title, difficulty, practiceLink, source, tags\]\) => \(\{\n  patternSlug,\n  title,\n  slug: `\$\{patternSlug\}-ext-\$\{slugify\(title\)\}`,\n  difficulty,\n  practiceLink,\n  source,\n  tags,\n\}\)\);/,
  `const extraProblems = extraRows.map(([patternSlug, title, difficulty, link, source, tags]) => {
  const base = {
    patternSlug,
    title,
    slug: \`\${patternSlug}-ext-\${slugify(title)}\`,
    difficulty,
    source,
    tags,
  };
  if (source === "LeetCode") {
    return { ...base, leetcodeLink: link };
  }
  return { ...base, practiceLink: link };
});`,
);

fs.writeFileSync(file, src);
console.log("extraProblems.js updated");
