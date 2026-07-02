const CompanionPage = (() => {
  const LAST_SOLVE_KEY = "afterhours_last_solve";

  const DIFFICULTY_OPTIONS = [
    { id: "easy", label: "😊 Easy" },
    { id: "medium", label: "😐 Medium" },
    { id: "hard", label: "😵 Hard" },
  ];

  const ENERGY_OPTIONS = [
    { id: "great", label: "⚡ Great" },
    { id: "fine", label: "🙂 Fine" },
    { id: "exhausted", label: "😴 Exhausted" },
  ];

  let modalEl = null;
  let activeSection = "journal";

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(dateKey) {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt.toLocaleDateString(undefined, { month: "short", day: "numeric" });
  }

  function readLastSolve() {
    try {
      const raw = sessionStorage.getItem(LAST_SOLVE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  function chipGroup(name, options, selected) {
    return `
      <div class="companion-chips" role="group" aria-label="${escapeHtml(name)}">
        ${options
          .map(
            (opt) => `
          <label class="companion-chip">
            <input type="radio" name="${name}" value="${opt.id}" ${selected === opt.id ? "checked" : ""} />
            <span>${opt.label}</span>
          </label>`,
          )
          .join("")}
      </div>`;
  }

  function renderHero() {
    const note = CompanionContent.nightNoteForToday();
    const letter = CompanionContent.founderLetterForToday();
    return `
      <header class="companion-hero panel">
        <div class="companion-hero-row">
          <div>
            <p class="companion-kicker">Night Companion</p>
            <h2 class="companion-title">Close the laptop with intention</h2>
          </div>
          <div class="companion-hero-pills">
            <span class="companion-pill">📓 Journal</span>
            <span class="companion-pill">💭 Night Note</span>
            <span class="companion-pill">💌 Letters</span>
          </div>
        </div>
        <p class="companion-lead">
          One problem after work is the job. This page is the ritual — reflect, read, promise tomorrow.
        </p>
        <blockquote class="companion-night-note panel">
          <p class="companion-night-note-label">Tonight's reminder</p>
          <p class="companion-night-note-text">${escapeHtml(note)}</p>
        </blockquote>
        <article class="companion-letter-spotlight panel">
          <p class="companion-letter-label">Letter #${letter.number} · ${escapeHtml(letter.title)}</p>
          ${letter.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("")}
        </article>
      </header>`;
  }

  function renderJournalForm(entry, lastSolve) {
    if (!Auth.isLoggedIn()) {
      return `
        <section class="companion-panel panel" id="companionJournal">
          <h3 class="companion-section-title">📓 Night Journal</h3>
          <p class="companion-muted">Log in to save tonight's win and build your timeline.</p>
          <a href="/login?next=companion" class="btn btn-primary btn-sm">Log in</a>
        </section>`;
    }

    const problemTitle = entry?.problemTitle || lastSolve?.title || "";
    const patternName = entry?.patternName || lastSolve?.patternName || "";
    const difficulty = entry?.problemDifficulty || lastSolve?.difficulty || "";

    return `
      <section class="companion-panel panel" id="companionJournal">
        <h3 class="companion-section-title">📓 Tonight's Journal</h3>
        <p class="companion-muted">Optional fields — even one sentence helps future you.</p>

        <div class="companion-win-card" id="companionWinCard">
          ${problemTitle ? `<p class="companion-win-title">✅ ${escapeHtml(problemTitle)}</p>` : `<p class="companion-win-title">✅ Today's win</p>`}
          ${patternName || difficulty ? `<p class="companion-win-meta">${escapeHtml([patternName, difficulty].filter(Boolean).join(" · "))}</p>` : ""}
        </div>

        <form id="companionJournalForm" class="companion-form">
          <input type="hidden" id="journalProblemId" value="${escapeHtml(entry?.problemId || lastSolve?.problemId || "")}" />
          <input type="hidden" id="journalProblemTitle" value="${escapeHtml(problemTitle)}" />
          <input type="hidden" id="journalPatternSlug" value="${escapeHtml(entry?.patternSlug || lastSolve?.patternSlug || "")}" />
          <input type="hidden" id="journalPatternName" value="${escapeHtml(patternName)}" />
          <input type="hidden" id="journalProblemDifficulty" value="${escapeHtml(difficulty)}" />

          <label class="companion-field">
            <span>What clicked today?</span>
            <textarea id="journalReflection" rows="2" placeholder="One sentence is enough.">${escapeHtml(entry?.reflection || "")}</textarea>
          </label>

          <label class="companion-field">
            <span>Today's win (optional note)</span>
            <textarea id="journalWinNote" rows="2" placeholder="e.g. Finally understood when to shrink the window.">${escapeHtml(entry?.winNote || "")}</textarea>
          </label>

          <fieldset class="companion-fieldset">
            <legend>How difficult did it feel?</legend>
            ${chipGroup("difficultyFelt", DIFFICULTY_OPTIONS, entry?.difficultyFelt || "")}
          </fieldset>

          <fieldset class="companion-fieldset">
            <legend>How was your energy?</legend>
            ${chipGroup("energy", ENERGY_OPTIONS, entry?.energy || "")}
          </fieldset>

          <div class="companion-form-actions">
            <button type="submit" class="btn btn-primary btn-sm">Save tonight</button>
            <button type="button" class="btn btn-ghost btn-sm" id="companionPromiseBtn" ${entry?.tomorrowPromise ? "disabled" : ""}>
              ${entry?.tomorrowPromise ? "See you tomorrow 🌙 ✓" : "See you tomorrow 🌙"}
            </button>
          </div>
          <p class="companion-save-status" id="companionSaveStatus" hidden></p>
        </form>
      </section>`;
  }

  function renderTimeline(timeline) {
    if (!Auth.isLoggedIn()) return "";

    const items = (timeline || [])
      .map((row) => {
        if (row.type === "entry") {
          const e = row.entry;
          const preview = e.reflection || e.winNote || e.problemTitle || "Reflected tonight";
          const meta = [e.patternName, e.problemDifficulty].filter(Boolean).join(" · ");
          return `
            <li class="companion-timeline-item companion-timeline-entry">
              <span class="companion-timeline-date">${formatDate(row.dateKey)}</span>
              <div>
                <p class="companion-timeline-title">${escapeHtml(preview)}</p>
                ${meta ? `<p class="companion-timeline-meta">${escapeHtml(meta)}</p>` : ""}
              </div>
            </li>`;
        }
        if (row.type === "solved") {
          return `
            <li class="companion-timeline-item companion-timeline-solved">
              <span class="companion-timeline-date">${formatDate(row.dateKey)}</span>
              <p class="companion-timeline-title">Solved — no journal entry</p>
            </li>`;
        }
        return `
          <li class="companion-timeline-item companion-timeline-skipped">
            <span class="companion-timeline-date">${formatDate(row.dateKey)}</span>
            <p class="companion-timeline-title">Skipped</p>
          </li>`;
      })
      .join("");

    return `
      <section class="companion-panel panel">
        <h3 class="companion-section-title">Last 30 nights</h3>
        <p class="companion-muted">Honest history — entries, solves, and skipped days.</p>
        <ul class="companion-timeline">${items}</ul>
      </section>`;
  }

  function renderLetters() {
    const cards = CompanionContent.FOUNDER_LETTERS.map(
      (letter) => `
        <button type="button" class="companion-read-card panel" data-letter-id="${letter.id}">
          <span class="companion-read-tag">Letter #${letter.number}</span>
          <h4>${escapeHtml(letter.title)}</h4>
          <p>${escapeHtml(letter.body[1] || letter.body[0])}</p>
        </button>`,
    ).join("");

    return `
      <section class="companion-panel panel" id="companionLetters">
        <h3 class="companion-section-title">💌 Founder Letters</h3>
        <p class="companion-muted">Short notes from Nishtha — tired evenings, real talk.</p>
        <div class="companion-read-grid">${cards}</div>
      </section>`;
  }

  function renderMindset() {
    const cards = CompanionContent.MINDSET_ARTICLES.map(
      (article) => `
        <button type="button" class="companion-read-card panel" data-mindset-id="${article.id}">
          <span class="companion-read-tag">${article.icon} ${article.readMin} min</span>
          <h4>${escapeHtml(article.title)}</h4>
          <p>${escapeHtml(article.teaser)}</p>
        </button>`,
    ).join("");

    return `
      <section class="companion-panel panel" id="companionMindset">
        <h3 class="companion-section-title">🧠 Interview Mindset</h3>
        <p class="companion-muted">Two-minute reads for after-work brains.</p>
        <div class="companion-read-grid">${cards}</div>
      </section>`;
  }

  function renderNightNotesLibrary() {
    const notes = CompanionContent.NIGHT_NOTES.slice(0, 12)
      .map((note) => `<li>${escapeHtml(note)}</li>`)
      .join("");

    return `
      <section class="companion-panel panel">
        <h3 class="companion-section-title">💭 Night Notes</h3>
        <p class="companion-muted">Rotating reminders — one featured above, more in the library.</p>
        <ul class="companion-notes-list">${notes}</ul>
      </section>`;
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "companionReadModal";
    modalEl.className = "motivation-modal companion-modal";
    modalEl.hidden = true;
    modalEl.innerHTML = `
      <div class="motivation-backdrop" data-companion-close tabindex="-1" aria-hidden="true"></div>
      <div class="motivation-dialog companion-dialog" role="dialog" aria-modal="true" aria-labelledby="companionModalTitle">
        <button type="button" class="motivation-close" data-companion-close aria-label="Close">&times;</button>
        <p class="motivation-kicker" id="companionModalKicker"></p>
        <h3 class="motivation-headline" id="companionModalTitle"></h3>
        <div class="companion-modal-body motivation-message" id="companionModalBody"></div>
        <div class="motivation-actions">
          <button type="button" class="btn btn-primary btn-sm" data-companion-close>Close</button>
        </div>
      </div>`;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-companion-close]").forEach((el) => {
      el.addEventListener("click", closeModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) closeModal();
    });

    return modalEl;
  }

  function openLetter(letterId) {
    const letter = CompanionContent.FOUNDER_LETTERS.find((l) => l.id === letterId);
    if (!letter) return;
    const modal = ensureModal();
    modal.querySelector("#companionModalKicker").textContent = `Letter #${letter.number}`;
    modal.querySelector("#companionModalTitle").textContent = letter.title;
    modal.querySelector("#companionModalBody").innerHTML = letter.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
    modal.hidden = false;
    document.body.classList.add("motivation-open");
  }

  function openMindset(articleId) {
    const article = CompanionContent.MINDSET_ARTICLES.find((a) => a.id === articleId);
    if (!article) return;
    const modal = ensureModal();
    modal.querySelector("#companionModalKicker").textContent = `${article.icon} Interview Mindset · ${article.readMin} min`;
    modal.querySelector("#companionModalTitle").textContent = article.title;
    modal.querySelector("#companionModalBody").innerHTML = article.body.map((p) => `<p>${escapeHtml(p)}</p>`).join("");
    modal.hidden = false;
    document.body.classList.add("motivation-open");
  }

  function closeModal() {
    if (!modalEl) return;
    modalEl.hidden = true;
    document.body.classList.remove("motivation-open");
  }

  function getFormPayload(tomorrowPromise = false) {
    const difficulty = document.querySelector('input[name="difficultyFelt"]:checked');
    const energy = document.querySelector('input[name="energy"]:checked');
    return {
      problemId: document.getElementById("journalProblemId")?.value || undefined,
      problemTitle: document.getElementById("journalProblemTitle")?.value || "",
      patternSlug: document.getElementById("journalPatternSlug")?.value || "",
      patternName: document.getElementById("journalPatternName")?.value || "",
      problemDifficulty: document.getElementById("journalProblemDifficulty")?.value || "",
      reflection: document.getElementById("journalReflection")?.value.trim() || "",
      winNote: document.getElementById("journalWinNote")?.value.trim() || "",
      difficultyFelt: difficulty?.value || undefined,
      energy: energy?.value || undefined,
      tomorrowPromise,
    };
  }

  async function saveJournal(tomorrowPromise = false) {
    const status = document.getElementById("companionSaveStatus");
    try {
      await Auth.api("/api/v1/journal", {
        method: "POST",
        body: JSON.stringify(getFormPayload(tomorrowPromise)),
      });
      if (status) {
        status.hidden = false;
        status.textContent = tomorrowPromise
          ? "Saved. See you tomorrow 🌙"
          : "Tonight saved.";
      }
      if (tomorrowPromise) {
        const btn = document.getElementById("companionPromiseBtn");
        if (btn) {
          btn.disabled = true;
          btn.textContent = "See you tomorrow 🌙 ✓";
        }
      }
      await loadAndRender(document.getElementById("companionRoot"));
    } catch (err) {
      if (status) {
        status.hidden = false;
        status.textContent = err.message;
      }
    }
  }

  function bindEvents(root) {
    root.querySelector("#companionJournalForm")?.addEventListener("submit", async (e) => {
      e.preventDefault();
      await saveJournal(false);
    });

    root.querySelector("#companionPromiseBtn")?.addEventListener("click", async () => {
      await saveJournal(true);
    });

    root.querySelectorAll("[data-letter-id]").forEach((btn) => {
      btn.addEventListener("click", () => openLetter(btn.dataset.letterId));
    });

    root.querySelectorAll("[data-mindset-id]").forEach((btn) => {
      btn.addEventListener("click", () => openMindset(btn.dataset.mindsetId));
    });
  }

  async function loadJournalData() {
    if (!Auth.isLoggedIn()) return { entry: null, timeline: [] };
    try {
      const [todayRes, timelineRes] = await Promise.all([
        Auth.api("/api/v1/journal/today"),
        Auth.api("/api/v1/journal/timeline?days=30"),
      ]);
      return {
        entry: todayRes.data,
        timeline: timelineRes.data || [],
      };
    } catch {
      return { entry: null, timeline: [] };
    }
  }

  async function loadAndRender(root) {
    const lastSolve = readLastSolve();
    const { entry, timeline } = await loadJournalData();

    root.innerHTML = `
      ${renderHero()}
      ${renderJournalForm(entry, lastSolve)}
      ${renderTimeline(timeline)}
      ${renderMindset()}
      ${renderLetters()}
      ${renderNightNotesLibrary()}`;

    bindEvents(root);

    if (new URLSearchParams(window.location.search).get("reflect") === "1") {
      document.getElementById("companionJournal")?.scrollIntoView({ behavior: "smooth" });
    }
  }

  function init() {
    const root = document.getElementById("companionRoot");
    if (!root) return;
    loadAndRender(root);
  }

  return { init, LAST_SOLVE_KEY };
})();
