/**
 * DSA Newsletter posts — edit this file to publish new articles.
 *
 * Body blocks:
 *   { type: "p", text: "..." }
 *   { type: "h2", text: "..." }
 *   { type: "h3", text: "..." }
 *   { type: "ul", items: ["...", "..."] }
 *   { type: "ol", items: ["...", "..."] }
 *   { type: "code", lang: "javascript", text: "..." }
 *   { type: "callout", text: "..." }
 */
const NewsletterContent = (() => {
  const POSTS = [
    {
      slug: "stay-consistent-after-work",
      title: "How to Stay Consistent With DSA When You Have a Day Job",
      excerpt:
        "Motivation fades after standups and Slack. Consistency comes from systems — not guilt. Here's a practical playbook inspired by Atomic Habits, built for AfterHours.",
      date: "2026-07-03",
      readMin: 9,
      tags: ["Habits", "Consistency", "AfterHours"],
      featured: true,
      body: [
        {
          type: "p",
          text: "Most interview prep advice assumes you have empty evenings and infinite willpower. Real life looks different: meetings run long, you're drained by 8 PM, and LeetCode's infinite problem list makes you feel behind before you start.",
        },
        {
          type: "p",
          text: "Consistency isn't a personality trait. It's a system. James Clear's Atomic Habits puts it simply: you don't rise to the level of your goals — you fall to the level of your systems. This essay is how to build that system for DSA on AfterHours, one tired night at a time.",
        },
        {
          type: "h2",
          text: "1. Shrink the habit until it's embarrassing not to do it",
        },
        {
          type: "p",
          text: "Clear calls this the Two-Minute Rule: scale any habit down until it takes two minutes or less. For DSA, that doesn't mean \"only solve Easy problems forever.\" It means the nightly commitment is tiny: open AfterHours, pick one problem, read the brief, attempt it for 20 minutes. Marking done can come after — showing up is the habit.",
        },
        {
          type: "callout",
          text: "Bad goal: \"I'll grind 3 hours on weekends.\" Good system: \"I open AfterHours after dinner on weekdays — even if I only solve one Medium.\"",
        },
        {
          type: "h2",
          text: "2. Stack it onto something you already do",
        },
        {
          type: "p",
          text: "Habit stacking links a new behavior to an existing anchor. You don't need a new time slot — you need a trigger you already hit every day.",
        },
        {
          type: "ul",
          items: [
            "After I close my work laptop → I open AfterHours.",
            "After I finish dinner → I solve one problem before Netflix.",
            "After I mark a problem done → I write one sentence in notes (Companion tab later).",
          ],
        },
        {
          type: "p",
          text: "Write your stack on a sticky note. Vague plans (\"I'll study sometime tonight\") die. Anchored plans survive bad days.",
        },
        {
          type: "h2",
          text: "3. Design your environment for one click",
        },
        {
          type: "p",
          text: "Clear's third law: make it easy. Friction kills after-hours prep. Bookmark AfterHours. Pin the tab. Turn on a recurring calendar block labeled \"one problem\" — 25 minutes, not \"DSA.\" Remove the decision of where to start: use patterns on the sidebar, or sort by Easy if you're rebuilding momentum.",
        },
        {
          type: "p",
          text: "On AfterHours specifically: the brief popup exists so you don't burn energy parsing a problem on LeetCode at midnight. Read the brief → open practice link → solve. Fewer tabs, fewer excuses.",
        },
        {
          type: "h2",
          text: "4. Identity beats intensity",
        },
        {
          type: "p",
          text: "Don't say \"I need to pass interviews.\" Say \"I'm someone who studies after work.\" Identity-based habits survive when outcomes feel far away. Every checkbox on AfterHours is a vote for that identity — not proof you're smart, proof you showed up.",
        },
        {
          type: "ul",
          items: [
            "Missed yesterday? Clear's rule: never miss twice. One skip is life. Two in a row is a new habit.",
            "Solved something Easy? It still counts. Streaks measure presence, not ego.",
            "Hard problem stuck? Note what blocked you, star it, move on. Coming back is consistency too.",
          ],
        },
        {
          type: "h2",
          text: "5. Make progress visible (and satisfying)",
        },
        {
          type: "p",
          text: "The fourth law: make it satisfying. LeetCode gives you a green check. AfterHours adds pattern progress, streaks, and notes you'll actually read before a retry. That feedback loop matters — your brain needs to feel tonight wasn't wasted.",
        },
        {
          type: "p",
          text: "Use Progress to see difficulty breakdowns. Use Companion after a session to close the loop: one reflection sentence, then close the laptop. Ritual beats willpower.",
        },
        {
          type: "h2",
          text: "6. Patterns over random grinding",
        },
        {
          type: "p",
          text: "Consistency without direction is just busywork. Pick a pattern for the week — two pointers, sliding window, binary search — and stay in that lane until recognition feels automatic. Random Hard problems feel like punishment; patterned practice feels like skill-building.",
        },
        {
          type: "callout",
          text: "Future essays here will go deep on individual patterns — how they work, when to use them, how they compare. This one is the foundation: none of that matters if you don't show up four nights a week.",
        },
        {
          type: "h2",
          text: "A minimal weekly system",
        },
        {
          type: "ol",
          items: [
            "Mon–Thu: one problem per night (15–30 min). Same time if possible.",
            "Fri: optional — review notes or redo one starred problem.",
            "Weekend: off or one light session. Rest is part of the system.",
            "When motivation is zero: open the site, read one brief, attempt 10 minutes. Still a win.",
          ],
        },
        {
          type: "h2",
          text: "Start tonight",
        },
        {
          type: "p",
          text: "Don't redesign your entire life. Pick one anchor (\"after dinner\"), one problem, one note. That's the whole playbook. Everything else on AfterHours — patterns, briefs, progress — exists to make repeating that night easier.",
        },
      ],
    },
  ];

  const ALL_TAGS = [...new Set(POSTS.flatMap((p) => p.tags))].sort();

  function getPosts() {
    return [...POSTS].sort((a, b) => b.date.localeCompare(a.date));
  }

  function getPost(slug) {
    return POSTS.find((p) => p.slug === slug) || null;
  }

  function getFeatured() {
    return POSTS.find((p) => p.featured) || getPosts()[0] || null;
  }

  return { getPosts, getPost, getFeatured, ALL_TAGS };
})();
