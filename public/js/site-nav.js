const SiteNav = (() => {
  const CORE = [
    { href: "/study", label: "Study", page: "study" },
    { href: "/", label: "Solve", page: "solve" },
    { href: "/ide", label: "IDE", page: "ide" },
    { href: "/progress", label: "Progress", page: "progress" },
  ];

  const SECONDARY = [
    { href: "/companion", label: "Companion", page: "companion" },
    { href: "/newsletter", label: "Khulasa", page: "newsletter" },
    { href: "/about", label: "About", page: "about" },
  ];

  const secondaryPages = new Set(SECONDARY.map((item) => item.page));

  function link(item) {
    return `<a href="${item.href}" class="nav-link" data-nav="${item.page}">${item.label}</a>`;
  }

  function dropdownLink(item) {
    return `<a href="${item.href}" class="nav-dropdown-link" role="menuitem" data-nav="${item.page}">${item.label}</a>`;
  }

  function render() {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;

    nav.id = "siteNav";
    nav.innerHTML = `
      <div class="nav-group nav-group-core">
        ${CORE.map(link).join("")}
      </div>
      <div class="nav-more" data-nav-more>
        <button
          type="button"
          class="nav-link nav-more-trigger"
          aria-expanded="false"
          aria-haspopup="menu"
          aria-controls="navMoreMenu"
          id="navMoreTrigger"
        >
          More
          <svg class="nav-more-chevron" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <div class="nav-dropdown" id="navMoreMenu" role="menu" aria-labelledby="navMoreTrigger" hidden>
          ${SECONDARY.map(dropdownLink).join("")}
        </div>
      </div>
      <div class="nav-group nav-group-more-mobile" aria-label="More pages">
        <span class="nav-drawer-label">More</span>
        ${SECONDARY.map(link).join("")}
      </div>`;

    ensureToggle();
  }

  function ensureToggle() {
    const header = document.querySelector(".site-header");
    if (!header || document.getElementById("navDrawerToggle")) return;

    const btn = document.createElement("button");
    btn.type = "button";
    btn.id = "navDrawerToggle";
    btn.className = "nav-drawer-toggle";
    btn.setAttribute("aria-expanded", "false");
    btn.setAttribute("aria-controls", "siteNav");
    btn.setAttribute("aria-label", "Open menu");
    btn.innerHTML = `
      <svg class="nav-drawer-icon-open" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="4" y1="7" x2="20" y2="7"/><line x1="4" y1="12" x2="20" y2="12"/><line x1="4" y1="17" x2="20" y2="17"/>
      </svg>
      <svg class="nav-drawer-icon-close" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
        <line x1="6" y1="6" x2="18" y2="18"/><line x1="6" y1="18" x2="18" y2="6"/>
      </svg>`;

    const nav = document.querySelector(".site-nav");
    header.insertBefore(btn, nav);

    let backdrop = document.getElementById("navDrawerBackdrop");
    if (!backdrop) {
      backdrop = document.createElement("div");
      backdrop.id = "navDrawerBackdrop";
      backdrop.className = "nav-drawer-backdrop";
      backdrop.hidden = true;
      header.after(backdrop);
    }
  }

  function setDrawerOpen(open) {
    const nav = document.querySelector(".site-nav");
    const btn = document.getElementById("navDrawerToggle");
    const backdrop = document.getElementById("navDrawerBackdrop");
    if (!nav || !btn) return;

    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) backdrop.hidden = !open;
    document.body.classList.toggle("nav-drawer-open", open);

    if (!open) setDropdownOpen(false);
  }

  function setDropdownOpen(open) {
    const trigger = document.getElementById("navMoreTrigger");
    const menu = document.getElementById("navMoreMenu");
    if (!trigger || !menu) return;

    trigger.setAttribute("aria-expanded", String(open));
    menu.hidden = !open;
    trigger.closest(".nav-more")?.classList.toggle("is-open", open);
  }

  function bind() {
    const btn = document.getElementById("navDrawerToggle");
    const nav = document.querySelector(".site-nav");
    const backdrop = document.getElementById("navDrawerBackdrop");
    const moreTrigger = document.getElementById("navMoreTrigger");
    const moreMenu = document.getElementById("navMoreMenu");

    btn?.addEventListener("click", () => {
      setDrawerOpen(!nav?.classList.contains("is-open"));
    });

    backdrop?.addEventListener("click", () => setDrawerOpen(false));

    nav?.querySelectorAll(".nav-link[data-nav], .nav-dropdown-link").forEach((link) => {
      link.addEventListener("click", () => setDrawerOpen(false));
    });

    moreTrigger?.addEventListener("click", (event) => {
      event.stopPropagation();
      const open = moreTrigger.getAttribute("aria-expanded") === "true";
      setDropdownOpen(!open);
    });

    moreMenu?.addEventListener("click", () => setDropdownOpen(false));

    document.addEventListener("click", (event) => {
      if (!event.target.closest("[data-nav-more]")) {
        setDropdownOpen(false);
      }
    });

    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
        setDrawerOpen(false);
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) {
        setDrawerOpen(false);
      } else {
        setDropdownOpen(false);
      }
    });
  }

  function setActive(page) {
    if (!page) return;

    document.querySelectorAll(".nav-link[data-nav], .nav-dropdown-link[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === page);
    });

    const moreTrigger = document.getElementById("navMoreTrigger");
    if (moreTrigger) {
      moreTrigger.classList.toggle("active", secondaryPages.has(page));
    }
  }

  function init() {
    render();
    bind();
    setActive(document.body.dataset.page || "");
  }

  return { init, setActive };
})();

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => SiteNav.init());
} else {
  SiteNav.init();
}
