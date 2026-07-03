const StudyStructure = (() => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function renderBlock(block) {
    switch (block.type) {
      case "p":
        return `<p>${escapeHtml(block.text)}</p>`;
      case "ul":
        return `<ul>${block.items.map((i) => `<li>${escapeHtml(i)}</li>`).join("")}</ul>`;
      case "callout":
        return `<aside class="study-callout"><p>${escapeHtml(block.text)}</p></aside>`;
      default:
        return "";
    }
  }

  function render(structure, problemCount) {
    if (!structure) return "";

    const jumpLinks = (structure.sections || [])
      .map(
        (s) =>
          `<a href="#${escapeHtml(s.id)}" class="study-ds-jump-link">${escapeHtml(s.title)}</a>`,
      )
      .join("");

    const sections = (structure.sections || [])
      .map(
        (section) => `
        <section class="study-ds-block" id="${escapeHtml(section.id)}">
          <h2 class="study-ds-block-title">${escapeHtml(section.title)}</h2>
          <div class="study-ds-block-body">
            ${(section.blocks || []).map(renderBlock).join("")}
          </div>
        </section>`,
      )
      .join("");

    return `
      <article class="study-ds-article panel">
        <div class="study-ds-hero">
          <div class="study-ds-hero-copy">
            <p class="study-ds-kicker">Data structure</p>
            <h1 class="study-ds-title">${escapeHtml(structure.name)}</h1>
            <p class="study-ds-tagline">${escapeHtml(structure.tagline)}</p>
            <p class="study-ds-meta">${structure.readMin || 4} min read · ${problemCount} practice problems</p>
          </div>
          ${
            structure.image
              ? `<figure class="study-ds-figure">
              <img src="${escapeHtml(structure.image)}" alt="" class="study-ds-figure-img" loading="eager" />
            </figure>`
              : ""
          }
        </div>

        <nav class="study-ds-jump" aria-label="Jump to section">
          ${jumpLinks}
          <a href="#study-ds-problems" class="study-ds-jump-link">Practice problems</a>
        </nav>

        <div class="study-ds-blocks">
          ${sections}
        </div>
      </article>`;
  }

  function bind(root) {
    if (!root) return;
    root.querySelectorAll(".study-ds-jump-link").forEach((link) => {
      link.addEventListener("click", (e) => {
        const href = link.getAttribute("href");
        if (!href?.startsWith("#")) return;
        const target = root.querySelector(href) || document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        target.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    });
  }

  return { render, bind };
})();
