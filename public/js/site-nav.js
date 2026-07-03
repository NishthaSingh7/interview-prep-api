const SiteNav = (() => {
  const CORE = [
    { href: "/study", label: "Study", page: "study" },
    { href: "/", label: "Solve", page: "solve" },
    { href: "/progress", label: "Progress", page: "progress" },
  ];

  const SECONDARY = [
    { href: "/companion", label: "Companion", page: "companion" },
    { href: "/newsletter", label: "Newsletter", page: "newsletter" },
    { href: "/about", label: "About", page: "about" },
  ];

  function link(item) {
    return `<a href="${item.href}" class="nav-link" data-nav="${item.page}">${item.label}</a>`;
  }

  function render() {
    const nav = document.querySelector(".site-nav");
    if (!nav) return;

    nav.id = "siteNav";
    nav.innerHTML = `
      <div class="nav-group nav-group-core">
        ${CORE.map(link).join("")}
      </div>
      <span class="nav-divider" aria-hidden="true"></span>
      <div class="nav-group nav-group-secondary">
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

  function setOpen(open) {
    const nav = document.querySelector(".site-nav");
    const btn = document.getElementById("navDrawerToggle");
    const backdrop = document.getElementById("navDrawerBackdrop");
    if (!nav || !btn) return;

    nav.classList.toggle("is-open", open);
    btn.setAttribute("aria-expanded", String(open));
    btn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
    if (backdrop) backdrop.hidden = !open;
    document.body.classList.toggle("nav-drawer-open", open);
  }

  function bind() {
    const btn = document.getElementById("navDrawerToggle");
    const nav = document.querySelector(".site-nav");
    const backdrop = document.getElementById("navDrawerBackdrop");

    btn?.addEventListener("click", () => {
      setOpen(!nav?.classList.contains("is-open"));
    });

    backdrop?.addEventListener("click", () => setOpen(false));

    nav?.querySelectorAll(".nav-link").forEach((link) => {
      link.addEventListener("click", () => setOpen(false));
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 900) setOpen(false);
    });
  }

  function setActive(page) {
    if (!page) return;
    document.querySelectorAll(".nav-link[data-nav]").forEach((link) => {
      link.classList.toggle("active", link.dataset.nav === page);
    });
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
