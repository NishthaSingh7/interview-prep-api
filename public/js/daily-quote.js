const DailyQuote = (() => {
  const QUOTES = [
    {
      text: "Progress never clocks out — neither should your curiosity.",
      author: "AfterHours",
    },
    {
      text: "Every problem you finish tonight is one less surprise in the interview room.",
      author: "AfterHours",
    },
    {
      text: "You don't need a perfect day. You need a consistent after-hours habit.",
      author: "AfterHours",
    },
    {
      text: "Consistency after dark beats intensity that burns out by Friday.",
      author: "AfterHours",
    },
    {
      text: "Show up tired. Solve anyway. That's the whole game.",
      author: "AfterHours",
    },
    {
      text: "Patterns repeat. Interviews repeat. Your reps compound.",
      author: "AfterHours",
    },
    {
      text: "One checkmark tonight beats ten problems bookmarked forever.",
      author: "AfterHours",
    },
    {
      text: "You're not cramming — you're building reflexes.",
      author: "AfterHours",
    },
    {
      text: "Hard problems respect the people who keep coming back.",
      author: "AfterHours",
    },
    {
      text: "Your future self won't remember how tired you were — only that you showed up.",
      author: "AfterHours",
    },
    {
      text: "Consistency after dark beats intensity that burns out by Friday.",
      author: "AfterHours",
    },
    {
      text: "Every solved problem is proof you can sit with discomfort and win.",
      author: "AfterHours",
    },
    {
      text: "The offer season doesn't care about your excuses — only your reps.",
      author: "AfterHours",
    },
    {
      text: "Small wins stacked nightly become unshakeable confidence.",
      author: "AfterHours",
    },
    {
      text: "You're not behind. You're building — one session at a time.",
      author: "AfterHours",
    },
    {
      text: "Interview prep isn't a sprint. It's a late-night marathon you choose.",
      author: "AfterHours",
    },
    {
      text: "The best engineers show up when nobody's watching. You're one of them.",
      author: "AfterHours",
    },
    {
      text: "Stuck is temporary. Quitting makes it permanent.",
      author: "AfterHours",
    },
    {
      text: "Your streak isn't luck — it's decisions made after the workday ends.",
      author: "AfterHours",
    },
    {
      text: "Rest after tonight's win. Tomorrow's problem will be there.",
      author: "AfterHours",
    },
    {
      text: "Confidence in interviews comes from receipts — and you're collecting them.",
      author: "AfterHours",
    },
    {
      text: "The pattern you learn tonight might be the one they ask tomorrow.",
      author: "AfterHours",
    },
    {
      text: "Don't wait for motivation. Log the win and let momentum follow.",
      author: "AfterHours",
    },
    {
      text: "Every unchecked problem is a chance. Every checked one is progress.",
      author: "AfterHours",
    },
    {
      text: "After hours is when ordinary developers become interview-ready ones.",
      author: "AfterHours",
    },
    {
      text: "You can't control the timeline — only the next problem you finish.",
      author: "AfterHours",
    },
    {
      text: "Your journey map doesn't lie. Neither does your streak.",
      author: "AfterHours",
    },
    {
      text: "Sleep on a win tonight. Wake up knowing you earned it.",
      author: "AfterHours",
    },
    {
      text: "Discipline is choosing the problem list over the infinite scroll.",
      author: "AfterHours",
    },
    {
      text: "You're closer than yesterday. That's the only scoreboard that matters.",
      author: "AfterHours",
    },
    {
      text: "Late nights now, calm handshakes later.",
      author: "AfterHours",
    },
  ];

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

  function getQuoteForToday() {
    const idx = hashString(todayKey()) % QUOTES.length;
    return QUOTES[idx];
  }

  function escapeHtml(str) {
    const div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  function render(el = document.getElementById("dailyQuote")) {
    if (!el) return;

    const quote = getQuoteForToday();
    el.innerHTML = `
      <p class="daily-quote-kicker">Daily motivation</p>
      <blockquote class="daily-quote-text">"${escapeHtml(quote.text)}"</blockquote>
      <p class="daily-quote-author">— ${escapeHtml(quote.author)}</p>`;
    el.hidden = false;
  }

  return { render, getQuoteForToday };
})();
