const CompanionContent = (() => {
  const NIGHT_NOTES = [
    "You don't need motivation. You only need 20 focused minutes.",
    "The hardest interview is the one you never prepare for.",
    "One problem today is easier than ten problems on Sunday.",
    "Consistency is not about feeling ready. It's about showing up anyway.",
    "You're not behind. You're building a habit most people never start.",
    "Tired is normal after work. Studying tired still counts.",
    "Don't chase perfection tonight. Finish today's one problem.",
    "Small reps after work beat heroic weekends every time.",
    "Your future self won't remember how tired you were. They'll remember that you came back.",
    "One clear win tonight beats three vague hours on the weekend.",
    "The pattern you learn today shows up in an interview you can't see yet.",
    "Missing one day won't ruin you. Missing five might.",
    "You're not studying to impress anyone tonight. You're studying to become someone who keeps promises to themselves.",
    "Hard problems feel personal. They're usually just unfamiliar.",
    "If you only have 25 minutes, use 25 minutes. That's still AfterHours.",
    "Office was long. Your streak doesn't need a perfect day — just one honest session.",
    "Close the laptop knowing you did the one thing you planned.",
    "Discipline is choosing the laptop when the couch is louder.",
    "Interview prep is lonely. You're not the only one doing it after dinner.",
    "Tomorrow's confidence is often built in a quiet 10 PM session.",
    "You don't need to solve fast. You need to solve and understand.",
    "A bad day at work doesn't cancel a good night of prep.",
    "Still here after 10:30? One question. Then sleep. You've got this.",
    "The goal isn't to feel motivated. The goal is to log another active day.",
    "Every pattern you revisit is cheaper than relearning it in panic mode.",
    "One problem. One note. One reason to return tomorrow.",
    "You're becoming someone who studies after work. That identity matters.",
    "When in doubt, pick the problem you keep avoiding. That's usually the lesson.",
    "Progress isn't loud. It's another checkbox on another tired evening.",
    "See you tomorrow is a promise worth keeping.",
  ];

  const FOUNDER_LETTERS = [
    {
      id: "letter-01",
      number: 1,
      title: "The laptop after dinner",
      body: [
        "Dear developer,",
        "I know the couch is calling. I know Slack was annoying today. I know you already gave your best hours to someone else's roadmap.",
        "But if you solve just one question tonight — one — tomorrow you'll be slightly harder to shake in an interview.",
        "Not because you're grinding. Because you kept a promise to yourself.",
        "That's AfterHours.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-02",
      number: 2,
      title: "When the manager was terrible",
      body: [
        "Dear developer,",
        "Some days office wins nothing. Meetings multiply. Your PR gets nitpicked. You leave feeling small.",
        "Those are the nights it's tempting to skip prep entirely.",
        "I've been there. The counterintuitive move is still one problem — not to prove them wrong, but to remind yourself you're more than one bad day.",
        "Twenty minutes. Then close the lid.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-03",
      number: 3,
      title: "You don't need a perfect mood",
      body: [
        "Dear developer,",
        "Motivation is a visitor. It shows up sometimes, leaves without warning, and makes you feel guilty when it's gone.",
        "Discipline is the roommate who stays.",
        "Open the laptop tired. Solve one. Write one sentence about what clicked. That's enough for tonight.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-04",
      number: 4,
      title: "After a skipped week",
      body: [
        "Dear developer,",
        "If you disappeared for a few days, welcome back. No lecture. No shame spiral.",
        "Pick one Easy or Medium problem. Rebuild the rhythm before you rebuild the ambition.",
        "Consistency recovers faster when you stop treating a gap like a verdict.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-05",
      number: 5,
      title: "Hard problems are not a verdict",
      body: [
        "Dear developer,",
        "When a Hard problem ruins your mood, it can feel like the interview already said no.",
        "It didn't.",
        "Hard means unfamiliar, not incapable. Mark it, note what tricked you, come back later.",
        "That's how pattern intuition actually grows.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-06",
      number: 6,
      title: "Why I built this",
      body: [
        "Dear developer,",
        "I built AfterHours because I was tired of closing LeetCode with no memory of where I left off.",
        "I didn't need another 500-problem list. I needed one clear path and proof I kept showing up.",
        "If you're here tonight, you're already doing the hard part.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-07",
      number: 7,
      title: "One problem is not 'too little'",
      body: [
        "Dear developer,",
        "Your brain will lie and say one problem doesn't count.",
        "It counts.",
        "One problem on a Wednesday after work is how most real prep happens — not the fantasy 4-hour Sunday you keep postponing.",
        "— Nishtha",
      ],
    },
    {
      id: "letter-08",
      number: 8,
      title: "See you tomorrow",
      body: [
        "Dear developer,",
        "Before you shut the laptop, make the promise out loud if you can: I'll be back tomorrow.",
        "Not for a heroic sprint. For one more honest session.",
        "I'll be here too.",
        "— Nishtha",
      ],
    },
  ];

  const MINDSET_ARTICLES = [
    {
      id: "fear-hard",
      icon: "🧱",
      title: "How to stop fearing Hard problems",
      readMin: 2,
      teaser: "Hard usually means unfamiliar — not incapable.",
      body: [
        "Hard problems feel like a judgment on your intelligence. They're not. They're usually a pattern you haven't seen enough times while tired, after work, with no tutor nearby.",
        "The move isn't to avoid them forever. It's to attempt, fail cleanly, and capture one sentence: what disguised this problem? What pattern was hiding?",
        "After a few of those nights, Hard stops feeling like a verdict and starts feeling like homework.",
      ],
    },
    {
      id: "consistency-beats",
      icon: "📅",
      title: "Why consistency beats intelligence",
      readMin: 2,
      teaser: "Interviews reward people who kept showing up.",
      body: [
        "The smartest person in the room still loses if they prep in random bursts and forget patterns between interviews.",
        "Consistency compounds: streaks, pattern recognition, calm under time pressure. None of that comes from a single heroic weekend.",
        "One problem after work, most days, beats talent used occasionally.",
      ],
    },
    {
      id: "prep-fails",
      icon: "🔄",
      title: "Why interview prep fails",
      readMin: 2,
      teaser: "Volume without reflection is just motion.",
      body: [
        "Prep fails when it's only counting solves. No notes. No pattern labels. No return visits.",
        "It also fails when it's all-or-nothing: perfect week, then zero for ten days.",
        "AfterHours is built around the middle path: one quality rep, a small reflection, tomorrow again.",
      ],
    },
    {
      id: "myth-motivation",
      icon: "💭",
      title: "The myth of motivation",
      readMin: 2,
      teaser: "You won't feel ready most nights. Study anyway.",
      body: [
        "Waiting to feel motivated is how months disappear.",
        "Motivation follows action more often than the reverse. Open the problem. Read the first line. Let the session start small.",
        "You're allowed to study without enthusiasm. The streak doesn't require a speech.",
      ],
    },
    {
      id: "why-dsa",
      icon: "🏢",
      title: "Why companies ask DSA",
      readMin: 2,
      teaser: "It's not cruelty — it's a noisy signal.",
      body: [
        "Companies use DSA because it's a standardized way to see how you think under constraints — not because every job is LeetCode.",
        "Your goal isn't to love puzzles. It's to pass a filter so you can talk about the work you actually want to do.",
        "One problem tonight is one step through that filter.",
      ],
    },
    {
      id: "missed-ten",
      icon: "🌧️",
      title: "How to recover after missing 10 days",
      readMin: 2,
      teaser: "Restart small. Restart today.",
      body: [
        "Ten missed days feel like proof you failed. They're just ten days.",
        "Don't compensate with a brutal catch-up plan. Pick one Medium you know halfway. Solve it. Journal one line. Come back tomorrow.",
        "The streak restarts when you restart — not when you punish yourself.",
      ],
    },
    {
      id: "after-work",
      icon: "🌙",
      title: "How I study after work",
      readMin: 2,
      teaser: "Ritual beats willpower.",
      body: [
        "Same rough time. Same site. One problem chosen before I open social media.",
        "I solve, I note what tricked me, I close the laptop. No 'just one more' unless energy is genuinely there.",
        "AfterHours is that ritual in product form — so you don't have to reinvent it every night.",
      ],
    },
    {
      id: "burnout-discipline",
      icon: "⚖️",
      title: "Burnout vs discipline",
      readMin: 2,
      teaser: "Know the difference before you push.",
      body: [
        "Discipline is one problem when you're tired but intact.",
        "Burnout is solving to silence anxiety, hating every minute, and dreading tomorrow.",
        "If you're in the second camp, shrink the goal: read a pattern guide, redo an Easy, or rest one night without quitting the identity.",
      ],
    },
  ];

  function hashString(str) {
    let h = 2166136261;
    for (let i = 0; i < str.length; i++) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 16777619);
    }
    return h >>> 0;
  }

  function todayKey() {
    const d = new Date();
    return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
  }

  function nightNoteForToday() {
    const idx = hashString(todayKey()) % NIGHT_NOTES.length;
    return NIGHT_NOTES[idx];
  }

  function founderLetterForToday() {
    const idx = hashString(`letter-${todayKey()}`) % FOUNDER_LETTERS.length;
    return FOUNDER_LETTERS[idx];
  }

  return {
    NIGHT_NOTES,
    FOUNDER_LETTERS,
    MINDSET_ARTICLES,
    nightNoteForToday,
    founderLetterForToday,
  };
})();

if (typeof window !== "undefined") {
  window.CompanionContent = CompanionContent;
}
