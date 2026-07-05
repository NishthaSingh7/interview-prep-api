const StudyPage = (() => {
  const state = {
    patterns: [],
    structures: [],
    problems: [],
    page: 1,
    pages: 1,
    limit: 50,
    total: 0,
    search: "",
    filterType: "",
    filterSlug: "",
    progressMap: new Map(),
    patternDone: {},
    structureDone: {},
    patternTotals: {},
    structureCatalogTotal: 0,
    articleSlug: "",
  };

  const $ = (sel) => document.querySelector(sel);

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function formatCount(done, total) {
    if (!Auth.isLoggedIn()) return String(total);
    const pct = total ? Math.round((done / total) * 100) : 0;
    return `${done}/${total} · ${pct}%`;
  }

  function api(path) {
    return Auth.api(path);
  }

  function studyListUrl(filterType, filterSlug) {
    if (filterType === "structure" && filterSlug) {
      return `/study?structure=${encodeURIComponent(filterSlug)}`;
    }
    if (filterType === "pattern" && filterSlug) {
      return `/study?pattern=${encodeURIComponent(filterSlug)}`;
    }
    return "/study";
  }

  function syncListUrl() {
    const url = studyListUrl(state.filterType, state.filterSlug);
    if (`${window.location.pathname}${window.location.search}` !== url) {
      window.history.pushState(null, "", url);
    }
  }

  function applyListParamsFromUrl() {
    const params = new URLSearchParams(window.location.search);
    const structure = params.get("structure");
    const pattern = params.get("pattern");
    if (structure) {
      state.filterType = "structure";
      state.filterSlug = structure;
      return;
    }
    if (pattern) {
      state.filterType = "pattern";
      state.filterSlug = pattern;
      return;
    }
    state.filterType = "";
    state.filterSlug = "";
  }

  function renderStructureIntro() {
    const intro = $("#studyStructureIntro");
    const section = $(".learn-section");
    const wrap = $("#studyProblemsWrap");
    const problemsHead = $("#studyDsProblemsHead");
    const problemsLead = $("#studyDsProblemsLead");
    const head = $(".problems-section-head");
    const lead = $(".learn-lead");
    if (!intro) return;

    if (state.filterType !== "structure" || !state.filterSlug) {
      intro.hidden = true;
      intro.innerHTML = "";
      section?.classList.remove("is-structure-view");
      wrap?.classList.remove("study-ds-problems-wrap");
      if (problemsHead) problemsHead.hidden = true;
      if (head) head.hidden = false;
      if (lead) lead.hidden = false;
      return;
    }

    const structure = DataStructures.get(state.filterSlug);
    const meta = state.structures.find((s) => s.slug === state.filterSlug);
    const count = meta?.total ?? state.total;

    if (!structure) {
      intro.hidden = true;
      intro.innerHTML = "";
      section?.classList.remove("is-structure-view");
      wrap?.classList.remove("study-ds-problems-wrap");
      if (problemsHead) problemsHead.hidden = true;
      if (head) head.hidden = false;
      return;
    }

    intro.hidden = false;
    intro.innerHTML = StudyStructure.render(structure, count);
    StudyStructure.bind(intro);
    section?.classList.add("is-structure-view");
    wrap?.classList.add("study-ds-problems-wrap");
    if (head) head.hidden = true;
    if (lead) lead.hidden = true;
    if (problemsHead) {
      problemsHead.hidden = false;
      if (problemsLead) {
        problemsLead.textContent = `${count} problems tagged ${structure.name.toLowerCase()} in this course.`;
      }
    }
  }

  function studyUrl(slug) {
    return `/study?problem=${encodeURIComponent(slug)}`;
  }

  function setListVisible(show) {
    const layout = $(".learn-layout");
    const section = $(".learn-section");
    if (layout) layout.hidden = !show;
    if (section) section.hidden = !show;
  }

  function setArticleVisible(show) {
    let root = $("#studyArticleRoot");
    if (!root && show) {
      root = document.createElement("div");
      root.id = "studyArticleRoot";
      root.className = "study-article-root";
      const main = document.querySelector(".learn-layout")?.parentElement || document.body;
      const footer = document.querySelector(".site-footer");
      main.insertBefore(root, footer);
    }
    if (root) {
      root.hidden = !show;
      if (!show) root.innerHTML = "";
    }
  }

  async function loadArticle(slug) {
    setListVisible(false);
    setArticleVisible(true);
    const root = $("#studyArticleRoot");
    if (!root) return;

    root.innerHTML = '<div class="loading"><div class="loader"></div></div>';

    try {
      await StudyGuides.load();
      const guide = StudyGuides.getGuide(slug);
      const guideSlug = guide?.slug || slug;
      const { data: problem } = await api(`/api/v1/problems/${encodeURIComponent(guideSlug)}`);
      root.innerHTML = StudyArticle.render(problem, guide);
      StudyArticle.bind(root);
    } catch (err) {
      root.innerHTML = `
        <div class="study-article about-wrap">
          <a href="/study" class="study-back">← Back to course</a>
          <div class="empty-state">Could not load: ${escapeHtml(err.message)}</div>
        </div>`;
    }
  }

  async function loadCatalog() {
    const [patternsRes, structuresRes] = await Promise.allSettled([
      api("/api/v1/patterns"),
      api("/api/v1/problems/structure-stats"),
    ]);
    state.patterns =
      patternsRes.status === "fulfilled" ? patternsRes.value.data || [] : [];
    state.structures =
      structuresRes.status === "fulfilled" ? structuresRes.value.data || [] : [];
    state.structureCatalogTotal =
      structuresRes.status === "fulfilled" ? structuresRes.value.catalogTotal || 0 : 0;
    state.patterns.forEach((p) => {
      state.patternTotals[p._id] = p.problemCount ?? 15;
    });
  }

  async function loadProgress() {
    if (!Auth.isLoggedIn()) return;
    try {
      const { data } = await api("/api/v1/progress?status=done");
      state.progressMap.clear();
      state.patternDone = {};
      state.structureDone = {};
      for (const entry of data) {
        const problem = entry.problemId;
        if (!problem) continue;
        state.progressMap.set(problem._id, true);
        const pid = problem.patternId?._id || problem.patternId;
        if (pid) state.patternDone[pid] = (state.patternDone[pid] || 0) + 1;
        const tags = problem.tags || [];
        for (const structure of state.structures) {
          if (structure.tags.some((tag) => tags.includes(tag))) {
            state.structureDone[structure.slug] = (state.structureDone[structure.slug] || 0) + 1;
          }
        }
      }
    } catch {
      /* guest or session expired */
    }
  }

  function renderRoadmap() {
    const root = $("#studyRoadmap");
    if (!root) return;

    const allDone = Auth.isLoggedIn() ? state.progressMap.size : 0;
    const allTotal = state.patterns.reduce(
      (n, p) => n + (state.patternTotals[p._id] ?? p.problemCount ?? 0),
      0,
    ) || 365;

    const structureItems = state.structures
      .map((s) => {
        const done = state.structureDone[s.slug] || 0;
        const active = state.filterType === "structure" && state.filterSlug === s.slug;
        return `
          <li>
            <button type="button" class="learn-roadmap-btn${active ? " active" : ""}" data-filter-type="structure" data-filter-slug="${s.slug}">
              <span>${escapeHtml(s.name)}</span>
              <span class="learn-roadmap-count">${formatCount(done, s.total)}</span>
            </button>
          </li>`;
      })
      .join("");

    const patternItems = state.patterns
      .map((p) => {
        const done = state.patternDone[p._id] || 0;
        const total = state.patternTotals[p._id] || 15;
        const active = state.filterType === "pattern" && state.filterSlug === p.slug;
        return `
          <li>
            <button type="button" class="learn-roadmap-btn${active ? " active" : ""}" data-filter-type="pattern" data-filter-slug="${p.slug}">
              <span>${escapeHtml(p.name)}</span>
              <span class="learn-roadmap-count">${formatCount(done, total)}</span>
            </button>
          </li>`;
      })
      .join("");

    root.innerHTML = `
      <div class="learn-roadmap-overview panel">
        <div class="sidebar-progress-head">
          <span>DSA roadmap</span>
          <span class="sidebar-progress-pct">${Auth.isLoggedIn() ? `${Math.round((allDone / allTotal) * 100) || 0}%` : "—"}</span>
        </div>
        <div class="sidebar-progress-bar" aria-hidden="true">
          <div class="sidebar-progress-fill" style="width:${Auth.isLoggedIn() ? Math.round((allDone / allTotal) * 100) : 0}%"></div>
        </div>
        <p class="sidebar-progress-meta">${Auth.isLoggedIn() ? `${allDone} of ${allTotal} studied` : `${allTotal} problems in the course`}</p>
      </div>
      <section class="learn-roadmap-section">
        <h3 class="learn-roadmap-heading">Data structures</h3>
        <ul class="learn-roadmap-list">
          <li>
            <button type="button" class="learn-roadmap-btn${!state.filterSlug ? " active" : ""}" data-filter-type="" data-filter-slug="">
              <span>Full course</span>
              <span class="learn-roadmap-count">${Auth.isLoggedIn() ? `${allDone}/${allTotal}` : allTotal}</span>
            </button>
          </li>
          ${structureItems}
        </ul>
      </section>
      <section class="learn-roadmap-section">
        <h3 class="learn-roadmap-heading">Coding patterns</h3>
        <ul class="learn-roadmap-list">${patternItems}</ul>
      </section>`;
  }

  async function loadProblems() {
    const params = new URLSearchParams({ page: state.page, limit: state.limit });
    if (state.search) params.set("search", state.search);
    if (state.filterType === "pattern" && state.filterSlug) {
      const pattern = state.patterns.find((p) => p.slug === state.filterSlug);
      if (pattern) params.set("patternId", pattern._id);
    }
    if (state.filterType === "structure" && state.filterSlug) {
      params.set("structure", state.filterSlug);
    }

    const { data, total, pages, page } = await api(`/api/v1/problems?${params}`);
    state.problems = data;
    state.total = total;
    state.pages = pages;
    state.page = page;
    renderTable();
    renderPagination();
    updateTitle();
    renderStructureIntro();
  }

  function updateTitle() {
    const title = $("#studyViewTitle");
    if (!title) return;
    if (state.filterType === "structure") {
      const s = state.structures.find((x) => x.slug === state.filterSlug);
      title.textContent = s?.name || "Data structures";
      return;
    }
    if (state.filterType === "pattern") {
      const p = state.patterns.find((x) => x.slug === state.filterSlug);
      title.textContent = p?.name || "Coding patterns";
      return;
    }
    title.textContent = "Full DSA course";
  }

  function renderTable() {
    const container = $("#studyProblemsContainer");
    if (!container) return;

    if (!state.problems.length) {
      container.innerHTML = '<div class="empty-state">No problems in this section yet.</div>';
      return;
    }

    const offset = (state.page - 1) * state.limit;

    const rows = state.problems
      .map(
        (p, i) => `
        <tr class="learn-row">
          <td class="col-num">${offset + i + 1}</td>
          <td class="col-title">
            <a href="${studyUrl(p.slug)}" class="study-title-link">${escapeHtml(p.title)}</a>
          </td>
          <td class="col-difficulty"><span class="diff-label diff-label-${(p.difficulty || "").toLowerCase()}">${escapeHtml(p.difficulty)}</span></td>
        </tr>`,
      )
      .join("");

    container.innerHTML = `
      <div class="table-wrap">
        <table class="problem-table learn-table">
          <thead>
            <tr>
              <th class="col-num">#</th>
              <th class="col-title">Title</th>
              <th class="col-difficulty">Difficulty</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  }

  function renderPagination() {
    const pag = $("#studyPagination");
    if (!pag) return;
    if (state.pages <= 1) {
      pag.hidden = true;
      return;
    }
    pag.hidden = false;
    $("#studyPageInfo").textContent = `Page ${state.page} of ${state.pages}`;
    $("#studyPrevPage").disabled = state.page <= 1;
    $("#studyNextPage").disabled = state.page >= state.pages;
  }

  function showList() {
    state.articleSlug = "";
    setArticleVisible(false);
    setListVisible(true);
  }

  function bindEvents() {
    $("#studyRoadmap")?.addEventListener("click", (e) => {
      const btn = e.target.closest(".learn-roadmap-btn");
      if (!btn) return;
      state.filterType = btn.dataset.filterType || "";
      state.filterSlug = btn.dataset.filterSlug || "";
      state.page = 1;
      renderRoadmap();
      syncListUrl();
      loadProblems();
    });

    $("#studySearchInput")?.addEventListener(
      "input",
      debounce((e) => {
        state.search = e.target.value.trim();
        state.page = 1;
        loadProblems();
      }, 350),
    );

    $("#studyPrevPage")?.addEventListener("click", () => {
      if (state.page > 1) {
        state.page -= 1;
        loadProblems();
      }
    });

    $("#studyNextPage")?.addEventListener("click", () => {
      if (state.page < state.pages) {
        state.page += 1;
        loadProblems();
      }
    });

    $("#studyDrawerToggle")?.addEventListener("click", () => {
      const sidebar = $("#studySidebar");
      const backdrop = $("#studyDrawerBackdrop");
      const open = !sidebar?.classList.contains("sidebar-open");
      sidebar?.classList.toggle("sidebar-open", open);
      if (backdrop) backdrop.hidden = !open;
    });

    $("#studyDrawerBackdrop")?.addEventListener("click", () => {
      $("#studySidebar")?.classList.remove("sidebar-open");
      const backdrop = $("#studyDrawerBackdrop");
      if (backdrop) backdrop.hidden = true;
    });

    window.addEventListener("popstate", () => {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("problem");
      if (slug) {
        state.articleSlug = slug;
        loadArticle(slug);
        return;
      }
      showList();
      applyListParamsFromUrl();
      renderRoadmap();
      loadProblems();
    });
  }

  function debounce(fn, ms) {
    let t;
    return (...args) => {
      clearTimeout(t);
      t = setTimeout(() => fn(...args), ms);
    };
  }

  async function init() {
    await Nav.init();
    bindEvents();

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("problem");

    try {
      await StudyGuides.load();
    } catch (err) {
      console.error(err);
    }

    if (slug) {
      state.articleSlug = slug;
      await loadArticle(slug);
      return;
    }

    showList();
    try {
      await Promise.all([loadCatalog(), DataStructures.load()]);
      applyListParamsFromUrl();
      await loadProgress();
      renderRoadmap();
      await loadProblems();
    } catch (err) {
      const container = $("#studyProblemsContainer");
      if (container) {
        container.innerHTML = `<div class="empty-state">Failed to load: ${escapeHtml(err.message)}</div>`;
      }
    }
  }

  return { init };
})();

StudyPage.init();
