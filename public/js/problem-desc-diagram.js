/**
 * Visual SVG diagrams for the problem brief modal.
 * Picks a layout from tags/title and paints the first example when possible.
 */
const ProblemDescDiagram = (() => {
  const TYPE_LABELS = {
    array: "Array view",
    string: "String view",
    "sliding-window": "Sliding window",
    "two-pointers": "Two pointers",
    "linked-list": "Linked list",
    tree: "Tree view",
    grid: "Grid view",
    graph: "Graph view",
    intervals: "Intervals",
    flow: "Input → output",
  };

  function parseJsonish(raw) {
    try {
      return JSON.parse(raw.replace(/'/g, '"'));
    } catch {
      return null;
    }
  }

  function parseArray(input = "") {
    const match = String(input).match(/=\s*(\[[^\]]*\])/);
    if (!match) return null;
    const val = parseJsonish(match[1]);
    return Array.isArray(val) ? val : null;
  }

  function parseGrid(input = "") {
    const match = String(input).match(/=\s*(\[\[[\s\S]*?\]\])/);
    if (!match) return null;
    const val = parseJsonish(match[1]);
    return Array.isArray(val) && Array.isArray(val[0]) ? val : null;
  }

  function parseString(input = "") {
    const match = String(input).match(/=\s*"([^"]*)"/) || String(input).match(/=\s*'([^']*)'/);
    return match ? match[1] : null;
  }

  function parseNumber(input = "", key) {
    const re = new RegExp(`${key}\\s*=\\s*(-?\\d+)`, "i");
    const match = String(input).match(re);
    return match ? Number(match[1]) : null;
  }

  function pickType(problem) {
    const tags = problem?.tags || [];
    const title = (problem?.title || "").toLowerCase();
    const text = `${problem?.brief?.scenario || ""} ${problem?.summary || ""}`.toLowerCase();

    if (tags.includes("matrix") || /grid|island|matrix|rotting orange/i.test(`${title} ${text}`)) return "grid";
    if (tags.includes("tree") || /tree|binary tree|bst|node/i.test(title)) return "tree";
    if (tags.includes("linked-list") || /linked list|list node/i.test(`${title} ${text}`)) return "linked-list";
    if (tags.includes("graph") || tags.includes("bfs") || tags.includes("dfs") || /graph|course schedule|word ladder/i.test(title)) {
      return "graph";
    }
    if (tags.includes("intervals") || /interval|meeting room/i.test(title)) return "intervals";
    if (tags.includes("sliding-window") || /sliding window|subarray|window size|fruit into baskets/i.test(title)) {
      return "sliding-window";
    }
    if (tags.includes("two-pointers") || /two sum|palindrome|container with most water|3sum|4sum/i.test(title)) {
      return "two-pointers";
    }
    if (tags.includes("string") || /\bs\s*=/.test(text) || /string|substring|anagram/i.test(title)) return "string";
    if (tags.includes("array") || /nums|array/i.test(text)) return "array";
    return "flow";
  }

  function caption(type, problem, example) {
    const title = problem?.title || "This problem";
    switch (type) {
      case "sliding-window":
        return `Visual: a moving window scans across the data for “${title}”.`;
      case "two-pointers":
        return `Visual: two markers scan from different sides for “${title}”.`;
      case "linked-list":
        return `Visual: nodes chained together — follow the arrows for “${title}”.`;
      case "tree":
        return `Visual: parent → child relationships in a tree for “${title}”.`;
      case "grid":
        return `Visual: each cell is one spot on the board for “${title}”.`;
      case "graph":
        return `Visual: dots are nodes, lines are connections for “${title}”.`;
      case "intervals":
        return `Visual: each bar is a time range for “${title}”.`;
      case "string":
        return `Visual: each box is one character for “${title}”.`;
      case "array":
        return `Visual: each box is one array value for “${title}”.`;
      default:
        return example?.input
          ? `Visual: sample input flows to the expected output for “${title}”.`
          : `Visual overview for “${title}”.`;
    }
  }

  function cell(x, y, w, h, label, opts = {}) {
    const { active = false, accent = false, muted = false } = opts;
    const cls = active ? "pd-cell pd-cell-active" : accent ? "pd-cell pd-cell-accent" : muted ? "pd-cell pd-cell-muted" : "pd-cell";
    return `
      <rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="6"/>
      <text class="pd-text" x="${x + w / 2}" y="${y + h / 2 + 4}" text-anchor="middle">${label}</text>`;
  }

  function arrow(x1, y1, x2, y2) {
    return `<line class="pd-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#pd-arrow)"/>`;
  }

  function svgWrap(width, height, inner, label) {
    return `<svg class="brief-glimpse-svg" viewBox="0 0 ${width} ${height}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs>
        <marker id="pd-arrow" markerWidth="7" markerHeight="7" refX="6" refY="3" orient="auto">
          <path d="M0,0 L6,3 L0,6 Z" class="pd-marker"/>
        </marker>
      </defs>
      ${inner}
    </svg>`;
  }

  function renderArray(values, highlight = []) {
    const items = (values || [2, 7, 11, 15]).slice(0, 5);
    const w = 30;
    const gap = 5;
    const pad = 8;
    const width = pad * 2 + items.length * w + (items.length - 1) * gap;
    const height = 52;
    let x = pad;
    const y = 10;
    let inner = "";

    items.forEach((val, i) => {
      inner += cell(x, y, w, 28, String(val), { active: highlight.includes(i) });
      x += w + gap;
    });

    return svgWrap(width, height, inner, TYPE_LABELS.array);
  }

  function renderString(str) {
    const chars = (str || "abc").slice(0, 7).split("");
    const w = 26;
    const gap = 4;
    const pad = 8;
    const width = pad * 2 + chars.length * w + (chars.length - 1) * gap;
    const height = 52;
    let x = pad;
    const y = 10;
    let inner = "";

    chars.forEach((ch) => {
      inner += cell(x, y, w, 28, ch === " " ? "·" : ch);
      x += w + gap;
    });

    return svgWrap(width, height, inner, TYPE_LABELS.string);
  }

  function renderSlidingWindow(values, k = 3) {
    const items = (values || [1, 3, -1, -3, 5]).slice(0, 5);
    const windowStart = 1;
    const highlight = Array.from({ length: Math.min(k, items.length) }, (_, i) => windowStart + i);
    const w = 30;
    const gap = 5;
    const pad = 8;
    const width = pad * 2 + items.length * w + (items.length - 1) * gap;
    const height = 52;
    let x = pad;
    const y = 14;
    let inner = "";
    const winX = pad + windowStart * (w + gap);
    const winW = k * w + (k - 1) * gap;
    inner += `<rect class="pd-window" x="${winX - 3}" y="${y - 4}" width="${winW + 6}" height="34" rx="5"/>`;
    items.forEach((val, i) => {
      inner += cell(x, y, w, 28, String(val), { active: highlight.includes(i) });
      x += w + gap;
    });
    return svgWrap(width, height, inner, TYPE_LABELS["sliding-window"]);
  }

  function renderTwoPointers(values) {
    const items = (values || [1, 2, 4, 6, 8]).slice(0, 5);
    const left = 0;
    const right = items.length - 1;
    const w = 30;
    const gap = 5;
    const pad = 10;
    const width = pad * 2 + items.length * w + (items.length - 1) * gap;
    const height = 56;
    let x = pad;
    const y = 14;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, y, w, 28, String(val), { active: i === left || i === right });
      if (i === left) inner += `<text class="pd-pointer" x="${x + w / 2}" y="${y - 3}" text-anchor="middle">L</text>`;
      if (i === right) inner += `<text class="pd-pointer" x="${x + w / 2}" y="${y + 40}" text-anchor="middle">R</text>`;
      x += w + gap;
    });
    return svgWrap(width, height, inner, TYPE_LABELS["two-pointers"]);
  }

  function renderLinkedList(values) {
    const items = (values || [1, 2, 3]).slice(0, 4);
    const w = 28;
    const gap = 16;
    const pad = 8;
    const width = pad * 2 + items.length * w + (items.length - 1) * gap + 12;
    const height = 52;
    let x = pad + 12;
    const y = 10;
    let inner = `<text class="pd-caption" x="${pad}" y="26">→</text>`;
    items.forEach((val, i) => {
      inner += cell(x, y, w, 28, String(val), { accent: i === 0 });
      if (i < items.length - 1) inner += arrow(x + w + 2, y + 14, x + w + gap - 3, y + 14);
      x += w + gap;
    });
    return svgWrap(width, height, inner, TYPE_LABELS["linked-list"]);
  }

  function renderTree() {
    const width = 110;
    const height = 52;
    const positions = [[55, 10], [28, 38], [82, 38]];
    const labels = ["3", "9", "20"];
    let inner = "";
    inner += arrow(55, 18, 28, 30);
    inner += arrow(55, 18, 82, 30);
    labels.forEach((val, i) => {
      const [x, y] = positions[i];
      inner += `<circle class="pd-node" cx="${x}" cy="${y}" r="9"/>`;
      inner += `<text class="pd-text" x="${x}" y="${y + 4}" text-anchor="middle">${val}</text>`;
    });
    return svgWrap(width, height, inner, TYPE_LABELS.tree);
  }

  function renderGrid(matrix) {
    const grid = (matrix || [["1", "1", "0"], ["0", "1", "0"], ["1", "0", "1"]]).slice(0, 3);
    const rows = grid.length;
    const cols = Math.min(grid[0]?.length || 1, 4);
    const size = 18;
    const gap = 3;
    const pad = 8;
    const width = pad * 2 + cols * size + (cols - 1) * gap;
    const height = pad * 2 + rows * size + (rows - 1) * gap;
    let inner = "";
    let y = pad;
    for (let r = 0; r < rows; r += 1) {
      let x = pad;
      for (let c = 0; c < cols; c += 1) {
        const val = grid[r][c];
        const land = String(val) === "1";
        inner += cell(x, y, size, size, String(val), { active: land, muted: !land });
        x += size + gap;
      }
      y += size + gap;
    }
    return svgWrap(width, height, inner, TYPE_LABELS.grid);
  }

  function renderGraph() {
    const width = 110;
    const height = 52;
    const nodes = [[18, 26], [55, 10], [55, 42], [92, 26]];
    let inner = "";
    inner += arrow(22, 24, 50, 14);
    inner += arrow(22, 28, 50, 38);
    inner += arrow(60, 14, 88, 24);
    inner += arrow(60, 38, 88, 28);
    nodes.forEach(([x, y], i) => {
      inner += `<circle class="pd-node" cx="${x}" cy="${y}" r="8"/>`;
      inner += `<text class="pd-text" x="${x}" y="${y + 4}" text-anchor="middle">${i}</text>`;
    });
    return svgWrap(width, height, inner, TYPE_LABELS.graph);
  }

  function renderIntervals(values) {
    const ranges = (values || [[1, 3], [2, 6], [8, 10]]).slice(0, 3);
    const pad = 8;
    const rowH = 12;
    const gap = 5;
    const width = 120;
    const height = pad * 2 + ranges.length * rowH + (ranges.length - 1) * gap;
    let inner = "";
    let y = pad;
    ranges.forEach(([a, b]) => {
      const x = 26 + a * 5;
      const w = Math.max(14, (b - a + 1) * 5);
      inner += `<rect class="pd-interval" x="${x}" y="${y}" width="${w}" height="10" rx="3"/>`;
      y += rowH + gap;
    });
    return svgWrap(width, height, inner, TYPE_LABELS.intervals);
  }

  function esc(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderFlow(example) {
    const input = esc((example?.input || "in").slice(0, 10));
    const output = esc((example?.output || "out").slice(0, 8));
    const width = 130;
    const height = 52;
    const inner = `
      ${cell(6, 12, 28, 26, "in", { muted: true })}
      ${arrow(36, 25, 46, 25)}
      ${cell(48, 12, 24, 26, "?", { accent: true })}
      ${arrow(74, 25, 84, 25)}
      ${cell(86, 12, 30, 26, "out", { muted: true })}
      <text class="pd-mini" x="20" y="28" text-anchor="middle">${input}</text>
      <text class="pd-mini" x="101" y="28" text-anchor="middle">${output}</text>
    `;
    return svgWrap(width, height, inner, TYPE_LABELS.flow);
  }

  function render(problem) {
    const type = pickType(problem);
    const example = problem?.brief?.examples?.[0];
    const input = example?.input || "";
    const nums = parseArray(input);
    const grid = parseGrid(input);
    const str = parseString(input);
    const k = parseNumber(input, "k") || 3;

    let diagram = "";

    switch (type) {
      case "grid":
        diagram = renderGrid(grid);
        break;
      case "tree":
        diagram = renderTree();
        break;
      case "linked-list":
        diagram = renderLinkedList(nums);
        break;
      case "graph":
        diagram = renderGraph();
        break;
      case "intervals":
        diagram = renderIntervals(parseGrid(input) || nums);
        break;
      case "sliding-window":
        diagram = renderSlidingWindow(nums, k);
        break;
      case "two-pointers":
        diagram = renderTwoPointers(nums);
        break;
      case "string":
        diagram = renderString(str);
        break;
      case "array":
        diagram = renderArray(nums);
        break;
      default:
        diagram = renderFlow(example);
    }

    return { diagram };
  }

  return { render, pickType };
})();
