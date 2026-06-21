const Nav = {
  init(options = {}) {
    const loggedIn = Auth.isLoggedIn();
    const guestNav = document.getElementById("guestNav");
    const userNav = document.getElementById("userNav");

    if (guestNav) guestNav.hidden = loggedIn;
    if (userNav) userNav.hidden = !loggedIn;

    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn && !logoutBtn.dataset.bound) {
      logoutBtn.dataset.bound = "true";
      logoutBtn.addEventListener("click", () => {
        Auth.clearSession();
        if (options.onLogout) options.onLogout();
        window.location.href = "/";
      });
    }

    const page = document.body.dataset.page;
    if (page) {
      document.querySelectorAll(".nav-link").forEach((link) => {
        link.classList.toggle("active", link.dataset.nav === page);
      });
    }

    const progressLink = document.querySelector('[data-nav="progress"]');
    if (progressLink && !loggedIn) {
      progressLink.addEventListener("click", (e) => {
        e.preventDefault();
        window.location.href = "/login.html?next=progress";
      });
    }
  },

  requireAuth(redirectTo = "/login.html") {
    if (!Auth.isLoggedIn()) {
      const next = encodeURIComponent(window.location.pathname);
      window.location.href = `${redirectTo}?next=${next}`;
      return false;
    }
    return true;
  },
};

document.addEventListener("DOMContentLoaded", () => Nav.init());
