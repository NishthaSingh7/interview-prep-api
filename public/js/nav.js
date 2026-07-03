const Nav = {
  updateAuthNav() {
    const loggedIn = Auth.isLoggedIn();
    const guestNav = document.getElementById("guestNav");
    const userNav = document.getElementById("userNav");
    const userNameEl = document.getElementById("userName");
    const userAvatarEl = document.getElementById("userAvatar");

    if (guestNav) {
      guestNav.hidden = loggedIn;
      guestNav.style.display = loggedIn ? "none" : "flex";
    }

    if (userNav) {
      userNav.hidden = !loggedIn;
      userNav.style.display = loggedIn ? "flex" : "none";
    }

    if (loggedIn) {
      const user = Auth.getUser();
      const name = user?.name || "Account";
      if (userNameEl) userNameEl.textContent = name;
      if (userAvatarEl) userAvatarEl.textContent = name.charAt(0).toUpperCase();
    } else {
      if (userNameEl) userNameEl.textContent = "";
      if (userAvatarEl) userAvatarEl.textContent = "";
    }
  },

  bindLogout(options = {}) {
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && !logoutBtn.dataset.bound) {
      logoutBtn.dataset.bound = "true";
      logoutBtn.addEventListener("click", () => {
        Auth.clearSession();
        if (options.onLogout) options.onLogout();
        window.location.href = "/";
      });
    }
  },

  ensureHeaderBadgeBar() {
    const header = document.querySelector(".site-header");
    if (!header) return;

    if (!header.parentElement?.classList.contains("site-header-sticky")) {
      const wrap = document.createElement("div");
      wrap.className = "site-header-sticky";
      header.parentNode.insertBefore(wrap, header);
      wrap.appendChild(header);
    }

    const actions = header.querySelector(".header-actions");
    if (!actions) return;

    document.getElementById("headerBadgeBar")?.remove();

    if (!document.getElementById("headerEarnedBadges")) {
      const badges = document.createElement("div");
      badges.id = "headerEarnedBadges";
      badges.className = "header-earned-badges";
      badges.setAttribute("aria-label", "Earned badges");
      badges.hidden = true;
      const themeToggle = actions.querySelector("[data-theme-toggle]");
      if (themeToggle) {
        actions.insertBefore(badges, themeToggle);
      } else {
        actions.prepend(badges);
      }
    }
  },

  async loadHeaderBadges() {
    if (typeof Milestones === "undefined") return;

    if (!Auth.isLoggedIn()) {
      Milestones.renderHeaderBadges(0);
      return;
    }

    try {
      const { data: stats } = await Auth.api("/api/v1/progress/stats");
      Milestones.renderHeaderBadges(stats.totalCompleted || 0);
    } catch {
      Milestones.renderHeaderBadges(0);
    }
  },

  async init(options = {}) {
    if (Auth.isLoggedIn()) {
      try {
        await Auth.api("/api/v1/auth/me");
      } catch {
        Auth.clearSession();
        if (options.onLogout) options.onLogout();
      }
    }

    this.ensureHeaderBadgeBar();
    this.updateAuthNav();
    this.bindLogout(options);

    await this.loadHeaderBadges();

    const page = document.body.dataset.page;
    if (typeof SiteNav !== "undefined") {
      SiteNav.setActive(page);
    } else if (page) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.dataset.nav === page);
      });
    }

    const progressLink = document.querySelector('[data-nav="progress"]');
    if (progressLink && !progressLink.dataset.authBound) {
      progressLink.dataset.authBound = "true";
      progressLink.addEventListener("click", (e) => {
        if (!Auth.isLoggedIn()) {
          e.preventDefault();
          window.location.href = "/login?next=progress";
        }
      });
    }
  },

  requireAuth(redirectTo = "/login") {
    if (!Auth.isLoggedIn()) {
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `${redirectTo}?next=${next}`;
      return false;
    }
    return true;
  },
};
