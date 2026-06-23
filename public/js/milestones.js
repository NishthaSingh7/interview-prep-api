const Milestones = (() => {
  const THRESHOLDS = [
    {
      id: "spark",
      count: 10,
      label: "Spark",
      tagline: "First 10 down",
      message: "You crossed double digits. Most people never get here — you're building real momentum after hours.",
      icon: "◎",
      tierClass: "milestone-tier-spark",
      color: "#fbbf24",
    },
    {
      id: "quarter",
      count: 25,
      label: "Quarter",
      tagline: "25 problems crushed",
      message: "A quarter-century of solves. The habit is real — your prep is no longer theoretical.",
      icon: "◉",
      tierClass: "milestone-tier-quarter",
      color: "#22d3ee",
    },
    {
      id: "stride",
      count: 45,
      label: "Stride",
      tagline: "45 problems deep",
      message: "Forty-five solved. You're moving with purpose — hard problems are in reach now.",
      icon: "◈",
      tierClass: "milestone-tier-stride",
      color: "#fb923c",
    },
    {
      id: "vanguard",
      count: 75,
      label: "Vanguard",
      tagline: "75 problems logged",
      message: "Seventy-five down. You're ahead of most candidates — keep pressing while others coast.",
      icon: "◆",
      tierClass: "milestone-tier-vanguard",
      color: "#f472b6",
    },
    {
      id: "century",
      count: 100,
      label: "Century",
      tagline: "100 problems conquered",
      message: "One hundred solved. Elite territory — your main page just leveled up because you earned it.",
      icon: "✦",
      tierClass: "milestone-tier-century",
      color: "#a78bfa",
    },
  ];

  const TIER_CLASSES = THRESHOLDS.map((m) => m.tierClass);

  let modalEl = null;

  function storageKey() {
    const user = typeof Auth !== "undefined" ? Auth.getUser() : null;
    return `afterhours-milestones-celebrated-${user?.email || "guest"}`;
  }

  function getCelebrated() {
    try {
      return JSON.parse(localStorage.getItem(storageKey()) || "[]");
    } catch {
      return [];
    }
  }

  function markCelebrated(id) {
    const celebrated = getCelebrated();
    if (!celebrated.includes(id)) {
      celebrated.push(id);
      localStorage.setItem(storageKey(), JSON.stringify(celebrated));
    }
  }

  function getEarned(totalDone) {
    return THRESHOLDS.filter((m) => totalDone >= m.count);
  }

  function getHighest(totalDone) {
    const earned = getEarned(totalDone);
    return earned.length ? earned[earned.length - 1] : null;
  }

  function getNext(totalDone) {
    return THRESHOLDS.find((m) => totalDone < m.count) || null;
  }

  function getNewlyCrossed(prevCount, newCount) {
    return THRESHOLDS.find((m) => prevCount < m.count && newCount >= m.count) || null;
  }

  function badgeHtml(milestone, earned) {
    const stateClass = earned ? "earned" : "locked";
    const style = earned ? ` style="--badge-glow: ${milestone.color}"` : "";
    return `
      <div class="milestone-badge ${stateClass} milestone-badge-${milestone.id}"${style} title="${milestone.tagline}">
        <span class="milestone-badge-icon" aria-hidden="true">${milestone.icon}</span>
        <span class="milestone-badge-count">${milestone.count}</span>
        <span class="milestone-badge-label">${milestone.label}</span>
      </div>`;
  }

  function renderPanel(totalDone) {
    const panel = document.getElementById("milestonePanel");
    const badgesEl = document.getElementById("milestoneBadges");
    const nextEl = document.getElementById("milestoneNext");
    const tierLabel = document.getElementById("milestoneTierLabel");

    if (!panel || !badgesEl || !nextEl) return;

    if (!Auth.isLoggedIn()) {
      panel.hidden = true;
      return;
    }

    panel.hidden = false;
    const highest = getHighest(totalDone);
    const next = getNext(totalDone);

    badgesEl.innerHTML = THRESHOLDS.map((m) => badgeHtml(m, totalDone >= m.count)).join("");

    if (tierLabel) {
      tierLabel.textContent = highest ? `${highest.label} tier` : "Rookie tier";
      tierLabel.className = `milestone-tier-label${highest ? ` tier-${highest.id}` : ""}`;
    }

    if (next) {
      const remaining = next.count - totalDone;
      const progress = Math.round((totalDone / next.count) * 100);
      nextEl.innerHTML = `
        <div class="milestone-target">
          <div class="milestone-target-head">
            <span class="milestone-target-kicker">Next target</span>
            <span class="milestone-target-name">${next.label} · ${next.count} problems</span>
          </div>
          <div class="milestone-target-meta">
            <span class="milestone-target-left">${remaining} to go</span>
            <span class="milestone-target-pct">${progress}%</span>
          </div>
          <div class="milestone-target-track">
            <div class="milestone-target-fill" style="width: ${progress}%"></div>
          </div>
        </div>`;
      nextEl.hidden = false;
    } else {
      nextEl.innerHTML = `
        <div class="milestone-target milestone-target-complete">
          <span class="milestone-target-kicker">All targets cleared</span>
          <span class="milestone-target-name">Century club — keep climbing toward 300</span>
        </div>`;
      nextEl.hidden = false;
    }
  }

  function applyTier(totalDone) {
    const dashboard = document.getElementById("homeDashboard");
    const section = document.getElementById("progressSection");
    const targets = [dashboard, section].filter(Boolean);
    const highest = getHighest(totalDone);

    targets.forEach((el) => {
      el.classList.remove(...TIER_CLASSES);
      if (highest) el.classList.add(highest.tierClass);
    });
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "milestoneModal";
    modalEl.className = "motivation-modal milestone-modal";
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="motivation-backdrop" data-milestone-close></div>
      <div class="motivation-dialog milestone-dialog" role="dialog" aria-modal="true" aria-labelledby="milestoneHeadline">
        <button type="button" class="motivation-close" data-milestone-close aria-label="Close">&times;</button>
        <span class="motivation-badge milestone-modal-badge" id="milestoneModalBadge"></span>
        <p class="motivation-problem" id="milestoneModalTagline"></p>
        <h3 class="motivation-headline" id="milestoneHeadline"></h3>
        <p class="motivation-message" id="milestoneModalMessage"></p>
        <p class="motivation-footer milestone-modal-footer">Your main page just upgraded — badge unlocked.</p>
        <button type="button" class="btn btn-primary motivation-cta" id="milestoneModalCta">Let's go →</button>
      </div>`;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-milestone-close]").forEach((el) => {
      el.addEventListener("click", hideCelebration);
    });
    modalEl.querySelector("#milestoneModalCta").addEventListener("click", hideCelebration);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && modalEl && !modalEl.hidden) hideCelebration();
    });

    return modalEl;
  }

  function celebrate(milestone) {
    if (!milestone || getCelebrated().includes(milestone.id)) return;

    markCelebrated(milestone.id);
    const modal = ensureModal();
    modal.className = `motivation-modal milestone-modal milestone-celebrate-${milestone.id}`;
    modal.querySelector("#milestoneModalBadge").textContent = `Target · ${milestone.count}`;
    modal.querySelector("#milestoneModalTagline").textContent = `${milestone.icon} ${milestone.tagline}`;
    modal.querySelector("#milestoneHeadline").textContent = `${milestone.label} unlocked`;
    modal.querySelector("#milestoneModalMessage").textContent = milestone.message;
    modal.querySelector(".milestone-dialog").style.borderTopColor = milestone.color;
    modal.querySelector("#milestoneModalBadge").style.color = milestone.color;
    modal.querySelector("#milestoneModalBadge").style.borderColor = milestone.color;
    modal.querySelector("#milestoneModalBadge").style.background = `${milestone.color}22`;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("motivation-open");
    modal.querySelector("#milestoneModalCta").focus();
  }

  function hideCelebration() {
    if (!modalEl || modalEl.hidden) return;
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("motivation-open");
  }

  function update(totalDone, prevCount) {
    if (!Auth.isLoggedIn()) {
      const panel = document.getElementById("milestonePanel");
      if (panel) panel.hidden = true;
      return;
    }

    renderPanel(totalDone);
    applyTier(totalDone);

    if (typeof prevCount === "number" && prevCount < totalDone) {
      const crossed = getNewlyCrossed(prevCount, totalDone);
      if (crossed) {
        setTimeout(() => celebrate(crossed), 800);
      }
    }
  }

  return {
    THRESHOLDS,
    getEarned,
    getHighest,
    getNext,
    getNewlyCrossed,
    update,
    celebrate,
    hideCelebration,
  };
})();
