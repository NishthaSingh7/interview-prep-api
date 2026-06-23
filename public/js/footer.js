const FooterSocial = {
  // Update these when you're ready — email uses mailto:, others use full URLs
  links: {
    email: "mailto:riyanishtha@gmail.com",
    linkedin: "https://www.linkedin.com/in/nishtha-singh-37a901233/",
    instagram: "https://www.instagram.com/nishthasingh7/",
  },

  icons: {
    email: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>`,
    linkedin: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>`,
    instagram: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>`,
  },

  labels: {
    email: "Email Nishtha Singh",
    linkedin: "LinkedIn",
    instagram: "Instagram",
  },

  normalizeHref(key, href) {
    if (!href) return "";
    if (key === "email" && !href.startsWith("mailto:")) {
      return `mailto:${href.replace(/^mailto:/, "")}`;
    }
    return href;
  },

  init() {
    const nav = document.querySelector(".footer-social");
    if (!nav) return;

    const items = [
      { key: "email", external: false },
      { key: "linkedin", external: true },
      { key: "instagram", external: true },
    ];

    nav.innerHTML = items
      .map(({ key, external }) => {
        const href = this.normalizeHref(key, this.links[key]);
        if (!href) return "";

        const externalAttrs = external ? ' target="_blank" rel="noopener noreferrer"' : "";

        return `
          <a
            href="${href}"
            class="footer-social-link"
            aria-label="${this.labels[key]}"
            ${externalAttrs}
          >${this.icons[key]}</a>`;
      })
      .join("");
  },
};

document.addEventListener("DOMContentLoaded", () => FooterSocial.init());
