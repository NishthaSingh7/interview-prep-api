/**
 * Approach-specific diagrams for Study guides — each type matches the actual approach.
 */
const StudyApproachDiagram = (() => {
  let uid = 0;

  function parseArray(input = "") {
    const match = String(input).match(/=\s*(\[[^\]]*\])/);
    if (!match) return null;
    try {
      return JSON.parse(match[1].replace(/'/g, '"'));
    } catch {
      return null;
    }
  }

  function defaultArray(guide) {
    const ex = guide?.statement?.examples?.[0]?.input || "";
    const parsed = parseArray(ex);
    if (parsed?.length) return parsed.slice(0, 6);
    return [2, 7, 1, 4];
  }

  function cell(x, y, w, h, label, opts = {}) {
    const { active, accent, muted } = opts;
    let cls = "sa-cell";
    if (active) cls += " sa-cell-active";
    else if (accent) cls += " sa-cell-accent";
    else if (muted) cls += " sa-cell-muted";
    return `
      <rect class="${cls}" x="${x}" y="${y}" width="${w}" height="${h}" rx="4"/>
      <text class="sa-text" x="${x + w / 2}" y="${y + h / 2 + 3}" text-anchor="middle">${label}</text>`;
  }

  function arrow(x1, y1, x2, y2, markerId) {
    return `<line class="sa-line" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" marker-end="url(#${markerId})"/>`;
  }

  function wrap(w, h, inner, label) {
    const id = `sa-${++uid}`;
    return `<svg class="study-approach-svg" viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="${label}">
      <defs><marker id="${id}" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto"><path d="M0,0 L5,3 L0,6 Z" class="sa-marker"/></marker></defs>
      ${inner.replace(/\{\{MID\}\}/g, id)}
    </svg>`;
  }

  function renderBruteForcePairs(values) {
    const items = values.slice(0, 5);
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 18, cw, 22, String(val), { active: i <= 1 });
      if (i === 0) inner += `<text class="sa-label" x="${x + cw / 2}" y="12" text-anchor="middle">i</text>`;
      if (i === 1) inner += `<text class="sa-label" x="${x + cw / 2}" y="50" text-anchor="middle">j</text>`;
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">all pairs</text>`;
    return wrap(width, 58, inner, "Brute force all pairs");
  }

  function renderLinearScan(values) {
    const items = values.slice(0, 6);
    const cw = 20;
    const gap = 3;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 16, cw, 22, String(val), { active: i === 2 });
      if (i === 2) inner += `<text class="sa-label sa-label-accent" x="${x + cw / 2}" y="11" text-anchor="middle">i</text>`;
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">scan each element</text>`;
    return wrap(width, 58, inner, "Linear scan");
  }

  function renderBruteForceSubarrays(values) {
    const items = values.slice(0, 5);
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    const winX = pad + cw + gap - 2;
    const winW = 3 * cw + 2 * gap + 4;
    let inner = `<rect class="sa-window" x="${winX}" y="13" width="${winW}" height="28" rx="4"/>`;
    let x = pad;
    items.forEach((val, i) => {
      inner += cell(x, 16, cw, 22, String(val), { active: i >= 1 && i <= 3 });
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">every subarray</text>`;
    return wrap(width, 58, inner, "Brute force subarrays");
  }

  function renderTwoPointers(values) {
    const items = values.slice(0, 6);
    const left = 0;
    const right = items.length - 1;
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 16, cw, 22, String(val), { active: i === left || i === right });
      if (i === left) inner += `<text class="sa-label sa-label-accent" x="${x + cw / 2}" y="11" text-anchor="middle">L</text>`;
      if (i === right) inner += `<text class="sa-label sa-label-accent" x="${x + cw / 2}" y="48" text-anchor="middle">R</text>`;
      x += cw + gap;
    });
    return wrap(width, 56, inner, "Two pointers");
  }

  function renderThreePointers(values) {
    const items = values.slice(0, 6);
    const cw = 20;
    const gap = 3;
    const pad = 4;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      const accent = i === 0 || i === 1 || i === items.length - 1;
      inner += cell(x, 18, cw, 20, String(val), { active: accent });
      if (i === 0) inner += `<text class="sa-label" x="${x + cw / 2}" y="12" text-anchor="middle">lo</text>`;
      if (i === 1) inner += `<text class="sa-label" x="${x + cw / 2}" y="12" text-anchor="middle">mid</text>`;
      if (i === items.length - 1) inner += `<text class="sa-label" x="${x + cw / 2}" y="48" text-anchor="middle">hi</text>`;
      x += cw + gap;
    });
    return wrap(width, 62, inner, "Three pointers");
  }

  function renderSlidingWindow(values) {
    const items = values.slice(0, 6);
    const start = 1;
    const k = 3;
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    const winW = k * cw + (k - 1) * gap;
    const winX = pad + start * (cw + gap);
    let inner = `<rect class="sa-window" x="${winX - 2}" y="13" width="${winW + 4}" height="28" rx="4"/>`;
    let x = pad;
    items.forEach((val, i) => {
      inner += cell(x, 16, cw, 22, String(val), { active: i >= start && i < start + k });
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">sliding window</text>`;
    return wrap(width, 58, inner, "Sliding window");
  }

  function renderBinarySearch(values) {
    const items = [...values].sort((a, b) => a - b).slice(0, 6);
    const mid = Math.floor(items.length / 2);
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 16, cw, 22, String(val), { active: i === mid, accent: i === 0 || i === items.length - 1 });
      if (i === 0) inner += `<text class="sa-label" x="${x + cw / 2}" y="11" text-anchor="middle">lo</text>`;
      if (i === mid) inner += `<text class="sa-label sa-label-accent" x="${x + cw / 2}" y="11" text-anchor="middle">mid</text>`;
      if (i === items.length - 1) inner += `<text class="sa-label" x="${x + cw / 2}" y="48" text-anchor="middle">hi</text>`;
      x += cw + gap;
    });
    return wrap(width, 58, inner, "Binary search");
  }

  function renderFastSlow() {
    const items = [1, 2, 3, 4];
    const cw = 22;
    const gap = 12;
    const pad = 8;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 12, cw, 22, String(val), { active: i === 0 || i === 2 });
      if (i === 0) inner += `<text class="sa-label" x="${x + cw / 2}" y="8" text-anchor="middle">S</text>`;
      if (i === 2) inner += `<text class="sa-label" x="${x + cw / 2}" y="8" text-anchor="middle">F</text>`;
      if (i < items.length - 1) inner += arrow(x + cw + 1, 23, x + cw + gap - 2, 23, "{{MID}}");
      x += cw + gap;
    });
    return wrap(width, 48, inner, "Fast and slow pointers");
  }

  function renderHashSet(values) {
    const items = values.slice(0, 4);
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = 118;
    let x = pad;
    let inner = "";
    items.forEach((val) => {
      inner += cell(x, 14, cw, 22, String(val));
      x += cw + gap;
    });
    inner += cell(76, 10, 36, 30, "set", { accent: true });
    inner += arrow(pad + cw, 25, 74, 25, "{{MID}}");
    inner += `<text class="sa-caption" x="94" y="56" text-anchor="middle">hash set</text>`;
    return wrap(width, 58, inner, "Hash set tracking");
  }

  function renderIntervals() {
    const width = 120;
    let inner = "";
    [[8, 28], [22, 48], [60, 90]].forEach(([a, b], i) => {
      inner += `<rect class="sa-interval" x="${a}" y="${8 + i * 14}" width="${b - a}" height="10" rx="3"/>`;
    });
    inner += `<text class="sa-caption" x="60" y="52" text-anchor="middle">merge sorted intervals</text>`;
    return wrap(width, 54, inner, "Interval merge");
  }

  function renderGridDfs() {
    const grid = [[1, 1, 0], [0, 1, 0], [1, 0, 1]];
    const path = new Set(["0,0", "0,1", "1,1"]);
    const size = 14;
    const gap = 2;
    const pad = 6;
    const width = pad * 2 + 3 * size + 2 * gap;
    const height = pad * 2 + 3 * size + 2 * gap + 10;
    let inner = "";
    let y = pad;
    grid.forEach((row, r) => {
      let x = pad;
      row.forEach((val, c) => {
        const onPath = path.has(`${r},${c}`);
        inner += cell(x, y, size, size, String(val), { active: onPath && val === 1, muted: val === 0 });
        x += size + gap;
      });
      y += size + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="${height - 2}" text-anchor="middle">DFS flood fill</text>`;
    return wrap(width, height, inner, "Grid DFS traversal");
  }

  function renderLinkedListReverse() {
    const items = [1, 2, 3];
    const cw = 22;
    const gap = 14;
    const pad = 8;
    const width = 110;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 12, cw, 22, String(val), { accent: i === 0 });
      if (i < items.length - 1) inner += arrow(x + cw + 2, 23, x + cw + gap - 2, 23, "{{MID}}");
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="46" text-anchor="middle">reverse in place</text>`;
    return wrap(width, 48, inner, "Linked list reversal");
  }

  function renderLinkedListCopy() {
    const items = [1, 2, 3];
    const cw = 20;
    const gap = 10;
    const pad = 6;
    const width = 115;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 10, cw, 20, String(val));
      if (i < items.length - 1) inner += arrow(x + cw + 1, 20, x + cw + gap - 2, 20, "{{MID}}");
      x += cw + gap;
    });
    inner += arrow(x + 2, 20, x + 14, 20, "{{MID}}");
    inner += cell(x + 16, 10, cw, 20, "[]", { accent: true });
    inner += `<text class="sa-caption" x="${width / 2}" y="46" text-anchor="middle">copy to array</text>`;
    return wrap(width, 48, inner, "Naive list copy");
  }

  function renderDpTable() {
    const width = 100;
    let inner = "";
    for (let r = 0; r < 3; r++) {
      for (let c = 0; c < 4; c++) {
        inner += cell(6 + c * 23, 8 + r * 16, 20, 14, r === 0 || c === 0 ? "0" : "·", {
          muted: r > 0 && c > 0 && !(r === 2 && c === 3),
          active: r === 2 && c === 3,
        });
      }
    }
    inner += `<text class="sa-caption" x="50" y="56" text-anchor="middle">DP table</text>`;
    return wrap(width, 58, inner, "Dynamic programming table");
  }

  function renderRecursionTree() {
    const width = 110;
    const inner = `
      <circle class="sa-node" cx="55" cy="10" r="7"/>
      <text class="sa-text" x="55" y="13" text-anchor="middle">f</text>
      ${arrow(50, 17, 30, 28, "{{MID}}")}
      ${arrow(60, 17, 80, 28, "{{MID}}")}
      <circle class="sa-node" cx="30" cy="32" r="6"/>
      <circle class="sa-node" cx="80" cy="32" r="6"/>
      ${arrow(28, 38, 18, 48, "{{MID}}")}
      ${arrow(32, 38, 42, 48, "{{MID}}")}
      <circle class="sa-node" cx="18" cy="52" r="5"/>
      <circle class="sa-node" cx="42" cy="52" r="5"/>
      <text class="sa-caption" x="55" y="62" text-anchor="middle">recursive calls</text>`;
    return wrap(width, 64, inner, "Recursion tree");
  }

  function renderBfs() {
    const width = 115;
    const inner = `
      <circle class="sa-node" cx="20" cy="26" r="7"/>
      <text class="sa-text" x="20" y="29" text-anchor="middle">0</text>
      ${arrow(27, 22, 48, 14, "{{MID}}")}
      ${arrow(27, 30, 48, 38, "{{MID}}")}
      <circle class="sa-node" cx="55" cy="12" r="6"/>
      <circle class="sa-node" cx="55" cy="40" r="6"/>
      <text class="sa-text" x="55" y="15" text-anchor="middle">1</text>
      <text class="sa-text" x="55" y="43" text-anchor="middle">2</text>
      ${arrow(61, 12, 82, 26, "{{MID}}")}
      <circle class="sa-node" cx="90" cy="26" r="6"/>
      <text class="sa-text" x="90" y="29" text-anchor="middle">3</text>
      <text class="sa-caption" x="57" y="56" text-anchor="middle">BFS by level</text>`;
    return wrap(width, 58, inner, "BFS level order");
  }

  function renderDfs() {
    const width = 115;
    const inner = `
      <circle class="sa-node" cx="20" cy="40" r="7"/>
      <text class="sa-text" x="20" y="43" text-anchor="middle">0</text>
      ${arrow(27, 36, 48, 22, "{{MID}}")}
      <circle class="sa-node" cx="55" cy="18" r="6"/>
      <text class="sa-text" x="55" y="21" text-anchor="middle">1</text>
      ${arrow(61, 18, 82, 10, "{{MID}}")}
      <circle class="sa-node" cx="90" cy="10" r="6"/>
      <text class="sa-text" x="90" y="13" text-anchor="middle">2</text>
      <path class="sa-dfs-path" d="M20 40 L55 18 L90 10" fill="none" stroke-width="2"/>
      <text class="sa-caption" x="57" y="56" text-anchor="middle">DFS goes deep</text>`;
    return wrap(width, 58, inner, "DFS depth-first path");
  }

  function renderTopological() {
    const width = 120;
    const inner = `
      <circle class="sa-node" cx="18" cy="26" r="7"/><text class="sa-text" x="18" y="29" text-anchor="middle">0</text>
      ${arrow(25, 26, 42, 26, "{{MID}}")}
      <circle class="sa-node" cx="50" cy="26" r="7"/><text class="sa-text" x="50" y="29" text-anchor="middle">1</text>
      ${arrow(57, 26, 74, 26, "{{MID}}")}
      <circle class="sa-node" cx="82" cy="26" r="7"/><text class="sa-text" x="82" y="29" text-anchor="middle">2</text>
      ${arrow(50, 33, 50, 44, "{{MID}}")}
      <circle class="sa-node" cx="50" cy="50" r="7"/><text class="sa-text" x="50" y="53" text-anchor="middle">3</text>
      <text class="sa-caption" x="60" y="62" text-anchor="middle">topological order</text>`;
    return wrap(width, 64, inner, "Topological sort");
  }

  function renderHeap() {
    const width = 100;
    const inner = `
      <circle class="sa-node" cx="50" cy="12" r="8"/><text class="sa-text" x="50" y="15" text-anchor="middle">3</text>
      ${arrow(44, 18, 28, 30, "{{MID}}")}
      ${arrow(56, 18, 72, 30, "{{MID}}")}
      <circle class="sa-node" cx="28" cy="34" r="7"/><text class="sa-text" x="28" y="37" text-anchor="middle">1</text>
      <circle class="sa-node" cx="72" cy="34" r="7"/><text class="sa-text" x="72" y="37" text-anchor="middle">5</text>
      <text class="sa-caption" x="50" y="54" text-anchor="middle">min-heap top K</text>`;
    return wrap(width, 56, inner, "Heap structure");
  }

  function renderKWayMerge() {
    const width = 115;
    let inner = "";
    [[8, 10], [8, 28], [8, 46]].forEach(([x, y], i) => {
      inner += cell(x, y, 18, 14, String(i + 1));
      inner += cell(x + 22, y, 18, 14, String(i + 3));
    });
    inner += cell(72, 24, 36, 22, "heap", { accent: true });
  inner += `<text class="sa-caption" x="57" y="62" text-anchor="middle">k-way merge</text>`;
    return wrap(width, 64, inner, "K-way merge heap");
  }

  function renderXor() {
    const width = 110;
    const inner = `
      ${cell(6, 16, 22, 22, "3")}
      <text class="sa-text" x="34" y="30" text-anchor="middle">^</text>
      ${cell(42, 16, 22, 22, "5")}
      <text class="sa-text" x="70" y="30" text-anchor="middle">^</text>
      ${cell(78, 16, 22, 22, "3", { muted: true })}
      <text class="sa-text" x="54" y="30" text-anchor="middle">=</text>
      ${cell(54, 16, 22, 22, "5", { active: true })}
      <text class="sa-caption" x="55" y="52" text-anchor="middle">pairs cancel</text>`;
    return wrap(width, 56, inner, "XOR cancellation");
  }

  function renderBacktracking() {
    const width = 110;
    const inner = `
      <circle class="sa-node" cx="55" cy="8" r="6"/>
      ${arrow(50, 14, 30, 26, "{{MID}}")}
      ${arrow(60, 14, 80, 26, "{{MID}}")}
      <text class="sa-mini" x="22" y="30">skip</text>
      <text class="sa-mini" x="72" y="30">take</text>
      <circle class="sa-node" cx="30" cy="30" r="5"/>
      <circle class="sa-node" cx="80" cy="30" r="5"/>
      ${arrow(28, 35, 18, 46, "{{MID}}")}
      ${arrow(32, 35, 42, 46, "{{MID}}")}
      <circle class="sa-node" cx="18" cy="50" r="4"/>
      <circle class="sa-node" cx="42" cy="50" r="4"/>
      <text class="sa-caption" x="55" y="60" text-anchor="middle">include / exclude</text>`;
    return wrap(width, 62, inner, "Backtracking tree");
  }

  function renderGreedyScan() {
    const bars = [3, 7, 2, 9, 4];
    const pick = 3;
    const bw = 16;
    const gap = 4;
    const pad = 8;
    const width = pad * 2 + bars.length * (bw + gap);
    let x = pad;
    let inner = "";
    bars.forEach((h, i) => {
      const height = 10 + h * 3;
      inner += `<rect class="${i === pick ? "sa-bar-active" : "sa-bar"}" x="${x}" y="${50 - height}" width="${bw}" height="${height}" rx="3"/>`;
      x += bw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">pick local best</text>`;
    return wrap(width, 58, inner, "Greedy scan");
  }

  function renderCyclicSort() {
    const items = [3, 1, 4, 2];
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap + 20;
    let x = pad;
    let inner = "";
    items.forEach((val, i) => {
      inner += cell(x, 16, cw, 22, String(val), { active: i === 0 });
      if (i === 0) {
        const targetX = pad + (val - 1) * (cw + gap);
        inner += arrow(x + cw / 2, 38, targetX + cw / 2, 48, "{{MID}}");
        inner += `<text class="sa-label" x="${x + cw / 2}" y="11" text-anchor="middle">i</text>`;
      }
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="58" text-anchor="middle">swap to index</text>`;
    return wrap(width, 60, inner, "Cyclic sort placement");
  }

  function renderCounting(values) {
    const items = values.slice(0, 6);
    const cw = 20;
    const gap = 3;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val) => {
      inner += cell(x, 16, cw, 22, String(val));
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="12" text-anchor="middle">count values</text>`;
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">rewrite in order</text>`;
    return wrap(width, 58, inner, "Counting sort");
  }

  function renderFullSort(values) {
    const items = values.slice(0, 5);
    const cw = 22;
    const gap = 4;
    const pad = 6;
    const width = pad * 2 + items.length * cw + (items.length - 1) * gap;
    let x = pad;
    let inner = "";
    items.forEach((val) => {
      inner += cell(x, 16, cw, 22, String(val));
      x += cw + gap;
    });
    inner += `<text class="sa-caption" x="${width / 2}" y="56" text-anchor="middle">sort entire array</text>`;
    return wrap(width, 58, inner, "Full sort naive");
  }

  const RENDERERS = {
    "brute-force-pairs": (g) => renderBruteForcePairs(defaultArray(g)),
    "brute-force-subarrays": (g) => renderBruteForceSubarrays(defaultArray(g)),
    "linear-scan": (g) => renderLinearScan(defaultArray(g)),
    "two-pointers": (g) => renderTwoPointers(defaultArray(g)),
    "three-pointers": (g) => renderThreePointers(defaultArray(g)),
    "dutch-flag": (g) => renderThreePointers(defaultArray(g)),
    counting: (g) => renderCounting(defaultArray(g)),
    "sliding-window": (g) => renderSlidingWindow(defaultArray(g)),
    "binary-search": (g) => renderBinarySearch(defaultArray(g)),
    "fast-slow": () => renderFastSlow(),
    "hash-set": (g) => renderHashSet(defaultArray(g)),
    intervals: () => renderIntervals(),
    grid: () => renderGridDfs(),
    "grid-dfs": () => renderGridDfs(),
    "linked-list": () => renderLinkedListReverse(),
    "linked-list-copy": () => renderLinkedListCopy(),
    dp: () => renderDpTable(),
    "recursion-tree": () => renderRecursionTree(),
    bfs: () => renderBfs(),
    dfs: () => renderDfs(),
    topological: () => renderTopological(),
    heap: () => renderHeap(),
    "k-way-merge": () => renderKWayMerge(),
    xor: () => renderXor(),
    backtracking: () => renderBacktracking(),
    greedy: () => renderGreedyScan(),
    "cyclic-sort": (g) => renderCyclicSort(defaultArray(g)),
    "full-sort": (g) => renderFullSort(defaultArray(g)),
    // legacy aliases
    "brute-force": (g) => renderBruteForcePairs(defaultArray(g)),
  };

  function render(section, guide) {
    const type = section?.diagramType;
    if (!type) return "";
    const fn = RENDERERS[type];
    if (!fn) return "";
    const svg = fn(guide);
    if (!svg) return "";
    return `<div class="study-approach-viz" aria-hidden="false">${svg}</div>`;
  }

  return { render };
})();
