const Milestones = (() => {
  const THRESHOLDS = [
    {
      id: "spark",
      count: 10,
      label: "Night Shift",
      subtitle: "You actually opened the laptop after work",
      unlockHint: "10 solved unlocks Night Shift — proof you're not just bookmarking problems.",
      message: "Ten down. Most people never get past the tutorial phase — you're in it now.",
      icon: "◎",
      tierClass: "milestone-tier-spark",
      color: "#fbbf24",
    },
    {
      id: "quarter",
      count: 25,
      label: "Second Wind",
      subtitle: "The habit survived a busy week",
      unlockHint: "25 solved unlocks Second Wind — your prep survived real life.",
      message: "Twenty-five crushed. This isn't a phase anymore — it's a routine.",
      icon: "◉",
      tierClass: "milestone-tier-quarter",
      color: "#22d3ee",
    },
    {
      id: "stride",
      count: 45,
      label: "Flow State",
      subtitle: "Patterns start feeling familiar",
      unlockHint: "45 solved unlocks Flow State — you're connecting dots, not just counting reps.",
      message: "Forty-five logged. Hard problems aren't scary — they're next.",
      icon: "◈",
      tierClass: "milestone-tier-stride",
      color: "#fb923c",
    },
    {
      id: "overtime",
      count: 60,
      label: "Deep Dive",
      subtitle: "You're staying past the easy wins",
      unlockHint: "60 solved unlocks Deep Dive — past the point most people quit.",
      message: "Sixty in the books. You're not surface-level prepping anymore.",
      icon: "◇",
      tierClass: "milestone-tier-overtime",
      color: "#4ade80",
    },
    {
      id: "vanguard",
      count: 75,
      label: "Final Boss Energy",
      subtitle: "Ahead of most people interviewing",
      unlockHint: "75 solved unlocks Final Boss Energy — the grind most candidates talk about but never do.",
      message: "Seventy-five done. You're playing a different game than the average applicant.",
      icon: "◆",
      tierClass: "milestone-tier-vanguard",
      color: "#f472b6",
    },
    {
      id: "stretch",
      count: 90,
      label: "Home Stretch",
      subtitle: "Triple digits are in sight",
      unlockHint: "90 solved unlocks Home Stretch — the last push before Offer Season.",
      message: "Ninety crushed. Offer Season is one sprint away.",
      icon: "◐",
      tierClass: "milestone-tier-stretch",
      color: "#e879f9",
    },
    {
      id: "century",
      count: 100,
      label: "Offer Season",
      subtitle: "Triple digits. Serious prep territory.",
      unlockHint: "100 solved unlocks Offer Season — the tier where interviews get interesting.",
      message: "One hundred solved. You earned this — keep climbing.",
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

  function setHeaderBarVisible(visible) {
    const bar = document.getElementById("headerBadgeBar");
    if (!bar) return;
    bar.hidden = !visible;
    bar.classList.toggle("is-visible", visible);
  }

  function headerBadgeHtml(milestone) {
    return `<span class="header-badge header-badge-${milestone.id}" style="--badge-glow: ${milestone.color}" title="${milestone.subtitle}">
      <span class="header-badge-count" aria-label="${milestone.count} problems">${milestone.count}</span>
      <span class="header-badge-copy">
        <span class="header-badge-name">${milestone.label}</span>
      </span>
    </span>`;
  }

  function renderHeaderBadges(totalDone) {
    const el = document.getElementById("headerEarnedBadges");
    if (!el) return;

    if (!Auth.isLoggedIn()) {
      setHeaderBarVisible(false);
      el.innerHTML = "";
      return;
    }

    const earned = getEarned(totalDone);
    if (!earned.length) {
      setHeaderBarVisible(false);
      el.innerHTML = "";
      return;
    }

    el.innerHTML = earned.map(headerBadgeHtml).join("");
    setHeaderBarVisible(true);
  }

  function badgeHtml(milestone, earned) {
    const stateClass = earned ? "earned" : "locked";
    const style = earned ? ` style="--badge-glow: ${milestone.color}"` : "";
    const sub = earned ? milestone.subtitle : `Unlock at ${milestone.count} problems`;
    const thresholdClass = earned ? "milestone-badge-threshold milestone-badge-threshold--earned" : "milestone-badge-threshold";

    return `
      <div class="milestone-badge ${stateClass} milestone-badge-${milestone.id}"${style} title="${milestone.unlockHint}">
        <span class="${thresholdClass}" aria-label="${milestone.count} problems">${milestone.count}</span>
        <div class="milestone-badge-copy">
          <span class="milestone-badge-label">${milestone.label}</span>
          <span class="milestone-badge-sub">${sub}</span>
        </div>
      </div>`;
  }

  function nextTargetHtml(next, totalDone) {
    const remaining = next.count - totalDone;
    const progress = Math.round((totalDone / next.count) * 100);
    return `
      <div class="milestone-target">
        <div class="milestone-target-head">
          <span class="milestone-target-kicker">Next up</span>
          <span class="milestone-target-name">${next.label}</span>
        </div>
        <p class="milestone-target-desc">${next.unlockHint}</p>
        <div class="milestone-target-meta">
          <span class="milestone-target-left">${totalDone} / ${next.count} problems · ${remaining} left</span>
          <span class="milestone-target-pct">${progress}%</span>
        </div>
        <div class="milestone-target-track">
          <div class="milestone-target-fill" style="width: ${progress}%"></div>
        </div>
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
      tierLabel.textContent = highest ? highest.label : "Still warming up";
      tierLabel.className = `milestone-tier-label${highest ? ` tier-${highest.id}` : ""}`;
    }

    if (next) {
      nextEl.innerHTML = nextTargetHtml(next, totalDone);
      nextEl.hidden = false;
    } else {
      const last = THRESHOLDS[THRESHOLDS.length - 1];
      nextEl.innerHTML = `
        <div class="milestone-target milestone-target-complete">
          <span class="milestone-target-kicker">All badges earned</span>
          <span class="milestone-target-name">${last.label}</span>
          <p class="milestone-target-desc">${totalDone} problems solved. Every badge unlocked — keep climbing toward 300.</p>
        </div>`;
      nextEl.hidden = false;
    }
  }

  function applyTier(totalDone) {
    const dashboard = document.getElementById("progressOverview") || document.getElementById("progressDashboard");
    const hero =
      document.querySelector(".visual-board") ||
      document.querySelector(".grind-map-hero") ||
      document.querySelector(".night-sky-hero") ||
      document.querySelector(".map-hero") ||
      document.querySelector(".progress-hero");
    const targets = [dashboard, hero].filter(Boolean);
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
        <p class="motivation-footer milestone-modal-footer">Badge unlocked — check the bar below the navbar.</p>
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
    modal.querySelector("#milestoneModalBadge").textContent = milestone.label;
    modal.querySelector("#milestoneModalTagline").textContent = `${milestone.icon} ${milestone.subtitle}`;
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
    renderHeaderBadges(totalDone);
    renderPanel(totalDone);
    applyTier(totalDone);

    if (!Auth.isLoggedIn()) return;

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
    renderHeaderBadges,
    celebrate,
    hideCelebration,
  };
})();
