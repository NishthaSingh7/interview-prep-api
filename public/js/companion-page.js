const CompanionPage = (() => {
  const LAST_SOLVE_KEY = "afterhours_last_solve";
  const TAB_KEY = "afterhours_companion_tab";
  const TIMELINE_DAYS = 15;

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
  let activeTab = "tonight";

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

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
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

  function renderHeader() {
    return `
      <header class="companion-header panel">
        <p class="companion-kicker">Night Companion</p>
        <h2 class="companion-title">Close your laptop with intention</h2>
        <p class="companion-lead">Solve on Home → reflect here → promise tomorrow. Two tabs, one ritual.</p>
      </header>`;
  }

  function renderTabs() {
    return `
      <div class="companion-tabs" role="tablist" aria-label="Companion sections">
        <button type="button" class="companion-tab${activeTab === "tonight" ? " active" : ""}" data-tab="tonight" role="tab" aria-selected="${activeTab === "tonight"}">
          🌙 Tonight
        </button>
        <button type="button" class="companion-tab${activeTab === "read" ? " active" : ""}" data-tab="read" role="tab" aria-selected="${activeTab === "read"}">
          📖 Read
        </button>
      </div>`;
  }

  function renderRitualSteps(entry) {
    const journaled = Boolean(entry?.reflection || entry?.winNote || entry?.difficultyFelt || entry?.energy);
    const promised = Boolean(entry?.tomorrowPromise);
    return `
      <ol class="companion-steps" aria-label="Tonight's ritual">
        <li class="companion-step is-done"><span>1</span> Solve one problem</li>
        <li class="companion-step${journaled ? " is-done" : " is-current"}"><span>2</span> Write your journal</li>
        <li class="companion-step${promised ? " is-done" : journaled ? " is-current" : ""}"><span>3</span> Promise tomorrow</li>
      </ol>`;
  }

  function renderJournalPrompt(entry, lastSolve, timeline) {
    const today = todayKey();
    const todayRow = (timeline || []).find((r) => r.dateKey === today);
    const solvedToday = Boolean(lastSolve || todayRow?.type === "entry" || todayRow?.type === "solved");
    const hasJournal = Boolean(entry?.reflection || entry?.winNote);

    if (hasJournal && entry?.tomorrowPromise) {
      return `
        <div class="companion-prompt companion-prompt-done panel">
          <p><strong>Tonight is complete.</strong> Journal saved and tomorrow promised. Rest well.</p>
        </div>`;
    }

    if (hasJournal) {
      return `
        <div class="companion-prompt companion-prompt-next panel">
          <p><strong>Journal saved.</strong> Last step: tap <em>See you tomorrow 🌙</em> when you're ready to close the laptop.</p>
        </div>`;
    }

    if (solvedToday) {
      return `
        <div class="companion-prompt companion-prompt-action panel">
          <p><strong>You solved tonight — now journal.</strong> One sentence on what clicked is enough. Future you will love reading this back.</p>
        </div>`;
    }

    return `
      <div class="companion-prompt panel">
        <p><strong>Start on Home:</strong> mark one problem done, then come back here to write tonight's journal.</p>
        <a href="/" class="btn btn-ghost btn-sm">Go to problems</a>
      </div>`;
  }

  function renderJournalForm(entry, lastSolve) {
    if (!Auth.isLoggedIn()) {
      return `
        <section class="companion-panel panel" id="companionJournal">
          <h3 class="companion-section-title">Tonight's journal</h3>
          <p class="companion-muted">Log in to save reflections and build your timeline.</p>
          <a href="/login?next=companion" class="btn btn-primary btn-sm">Log in</a>
        </section>`;
    }

    const problemTitle = entry?.problemTitle || lastSolve?.title || "";
    const patternName = entry?.patternName || lastSolve?.patternName || "";
    const difficulty = entry?.problemDifficulty || lastSolve?.difficulty || "";

    return `
      <section class="companion-panel panel" id="companionJournal">
        <div class="companion-panel-head">
          <h3 class="companion-section-title">Tonight's journal</h3>
          <span class="companion-panel-hint">~60 sec</span>
        </div>

        <div class="companion-win-card" id="companionWinCard">
          ${problemTitle
            ? `<p class="companion-win-title">✅ ${escapeHtml(problemTitle)}</p>`
            : `<p class="companion-win-title">✅ Tonight's win</p>`}
          ${patternName || difficulty
            ? `<p class="companion-win-meta">${escapeHtml([patternName, difficulty].filter(Boolean).join(" · "))}</p>`
            : `<p class="companion-win-meta">Linked when you solve from Home</p>`}
        </div>

        <form id="companionJournalForm" class="companion-form">
          <input type="hidden" id="journalProblemId" value="${escapeHtml(entry?.problemId || lastSolve?.problemId || "")}" />
          <input type="hidden" id="journalProblemTitle" value="${escapeHtml(problemTitle)}" />
          <input type="hidden" id="journalPatternSlug" value="${escapeHtml(entry?.patternSlug || lastSolve?.patternSlug || "")}" />
          <input type="hidden" id="journalPatternName" value="${escapeHtml(patternName)}" />
          <input type="hidden" id="journalProblemDifficulty" value="${escapeHtml(difficulty)}" />

          <label class="companion-field companion-field-primary">
            <span>What clicked today? <em class="companion-required-hint">Start here</em></span>
            <textarea id="journalReflection" rows="2" placeholder="e.g. Finally understood when to shrink the sliding window.">${escapeHtml(entry?.reflection || "")}</textarea>
          </label>

          <details class="companion-details">
            <summary>More details (optional)</summary>
            <div class="companion-details-body">
              <label class="companion-field">
                <span>Extra note</span>
                <textarea id="journalWinNote" rows="2" placeholder="Anything else worth remembering.">${escapeHtml(entry?.winNote || "")}</textarea>
              </label>
              <fieldset class="companion-fieldset">
                <legend>How difficult did it feel?</legend>
                ${chipGroup("difficultyFelt", DIFFICULTY_OPTIONS, entry?.difficultyFelt || "")}
              </fieldset>
              <fieldset class="companion-fieldset">
                <legend>How was your energy?</legend>
                ${chipGroup("energy", ENERGY_OPTIONS, entry?.energy || "")}
              </fieldset>
            </div>
          </details>

          <div class="companion-form-actions">
            <button type="submit" class="btn btn-primary btn-sm">Save journal</button>
            <button type="button" class="btn btn-ghost btn-sm" id="companionPromiseBtn" ${entry?.tomorrowPromise ? "disabled" : ""}>
              ${entry?.tomorrowPromise ? "See you tomorrow 🌙 ✓" : "See you tomorrow 🌙"}
            </button>
          </div>
          <p class="companion-save-status" id="companionSaveStatus" hidden></p>
        </form>
      </section>`;
  }

  function timelineLabel(row) {
    if (row.type === "entry") {
      const e = row.entry;
      const text = e.reflection || e.winNote || e.problemTitle || "Journal entry";
      return escapeHtml(text.length > 42 ? `${text.slice(0, 42)}…` : text);
    }
    if (row.type === "solved") return "Solved · no journal";
    return "Skipped";
  }

  function renderTimeline(timeline) {
    if (!Auth.isLoggedIn()) return "";

    const items = (timeline || [])
      .map(
        (row) => `
        <li class="companion-timeline-row companion-timeline-${row.type}">
          <span class="companion-timeline-dot" aria-hidden="true"></span>
          <span class="companion-timeline-date">${formatDate(row.dateKey)}</span>
          <span class="companion-timeline-text">${timelineLabel(row)}</span>
        </li>`,
      )
      .join("");

    return `
      <section class="companion-panel panel companion-timeline-panel">
        <div class="companion-panel-head">
          <h3 class="companion-section-title">Last ${TIMELINE_DAYS} nights</h3>
          <span class="companion-panel-hint">compact log</span>
        </div>
        <ul class="companion-timeline-compact">${items}</ul>
      </section>`;
  }

  function renderTonightTab(entry, lastSolve, timeline) {
    const note = CompanionContent.nightNoteForToday();
    return `
      <div class="companion-tab-panel" data-panel="tonight" ${activeTab !== "tonight" ? "hidden" : ""}>
        ${renderRitualSteps(entry)}
        ${renderJournalPrompt(entry, lastSolve, timeline)}
        ${renderJournalForm(entry, lastSolve)}
        ${renderTimeline(timeline)}
        <p class="companion-tonight-footer">💭 ${escapeHtml(note)}</p>
      </div>`;
  }

  function renderReadTab() {
    const note = CompanionContent.nightNoteForToday();
    const letter = CompanionContent.founderLetterForToday();
    const letterPreview = letter.body.slice(0, 3).map((p) => `<p>${escapeHtml(p)}</p>`).join("");

    const mindsetCards = CompanionContent.MINDSET_ARTICLES.map(
      (article) => `
        <button type="button" class="companion-read-row" data-mindset-id="${article.id}">
          <span class="companion-read-row-icon">${article.icon}</span>
          <span class="companion-read-row-body">
            <strong>${escapeHtml(article.title)}</strong>
            <small>${article.readMin} min · ${escapeHtml(article.teaser)}</small>
          </span>
        </button>`,
    ).join("");

    const letterCards = CompanionContent.FOUNDER_LETTERS.map(
      (l) => `
        <button type="button" class="companion-read-row" data-letter-id="${l.id}">
          <span class="companion-read-row-icon">💌</span>
          <span class="companion-read-row-body">
            <strong>Letter #${l.number} · ${escapeHtml(l.title)}</strong>
            <small>${escapeHtml((l.body[1] || l.body[0]).slice(0, 72))}…</small>
          </span>
        </button>`,
    ).join("");

    const notes = CompanionContent.NIGHT_NOTES.slice(0, 6)
      .map((n) => `<li>${escapeHtml(n)}</li>`)
      .join("");

    return `
      <div class="companion-tab-panel" data-panel="read" ${activeTab !== "read" ? "hidden" : ""}>
        <section class="companion-panel panel">
          <p class="companion-night-note-label">Tonight's reminder</p>
          <p class="companion-night-note-text">${escapeHtml(note)}</p>
        </section>

        <section class="companion-panel panel companion-letter-card">
          <div class="companion-panel-head">
            <h3 class="companion-section-title">Founder letter</h3>
            <button type="button" class="btn btn-ghost btn-sm" data-letter-id="${letter.id}">Read full</button>
          </div>
          <p class="companion-letter-label">Letter #${letter.number} · ${escapeHtml(letter.title)}</p>
          <div class="companion-letter-preview">${letterPreview}</div>
        </section>

        <section class="companion-panel panel">
          <h3 class="companion-section-title">Interview mindset</h3>
          <p class="companion-muted">Short reads when your brain is tired.</p>
          <div class="companion-read-list">${mindsetCards}</div>
        </section>

        <section class="companion-panel panel">
          <h3 class="companion-section-title">All founder letters</h3>
          <div class="companion-read-list">${letterCards}</div>
        </section>

        <section class="companion-panel panel">
          <h3 class="companion-section-title">Night notes</h3>
          <ul class="companion-notes-compact">${notes}</ul>
        </section>
      </div>`;
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
        status.textContent = tomorrowPromise ? "Saved. See you tomorrow 🌙" : "Journal saved.";
      }
      await loadAndRender(document.getElementById("companionRoot"), { keepTab: true });
    } catch (err) {
      if (status) {
        status.hidden = false;
        status.textContent = err.message;
      }
    }
  }

  function switchTab(tab) {
    activeTab = tab;
    try {
      sessionStorage.setItem(TAB_KEY, tab);
    } catch {
      /* ignore */
    }
    const root = document.getElementById("companionRoot");
    if (!root) return;
    root.querySelectorAll(".companion-tab").forEach((btn) => {
      const on = btn.dataset.tab === tab;
      btn.classList.toggle("active", on);
      btn.setAttribute("aria-selected", on ? "true" : "false");
    });
    root.querySelectorAll(".companion-tab-panel").forEach((panel) => {
      panel.hidden = panel.dataset.panel !== tab;
    });
  }

  function bindEvents(root) {
    root.querySelectorAll(".companion-tab").forEach((btn) => {
      btn.addEventListener("click", () => switchTab(btn.dataset.tab));
    });

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
        Auth.api(`/api/v1/journal/timeline?days=${TIMELINE_DAYS}`),
      ]);
      return {
        entry: todayRes.data,
        timeline: timelineRes.data || [],
      };
    } catch {
      return { entry: null, timeline: [] };
    }
  }

  async function loadAndRender(root, options = {}) {
    const params = new URLSearchParams(window.location.search);
    if (params.get("reflect") === "1") {
      activeTab = "tonight";
    } else if (!options.keepTab) {
      try {
        activeTab = sessionStorage.getItem(TAB_KEY) || "tonight";
      } catch {
        activeTab = "tonight";
      }
    }

    const lastSolve = readLastSolve();
    const { entry, timeline } = await loadJournalData();

    root.innerHTML = `
      ${renderHeader()}
      ${renderTabs()}
      ${renderTonightTab(entry, lastSolve, timeline)}
      ${renderReadTab()}`;

    bindEvents(root);

    if (params.get("reflect") === "1") {
      document.getElementById("companionJournal")?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  function init() {
    const root = document.getElementById("companionRoot");
    if (!root) return;
    loadAndRender(root);
  }

  return { init, LAST_SOLVE_KEY };
})();
