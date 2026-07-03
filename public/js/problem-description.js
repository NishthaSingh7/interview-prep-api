/**
 * Problem brief modal — compact layout, tiny glimpse visual, unified CTA.
 */
const ProblemDescription = (() => {
  const SOLVE_CTA = "Let's solve →";

  let modalEl = null;

  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function diffClass(d) {
    const map = { Easy: "easy", Medium: "medium", Hard: "hard" };
    return map[d] || "medium";
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "problemDescriptionModal";
    modalEl.className = "problem-desc-modal";
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="problem-desc-backdrop" data-problem-desc-close tabindex="-1" aria-hidden="true"></div>
      <div class="problem-desc-sheet" role="dialog" aria-modal="true" aria-labelledby="problemDescTitle">
        <button type="button" class="problem-desc-close" data-problem-desc-close aria-label="Close">&times;</button>
        <header class="brief-header">
            <div class="brief-hero">
            <div class="brief-visual" id="problemDescGlimpse" hidden></div>
            <div class="brief-hero-text">
              <h2 class="brief-title" id="problemDescTitle"></h2>
              <span class="brief-diff" id="problemDescDiff"></span>
            </div>
          </div>
        </header>
        <div class="brief-scroll">
          <div class="brief-body" id="problemDescBody"></div>
        </div>
        <footer class="brief-footer">
          <a id="problemDescSolveBtn" class="btn btn-primary btn-full brief-solve-btn" href="#" target="_blank" rel="noopener noreferrer">${SOLVE_CTA}</a>
        </footer>
      </div>
    `;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-problem-desc-close]").forEach((el) => {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) close();
    });

    return modalEl;
  }

  function renderDescription(text) {
    return String(text || "No description available yet.")
      .split(/\n\n+/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p class="brief-desc-p">${escapeHtml(p)}</p>`)
      .join("");
  }

  function renderBriefBody(brief, fallbackSummary) {
    const description = brief?.scenario || fallbackSummary || "No description available yet.";
    const examples = (brief?.examples || []).slice(0, 2);

    const cases = examples
      .map(
        (ex, i) => `
        <article class="brief-example">
          <span class="brief-example-n">${i + 1}</span>
          <div class="brief-example-lines">
            <p><span class="brief-k">in</span> <code>${escapeHtml(ex.input || "—")}</code></p>
            <p><span class="brief-k">out</span> <code>${escapeHtml(ex.output || "—")}</code></p>
          </div>
        </article>`,
      )
      .join("");

    return `
      <div class="brief-desc">${renderDescription(description)}</div>
      ${examples.length ? `<section class="brief-examples"><h3 class="brief-examples-label">Examples</h3>${cases}</section>` : ""}`;
  }

  function practiceUrl(problem) {
    return problem?.leetcodeLink || problem?.practiceLink || "";
  }

  function updateSolveButton(problem) {
    const btn = modalEl?.querySelector("#problemDescSolveBtn");
    if (!btn) return;

    const url = practiceUrl(problem);
    btn.textContent = SOLVE_CTA;

    if (url) {
      btn.href = url;
      btn.removeAttribute("aria-disabled");
      btn.classList.remove("is-disabled");
      btn.onclick = () => close();
    } else {
      btn.href = "#";
      btn.setAttribute("aria-disabled", "true");
      btn.classList.add("is-disabled");
      btn.onclick = (e) => e.preventDefault();
    }
  }

  function iconButton(problem, className = "problem-desc-btn") {
    const title = problem?.title || "problem";
    return `<button type="button" class="${className}" data-problem-desc-id="${problem._id}" aria-label="Read brief for ${escapeHtml(title)}" title="Read question brief">
      <svg class="problem-desc-icon" viewBox="0 0 20 20" width="16" height="16" aria-hidden="true" focusable="false">
        <circle cx="10" cy="10" r="8.25" fill="none" stroke="currentColor" stroke-width="1.35"/>
        <path d="M10 9v5" stroke="currentColor" stroke-width="1.5" stroke-linecap="round"/>
        <circle cx="10" cy="6.25" r="0.9" fill="currentColor"/>
      </svg>
    </button>`;
  }

  function bindButtons(root, problemsById) {
    root.querySelectorAll("[data-problem-desc-id]").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        e.stopPropagation();
        const problem = problemsById.get(btn.dataset.problemDescId);
        if (problem) open(problem);
      });
    });
  }

  function open(problem) {
    const el = ensureModal();
    el.querySelector("#problemDescTitle").textContent = problem.title || "Problem";

    const diffEl = el.querySelector("#problemDescDiff");
    if (problem.difficulty) {
      diffEl.textContent = problem.difficulty;
      diffEl.className = `brief-diff brief-diff-${diffClass(problem.difficulty)}`;
      diffEl.hidden = false;
    } else {
      diffEl.hidden = true;
    }

    const glimpseEl = el.querySelector("#problemDescGlimpse");
    const visual = typeof ProblemDescDiagram !== "undefined" ? ProblemDescDiagram.render(problem || {}) : null;
    if (visual?.diagram) {
      glimpseEl.innerHTML = visual.diagram;
      glimpseEl.hidden = false;
    } else {
      glimpseEl.innerHTML = "";
      glimpseEl.hidden = true;
    }

    el.querySelector("#problemDescBody").innerHTML = renderBriefBody(problem.brief, problem.summary);
    updateSolveButton(problem);
    el.hidden = false;
    el.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function close() {
    if (!modalEl) return;
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
  }

  return { open, close, iconButton, bindButtons };
})();
