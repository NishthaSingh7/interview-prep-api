/**
 * Pattern info modal — opened from sidebar (i) buttons.
 */
const PatternInfo = (() => {
  let modalEl = null;

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "patternInfoModal";
    modalEl.className = "motivation-modal pattern-info-modal";
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="motivation-backdrop" data-pattern-info-close tabindex="-1" aria-hidden="true"></div>
      <div class="motivation-dialog pattern-info-dialog" role="dialog" aria-modal="true" aria-labelledby="patternInfoTitle">
        <button type="button" class="pattern-info-close" data-pattern-info-close aria-label="Close">&times;</button>
        <p class="pattern-info-kicker">Pattern guide</p>
        <h2 class="pattern-info-title" id="patternInfoTitle"></h2>
        <p class="pattern-info-summary" id="patternInfoSummary"></p>
        <div class="pattern-info-diagram" id="patternInfoDiagram" hidden></div>
        <div class="pattern-info-section" data-section="clues">
          <h3>When to use — clues</h3>
          <ul id="patternInfoClues" class="pattern-info-list"></ul>
        </div>
        <div class="pattern-info-section" data-section="types">
          <h3>Types</h3>
          <ul id="patternInfoTypes" class="pattern-info-list"></ul>
        </div>
        <div class="pattern-info-section" data-section="disguises">
          <h3>What it asks → What it maps to</h3>
          <ul id="patternInfoDisguises" class="pattern-info-list pattern-info-disguises"></ul>
        </div>
        <div class="pattern-info-section" data-section="pseudocode">
          <h3>How to use — pseudocode</h3>
          <pre class="pattern-pseudocode"><code id="patternInfoPseudocode"></code></pre>
        </div>
        <div class="pattern-info-section" data-section="tips">
          <h3>Tips</h3>
          <ul id="patternInfoTips" class="pattern-info-list pattern-info-tips"></ul>
        </div>
        <p class="pattern-info-complexity" id="patternInfoComplexity"></p>
        <button type="button" class="btn btn-primary btn-full" data-pattern-info-close>Got it</button>
      </div>
    `;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-pattern-info-close]").forEach((el) => {
      el.addEventListener("click", close);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) close();
    });

    return modalEl;
  }

  function renderDisguises(el, items) {
    const section = el.closest(".pattern-info-section");
    el.innerHTML = "";
    if (!items?.length) {
      section?.setAttribute("hidden", "");
      return;
    }
    section?.removeAttribute("hidden");

    items.forEach((item) => {
      const li = document.createElement("li");
      li.className = "pattern-disguise-item";

      if (typeof item === "string") {
        li.textContent = item;
        el.appendChild(li);
        return;
      }

      const asks = document.createElement("p");
      asks.className = "pattern-disguise-asks";
      const asksLabel = document.createElement("span");
      asksLabel.className = "pattern-disguise-label";
      asksLabel.textContent = "Asks: ";
      asks.appendChild(asksLabel);
      asks.appendChild(document.createTextNode(item.question));

      const maps = document.createElement("p");
      maps.className = "pattern-disguise-maps";
      const mapsLabel = document.createElement("span");
      mapsLabel.className = "pattern-disguise-label";
      mapsLabel.textContent = "Maps to: ";
      maps.appendChild(mapsLabel);
      maps.appendChild(document.createTextNode(item.mapsTo));

      li.appendChild(asks);
      li.appendChild(maps);
      el.appendChild(li);
    });
  }

  function renderList(el, items) {
    const section = el.closest(".pattern-info-section");
    el.innerHTML = "";
    if (!items?.length) {
      section?.setAttribute("hidden", "");
      return;
    }
    section?.removeAttribute("hidden");
    items.forEach((text) => {
      const li = document.createElement("li");
      li.textContent = text;
      el.appendChild(li);
    });
  }

  function renderPseudocode(el, code) {
    const section = el.closest(".pattern-info-section");
    if (!code?.trim()) {
      el.textContent = "";
      section?.setAttribute("hidden", "");
      return;
    }
    section?.removeAttribute("hidden");
    el.textContent = code.trim();
  }

  function open(pattern) {
    if (!pattern) return;

    const guide = typeof PatternGuides !== "undefined" ? PatternGuides.get(pattern.slug) : null;
    const modal = ensureModal();

    modal.querySelector("#patternInfoTitle").textContent = pattern.name;
    modal.querySelector("#patternInfoSummary").textContent =
      guide?.description ||
      pattern.description ||
      "No description available for this pattern yet.";

    const diagramEl = modal.querySelector("#patternInfoDiagram");
    const diagram =
      (typeof PatternDiagrams !== "undefined" && PatternDiagrams.get(pattern.slug)) || guide?.diagram || "";
    if (diagram) {
      diagramEl.innerHTML = diagram;
      diagramEl.hidden = false;
    } else {
      diagramEl.innerHTML = "";
      diagramEl.hidden = true;
    }

    renderList(modal.querySelector("#patternInfoClues"), guide?.clues || []);
    renderList(modal.querySelector("#patternInfoTypes"), guide?.types || []);
    renderDisguises(modal.querySelector("#patternInfoDisguises"), guide?.disguises || []);
    renderPseudocode(modal.querySelector("#patternInfoPseudocode"), guide?.pseudocode || "");
    renderList(modal.querySelector("#patternInfoTips"), guide?.tips || []);

    const complexityEl = modal.querySelector("#patternInfoComplexity");
    if (guide?.complexity) {
      complexityEl.textContent = `Typical complexity: ${guide.complexity}`;
      complexityEl.hidden = false;
    } else {
      complexityEl.hidden = true;
    }

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("motivation-open");
    modal.querySelector(".pattern-info-close").focus();
  }

  function close() {
    if (!modalEl || modalEl.hidden) return;
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("motivation-open");
  }

  return { open, close };
})();

if (typeof window !== "undefined") {
  window.PatternInfo = PatternInfo;
}
