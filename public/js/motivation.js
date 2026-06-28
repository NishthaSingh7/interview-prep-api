const Motivation = (() => {
  const QUOTES = {
    done: {
    Easy: [
      {
        headline: "Warm-up complete.",
        message:
          "You didn't overthink it — you solved it. That's how strong engineers build rhythm before the hard stuff.",
        footer: "Stack one more easy win while your brain is in flow.",
      },
      {
        headline: "Green check energy.",
        message:
          "Every easy problem you finish is proof your fundamentals work. Confidence isn't luck — you're earning it.",
        footer: "The next problem is waiting. You already know you can do this.",
      },
      {
        headline: "Entry point cleared.",
        message:
          "Most people bookmark easy problems and never return. You actually closed the loop. That matters.",
        footer: "Keep the streak alive — one more before you call it a session.",
      },
      {
        headline: "Low friction, high payoff.",
        message:
          "Easy doesn't mean worthless. You just reinforced a pattern your future self will thank you for.",
        footer: "Ride this momentum — pick another and stay in the zone.",
      },
      {
        headline: "Shipped.",
        message:
          "One less problem on your mental backlog. Your interview prep just got measurably stronger.",
        footer: "Don't break the spell — open the next one while you're warmed up.",
      },
      {
        headline: "Baseline unlocked.",
        message:
          "You're building the habit of finishing, not just starting. That's the difference between prep and progress.",
        footer: "Two in a row hits different. Go for it.",
      },
      {
        headline: "Clean execution.",
        message:
          "You turned an unknown into a known. That mental folder is filed — permanently.",
        footer: "Your queue has more easy wins. Claim the next one.",
      },
      {
        headline: "Compounding starts here.",
        message:
          "Easy problems are the compound interest of DSA prep. Small today, massive when it counts.",
        footer: "Stay after hours a little longer — one more problem.",
      },
      {
        headline: "You showed up.",
        message:
          "After a long day, solving anything is a flex. You chose progress over procrastination.",
        footer: "The hardest part was starting. You're already past that — keep going.",
      },
      {
        headline: "Pattern recognized.",
        message:
          "Something clicked just now. That's your brain wiring the solution path for next time.",
        footer: "Strike while it's fresh — grab another easy problem.",
      },
      {
        headline: "Progress logged.",
        message:
          "Your future interview self won't remember this title — but they'll remember the reps you put in tonight.",
        footer: "One more checkmark tonight = one less panic later.",
      },
      {
        headline: "Door opened.",
        message:
          "Easy problems are the on-ramp to harder ones. You just merged onto the highway.",
        footer: "Don't exit yet — the next problem is right there.",
      },
    ],
    Medium: [
      {
        headline: "That's the grind.",
        message:
          "Medium problems separate tourists from practitioners. You stayed with it until it broke — respect.",
        footer: "You're warmed up for another. The bar is higher now and you're meeting it.",
      },
      {
        headline: "Edge case survivor.",
        message:
          "You didn't just pass happy path — you wrestled with the real problem. That's interview-ready thinking.",
        footer: "Your confidence earned another rep. Pick the next medium.",
      },
      {
        headline: "Depth over speed.",
        message:
          "Medium problems teach trade-offs, not tricks. You just leveled up how you reason under pressure.",
        footer: "The discomfort you felt? That's growth. Go again.",
      },
      {
        headline: "Middleweight champion.",
        message:
          "Most candidates freeze at medium. You pushed through. Remember this feeling next time you're stuck.",
        footer: "You're in the zone — don't waste it on scrolling.",
      },
      {
        headline: "Problem cracked.",
        message:
          "You sat with ambiguity and came out with structure. That's exactly what hiring loops test for.",
        footer: "One more medium tonight and you'll sleep knowing you earned it.",
      },
      {
        headline: "Real prep happened.",
        message:
          "Easy problems build habit. Medium problems build skill. You just banked skill.",
        footer: "Stack another while your problem-solving gears are turning.",
      },
      {
        headline: "You didn't quit.",
        message:
          "The bug, the wrong approach, the restart — you pushed through all of it. That's the job.",
        footer: "The next problem won't feel impossible. You've got receipts now.",
      },
      {
        headline: "Pattern level-up.",
        message:
          "Medium difficulty means multiple concepts colliding. You navigated that collision like a pro.",
        footer: "Stay in the chair. One more medium before you close the laptop.",
      },
      {
        headline: "After-hours win.",
        message:
          "While others clocked out, you solved something that actually matters for your career.",
        footer: "This is how offers get made — one medium at a time.",
      },
      {
        headline: "Friction = growth.",
        message:
          "If it felt hard, good. Your brain just formed connections that won't disappear tomorrow.",
        footer: "Channel that energy into the next problem on your list.",
      },
      {
        headline: "Interview ammo loaded.",
        message:
          "You can now walk through this problem out loud. That story is worth more than the solution alone.",
        footer: "Build your arsenal — tackle another medium tonight.",
      },
      {
        headline: "Resilience logged.",
        message:
          "Medium problems test patience as much as algorithms. You passed both tests.",
        footer: "You're not done for the night until you say so. Next one?",
      },
    ],
    Hard: [
      {
        headline: "Elite territory.",
        message:
          "Hard problems break people. You broke the problem instead. That's rare — own it.",
        footer: "Rest if you need to, but remember: you belong at this level.",
      },
      {
        headline: "Boss defeated.",
        message:
          "Companies dream of candidates who don't flinch at hard problems. You just proved you're that person.",
        footer: "The hardest ones on your list just got less scary. Keep pushing.",
      },
      {
        headline: "Legendary session.",
        message:
          "Most prep platforms collect dust on hard problems. You actually conquered one. Top 1% behavior.",
        footer: "You're operating at a different level tonight — ride that wave.",
      },
      {
        headline: "Fear deleted.",
        message:
          "That problem used to loom over you. Now it's a checkmark. That's the whole game.",
        footer: "Pick your next challenge — you've already proven you can handle hard.",
      },
      {
        headline: "Deep work delivered.",
        message:
          "Hard problems demand focus, persistence, and courage. You brought all three after hours.",
        footer: "Walk away knowing you did what most won't. Or go one more — your call.",
      },
      {
        headline: "Unlocked.",
        message:
          "You just solved something that filters out most candidates. Your confidence isn't arrogance — it's evidence.",
        footer: "The next hard problem is less intimidating now. Trust yourself.",
      },
      {
        headline: "Grind pays off.",
        message:
          "Hours of struggle compressed into one moment of clarity. That's the after-hours magic.",
        footer: "Save this energy — you're built for the tough ones.",
      },
      {
        headline: "Top shelf solved.",
        message:
          "When interview day comes, you'll remember nights like this — when you refused to give up on a hard problem.",
        footer: "You're in rare air. One more hard problem? You've got this.",
      },
      {
        headline: "Mountains moved.",
        message:
          "Hard problems aren't about being smart — they're about being stubborn in the right way. You were.",
        footer: "Don't let this win fade. Channel it into your next session.",
      },
      {
        headline: "Proof of work.",
        message:
          "Anyone can claim they're good at DSA. You just demonstrated it on a hard problem. Undeniable.",
        footer: "Your prep is real. Keep building the portfolio of wins.",
      },
      {
        headline: "Night owl victory.",
        message:
          "Solving hard problems after hours takes a different kind of drive. You have it.",
        footer: "Sleep well knowing you did something most people only talk about.",
      },
      {
        headline: "Final boss down.",
        message:
          "The problem that used to intimidate you is now part of your solved set. That's transformation.",
        footer: "Hard problems are your new normal. Pick the next one when you're ready.",
      },
    ],
    },
    redo: {
    Easy: [
      {
        headline: "Back for round two.",
        message:
          "You solved this once — now you're making sure it sticks. That's how real retention works, not one-and-done.",
        footer: "Open it fresh, solve it clean, then mark it done again.",
      },
      {
        headline: "Smart revisit.",
        message:
          "Spacing out practice is elite prep behavior. Unchecking means you're serious about owning this problem long-term.",
        footer: "Let's redo it — your future interview will thank you.",
      },
      {
        headline: "Refresh mode on.",
        message:
          "Memory fades. Deliberate redo doesn't. You're choosing to sharpen instead of assuming you still got it.",
        footer: "Hit practice, solve from scratch, earn that checkmark again.",
      },
      {
        headline: "No autopilot allowed.",
        message:
          "Easy problems can feel solved forever until they're not. You're doing the right thing by revisiting.",
        footer: "Go solve it again — prove it still lives in muscle memory.",
      },
      {
        headline: "Second pass incoming.",
        message:
          "The best engineers re-solve fundamentals regularly. You're not starting over — you're reinforcing.",
        footer: "When you're done, check it off again. Let's go.",
      },
      {
        headline: "Revisit unlocked.",
        message:
          "Maybe it's been a week or a month. Either way, you're back — and that's what separates prep from hope.",
        footer: "Open the problem and run it again from zero.",
      },
      {
        headline: "Trust, but verify.",
        message:
          "You marked it done before for a reason. Now you're verifying you can still ship it cold. Respect.",
        footer: "Redo it properly — then claim the win again.",
      },
      {
        headline: "Pattern refresh.",
        message:
          "Easy today, forgotten tomorrow — unless you loop back. You're looping back. That's the move.",
        footer: "Solve it once more, then lock it in again.",
      },
      {
        headline: "Active recall time.",
        message:
          "Unchecking isn't losing progress — it's scheduling a stronger version of the same win.",
        footer: "Let's go — tackle it like it's new, because that's the point.",
      },
      {
        headline: "Maintenance rep.",
        message:
          "Athletes drill basics forever. You're drilling an easy problem again because basics win interviews.",
        footer: "Fire up the editor and run it back.",
      },
      {
        headline: "Good call coming back.",
        message:
          "Most people never revisit solved problems. You're building durable skill, not a trophy case.",
        footer: "Redo it now — mark done when it feels effortless.",
      },
      {
        headline: "Round two starts now.",
        message:
          "You know the shape of this problem. Now make sure you can still execute without hints.",
        footer: "Open it, solve it, check it off again. You've got this.",
      },
    ],
    Medium: [
      {
        headline: "Worth another look.",
        message:
          "Medium problems have layers — one solve rarely captures all of them. You're going deeper this time.",
        footer: "Redo it from scratch and find what you missed the first pass.",
      },
      {
        headline: "Spaced repetition wins.",
        message:
          "Unchecking a medium problem is a power move. You're telling your brain this one needs to stay sharp.",
        footer: "Let's go — solve it again before the rust sets in.",
      },
      {
        headline: "Second crack scheduled.",
        message:
          "You conquered it once. Now prove it wasn't a one-time thing — that's interview confidence.",
        footer: "Open practice and run the full solve again.",
      },
      {
        headline: "Level up the redo.",
        message:
          "Try a different approach this time, or optimize your old one. Redo isn't repeat — it's refine.",
        footer: "When it clicks again, mark it done. Let's go.",
      },
      {
        headline: "Don't let it slip.",
        message:
          "Medium patterns fade faster than you think. You're revisiting at exactly the right time.",
        footer: "Solve it cold — no peeking at old notes until you're stuck.",
      },
      {
        headline: "Back in the arena.",
        message:
          "This problem challenged you before. Coming back means you're not afraid of the hard middle ground.",
        footer: "Redo it properly, then check it off with confidence.",
      },
      {
        headline: "Sharpen the edge.",
        message:
          "One solve gets you familiar. A second solve gets you fluent. You're chasing fluency.",
        footer: "Let's go — open it and work through it again.",
      },
      {
        headline: "Revisit with intent.",
        message:
          "Whether it's been days or months, unchecking means you're investing in real mastery.",
        footer: "Run it back — mark done when you can explain every line.",
      },
      {
        headline: "Strong engineers redo.",
        message:
          "The difference between knowing a problem and owning it is how many times you've solved it cold.",
        footer: "This redo counts. Go get it.",
      },
      {
        headline: "Pattern recall test.",
        message:
          "Can you still identify the approach without the title giving it away? Time to find out.",
        footer: "Solve it again — that's the whole point of unchecking.",
      },
      {
        headline: "Momentum through review.",
        message:
          "You're not moving backward — you're tightening a skill that already paid off once.",
        footer: "Open the problem and let's go again.",
      },
      {
        headline: "Earn it twice.",
        message:
          "Checking it done the first time mattered. Earning it again proves you're built for retention.",
        footer: "Redo now — recheck when it's solid.",
      },
    ],
    Hard: [
      {
        headline: "Brave enough to return.",
        message:
          "Hard problems are exactly what people avoid revisiting. You're not most people — you're coming back.",
        footer: "Open it, breathe, and let's go again from scratch.",
      },
      {
        headline: "Boss rush mode.",
        message:
          "You beat this once when it was scary. Doing it again is how you turn a fluke into a skill.",
        footer: "Redo it — mark done only when you truly own it.",
      },
      {
        headline: "Elite redo energy.",
        message:
          "Unchecking a hard problem is a statement: you're not collecting checkmarks, you're building capability.",
        footer: "Let's go — this second solve will feel different.",
      },
      {
        headline: "Forged twice.",
        message:
          "Hard problems solved once are impressive. Solved twice from memory are interview legends.",
        footer: "Run it back — you've done harder than this before.",
      },
      {
        headline: "No rust on you.",
        message:
          "Time passes. Confidence on hard problems shouldn't expire. You're refreshing the hardest kind of win.",
        footer: "Open practice and attack it like round one.",
      },
      {
        headline: "Second summit.",
        message:
          "The first climb proved it's possible. The second proves you're the kind of person who belongs there.",
        footer: "Let's go — solve it again, then lock it back in.",
      },
      {
        headline: "Hard redo, real growth.",
        message:
          "Most candidates never touch hard problems twice. You're building a depth chart most won't have.",
        footer: "When you finish, that checkmark means even more this time.",
      },
      {
        headline: "Return to the deep end.",
        message:
          "You unchecked because you want this problem in your bones — not just in your history.",
        footer: "Redo it cold. Let's go.",
      },
      {
        headline: "Proof over memory.",
        message:
          "Thinking you can still solve it isn't enough. You're about to prove it — that's top-tier prep.",
        footer: "Open the problem and run the full solve again.",
      },
      {
        headline: "Fearless revisit.",
        message:
          "Hard problems lose power every time you face them. This redo strips away whatever's left.",
        footer: "Let's go — you've beaten it before and you will again.",
      },
      {
        headline: "Maintenance on hard mode.",
        message:
          "Keeping hard problems sharp is rare air. You're maintaining skills that actually move the needle.",
        footer: "Solve it again — recheck when it's undeniable.",
      },
      {
        headline: "One more round.",
        message:
          "Whether it's been a month or a year, coming back to a hard problem is how offers stay realistic.",
        footer: "Open it up. Let's go.",
      },
    ],
    },
  };

  const CTA_LABELS = {
    done: "Keep grinding →",
    redo: "Let's go →",
  };

  let modalEl = null;

  function storageKey(difficulty, type) {
    const user = typeof Auth !== "undefined" ? Auth.getUser() : null;
    const userId = user?.email || "guest";
    return `afterhours-motivation-${type}-shown-${difficulty.toLowerCase()}-${userId}`;
  }

  function pickQuote(difficulty, type = "done") {
    const pools = QUOTES[type] || QUOTES.done;
    const pool = pools[difficulty] || pools.Easy;
    const key = storageKey(difficulty, type);
    let shown = [];

    try {
      shown = JSON.parse(localStorage.getItem(key) || "[]");
    } catch {
      shown = [];
    }

    let available = pool.map((_, i) => i).filter((i) => !shown.includes(i));

    if (available.length === 0) {
      shown = [];
      available = pool.map((_, i) => i);
    }

    const index = available[Math.floor(Math.random() * available.length)];
    shown.push(index);
    localStorage.setItem(key, JSON.stringify(shown));

    return pool[index];
  }

  function ensureModal() {
    if (modalEl) return modalEl;

    modalEl = document.createElement("div");
    modalEl.id = "motivationModal";
    modalEl.className = "motivation-modal";
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    modalEl.innerHTML = `
      <div class="motivation-backdrop" data-motivation-close></div>
      <div class="motivation-dialog" role="dialog" aria-modal="true" aria-labelledby="motivationHeadline">
        <button type="button" class="motivation-close" data-motivation-close aria-label="Close">&times;</button>
        <span class="motivation-badge" id="motivationBadge"></span>
        <p class="motivation-problem" id="motivationProblem"></p>
        <h3 class="motivation-headline" id="motivationHeadline"></h3>
        <p class="motivation-message" id="motivationMessage"></p>
        <p class="motivation-footer" id="motivationFooter"></p>
        <button type="button" class="btn btn-primary motivation-cta" id="motivationCta">Keep grinding →</button>
      </div>`;

    document.body.appendChild(modalEl);

    modalEl.querySelectorAll("[data-motivation-close]").forEach((el) => {
      el.addEventListener("click", hide);
    });

    modalEl.querySelector("#motivationCta").addEventListener("click", hide);

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !modalEl.hidden) hide();
    });

    return modalEl;
  }

  function show({ difficulty, problemTitle, type = "done" }) {
    const quote = pickQuote(difficulty, type);
    const modal = ensureModal();
    const diffClass = difficulty.toLowerCase();

    modal.className = `motivation-modal motivation-${diffClass} motivation-${type}`;
    modal.querySelector("#motivationBadge").textContent =
      type === "redo" ? `Redo · ${difficulty}` : difficulty;
    modal.querySelector("#motivationProblem").textContent = problemTitle
      ? type === "redo"
        ? `↻ ${problemTitle}`
        : `✓ ${problemTitle}`
      : "";
    modal.querySelector("#motivationHeadline").textContent = quote.headline;
    modal.querySelector("#motivationMessage").textContent = quote.message;
    modal.querySelector("#motivationFooter").textContent = quote.footer;
    modal.querySelector("#motivationCta").textContent = CTA_LABELS[type] || CTA_LABELS.done;

    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("motivation-open");

    if (type === "done" && typeof Confetti !== "undefined") {
      Confetti.burst({ container: modal });
    }

    modal.querySelector("#motivationCta").focus();
  }

  function hide() {
    if (!modalEl || modalEl.hidden) return;
    if (typeof Confetti !== "undefined") Confetti.stop();
    modalEl.hidden = true;
    modalEl.setAttribute("aria-hidden", "true");
    document.body.classList.remove("motivation-open");
  }

  return { show, hide, pickQuote };
})();
