const NewsletterPage = (() => {
  function escapeHtml(str) {
    return String(str)
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }

  function formatDate(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString(undefined, {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  function formatDateline(dateStr) {
    const [y, m, d] = dateStr.split("-").map(Number);
    const dt = new Date(y, m - 1, d);
    return dt
      .toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric", year: "numeric" })
      .toUpperCase();
  }

  function renderBodyBlock(block, { isLede = false } = {}) {
    switch (block.type) {
      case "h2":
        return `
          <div class="khulasa-read-section">
            <div class="khulasa-read-ornament" aria-hidden="true">✦</div>
            <h2 class="khulasa-read-h2">${escapeHtml(block.text)}</h2>
          </div>`;
      case "h3":
        return `<h3 class="khulasa-read-h3">${escapeHtml(block.text)}</h3>`;
      case "p":
        return `<p class="khulasa-read-p${isLede ? " khulasa-read-lede" : ""}">${escapeHtml(block.text)}</p>`;
      case "ul":
        return `<ul class="khulasa-read-list">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      case "ol":
        return `<ol class="khulasa-read-list khulasa-read-list-ol">${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
      case "code":
        return `<pre class="khulasa-read-code"><code class="language-${escapeHtml(block.lang || "text")}">${escapeHtml(block.text)}</code></pre>`;
      case "callout":
        return `
          <blockquote class="khulasa-read-pullquote">
            <span class="khulasa-read-pullquote-mark" aria-hidden="true">"</span>
            <p>${escapeHtml(block.text)}</p>
            <cite>Desk note · filed tonight</cite>
          </blockquote>`;
      case "diagram":
        return `
          <figure class="khulasa-diagram">
            ${block.html || ""}
            ${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ""}
          </figure>`;
      default:
        return "";
    }
  }

  function renderArticleBody(blocks) {
    let firstP = true;
    return blocks
      .map((block) => {
        const isLede = block.type === "p" && firstP;
        if (isLede) firstP = false;
        return renderBodyBlock(block, { isLede });
      })
      .join("");
  }

  function tagPills(tags) {
    return tags.map((t) => `<span class="khulasa-tag">${escapeHtml(t)}</span>`).join("");
  }

  function renderLeadStory(post) {
    if (!post) return "";
    const href = `/newsletter?post=${encodeURIComponent(post.slug)}`;
    return `
      <article class="khulasa-lead khulasa-paper-card">
        <div class="khulasa-lead-bar">
          <span class="khulasa-live-dot" aria-hidden="true"></span>
          <span class="khulasa-lead-label">Lead story</span>
          <span class="khulasa-lead-meta">${formatDateline(post.date)} · ${post.readMin} min read</span>
        </div>
        <h2 class="khulasa-lead-title">${escapeHtml(post.title)}</h2>
        <p class="khulasa-lead-deck">${escapeHtml(post.excerpt)}</p>
        <div class="khulasa-lead-foot">
          <span class="khulasa-lead-tags">${tagPills(post.tags.slice(0, 3))}</span>
          <a href="${href}" class="khulasa-read-cta">Khulasa padho →</a>
        </div>
      </article>`;
  }

  function renderWireCard(post, { isLead = false } = {}) {
    const href = `/newsletter?post=${encodeURIComponent(post.slug)}`;
    return `
      <article class="khulasa-wire khulasa-paper-card${isLead ? " khulasa-wire-lead" : ""}">
        ${isLead ? '<span class="khulasa-wire-badge">Lead filing</span>' : ""}
        <div class="khulasa-wire-head">
          <span class="khulasa-wire-date">${formatDateline(post.date)}</span>
          <span class="khulasa-wire-read">${post.readMin} min</span>
        </div>
        <h3 class="khulasa-wire-title">${escapeHtml(post.title)}</h3>
        <p class="khulasa-wire-excerpt">${escapeHtml(post.excerpt)}</p>
        <div class="khulasa-wire-foot">
          <span class="khulasa-wire-tags">${tagPills(post.tags)}</span>
          <a href="${href}" class="khulasa-read-cta khulasa-read-cta-sm">Khulasa padho →</a>
        </div>
      </article>`;
  }

  function renderList(activeTag = "") {
    const posts = NewsletterContent.getPosts();
    const featured = NewsletterContent.getFeatured();
    const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;
    const gridPosts = filtered;
    const tags = NewsletterContent.ALL_TAGS;
    const latestDate = posts[0] ? formatDateline(posts[0].date) : "";
    const totalRead = posts.reduce((n, p) => n + (p.readMin || 0), 0);

    return `
      <div class="khulasa-dispatch">
        <section class="khulasa-reveal-hero panel" aria-label="Khulasa reveal">
          <div class="khulasa-reveal-bg" aria-hidden="true"></div>
          <div class="khulasa-reveal-inner">
            <div class="khulasa-reveal-badge-row">
              <span class="khulasa-reveal-live"><span class="khulasa-live-dot" aria-hidden="true"></span> Live filing</span>
              <span class="khulasa-reveal-edition">AfterHours · Late desk</span>
            </div>
            <div class="khulasa-reveal-stamp-wrap">
              <span class="khulasa-reveal-stamp" aria-hidden="true">KHULASA</span>
              <h1 class="khulasa-reveal-title">Raat ko solve kiya?<br><em>Yahan khulasa filed hota hai.</em></h1>
            </div>
            <p class="khulasa-reveal-deck">Main reporter hoon, tum reader. Jab koi question finally click karta hai — analogy, trick, woh "arre haan!" moment — yahan report karti hoon. Tutorial nahi. Khulasa hai.</p>
            <div class="khulasa-reveal-stats">
              <span><strong>${posts.length}</strong> khulase filed</span>
              <span class="khulasa-reveal-stat-dot" aria-hidden="true">·</span>
              <span><strong>${totalRead}</strong> min total read</span>
              <span class="khulasa-reveal-stat-dot" aria-hidden="true">·</span>
              <span>Latest ${latestDate}</span>
            </div>
          </div>
          <div class="khulasa-reveal-ticker" aria-hidden="true">
            <div class="khulasa-reveal-ticker-track">
              <span>Breaking from tonight's desk</span>
              <span>Tricks that actually click</span>
              <span>No code dumps</span>
              <span>Reporter POV only</span>
              <span>Breaking from tonight's desk</span>
              <span>Tricks that actually click</span>
            </div>
          </div>
        </section>

        ${activeTag ? "" : `
          <div class="khulasa-section-head">
            <span class="khulasa-section-kicker">Lead filing</span>
            <h2 class="khulasa-section-title">Aaj ka main khulasa</h2>
          </div>
          ${renderLeadStory(featured)}
        `}

        <div class="khulasa-desk-toolbar">
          <div class="khulasa-section-head khulasa-section-head-inline">
            <span class="khulasa-section-kicker">Archive</span>
            <h2 class="khulasa-section-title">Saare khulase</h2>
          </div>
          <div class="khulasa-desk-filters" role="tablist" aria-label="Filter by topic">
            <button type="button" class="khulasa-desk-filter${activeTag ? "" : " active"}" data-tag="">All</button>
            ${tags.map((t) => `<button type="button" class="khulasa-desk-filter${activeTag === t ? " active" : ""}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join("")}
          </div>
        </div>

        <div class="khulasa-wire-grid">
          ${gridPosts.length ? gridPosts.map((p) => renderWireCard(p, { isLead: !activeTag && p.slug === featured?.slug })).join("") : '<p class="khulasa-empty">No posts in this topic yet — check back soon.</p>'}
        </div>
      </div>`;
  }

  function renderArticle(post) {
    const body = renderArticleBody(post.body || []);
    document.title = `${post.title} — AfterHours Khulasa`;

    return `
      <article class="khulasa-read">
        <nav class="khulasa-read-nav">
          <a href="/newsletter" class="khulasa-read-back">← Saare khulase</a>
        </nav>

        <div class="khulasa-folio">
          <div class="khulasa-parchment" role="document" aria-label="Khulasa story">
            <div class="khulasa-parchment-tear khulasa-parchment-tear-top" aria-hidden="true"></div>
            <div class="khulasa-parchment-tear khulasa-parchment-tear-bottom" aria-hidden="true"></div>
            <div class="khulasa-parchment-tear khulasa-parchment-tear-left" aria-hidden="true"></div>
            <div class="khulasa-parchment-tear khulasa-parchment-tear-right" aria-hidden="true"></div>

            <div class="khulasa-parchment-sheet">
              <span class="khulasa-parchment-stamp" aria-hidden="true">Khulasa</span>
              <span class="khulasa-parchment-stamp khulasa-parchment-stamp-ink" aria-hidden="true">Revealed</span>

              <header class="khulasa-read-hero">
                <div class="khulasa-read-meta">
                  <span class="khulasa-read-live">Field report</span>
                  <time class="khulasa-read-time" datetime="${escapeHtml(post.date)}">${formatDateline(post.date)}</time>
                  <span class="khulasa-read-duration">${post.readMin} min</span>
                </div>
                <h1 class="khulasa-read-headline">${escapeHtml(post.title)}</h1>
                <p class="khulasa-read-deck">${escapeHtml(post.excerpt)}</p>
                <div class="khulasa-read-byline">
                  <span class="khulasa-read-author">Nishtha Singh</span>
                  <span class="khulasa-read-role">AfterHours · late desk filing</span>
                </div>
                <div class="khulasa-read-tags">${tagPills(post.tags)}</div>
              </header>

              <div class="khulasa-read-rule" aria-hidden="true">
                <span class="khulasa-read-rule-line"></span>
                <span class="khulasa-read-rule-gem">◆</span>
                <span class="khulasa-read-rule-line"></span>
              </div>

              <div class="khulasa-read-prose">
                ${body}
              </div>

              <footer class="khulasa-read-end">
                <p class="khulasa-read-signoff">— Filed from the AfterHours desk. Same time tomorrow.</p>
                <a href="/" class="khulasa-read-cta">Pick a problem tonight →</a>
              </footer>
            </div>
          </div>
        </div>
      </article>`;
  }

  function bindFilters(root) {
    root.querySelectorAll(".khulasa-desk-filter").forEach((btn) => {
      btn.addEventListener("click", () => {
        const tag = btn.dataset.tag || "";
        const url = tag ? `/newsletter?tag=${encodeURIComponent(tag)}` : "/newsletter";
        window.history.pushState({}, "", url);
        render();
      });
    });
  }

  function render() {
    const root = document.getElementById("newsletterRoot");
    if (!root) return;

    const params = new URLSearchParams(window.location.search);
    const slug = params.get("post");
    const tag = params.get("tag") || "";

    if (slug) {
      const post = NewsletterContent.getPost(slug);
      if (!post) {
        root.innerHTML = `
          <div class="khulasa-masthead panel">
            <p class="khulasa-kicker">Khulasa</p>
            <h1 class="khulasa-masthead-title">Post not found</h1>
            <p class="khulasa-masthead-deck"><a href="/newsletter">← Saare khulase</a></p>
          </div>`;
        return;
      }
      root.innerHTML = renderArticle(post);
      document.body.classList.add("khulasa-reading");
    } else {
      document.body.classList.remove("khulasa-reading");
      root.innerHTML = renderList(tag);
      bindFilters(root);
    }
  }

  function init() {
    render();
    window.addEventListener("popstate", render);
  }

  return { init };
})();
