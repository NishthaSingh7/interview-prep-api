const StudyArticle = (() => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function diffClass(d) {
    return (d || "").toLowerCase();
  }

  function renderBlock(block) {
    switch (block.type) {
      case "h3":
        return `<h3 class="study-block-h3">${escapeHtml(block.text)}</h3>`;
      case "p":
        return `<p>${escapeHtml(block.text)}</p>`;
      case "ul":
        return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
      case "ol":
        return `<ol>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ol>`;
      case "code":
        return `<pre class="study-code"><code>${escapeHtml(block.text)}</code></pre>`;
      case "callout":
        return `<aside class="study-callout"><p>${escapeHtml(block.text)}</p></aside>`;
      case "complexity":
        return `<div class="study-complexity">
          <p class="study-complexity-heading">Complexity analysis</p>
          <p><strong>Time complexity:</strong> ${escapeHtml(block.time)}</p>
          <p><strong>Space complexity:</strong> ${escapeHtml(block.space)}</p>
        </div>`;
      case "walkthrough":
        return `<div class="study-walkthrough">
          <ol class="study-walkthrough-steps">
            ${(block.steps || []).map((step) => `<li>${escapeHtml(step)}</li>`).join("")}
          </ol>
        </div>`;
      default:
        return "";
    }
  }

  function renderStatement(guide) {
    const st = guide.statement || {};
    let html = "";

    if (st.description) {
      html += `<p class="study-statement-lead">${escapeHtml(st.description)}</p>`;
    }

    if (st.examples?.length) {
      html += st.examples
        .map(
          (ex, i) => `
        <div class="study-example">
          <p class="study-example-label">Example ${i + 1}</p>
          ${ex.input ? `<p><strong>Input:</strong> <code>${escapeHtml(ex.input)}</code></p>` : ""}
          ${ex.output ? `<p><strong>Output:</strong> <code>${escapeHtml(ex.output)}</code></p>` : ""}
          ${ex.explanation ? `<p>${escapeHtml(ex.explanation)}</p>` : ""}
        </div>`,
        )
        .join("");
    }

    if (st.constraints?.length) {
      html += `<div class="study-constraints">
        <p class="study-example-label">Constraints</p>
        <ul>${st.constraints.map((c) => `<li>${escapeHtml(c)}</li>`).join("")}</ul>
      </div>`;
    }

    if (st.followUp) {
      html += `<p class="study-followup"><strong>Follow-up:</strong> ${escapeHtml(st.followUp)}</p>`;
    }

    return html;
  }

  function renderJump(sections) {
    const links = [
      `<a href="#study-problem" class="study-guide-jump-link">Problem</a>`,
      ...sections.map(
        (s) =>
          `<a href="#${escapeHtml(s.id)}" class="study-guide-jump-link">${escapeHtml(s.title)}</a>`,
      ),
    ].join("");

    return `<nav class="study-guide-jump" aria-label="Jump to section">${links}</nav>`;
  }

  function renderGuideBlock(id, title, bodyHtml) {
    return `
      <section class="study-guide-block" id="${escapeHtml(id)}">
        <h2 class="study-guide-block-title">${escapeHtml(title)}</h2>
        <div class="study-guide-block-body">${bodyHtml}</div>
      </section>`;
  }

  function renderSection(section) {
    const body = (section.blocks || []).map(renderBlock).join("");
    return renderGuideBlock(section.id, section.title, body);
  }

  function solveUrl(problem) {
    return `/?search=${encodeURIComponent(problem.title)}`;
  }

  function renderActions(problem) {
    const external = problem.leetcodeLink || problem.practiceLink;
    if (external) {
      return `<a href="${escapeHtml(external)}" class="btn btn-primary btn-sm" target="_blank" rel="noopener noreferrer">Practice on LeetCode →</a>`;
    }
    return `<a href="${escapeHtml(solveUrl(problem))}" class="btn btn-primary btn-sm">Solve on AfterHours →</a>`;
  }

  function render(problem, guide) {
    if (!guide) {
      return `
        <div class="study-article about-wrap">
          <a href="/study" class="study-back">← Back to course</a>
          <div class="empty-state">Study guide not found for this problem.</div>
        </div>`;
    }

    document.title = `${guide.title || problem.title} — Study — AfterHours`;

    const sections = guide.sections || [];
    const patternName = guide.patternName || problem.patternId?.name || "";

    return `
      <div class="study-article">
        <a href="/study" class="study-back">← Back to course</a>

        <article class="study-guide panel">
          <header class="study-guide-hero">
            <div class="study-guide-hero-copy">
              <h1 class="study-guide-title">${escapeHtml(guide.title || problem.title)}</h1>
              <div class="study-article-meta">
                <span class="study-diff study-diff-${diffClass(guide.difficulty || problem.difficulty)}">${escapeHtml(guide.difficulty || problem.difficulty)}</span>
                ${patternName ? `<span class="study-meta-sep">·</span><span>${escapeHtml(patternName)}</span>` : ""}
                <span class="study-meta-sep">·</span>
                <span>${guide.readMin || 5} min read</span>
                ${guide.updated ? `<span class="study-meta-sep">·</span><span>Updated ${escapeHtml(guide.updated)}</span>` : ""}
              </div>
            </div>
            <div class="study-guide-actions">
              ${renderActions(problem)}
            </div>
          </header>

          ${renderJump(sections)}

          <div class="study-guide-blocks">
            ${renderGuideBlock("study-problem", "Problem", renderStatement(guide))}
            ${sections.map((s) => renderSection(s)).join("")}
          </div>
        </article>
      </div>`;
  }

  function bind(root) {
    if (!root) return;

    root.querySelectorAll(".study-guide-jump-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#")) return;
        e.preventDefault();
        const target = root.querySelector(href);
        if (target) {
          target.scrollIntoView({ behavior: "smooth", block: "start" });
          if (history.replaceState) {
            history.replaceState(null, "", href);
          }
        }
      });
    });
  }

  return { render, bind };
})();
