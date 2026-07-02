# AfterHours — Night Companion Plan

Product roadmap for replacing **Stories** with features that reinforce the core promise.  
**Last updated:** June 2026  
**Live:** [afterhours-interview-prep.netlify.app](https://afterhours-interview-prep.netlify.app)  
**Status:** Stories hidden from nav; code kept at `/stories` for reference only.

---

## The one question every page must answer

> 🌙 *"It's 10 PM. I'm tired after work. Give me one reason to open my laptop and solve one problem."*

AfterHours is not a place to read folk tales or pass time. It is a **nightly ritual** for developers with day jobs. Every surface should increase at least one of:

| Pillar | What it means |
|--------|----------------|
| 🔥 Motivation | Reason to open the laptop tonight |
| 📅 Consistency | Showing up again tomorrow |
| 🧠 Interview confidence | Belief that prep is working |
| 💪 Discipline | Acting when motivation is low |
| 🎯 Pattern intuition | Understanding *why*, not just solving |

**Avoid:** entertainment for its own sake, generic motivational fluff, AI-sounding copy, volume/grind framing.

---

## Why Stories is out

The Stories section (Birbal, Panchatantra, listen/TTS experiments) did not reinforce the product promise. Users do not come to AfterHours to relax with tales — they come to **complete one after-hours session** and feel proud closing the laptop.

| Stories did | AfterHours needs |
|-------------|------------------|
| Passive reading | Active reflection after solving |
| Disconnected from DSA | Tied to tonight's problem & streak |
| Entertainment | Emotional consistency & discipline |
| Optional browse | Natural end-of-session ritual |

**Decision:** Keep `/stories` code dormant. Do not re-enable nav until a replacement ships.

---

## Dream replacement: 🌙 Night Companion

One calm space that closes every study session — not a pile of separate utilities.

**Combines (over time):**

- 📓 Daily Journal — today's win in the user's words
- 💌 Founder Letters — short, personal, handwritten-feeling notes from Nishtha
- 🌱 Daily Reflection — one sentence before leaving
- 💭 One motivational thought — rotates nightly (not 365 cards on day one)
- 🎯 Tomorrow's commitment — "See you tomorrow 🌙"
- 📝 Link to today's problem notes (already exists on problem rows)

**Target flow:**

```
Solved today's problem
        ↓
   🎉 Celebration (existing)
        ↓
   Today's Win (auto + optional edit)
        ↓
   Write one sentence (reflection)
        ↓
   Read a short founder letter OR nightly thought
        ↓
   Click "See you tomorrow 🌙"
        ↓
   Close laptop
```

**Success metric:** Users think *"I completed my AfterHours session"* — not *"I checked a box on LeetCode."*

### Naming options (pick one for nav)

| Name | Vibe |
|------|------|
| **🌙 Night Companion** | Recommended — mentor studying with you |
| 🌃 Night Ritual | Habit-forward |
| ☕ AfterHours Corner | Cozy, on-brand |
| 📓 Reflection Room | Journal-first |
| 🌱 Second Wind | Matches milestone tier language |
| 💌 Midnight Notes | Founder-letter energy |
| ✨ Keep Showing Up | Discipline-forward |
| 📖 Progress Journal | Clear, functional |
| 🎯 Tomorrow Starts Tonight | Commitment-forward |

**Nav label recommendation:** **Night Companion** or **Journal** (short for mobile header).

---

## Idea backlog (ranked)

Ideas from product exploration, ordered **strongest → weakest** for AfterHours fit.

### Tier S — Build into Night Companion (core)

| # | Idea | Summary | Fit |
|---|------|---------|-----|
| 1 | **AfterHours Journal** | After each solve: today's win, difficulty (😊😐😵), energy (⚡🙂😴), optional note; timeline of last 30 entries | ⭐ Favorite — consistency is emotional; people love looking back |
| 7 | **Daily Reflection** | "What did you learn today?" — one line, stored forever | Natural close of session |
| 13 | **Tomorrow's Promise** | "Will you come back tomorrow? YES 🌙" → welcome back next day | Psychologically powerful; pairs with streak |
| 5 | **Tiny Wins** | Auto-surface after solve: pattern practiced, streak kept, O(n) learned | Dopamine without leaderboards |
| 14 | **Night Mode Companion** | Time-aware copy after 10:30 PM — "Still here? One question. Then sleep." | Unique to after-hours brand |

### Tier A — High value, ship soon after MVP

| # | Idea | Summary | Fit |
|---|------|---------|-----|
| 3 | **Founder Letters** | Handwritten-feeling letters from Nishtha — tired, manager bad day, one question tonight | Authenticity; users love real voice |
| 4 | **Interview Mindset** | 2-min reads: fearing Hard, consistency vs intelligence, recovering after 10 missed days | Aligns with prep; not folk tales |
| 8 | **Pattern Wisdom** | One quote per pattern: "The trick isn't finding the window — it's knowing when to shrink it." | Extends existing 20-pattern guides |
| 12 | **One Minute Learn** | 60–90 sec concepts: memoization, heap vs PQ, hash collisions | Bite-sized; interview confidence |
| 2 | **Night Notes** | Rotating nightly reminders — "You only need 20 focused minutes" | Easy content; low build cost |

### Tier B — Strong but more scope / moderation

| # | Idea | Summary | Fit |
|---|------|---------|-----|
| 6 | **Consistency Library** | Tiny lessons from Atomic Habits, Deep Work, etc. — not summaries, one idea each | Discipline pillar; watch copyright tone |
| 10 | **Discipline Vault** | Day 4 / Day 18 / Day 42 mentor reminders | Good content; overlaps Night Notes |
| 15 | **The Wall** | Each solve = one brick; visual metaphor, no % | Beautiful; needs design pass |
| 9 | **Interview Diaries** | Real experiences: Amazon question, mistake, lesson | Amazing if curated; moderation if UGC |

### Tier C — Defer or cut

| # | Idea | Summary | Why defer |
|---|------|---------|-----------|
| 11 | **Failure Wall** | Anonymous rejection → comeback stories | Moderation, abuse risk, scope |
| — | **Stories (folk tales)** | Birbal, Panchatantra | Already tried; wrong promise |

---

## Phased roadmap

### Phase 0 — Align & retire Stories ✅

- [x] Remove Stories from navigation (live)
- [x] Keep `public/stories.html` + `stories-page.js` in repo, unlinked
- [ ] Add redirect or 404 from `/stories` when replacement ships (optional)

### Phase 1 — Night Companion MVP (Journal + close ritual)

**Goal:** Replace Stories nav with a session-ending ritual tied to solving.

**User-facing:**

- New page: `/companion` (or `/journal`) — **Night Companion**
- Trigger after marking a problem **done** (extend celebration flow, don't replace milestone modal)
- **Today's Win** card (auto-filled: problem title, pattern, difficulty)
- Optional fields:
  - One sentence: "What clicked today?"
  - Difficulty felt: 😊 Easy / 😐 Medium / 😵 Hard
  - Energy: ⚡ Great / 🙂 Fine / 😴 Exhausted
- **Tomorrow's Promise** button: "See you tomorrow 🌙"
- **Timeline:** last 30 entries (date, problem, one-line preview, skipped days visible)

**Backend:**

- New model: `JournalEntry` (or extend `Progress` with journal fields — prefer separate collection for history)
  - `userId`, `date` (timezone day key), `problemId`, `problemTitle`, `patternSlug`
  - `winNote`, `difficultyFelt`, `energy`, `reflection`
  - `tomorrowPromise` (boolean + timestamp)
- `GET /api/v1/journal` — list entries (paginated, last 30)
- `POST /api/v1/journal` — upsert today's entry (one per calendar day per user)
- `GET /api/v1/journal/today` — today's entry if exists

**Frontend:**

- `public/companion.html` + `public/js/companion-page.js`
- Hook from `motivation.js` / `app.js` post-celebration → optional "Reflect" CTA
- Reuse timezone from user profile (`Asia/Kolkata` default)

**Copy tone:** Warm, short, Nishtha's voice — not corporate, not AI.

### Phase 2 — Founder Letters + Night Notes

- Curated static content (JSON or markdown in repo — no CMS needed initially)
- ~12 founder letters to start; add 1–2 per month
- Nightly thought rotates from pool of ~30–50 lines (expand toward 365 over time)
- Show **one** letter OR thought per session (not both — avoid overwhelm)
- Time-aware companion messages after 22:00 local (Phase 1.5 if trivial)

### Phase 3 — Pattern Wisdom + One Minute Learn

- `pattern-wisdom.json` keyed by pattern slug — one card per pattern (20 total)
- `one-minute-learn.json` — concept cards (memoization, two pointers intuition, etc.)
- Surface on Game Plan or Companion as "while you're here" — never blocking the ritual
- Links back to existing `pattern-guides.js` for depth

### Phase 4 — Interview Mindset library

- Replace generic reads with 8–12 mindset articles (2 min each)
- Topics: fearing Hard, consistency vs intelligence, missing 10 days, burnout vs discipline, why companies ask DSA
- Authored by Nishtha — personal, not wiki summaries

### Phase 5 — Visual consistency (The Wall) + welcome-back

- Next-day home greeting: "Welcome back. Yesterday you promised yourself. Thanks for showing up."
- Optional brick wall on Journey Map (each active day = brick; no % of 300)
- Share card variant: "I showed up X nights this month"

### Phase 6 — Interview Diaries (curated)

- Start with 5–10 **founder/curated** diaries only (no UGC)
- Format: company, question type, mistake, lesson
- Evaluate UGC + moderation only if traction proves demand

---

## Content principles

1. **Handwritten > generated** — Founder Letters and mindset pieces should sound like Nishtha, not ChatGPT.
2. **Short > long** — 2 minutes max for reads; journal fields optional but one sentence encouraged.
3. **Tied to action** — Content appears after solve or on Progress; not a separate entertainment tab.
4. **Consistency is emotional** — Journal timeline and welcome-back copy matter more than new badges.
5. **No new primary KPI** — Journal does not introduce XP, ranks, or % complete.
6. **India-friendly defaults** — Timezone-aware dates, relatable after-work tone.

---

## Integration with existing features

| Existing | How Night Companion connects |
|----------|------------------------------|
| Celebration modal (`motivation.js`) | Add "Reflect on tonight" → Companion |
| Milestones (`milestones.js`) | Keep separate; journal is daily, badges are lifetime |
| Per-problem notes (`app.js`) | Link "View problem notes" from journal entry |
| Tonight's problem (`focus.js`) | Pre-fill journal with tonight's pick if used |
| Streak / stats API | Journal `skipped` days shown in timeline; don't break streak logic |
| Progress page | Optional "Recent reflections" strip on Game Plan |
| Push reminders | "Your after-hours slot is open" → deep-link to tonight's problem |
| PWA | Companion works offline for read; sync journal on reconnect |

---

## Technical sketch

```
public/
  companion.html          # Night Companion page
  js/
    companion-page.js     # Journal UI + timeline
    companion-content.js  # Static letters, night notes, pattern wisdom
src/
  models/
    journal.model.js
  routes/
    journal.routes.js
  controllers/
    journal.controller.js
```

**Reuse:** `auth.middleware`, `timezone.js`, `consistency.js` day keys, existing modal/panel CSS patterns from `style.css`.

**Do not build yet:** Failure Wall UGC, forums, leaderboards, paid TTS, ElevenLabs.

---

## What we are not building

- Folk tales / Panchatantra / listen-to-story (tried, removed)
- Leaderboards, XP, streaks as competition
- % of 300 problems as hero metric
- AI-generated daily content at launch
- Another social network

---

## Success signals (3 months post-launch)

| Signal | Target |
|--------|--------|
| Journal entry rate | ≥ 30% of daily solves get at least one field filled |
| Tomorrow promise clicks | ≥ 40% of journal sessions |
| Return next day | +5% vs pre-Companion baseline (streak retention) |
| Qualitative | Users describe "AfterHours session" not "LeetCode problem" |

---

## Deploy checklist (when shipping Phase 1)

- [ ] API + model on Railway (`journal` routes)
- [ ] `companion.html` on Netlify
- [ ] Nav link replaces hidden Stories slot
- [ ] Post-solve CTA from celebration flow
- [ ] Smoke test: solve → reflect → tomorrow promise → see entry next day
- [ ] Mobile: journal form usable one-handed
- [ ] Hard refresh cache bust on JS/CSS

---

## Related docs

| Doc | Purpose |
|-----|---------|
| `docs/IMPROVEMENT-PLAN.md` | Completed consistency/streak/progress phases |
| `docs/plan.md` | This file — Night Companion replacement for Stories |
| `public/js/stories-page.js` | Deprecated reference implementation |

---

## Open decisions

| Question | Options | Recommendation |
|----------|---------|----------------|
| Nav name | Night Companion vs Journal | **Night Companion** (brand) / shorten to **Journal** on mobile |
| URL | `/companion` vs `/journal` | `/companion` (distinct from problem notes) |
| Required fields | All optional vs require one sentence | All optional; nudge with placeholder |
| Skip days in timeline | Show "Skipped" vs hide | **Show Skipped** — honesty builds trust |
| Founder letter frequency | Every session vs 1×/week | Every session for first 12 letters, then rotate |

---

*Living doc — Phase 1 is the minimum lovable replacement for Stories. Ship journal + tomorrow promise before adding libraries, diaries, or The Wall.*
