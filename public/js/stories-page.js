const StoriesPage = (() => {
  const CATEGORIES = [
    { id: "all", label: "All" },
    { id: "motivation", label: "Motivation" },
    { id: "interview", label: "Interview" },
    { id: "discipline", label: "Discipline" },
    { id: "mindset", label: "Mindset" },
  ];

  const STORIES = [
    {
      id: "venkatesh-google",
      category: "interview",
      icon: "🌙",
      title: "One problem a day while working full-time",
      teaser: "Venkatesh Dhongadi prepped at PANW nights, stuck to one daily problem, and landed Google.",
      author: "Venkatesh Dhongadi",
      source: "Medium — My Journey to Cracking Google",
      readMin: 2,
      body: [
        "Venkatesh was a year into his full-time role at Palo Alto Networks when he decided to seriously chase Google again. He started with one LeetCode problem per day — but consistency was brutal until he found a structured sheet he could trust and stopped drowning in random resources.",
        "For months his life shrank to three things: work, gym, and study. Friends noticed he 'disappeared.' He took focused leave before rounds, drilled high-frequency tagged questions, and ran four virtual on-sites in four days.",
        "In March 2025 the offer came through. His lesson for working engineers: you don't need to quit your job — you need one trusted path and the discipline to show up most nights, even when progress feels invisible.",
      ],
    },
    {
      id: "james-clear-never-twice",
      category: "discipline",
      icon: "🔗",
      title: "Never miss twice",
      teaser: "James Clear's recovery rule: one slip is an accident; two in a row is a new habit.",
      author: "James Clear",
      source: "Atomic Habits",
      readMin: 2,
      body: [
        "James Clear popularized a rule that changed how many people think about streaks: missing once is normal. Missing twice is when you start becoming someone who doesn't do the habit.",
        "On the recovery day, the job isn't to 'make up' for yesterday. It's to do the smallest possible version — one push-up, one page, one problem — so the loop fires again.",
        "For interview prep after work, that means a bad night doesn't erase you. It means tomorrow you open the laptop, solve something small, and log it. Perfection isn't the metric. Restart speed is.",
      ],
    },
    {
      id: "curt-one-pushup",
      category: "discipline",
      icon: "💪",
      title: "The one push-up that became years of consistency",
      teaser: "Curt Jaimungal couldn't make the gym stick for 21 years — until the bar was absurdly low.",
      author: "Curt Jaimungal",
      source: "Substack — One Push Up",
      readMin: 2,
      body: [
        "Curt Jaimungal writes that for twenty-one years he couldn't make working out stick. Goals like '30 minutes at the gym' kept failing and leaving him feeling worse each cycle.",
        "So he made the rule stupidly small: one push-up per day. Not ten. Not a workout. One. He found that starting the one often turned into more — but he never had to.",
        "He then didn't miss a day for years. The lesson maps cleanly to prep: 'one problem tonight' isn't a joke. It's how you lower the barrier until your brain can't argue its way out.",
      ],
    },
    {
      id: "tina-habit-capsules",
      category: "mindset",
      icon: "🫶",
      title: "Compassionate consistency",
      teaser: "Tina Nayak built six years of habits by knowing what to drop on hard days.",
      author: "Tina Nayak",
      source: "Substack — Compassionate Consistency",
      readMin: 2,
      body: [
        "Tina Nayak writes that real consistency isn't identical perfect days. It's knowing what to drop when life gets loud — without quitting entirely.",
        "She uses 'habit capsules': the minimum viable version designed for your busiest day. Ten squats instead of an hour at the gym. One sentence instead of a journal page. One problem instead of a three-hour grind.",
        "On her lowest month she still logged at least one habit on 30 of 31 days — because the floor was small enough to always say yes. That's the energy for after-work prep: shrink the night, don't cancel it.",
      ],
    },
    {
      id: "meta-over-prepared",
      category: "interview",
      icon: "🎯",
      title: "327 problems, then a fail — then a pass",
      teaser: "An engineer over-prepared for Meta, choked from memorization, and came back with depth over volume.",
      author: "Anonymous engineer",
      source: "Medium — I Failed Meta's Interview Because I Over-Prepared",
      readMin: 3,
      body: [
        "One engineer wrote about six months of intense Meta prep: 327 LeetCode problems, dozens of rehearsed STAR stories, 23 mock interviews. They walked in and froze — optimized for pattern recognition, not thinking under pressure.",
        "The second attempt looked smaller on paper: ~50 problems, but each solved multiple ways with trade-offs explained. Fewer mocks with people they actually knew. Less script, more understanding.",
        "They passed. The lesson isn't 'don't prepare.' It's that grinding hundreds of problems without depth can make you brittle. One thoughtful solve tonight beats three rushed ones you won't remember.",
      ],
    },
    {
      id: "reddit-communication",
      category: "interview",
      icon: "🎙️",
      title: "They didn't ace it — they communicated",
      teaser: "A Reddit SWE candidate says thought process mattered more than a perfect solution.",
      author: "Reddit SWE candidate",
      source: "Jointaro — Reddit interview experience",
      readMin: 2,
      body: [
        "A software engineer who received a Reddit offer wrote that in multiple rounds they didn't nail the coding question perfectly — but they kept talking through their approach, asking clarifying questions, and showing how they'd adapt.",
        "System design wasn't a textbook answer either. It was a conversation about trade-offs and scaling under changing requirements.",
        "If you're prepping alone at night, practice narrating out loud. The interview isn't only whether you finish — it's whether a stranger can follow your thinking.",
      ],
    },
    {
      id: "busy-engineer-8-week",
      category: "motivation",
      icon: "📅",
      title: "60–90 minutes is enough",
      teaser: "Subbu Uppalapati's 8-week system is built for engineers who still have a day job.",
      author: "Subbu Uppalapati",
      source: "DEV Community — 8-Week Prep System",
      readMin: 2,
      body: [
        "Subbu Uppalapati published an 8-week interview framework explicitly for busy engineers: about 75 minutes on weekdays, longer blocks on weekends, and one rest day.",
        "His point is that structure beats random grinding. Coding days, design days, behavioral days — with post-mortems after timed sets so mistakes don't repeat in silence.",
        "You don't need to disappear from life. You need a weekly rhythm you can actually keep while paying rent. One problem tonight is a valid entry point into that rhythm.",
      ],
    },
    {
      id: "leetcode-vs-design",
      category: "mindset",
      icon: "⚖️",
      title: "487 LeetCode problems wasn't the whole game",
      teaser: "An engineer learned that senior interviews test design and communication too.",
      author: "Devrim",
      source: "JavaScript in Plain English",
      readMin: 2,
      body: [
        "Devrim wrote about solving hundreds of LeetCode problems and still failing system design rounds at big companies. Coding was strong; structured design storytelling wasn't.",
        "What changed wasn't more volume — it was a repeatable framework: clarify requirements, estimate scale, sketch components, deep-dive, discuss bottlenecks.",
        "Even if you're early in prep, the lesson lands: don't let 'solved count' become your only scoreboard. Can you explain what you did tonight to another engineer? That's interview muscle too.",
      ],
    },
    {
      id: "full-time-realistic",
      category: "motivation",
      icon: "🌆",
      title: "Don't quit your job to grind",
      teaser: "Multiple prep guides agree: steady 10–15 hours/week beats burnout sprints.",
      author: "Working engineers",
      source: "FAANG prep guides (Copilot Interview, Apex Interviewer)",
      readMin: 2,
      body: [
        "Interview prep content written for people with jobs keeps repeating the same math: 60–90 minutes on most weekdays, for 8–12 weeks, is enough to land strong offers — if the time is focused.",
        "Guides aimed at working engineers explicitly warn against quitting to prep full-time. Burnout by week three or four is common. Spacing helps pattern recognition stick.",
        "If you're reading this tired after work, you're not behind. You're the audience these plans were written for. One problem tonight counts.",
      ],
    },
    {
      id: "minimum-viable-habit",
      category: "discipline",
      icon: "🌱",
      title: "Laughably small still counts",
      teaser: "Coaches call it the minimum viable habit — so small your brain can't say no.",
      author: "Habit researchers & coaches",
      source: "Triage Method, James Clear",
      readMin: 2,
      body: [
        "Behavior-change coaches describe 'minimum viable habits' as almost embarrassingly small — two pushups, five minutes of reading, one problem — because consistency rewires the brain through repetition, not intensity.",
        "The threat-detection part of your brain fights big commitments after a long workday. Tiny commitments slip through.",
        "AfterHours is built on that idea: one checkmark tonight is a real rep. You're not failing because you didn't do five problems. You're building if you did one.",
      ],
    },
    {
      id: "decade-wait",
      category: "motivation",
      icon: "⏳",
      title: "A decade of waiting, then all-in",
      teaser: "Venkatesh said he'd waited ten years for his Google shot — and finally went all-in.",
      author: "Venkatesh Dhongadi",
      source: "Medium — Google prep journey",
      readMin: 2,
      body: [
        "In his write-up, Venkatesh describes treating the Google process like something he'd been circling for years — not a whim. When the recruiter finally replied, he structured leave, cut distractions, and treated each round like it mattered.",
        "That seriousness didn't mean solving 20 problems a night. It meant not breaking the daily habit when motivation dipped, and trusting the sheet he'd committed to.",
        "You might not be chasing Google. But whatever company or role is your 'ten-year quiet goal' — tonight's single problem is how people like him kept the door open.",
      ],
    },
    {
      id: "recovery-not-guilt",
      category: "mindset",
      icon: "☕",
      title: "Rest days are part of the plan",
      teaser: "Sustainable prep schedules build in recovery — not guilt-driven catch-up.",
      author: "Interview prep coaches",
      source: "8-week prep frameworks",
      readMin: 2,
      body: [
        "Structured prep plans for full-time workers almost always include one real rest day per week. Not because you're lazy — because tired candidates interview badly.",
        "Weekend marathons that leave you dreading Monday don't compound. They spike anxiety and drop weekday quality.",
        "Miss a night? Don't punish yourself with a four-hour Sunday. Do one problem when you can, protect sleep, and come back. The long game is months, not one heroic evening.",
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

  function renderAttribution(story) {
    if (!story.author) return "";
    const source = story.source ? ` · ${story.source}` : "";
    return `<p class="stories-modal-attribution">Story summarized from ${escapeHtml(story.author)}${escapeHtml(source)}</p>`;
  }

  function renderBody(story) {
    return `${story.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}${renderAttribution(story)}`;
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
        <p class="stories-card-author">${escapeHtml(story.author || "")}</p>
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
    modal.querySelector("#storyModalKicker").textContent = `${story.icon} ${categoryLabel(story.category)} · ${story.readMin} min · ${story.author || "Story"}`;
    modal.querySelector("#storyModalTitle").textContent = story.title;
    modal.querySelector("#storyModalBody").innerHTML = renderBody(story);
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
        <h2 class="about-title">Real stories. Two-minute reads.</h2>
        <p class="about-lead">
          Summarized lessons from engineers, authors, and builders — interview journeys, discipline, and recovery after hard days.
          A calm stop before tonight's problem.
        </p>
        <div class="about-meta-row">
          <span class="about-pill">${STORIES.length} stories</span>
          <span class="about-pill">~2 min each</span>
          <span class="about-pill">Attributed sources</span>
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
