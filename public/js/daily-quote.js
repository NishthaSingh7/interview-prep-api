const DailyQuote = (() => {
  const QUOTES = [
    { text: "Progress never clocks out — neither should your curiosity.", author: "AfterHours", tags: ["general"] },
    { text: "Every problem you finish tonight is one less surprise in the interview room.", author: "AfterHours", tags: ["general", "checkin"] },
    { text: "You don't need a perfect day. You need a consistent after-hours habit.", author: "AfterHours", tags: ["general"] },
    { text: "Consistency after dark beats intensity that burns out by Friday.", author: "AfterHours", tags: ["general", "streak"] },
    { text: "Show up tired. Solve anyway. That's the whole game.", author: "AfterHours", tags: ["general", "after-work"] },
    { text: "Patterns repeat. Interviews repeat. Your reps compound.", author: "AfterHours", tags: ["general", "pattern"] },
    { text: "One checkmark tonight beats ten problems bookmarked forever.", author: "AfterHours", tags: ["checkin", "done-tonight"] },
    { text: "You're not cramming — you're building reflexes.", author: "AfterHours", tags: ["general"] },
    { text: "Hard problems respect the people who keep coming back.", author: "AfterHours", tags: ["general", "streak"] },
    { text: "Your future self won't remember how tired you were — only that you showed up.", author: "AfterHours", tags: ["checkin", "after-work"] },
    { text: "Every solved problem is proof you can sit with discomfort and win.", author: "AfterHours", tags: ["checkin"] },
    { text: "Small wins stacked nightly become unshakeable confidence.", author: "AfterHours", tags: ["streak", "checkin"] },
    { text: "You're not behind. You're building — one session at a time.", author: "AfterHours", tags: ["comeback", "general"] },
    { text: "Interview prep isn't a sprint. It's a late-night marathon you choose.", author: "AfterHours", tags: ["general"] },
    { text: "The best engineers show up when nobody's watching. You're one of them.", author: "AfterHours", tags: ["streak"] },
    { text: "Stuck is temporary. Quitting makes it permanent.", author: "AfterHours", tags: ["comeback"] },
    { text: "Your streak isn't luck — it's decisions made after the workday ends.", author: "AfterHours", tags: ["streak"] },
    { text: "Rest after tonight's win. Tomorrow's problem will be there.", author: "AfterHours", tags: ["done-tonight", "checkin"] },
    { text: "Confidence in interviews comes from receipts — and you're collecting them.", author: "AfterHours", tags: ["checkin", "streak"] },
    { text: "The pattern you learn tonight might be the one they ask tomorrow.", author: "AfterHours", tags: ["pattern", "general"] },
    { text: "Don't wait for motivation. Log the win and let momentum follow.", author: "AfterHours", tags: ["general", "after-work"] },
    { text: "After hours is when ordinary developers become interview-ready ones.", author: "AfterHours", tags: ["after-work"] },
    { text: "You can't control the timeline — only the next problem you finish.", author: "AfterHours", tags: ["general"] },
    { text: "Your journey map doesn't lie. Neither does your streak.", author: "AfterHours", tags: ["streak"] },
    { text: "Sleep on a win tonight. Wake up knowing you earned it.", author: "AfterHours", tags: ["done-tonight", "checkin"] },
    { text: "Discipline is choosing the problem list over the infinite scroll.", author: "AfterHours", tags: ["after-work"] },
    { text: "You're closer than yesterday. That's the only scoreboard that matters.", author: "AfterHours", tags: ["streak", "general"] },
    { text: "Late nights now, calm handshakes later.", author: "AfterHours", tags: ["general"] },
    { text: "Welcome back. One problem tonight is enough to restart the rhythm.", author: "AfterHours", tags: ["comeback"] },
    { text: "Missed a night? It happens. Your best streak is still proof you can do this.", author: "AfterHours", tags: ["comeback", "streak"] },
    { text: "Done for tonight. Same time tomorrow.", author: "AfterHours", tags: ["done-tonight", "checkin"] },
    { text: "One quality rep after work beats a hollow race to three hundred.", author: "AfterHours", tags: ["general", "done-tonight"] },
  ];

  const AUTHORS = ["AfterHours", "AfterHours", "Nishtha", "AfterHours"];

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function pickAuthor(seed) {
    return AUTHORS[seed % AUTHORS.length];
  }

  function resolveTag(context = {}) {
    const idle = context.daysSinceLastActive ?? context.daysSinceActive;
    if (context.event === "checkin" || context.checkin) return "checkin";
    if (context.event === "done-tonight") return "done-tonight";
    if (idle != null && idle >= 2) return "comeback";
    if ((context.streak || 0) >= 7) return "streak";
    return "general";
  }

  function getQuoteForContext(context = {}) {
    const tag = resolveTag(context);
    const pool = QUOTES.filter((q) => q.tags.includes(tag));
    const list = pool.length ? pool : QUOTES;
    const seed = hashString(`${todayKey()}-${tag}-${context.streak || 0}`);
    const quote = list[seed % list.length];
    const author = quote.author === "AfterHours" ? pickAuthor(seed) : quote.author;
    return { text: quote.text, author, tag };
  }

  function getQuoteForToday() {
    return getQuoteForContext({});
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render(el = document.getElementById("dailyQuote"), context = {}) {
    if (!el) return;

    const quote = getQuoteForContext(context);
    const kicker =
      quote.tag === "comeback"
        ? "Welcome back"
        : quote.tag === "checkin"
          ? "Tonight's win"
          : quote.tag === "streak"
            ? "Streak fuel"
            : "Daily motivation";

    el.innerHTML = `
      <p class="daily-quote-kicker">${escapeHtml(kicker)}</p>
      <blockquote class="daily-quote-text">"${escapeHtml(quote.text)}"</blockquote>
      <p class="daily-quote-author">— ${escapeHtml(quote.author)}</p>`;
    el.hidden = false;
  }

  return { render, getQuoteForToday, getQuoteForContext };
})();
