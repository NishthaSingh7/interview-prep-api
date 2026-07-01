const StoriesPage = (() => {
  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "motivation", label: "Motivation" },
    { id: "dsa", label: "DSA" },
    { id: "interview", label: "Interview" },
    { id: "mindset", label: "Mindset" },
  ];

  const STORIES = [
    {
      id: "one-problem-tonight",
      category: "motivation",
      icon: "🌙",
      title: "You only need one problem tonight",
      teaser: "The prep advice nobody with a day job wants to hear — until it works.",
      readMin: 2,
      body: [
        "There's a version of interview prep that looks like quitting your job, doing 8 problems a day, and posting your grind on LinkedIn. That's not your life. You have standups, PR reviews, and a brain that's already been on for nine hours.",
        "AfterHours is built on a quieter bet: one quality problem after work, most nights, beats a heroic weekend binge every time. Not because binges are bad — because they don't survive February.",
        "Tonight doesn't need to be your best night. It needs to be a logged night. Check the box, close the laptop, sleep proud.",
      ],
    },
    {
      id: "two-pointers-story",
      category: "dsa",
      icon: "↔️",
      title: "The Two Pointers story interviewers want",
      teaser: "How to explain shrinking a window without sounding like you memorized a template.",
      readMin: 3,
      body: [
        "Two pointers isn't a trick — it's a story about not re-reading the same data. You have a sorted array and you ask: can I make a pair that sums to target? Brute force checks every pair. Two pointers start at both ends and move inward because sorting gave you a rule: if the sum is too small, the left pointer must move right.",
        "In the interview, say that out loud. 'I'm avoiding an O(n²) scan by using the order of the array.' Then write the loop. Interviewers care that you know why the pointers only move one direction.",
        "Practice one medium two-pointer problem this week. Your goal isn't speed — it's being able to teach it to the interviewer like you're pair programming.",
      ],
    },
    {
      id: "sliding-window-after-work",
      category: "dsa",
      icon: "🪟",
      title: "Sliding Window: the after-work friendly pattern",
      teaser: "Fixed or variable window — both are about not restarting from scratch.",
      readMin: 3,
      body: [
        "Sliding window problems show up constantly because they mirror real engineering: you have a stream of events and you care about the last K items, or the longest valid segment.",
        "The mental model: expand the right edge until the window breaks, then shrink from the left until it's valid again. You're never recomputing the whole subarray — you're updating counts.",
        "When you're tired at 10pm, draw the window on paper before you code. One sketch saves twenty minutes of off-by-one debugging.",
      ],
    },
    {
      id: "streak-broke",
      category: "mindset",
      icon: "🔗",
      title: "You broke your streak. Good — now what?",
      teaser: "A missed night is data, not a verdict on your career.",
      readMin: 2,
      body: [
        "Missing a night hurts because streaks are honest. They don't care about your excuse — travel, production fire, exhaustion. They just reset.",
        "But your best streak is still in the data. You already proved you can show up five, seven, ten nights in a row. The question isn't 'Am I disciplined?' — it's 'What's the smallest action that restarts the chain tonight?'",
        "One easy problem. One checkmark. The streak number will catch up later. Your identity as someone who preps after work doesn't reset at zero.",
      ],
    },
    {
      id: "think-aloud",
      category: "interview",
      icon: "🎙️",
      title: "Practice thinking out loud (even alone)",
      teaser: "Silence in an interview reads as stuck. Narration reads as senior.",
      readMin: 2,
      body: [
        "At home, whisper your plan before you type. 'I see sorted input, so binary search might apply.' 'Edge case: empty array.' 'I'll try a hash map for O(n) lookup.'",
        "It feels awkward alone. In the room, it's the difference between 'candidate froze' and 'candidate is structured.'",
        "Tonight when you solve, record a 60-second voice note explaining your approach. Delete it after. The reps matter.",
      ],
    },
    {
      id: "pattern-not-problem",
      category: "interview",
      icon: "🧩",
      title: "They ask a problem. You sell a pattern.",
      teaser: "Interviewers remember the framing, not whether you got line 47 perfect.",
      readMin: 3,
      body: [
        "Most candidates jump to code. Strong candidates name the pattern first: 'This smells like BFS because we're exploring levels.' 'Subarray sum → prefix sum or sliding window.'",
        "That sentence buys you five minutes of trust. The interviewer relaxes. You can stumble on syntax and still pass.",
        "AfterHours groups problems by pattern so your brain builds folders. When you see 'longest substring without repeating characters,' you shouldn't think of one LeetCode number — you should think sliding window.",
      ],
    },
    {
      id: "consistency-compounds",
      category: "motivation",
      icon: "📈",
      title: "Consistency compounds slower than you want",
      teaser: "And faster than you think.",
      readMin: 2,
      body: [
        "Night 3 feels invisible. Night 30 feels like you always knew BFS. Night 90 feels like interviews got quieter in your head.",
        "You won't feel the compound effect daily. You'll feel it when a problem you've never seen still feels familiar because the pattern rhymes with something you solved tired at 11pm.",
        "Trust the boring nights. They're doing work your anxiety can't see yet.",
      ],
    },
    {
      id: "binary-search-not-magic",
      category: "dsa",
      icon: "🔍",
      title: "Binary search isn't magic — it's a contract",
      teaser: "The condition must get monotonically better or worse as you move.",
      readMin: 3,
      body: [
        "People fail binary search because they treat it as 'sorted array → binary search.' The real question: can I define a predicate on index i that's false before some point and true after?",
        "Classic example: find minimum in rotated sorted array. The predicate isn't 'is this the answer' — it's 'is this part in the left sorted segment?'",
        "When studying tonight, write the predicate in English before you write mid = (lo + hi) >> 1.",
      ],
    },
    {
      id: "weekend-guilt",
      category: "mindset",
      icon: "☕",
      title: "Stop punishing yourself with weekend marathons",
      teaser: "Recovery is part of prep when you have a real job.",
      readMin: 2,
      body: [
        "Saturday 6-hour LeetCode sessions feel productive and leave you dreading Monday. Your job already takes cognitive load. Prep should add clarity, not another job.",
        "A sustainable rhythm: weeknights for one problem, weekends for one review or one hard problem if you have energy — not a rescue mission.",
        "The offer goes to people who can perform in the interview, not people who burned out proving they deserved it.",
      ],
    },
    {
      id: "redo-problems",
      category: "mindset",
      icon: "🔁",
      title: "Redoing a problem is not failure",
      teaser: "It's the difference between recognition and recall.",
      readMin: 2,
      body: [
        "You solved it three weeks ago. You can't reproduce it today. That's normal — your first solve was with hints, fresh memory, and momentum.",
        "Unchecking a problem in AfterHours isn't going backward. It's choosing depth over vanity metrics.",
        "Interview rooms don't show your solved count. They show whether you can rebuild the solution with a whiteboard and a stranger watching.",
      ],
    },
    {
      id: "system-design-bridge",
      category: "interview",
      icon: "🏗️",
      title: "DSA prep is interview stamina training",
      teaser: "Coding rounds test how you think under pressure — same muscle.",
      readMin: 2,
      body: [
        "You might wonder why arrays matter if you want a backend role. Because the coding round isn't about arrays — it's about decomposition, tradeoffs, and communication while tired.",
        "Every night you sit down after work and push through one hard thing, you're training the same meta-skill: structured thinking when you'd rather scroll.",
        "That's transferable to system design, behavioral, and on-call debugging. The problem is the gym. The skill is the muscle.",
      ],
    },
    {
      id: "after-hours-identity",
      category: "motivation",
      icon: "💻",
      title: "The after-hours identity",
      teaser: "You're not 'behind.' You're building on a different schedule.",
      readMin: 2,
      body: [
        "Full-time prep students start at page one in daylight. You start after dinner, when the team Slack finally quiets. Different starting line, same finish line.",
        "Your edge isn't free time — it's maturity. You know what shipping feels like. You know when good enough is good enough. Bring that to interviews.",
        "AfterHours exists because your progress deserves a map that respects your schedule. One marker tonight is enough.",
      ],
    },
  ];

  let activeFilter = "all";
  let modalEl = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function categoryLabel(id) {
    return CATEGORIES.find((c) => c.id === id)?.label || id;
  }

  function featuredStory() {
    const idx = hashString(todayKey()) % STORIES.length;
    return STORIES[idx];
  }

  function filteredStories() {
    if (activeFilter === "all") return STORIES;
    return STORIES.filter((s) => s.category === activeFilter);
  }

  function renderBody(body) {
    return body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
  }

  function renderFeatured(story) {
    return `
      <article class="stories-featured panel" data-story-id="${story.id}">
        <div class="stories-featured-top">
          <span class="stories-featured-badge">Tonight's read</span>
          <span class="stories-card-meta">${escapeHtml(categoryLabel(story.category))} · ${story.readMin} min</span>
        </div>
        <div class="stories-featured-body">
          <span class="stories-card-icon" aria-hidden="true">${story.icon}</span>
          <div>
            <h3 class="stories-featured-title">${escapeHtml(story.title)}</h3>
            <p class="stories-featured-teaser">${escapeHtml(story.teaser)}</p>
          </div>
        </div>
        <button type="button" class="btn btn-primary btn-sm stories-read-btn" data-story-id="${story.id}">Read story</button>
      </article>`;
  }

  function renderCard(story) {
    return `
      <article class="stories-card panel" data-story-id="${story.id}">
        <div class="stories-card-head">
          <span class="stories-card-icon" aria-hidden="true">${story.icon}</span>
          <span class="stories-card-tag">${escapeHtml(categoryLabel(story.category))}</span>
        </div>
        <h4 class="stories-card-title">${escapeHtml(story.title)}</h4>
        <p class="stories-card-teaser">${escapeHtml(story.teaser)}</p>
        <div class="stories-card-foot">
          <span class="stories-card-meta">${story.readMin} min read</span>
          <button type="button" class="btn btn-ghost btn-sm stories-read-btn" data-story-id="${story.id}">Read</button>
        </div>
      </article>`;
  }

  function renderFilters() {
    return CATEGORIES.map(
      (cat) => `
        <button
          type="button"
          class="stories-filter${activeFilter === cat.id ? " active" : ""}"
          data-filter="${cat.id}"
        >${escapeHtml(cat.label)}</button>`,
    ).join("");
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "storyModal";
    modalEl.className = "motivation-modal stories-modal";
    modalEl.hidden = true;
    modalEl.innerHTML = `
      <div class="motivation-backdrop" data-story-close tabindex="-1" aria-hidden="true"></div>
      <div class="motivation-dialog stories-dialog" role="dialog" aria-modal="true" aria-labelledby="storyModalTitle">
        <button type="button" class="motivation-close" data-story-close aria-label="Close">&times;</button>
        <p class="motivation-kicker" id="storyModalKicker"></p>
        <h3 class="motivation-headline" id="storyModalTitle"></h3>
        <div class="stories-modal-body motivation-message" id="storyModalBody"></div>
        <div class="motivation-actions">
          <a href="/" class="btn btn-primary motivation-cta" id="storyModalCta">Solve tonight's problem →</a>
        </div>
      </div>`;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-story-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) closeModal();
    });

    return modalEl;
  }

  function openModal(storyId) {
    const story = STORIES.find((s) => s.id === storyId);
    if (!story) return;

    const modal = ensureModal();
    modal.querySelector("#storyModalKicker").textContent = `${story.icon} ${categoryLabel(story.category)} · ${story.readMin} min`;
    modal.querySelector("#storyModalTitle").textContent = story.title;
    modal.querySelector("#storyModalBody").innerHTML = renderBody(story.body);
    modal.hidden = false;
    document.body.classList.add("motivation-open");
    modal.querySelector(".motivation-close").focus();
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove("motivation-open");
  }

  function bindEvents(root) {
    root.querySelectorAll("[data-filter]").forEach((btn) => {
      btn.addEventListener("click", () => {
        activeFilter = btn.dataset.filter;
        render(root);
      });
    });

    root.querySelectorAll(".stories-read-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        openModal(btn.dataset.storyId);
      });
    });

    root.querySelectorAll(".stories-featured").forEach((card) => {
      card.addEventListener("click", () => openModal(card.dataset.storyId));
    });
  }

  function render(root) {
    const featured = featuredStory();
    const list = filteredStories().filter((s) => activeFilter !== "all" || s.id !== featured.id);

    root.innerHTML = `
      <header class="stories-hero panel">
        <p class="about-eyebrow">Night Shift Stories</p>
        <h2 class="about-title">Read before you solve</h2>
        <p class="about-lead">
          Short motivation, DSA insight, and interview reality checks for people who prep after work.
          Two minutes of context. One problem tonight.
        </p>
        <div class="about-meta-row">
          <span class="about-pill">${STORIES.length} stories</span>
          <span class="about-pill">2–3 min reads</span>
          <span class="about-pill">New featured daily</span>
        </div>
      </header>

      ${activeFilter === "all" ? renderFeatured(featured) : ""}

      <div class="stories-toolbar">
        <div class="stories-filters" role="tablist" aria-label="Story categories">${renderFilters()}</div>
      </div>

      <div class="stories-grid">
        ${list.map(renderCard).join("")}
      </div>

      <section class="stories-cta panel">
        <h3>Done reading?</h3>
        <p>Pick one pattern. Solve one problem. Log one win.</p>
        <a href="/" class="btn btn-primary">Go to problems</a>
      </section>`;

    bindEvents(root);
  }

  function init() {
    const root = document.getElementById("storiesRoot");
    if (!root) return;
    render(root);
  }

  return { init };
})();
