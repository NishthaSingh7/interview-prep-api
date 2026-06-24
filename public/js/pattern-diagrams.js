/**
 * Inline SVG diagrams for pattern info modals.
 * Styled via .pattern-info-diagram in style.css
 */
const PatternDiagrams = {
  wrap(title, body) {
    return `<svg class="pattern-diagram-svg" viewBox="0 0 360 132" xmlns="http://www.w3.org/2000/svg" role="img" aria-hidden="true">
      <title>${title}</title>
      ${body}
    </svg>`;
  },

  diagrams: {
    "sliding-window": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Expand right · shrink left</text>
      <rect class="pd-cell" x="24" y="36" width="28" height="28" rx="4"/><rect class="pd-cell" x="56" y="36" width="28" height="28" rx="4"/>
      <rect class="pd-cell pd-accent" x="88" y="36" width="28" height="28" rx="4"/><rect class="pd-cell pd-accent" x="120" y="36" width="28" height="28" rx="4"/>
      <rect class="pd-cell pd-accent" x="152" y="36" width="28" height="28" rx="4"/><rect class="pd-cell" x="184" y="36" width="28" height="28" rx="4"/>
      <rect class="pd-cell" x="216" y="36" width="28" height="28" rx="4"/><rect class="pd-cell" x="248" y="36" width="28" height="28" rx="4"/>
      <rect class="pd-window" x="84" y="30" width="100" height="40" rx="6"/>
      <text class="pd-label pd-accent-text" x="100" y="78">L</text>
      <line class="pd-pointer" x1="102" y1="82" x2="102" y2="72"/>
      <text class="pd-label pd-accent-text" x="168" y="78">R</text>
      <line class="pd-pointer" x1="170" y1="82" x2="170" y2="72"/>
      <text class="pd-note" x="180" y="108" text-anchor="middle">window = contiguous subarray / substring</text>`,

    "two-pointers": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Opposite ends move inward</text>
      <rect class="pd-cell" x="40" y="40" width="32" height="32" rx="4"/><rect class="pd-cell" x="76" y="40" width="32" height="32" rx="4"/>
      <rect class="pd-cell" x="112" y="40" width="32" height="32" rx="4"/><rect class="pd-cell" x="148" y="40" width="32" height="32" rx="4"/>
      <rect class="pd-cell" x="184" y="40" width="32" height="32" rx="4"/><rect class="pd-cell" x="220" y="40" width="32" height="32" rx="4"/>
      <rect class="pd-cell" x="256" y="40" width="32" height="32" rx="4"/>
      <text class="pd-label pd-accent-text" x="52" y="92">L →</text>
      <text class="pd-label pd-accent-text" x="268" y="92">← R</text>
      <path class="pd-arrow" d="M78 88h40"/><path class="pd-arrow-head" d="M118 88l-6-4v8z"/>
      <path class="pd-arrow" d="M250 88h-40"/><path class="pd-arrow-head" d="M210 88l6-4v8z"/>
      <text class="pd-note" x="180" y="118" text-anchor="middle">sorted array · pair sum · palindrome</text>`,

    "fast-slow-pointers": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Slow ×1 · Fast ×2</text>
      <circle class="pd-node" cx="50" cy="68" r="14"/><circle class="pd-node" cx="110" cy="68" r="14"/>
      <circle class="pd-node pd-accent" cx="170" cy="68" r="14"/><circle class="pd-node" cx="230" cy="68" r="14"/>
      <circle class="pd-node" cx="290" cy="68" r="14"/>
      <line class="pd-edge" x1="64" y1="68" x2="96" y2="68"/><line class="pd-edge" x1="124" y1="68" x2="156" y2="68"/>
      <line class="pd-edge" x1="184" y1="68" x2="216" y2="68"/><line class="pd-edge" x1="244" y1="68" x2="276" y2="68"/>
      <path class="pd-edge pd-cycle" d="M290 82c0 28-80 28-80 0"/>
      <circle class="pd-dot pd-slow" cx="110" cy="68" r="4"/><circle class="pd-dot pd-fast" cx="230" cy="68" r="4"/>
      <text class="pd-label" x="104" y="100">slow</text><text class="pd-label" x="222" y="100">fast</text>
      <text class="pd-note" x="180" y="122" text-anchor="middle">meet inside cycle → cycle exists</text>`,

    "merge-intervals": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Sort by start · merge overlaps</text>
      <line class="pd-axis" x1="30" y1="44" x2="330" y2="44"/>
      <rect class="pd-interval" x="50" y="52" width="70" height="12" rx="3"/>
      <rect class="pd-interval pd-overlap" x="100" y="68" width="90" height="12" rx="3"/>
      <rect class="pd-interval" x="210" y="52" width="80" height="12" rx="3"/>
      <text class="pd-note" x="50" y="98">before</text>
      <rect class="pd-interval pd-accent" x="50" y="108" width="140" height="12" rx="3"/>
      <rect class="pd-interval pd-accent" x="210" y="108" width="80" height="12" rx="3"/>
      <text class="pd-note" x="50" y="128">after merge</text>`,

    "cyclic-sort": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Each value → its index</text>
      <text class="pd-idx" x="52" y="38">0</text><text class="pd-idx" x="84" y="38">1</text><text class="pd-idx" x="116" y="38">2</text>
      <text class="pd-idx" x="148" y="38">3</text><text class="pd-idx" x="180" y="38">4</text>
      <rect class="pd-cell" x="40" y="44" width="28" height="28" rx="4"/><text class="pd-val" x="54" y="62">3</text>
      <rect class="pd-cell pd-wrong" x="72" y="44" width="28" height="28" rx="4"/><text class="pd-val" x="86" y="62">1</text>
      <rect class="pd-cell" x="104" y="44" width="28" height="28" rx="4"/><text class="pd-val" x="118" y="62">5</text>
      <rect class="pd-cell pd-wrong" x="136" y="44" width="28" height="28" rx="4"/><text class="pd-val" x="150" y="62">4</text>
      <rect class="pd-cell pd-wrong" x="168" y="44" width="28" height="28" rx="4"/><text class="pd-val" x="182" y="62">2</text>
      <path class="pd-swap" d="M86 76c20 24 44 24 64 0"/><text class="pd-note" x="180" y="108" text-anchor="middle">swap until nums[i] sits at index nums[i]-1</text>`,

    "island-matrix-traversal": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">DFS / BFS flood from each land cell</text>
      <g transform="translate(108,28)">
        <rect class="pd-grid" width="144" height="72" rx="4"/>
        <rect class="pd-water" x="4" y="4" width="28" height="28"/><rect class="pd-land pd-accent" x="36" y="4" width="28" height="28"/>
        <rect class="pd-land pd-accent" x="68" y="4" width="28" height="28"/><rect class="pd-water" x="100" y="4" width="28" height="28"/>
        <rect class="pd-water" x="4" y="36" width="28" height="28"/><rect class="pd-land pd-accent" x="36" y="36" width="28" height="28"/>
        <rect class="pd-water" x="68" y="36" width="28" height="28"/><rect class="pd-land" x="100" y="36" width="28" height="28"/>
      </g>
      <text class="pd-note" x="180" y="118" text-anchor="middle">highlight = one connected island</text>`,

    "in-place-reversal-linked-list": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">prev · curr · next</text>
      <text class="pd-note" x="60" y="44">before</text>
      <circle class="pd-node" cx="70" cy="62" r="12"/><circle class="pd-node" cx="130" cy="62" r="12"/><circle class="pd-node" cx="190" cy="62" r="12"/>
      <line class="pd-edge" x1="82" y1="62" x2="118" y2="62"/><line class="pd-edge" x1="142" y1="62" x2="178" y2="62"/>
      <text class="pd-note" x="60" y="88">after</text>
      <circle class="pd-node pd-accent" cx="70" cy="106" r="12"/><circle class="pd-node pd-accent" cx="130" cy="106" r="12"/><circle class="pd-node pd-accent" cx="190" cy="106" r="12"/>
      <line class="pd-edge pd-accent-edge" x1="178" y1="106" x2="142" y2="106"/><line class="pd-edge pd-accent-edge" x1="118" y1="106" x2="82" y2="106"/>`,

    "breadth-first-search": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Level by level (queue)</text>
      <circle class="pd-node pd-accent" cx="180" cy="44" r="14"/>
      <circle class="pd-node" cx="120" cy="78" r="11"/><circle class="pd-node" cx="180" cy="78" r="11"/><circle class="pd-node" cx="240" cy="78" r="11"/>
      <circle class="pd-node" cx="90" cy="108" r="9"/><circle class="pd-node" cx="130" cy="108" r="9"/><circle class="pd-node" cx="210" cy="108" r="9"/>
      <line class="pd-edge" x1="172" y1="56" x2="126" y2="68"/><line class="pd-edge" x1="180" y1="58" x2="180" y2="67"/>
      <line class="pd-edge" x1="188" y1="56" x2="234" y2="68"/>
      <text class="pd-label" x="300" y="48">0</text><text class="pd-label" x="300" y="82">1</text><text class="pd-label" x="300" y="112">2</text>
      <text class="pd-note" x="180" y="128" text-anchor="middle">shortest path in unweighted graphs</text>`,

    "depth-first-search": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Go deep, then backtrack</text>
      <circle class="pd-node pd-accent" cx="180" cy="40" r="14"/>
      <circle class="pd-node pd-accent" cx="130" cy="72" r="11"/><circle class="pd-node" cx="230" cy="72" r="11"/>
      <circle class="pd-node pd-accent" cx="100" cy="104" r="10"/><circle class="pd-node" cx="160" cy="104" r="10"/>
      <line class="pd-edge pd-accent-edge" x1="172" y1="52" x2="138" y2="62"/><line class="pd-edge" x1="188" y1="52" x2="222" y2="62"/>
      <line class="pd-edge pd-accent-edge" x1="122" y1="82" x2="108" y2="94"/>
      <path class="pd-path" d="M180 54 L130 72 L100 104"/>
      <text class="pd-note" x="180" y="126" text-anchor="middle">orange = current DFS path</text>`,

    "two-heaps": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Lower half · median · upper half</text>
      <polygon class="pd-heap pd-max" points="90,100 50,50 130,50"/>
      <text class="pd-label" x="78" y="78">max</text>
      <polygon class="pd-heap pd-min" points="270,100 230,50 310,50"/>
      <text class="pd-label" x="258" y="78">min</text>
      <rect class="pd-median" x="158" y="56" width="44" height="36" rx="6"/>
      <text class="pd-val pd-accent-text" x="180" y="80" text-anchor="middle">med</text>
      <text class="pd-note" x="180" y="122" text-anchor="middle">balance sizes after each insert</text>`,

    subsets: `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Pick / skip each element</text>
      <circle class="pd-node" cx="180" cy="36" r="12"/><text class="pd-val" x="176" y="40">[]</text>
      <circle class="pd-node" cx="120" cy="68" r="11"/><circle class="pd-node" cx="240" cy="68" r="11"/>
      <text class="pd-label" x="104" y="72">skip</text><text class="pd-label" x="228" y="72">pick</text>
      <circle class="pd-node" cx="80" cy="100" r="10"/><circle class="pd-node" cx="160" cy="100" r="10"/>
      <circle class="pd-node" cx="200" cy="100" r="10"/><circle class="pd-node" cx="280" cy="100" r="10"/>
      <line class="pd-edge" x1="174" y1="46" x2="126" y2="58"/><line class="pd-edge" x1="186" y1="46" x2="234" y2="58"/>
      <line class="pd-edge" x1="114" y1="78" x2="86" y2="92"/><line class="pd-edge" x1="126" y1="78" x2="154" y2="92"/>
      <text class="pd-note" x="180" y="122" text-anchor="middle">backtrack after each choice</text>`,

    "modified-binary-search": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Halve the search space</text>
      <rect class="pd-cell" x="50" y="44" width="30" height="30" rx="4"/><rect class="pd-cell" x="84" y="44" width="30" height="30" rx="4"/>
      <rect class="pd-cell" x="118" y="44" width="30" height="30" rx="4"/><rect class="pd-cell pd-accent" x="152" y="44" width="30" height="30" rx="4"/>
      <rect class="pd-cell" x="186" y="44" width="30" height="30" rx="4"/><rect class="pd-cell" x="220" y="44" width="30" height="30" rx="4"/>
      <rect class="pd-cell" x="254" y="44" width="30" height="30" rx="4"/>
      <text class="pd-label pd-accent-text" x="58" y="92">L</text>
      <text class="pd-label pd-accent-text" x="164" y="92">M</text>
      <text class="pd-label pd-accent-text" x="262" y="92">R</text>
      <line class="pd-bracket" x1="50" y1="82" x2="284" y2="82"/>
      <text class="pd-note" x="180" y="118" text-anchor="middle">monotonic condition → left or right</text>`,

    "bitwise-xor": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Pairs cancel · unique survives</text>
      <text class="pd-val" x="60" y="58">4</text><text class="pd-val" x="100" y="58">7</text>
      <text class="pd-val" x="140" y="58">4</text><text class="pd-val" x="180" y="58">7</text>
      <text class="pd-val pd-accent-text" x="240" y="58">5</text>
      <line class="pd-strike" x1="52" y1="62" x2="108" y2="48"/><line class="pd-strike" x1="132" y1="62" x2="188" y2="48"/>
      <text class="pd-note" x="180" y="88" text-anchor="middle">4 ⊕ 4 = 0 · 7 ⊕ 7 = 0 · answer = 5</text>
      <text class="pd-note" x="180" y="112" text-anchor="middle">a ⊕ a = 0 · a ⊕ 0 = a</text>`,

    "top-k-elements": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Heap of size K</text>
      <rect class="pd-cell" x="30" y="48" width="24" height="24" rx="3"/><rect class="pd-cell" x="58" y="48" width="24" height="24" rx="3"/>
      <rect class="pd-cell" x="86" y="48" width="24" height="24" rx="3"/><rect class="pd-cell" x="114" y="48" width="24" height="24" rx="3"/>
      <rect class="pd-cell" x="142" y="48" width="24" height="24" rx="3"/><rect class="pd-cell" x="170" y="48" width="24" height="24" rx="3"/>
      <rect class="pd-heap-box" x="230" y="40" width="100" height="72" rx="8"/>
      <text class="pd-label" x="248" y="58">min-heap</text>
      <rect class="pd-cell pd-accent" x="248" y="66" width="28" height="22" rx="3"/>
      <rect class="pd-cell pd-accent" x="282" y="66" width="28" height="22" rx="3"/>
      <text class="pd-note" x="180" y="118" text-anchor="middle">keep K best · pop weakest when full</text>`,

    "k-way-merge": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Pop smallest · push next</text>
      <rect class="pd-list" x="40" y="36" width="20" height="14" rx="2"/><rect class="pd-list" x="40" y="54" width="20" height="14" rx="2"/>
      <rect class="pd-list" x="40" y="72" width="20" height="14" rx="2"/>
      <rect class="pd-list" x="90" y="42" width="20" height="14" rx="2"/><rect class="pd-list" x="90" y="60" width="20" height="14" rx="2"/>
      <rect class="pd-list" x="140" y="48" width="20" height="14" rx="2"/><rect class="pd-list" x="140" y="66" width="20" height="14" rx="2"/>
      <rect class="pd-heap-box" x="200" y="44" width="56" height="48" rx="6"/>
      <text class="pd-label" x="212" y="58">heap</text>
      <path class="pd-arrow" d="M68 50h24"/><path class="pd-arrow" d="M118 56h24"/><path class="pd-arrow" d="M168 62h24"/>
      <rect class="pd-cell pd-accent" x="290" y="54" width="50" height="24" rx="4"/>
      <text class="pd-note" x="180" y="112" text-anchor="middle">merged output grows left → right</text>`,

    "topological-sort": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Dependencies before dependents</text>
      <circle class="pd-node" cx="70" cy="56" r="14"/><text class="pd-val" x="67" y="60">A</text>
      <circle class="pd-node" cx="160" cy="40" r="14"/><text class="pd-val" x="157" y="44">B</text>
      <circle class="pd-node" cx="160" cy="88" r="14"/><text class="pd-val" x="157" y="92">C</text>
      <circle class="pd-node pd-accent" cx="260" cy="64" r="14"/><text class="pd-val" x="257" y="68">D</text>
      <path class="pd-arrow" d="M84 54 L144 44"/><path class="pd-arrow-head" d="M144 44l-7-2v6z"/>
      <path class="pd-arrow" d="M84 60 L144 84"/><path class="pd-arrow-head" d="M144 84l-7-4v6z"/>
      <path class="pd-arrow" d="M174 48 L244 58"/><path class="pd-arrow" d="M174 86 L244 70"/>
      <text class="pd-note" x="180" y="118" text-anchor="middle">order: A → B,C → D (in-degree 0 queue)</text>`,

    "knapsack-01": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">DP table: items × capacity</text>
      <rect class="pd-grid" x="80" y="32" width="200" height="72" rx="4"/>
      <line class="pd-grid-line" x1="80" y1="52" x2="280" y2="52"/><line class="pd-grid-line" x1="80" y1="72" x2="280" y2="72"/>
      <line class="pd-grid-line" x1="120" y1="32" x2="120" y2="104"/><line class="pd-grid-line" x1="160" y1="32" x2="160" y2="104"/>
      <line class="pd-grid-line" x1="200" y1="32" x2="200" y2="104"/><line class="pd-grid-line" x1="240" y1="32" x2="240" y2="104"/>
      <rect class="pd-cell pd-accent" x="200" y="72" width="40" height="20" rx="2"/>
      <text class="pd-label" x="44" y="56">item</text><text class="pd-label" x="44" y="76">wt</text>
      <text class="pd-note" x="180" y="122" text-anchor="middle">take vs skip · best value in cell</text>`,

    "longest-common-substring": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">2D table over both strings</text>
      <text class="pd-label" x="70" y="40">ABCDE</text><text class="pd-label" x="70" y="58">ACE</text>
      <rect class="pd-grid" x="130" y="30" width="150" height="60" rx="4"/>
      <line class="pd-grid-line" x1="130" y1="50" x2="280" y2="50"/><line class="pd-grid-line" x1="130" y1="70" x2="280" y2="70"/>
      <line class="pd-grid-line" x1="160" y1="30" x2="160" y2="90"/><line class="pd-grid-line" x1="190" y1="30" x2="190" y2="90"/>
      <rect class="pd-cell pd-accent" x="190" y="50" width="30" height="20" rx="2"/>
      <text class="pd-note" x="180" y="112" text-anchor="middle">match ↖ +1 · else max(top, left)</text>`,

    "dynamic-programming": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Overlapping subproblems</text>
      <rect class="pd-cell" x="150" y="36" width="60" height="28" rx="4"/><text class="pd-val" x="168" y="54">f(n)</text>
      <rect class="pd-cell" x="80" y="76" width="50" height="24" rx="4"/><rect class="pd-cell" x="230" y="76" width="50" height="24" rx="4"/>
      <line class="pd-edge" x1="168" y1="64" x2="105" y2="76"/><line class="pd-edge" x1="192" y1="64" x2="255" y2="76"/>
      <rect class="pd-cell pd-dim" x="50" y="108" width="40" height="20" rx="3"/><rect class="pd-cell pd-dim" x="110" y="108" width="40" height="20" rx="3"/>
      <text class="pd-note" x="180" y="128" text-anchor="middle">memoize repeated states</text>`,

    "greedy-technique": `
      <text class="pd-caption" x="180" y="14" text-anchor="middle">Sort · pick what looks best now</text>
      <rect class="pd-bar" x="50" y="70" width="24" height="40" rx="3"/><rect class="pd-bar pd-accent" x="82" y="50" width="24" height="60" rx="3"/>
      <rect class="pd-bar" x="114" y="58" width="24" height="52" rx="3"/><rect class="pd-bar pd-accent" x="146" y="44" width="24" height="66" rx="3"/>
      <rect class="pd-bar" x="178" y="62" width="24" height="48" rx="3"/><rect class="pd-bar pd-accent" x="210" y="52" width="24" height="58" rx="3"/>
      <text class="pd-check pd-accent-text" x="88" y="46">✓</text><text class="pd-check pd-accent-text" x="152" y="40">✓</text>
      <text class="pd-check pd-accent-text" x="216" y="48">✓</text>
      <text class="pd-note" x="180" y="122" text-anchor="middle">feasible + locally optimal choices</text>`,
  },

  get(slug) {
    const body = this.diagrams[slug];
    if (!body) return null;
    return this.wrap(slug.replace(/-/g, " "), body);
  },
};

if (typeof window !== "undefined") {
  window.PatternDiagrams = PatternDiagrams;
}
