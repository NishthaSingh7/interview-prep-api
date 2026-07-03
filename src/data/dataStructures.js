/** Primary data-structure groupings for sidebar browse (tag-driven). */
const DATA_STRUCTURES = [
  { name: "Arrays", slug: "arrays", tags: ["array"] },
  { name: "Strings", slug: "strings", tags: ["string"] },
  { name: "Linked Lists", slug: "linked-lists", tags: ["linked-list"] },
  { name: "Trees", slug: "trees", tags: ["tree"] },
  { name: "Graphs", slug: "graphs", tags: ["graph", "dfs", "bfs", "topological-sort"] },
  { name: "Heaps", slug: "heaps", tags: ["heap"] },
  { name: "Matrix", slug: "matrix", tags: ["matrix"] },
  { name: "Math", slug: "math", tags: ["math"] },
];

const ALL_STRUCTURE_TAGS = [...new Set(DATA_STRUCTURES.flatMap((s) => s.tags))];

function findStructure(slug) {
  return DATA_STRUCTURES.find((s) => s.slug === slug);
}

function structureFilter(slug) {
  const structure = findStructure(slug);
  if (!structure) return null;
  return { tags: { $in: structure.tags } };
}

module.exports = { DATA_STRUCTURES, ALL_STRUCTURE_TAGS, findStructure, structureFilter };
