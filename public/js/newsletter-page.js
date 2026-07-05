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

  function renderBodyBlock(block) {
    switch (block.type) {
      case "h2":
        return `<h2 class="newsletter-article-h2">${escapeHtml(block.text)}</h2>`;
      case "h3":
        return `<h3 class="newsletter-article-h3">${escapeHtml(block.text)}</h3>`;
      case "p":
        return `<p>${escapeHtml(block.text)}</p>`;
      case "ul":
        return `<ul>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ul>`;
      case "ol":
        return `<ol>${block.items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")}</ol>`;
      case "code":
        return `<pre class="newsletter-code"><code class="language-${escapeHtml(block.lang || "text")}">${escapeHtml(block.text)}</code></pre>`;
      case "callout":
        return `<aside class="newsletter-callout"><p>${escapeHtml(block.text)}</p></aside>`;
      default:
        return "";
    }
  }

  function tagPills(tags) {
    return tags
      .map((t) => `<span class="newsletter-tag">${escapeHtml(t)}</span>`)
      .join("");
  }

  function renderFeatured(post) {
    if (!post) return "";
    const href = `/newsletter?post=${encodeURIComponent(post.slug)}`;
    return `
      <article class="newsletter-featured panel">
        <div class="newsletter-featured-top">
          <span class="newsletter-featured-badge">Latest</span>
          <span class="newsletter-featured-meta">${formatDate(post.date)} · ${post.readMin} min read</span>
        </div>
        <h2 class="newsletter-featured-title">
          <a href="${href}" class="newsletter-card-link">${escapeHtml(post.title)}</a>
        </h2>
        <p class="newsletter-featured-excerpt">${escapeHtml(post.excerpt)}</p>
        <div class="newsletter-featured-foot">
          <span class="newsletter-featured-tags">${tagPills(post.tags.slice(0, 3))}</span>
          <a href="${href}" class="newsletter-read-link">Khulasa padho →</a>
        </div>
      </article>`;
  }

  function renderCard(post) {
    const href = `/newsletter?post=${encodeURIComponent(post.slug)}`;
    return `
      <article class="newsletter-card panel">
        <div class="newsletter-card-head">
          <span class="newsletter-card-date">${formatDate(post.date)}</span>
          <span class="newsletter-card-read">${post.readMin} min</span>
        </div>
        <h3 class="newsletter-card-title">
          <a href="${href}" class="newsletter-card-link">${escapeHtml(post.title)}</a>
        </h3>
        <p class="newsletter-card-excerpt">${escapeHtml(post.excerpt)}</p>
        <div class="newsletter-card-foot">
          <span class="newsletter-card-tags">${tagPills(post.tags)}</span>
          <a href="${href}" class="newsletter-read-link">Read →</a>
        </div>
      </article>`;
  }

  function renderList(activeTag = "") {
    const posts = NewsletterContent.getPosts();
    const featured = NewsletterContent.getFeatured();
    const filtered = activeTag ? posts.filter((p) => p.tags.includes(activeTag)) : posts;
    const gridPosts = filtered.filter((p) => p.slug !== featured?.slug || activeTag);

    const tags = NewsletterContent.ALL_TAGS;

    return `
      <header class="newsletter-hero panel">
        <p class="newsletter-kicker">Khulasa</p>
        <h1 class="newsletter-title">Raat ko solve kiya? Khulasa suno.</h1>
        <p class="newsletter-lead">Main reporter hoon, tum reader. Jab koi question finally click karta hai — analogy, trick, woh "arre haan!" moment — yahan report karti hoon. Tutorial nahi. Khulasa hai.</p>
      </header>

      ${activeTag ? "" : renderFeatured(featured)}

      <div class="newsletter-toolbar">
        <div class="newsletter-filters" role="tablist" aria-label="Filter by topic">
          <button type="button" class="newsletter-filter${activeTag ? "" : " active"}" data-tag="">All</button>
          ${tags.map((t) => `<button type="button" class="newsletter-filter${activeTag === t ? " active" : ""}" data-tag="${escapeHtml(t)}">${escapeHtml(t)}</button>`).join("")}
        </div>
      </div>

      <div class="newsletter-grid">
        ${gridPosts.length ? gridPosts.map(renderCard).join("") : '<p class="newsletter-empty">No posts in this topic yet — check back soon.</p>'}
      </div>`;
  }

  function renderArticle(post) {
    const body = (post.body || []).map(renderBodyBlock).join("");

    document.title = `${post.title} — AfterHours Khulasa`;

    return `
      <article class="newsletter-article">
        <a href="/newsletter" class="newsletter-back">← Saare khulase</a>
        <header class="newsletter-article-header panel">
          <p class="newsletter-kicker">Khulasa</p>
          <h1 class="newsletter-article-title">${escapeHtml(post.title)}</h1>
          <div class="newsletter-article-meta">
            <span>${formatDate(post.date)}</span>
            <span aria-hidden="true">·</span>
            <span>${post.readMin} min read</span>
            <span aria-hidden="true">·</span>
            <span>By Nishtha Singh</span>
          </div>
          <div class="newsletter-article-tags">${tagPills(post.tags)}</div>
        </header>
        <div class="newsletter-article-body panel">
          ${body}
        </div>
        <footer class="newsletter-article-footer panel">
          <p class="newsletter-article-cta">Ready to practice? <a href="/">Pick a problem on AfterHours →</a></p>
        </footer>
      </article>`;
  }

  function bindFilters(root) {
    root.querySelectorAll(".newsletter-filter").forEach((btn) => {
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
          <div class="newsletter-hero panel">
            <h1 class="newsletter-title">Post not found</h1>
            <p class="newsletter-lead"><a href="/newsletter">← Saare khulase</a></p>
          </div>`;
        return;
      }
      root.innerHTML = renderArticle(post);
    } else {
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
