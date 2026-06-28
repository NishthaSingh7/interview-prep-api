# AfterHours — Improvement Plan

A phased roadmap for product, UX, and technical improvements.  
**Last updated:** June 2026  
**Live:** [afterhours-interview-prep.netlify.app](https://afterhours-interview-prep.netlify.app)

---

## Vision

AfterHours is for **9–6 workers** who open the laptop after dinner and do **one quality problem** — not a race through 300. Success = **showing up on schedule**, **building pattern intuition**, and **celebrating small wins** that compound.

**Core strengths to protect:**
- 20 patterns with guides (diagrams, clues, disguises, pseudocode)
- Daily habit loop: tonight's problem → check-in → celebration → streak
- Progress split: **Journey Map** (visual consistency) + **Game Plan** (action)
- Personal, friendly tone (About page, tagline)

**Avoid:** forums, leaderboards, % of 300 as primary KPI, "keep grinding" volume nudges.

---

## Metric hierarchy (what we show users)

| Priority | Metric | Where |
|----------|--------|-------|
| 1 | Today status (done / pending) | Home Today card, Game Plan |
| 2 | Streak (days) | Home snippet, Journey Map, Game Plan |
| 3 | Active days (week / month) | Game Plan, charts |
| 4 | Badge journey markers | Journey Map |
| 5 | Pattern breadth | Pattern heat grid |
| 6 | Lifetime solves | Secondary stat only |

---

## Phase 1 — Philosophy & copy reframe ✅

- Home snippet: streak + active days (not % of 300)
- Sidebar: per-pattern progress + "X solved" total
- Insights: streak-first messaging
- Motivation modals: "See you tomorrow" CTAs
- Meta / guest copy: one problem after work
- Journey Map tab label (was Grind Map)
- Reminder copy: "after-hours slot is open"

---

## Phase 2 — Daily habit loop ✅

- Today card on Home + Game Plan
- Tonight's problem on Game Plan
- Reminder deep-links via `afterhours_tonight_slug`
- Single celebration path (milestone OR motivation modal)
- Shuffle renamed "Different pick"

---

## Phase 3 — Progress page realignment ✅

- Binary consistency calendar
- Consistency + weekly active-days charts (replaced volume charts)
- Game Plan: streak, active days week/month, lifetime solves secondary
- Disguise hints on Game Plan

---

## Phase 4 — Backend consistency ✅

- `GET /api/v1/progress/stats` returns `streak`, `activeDaysThisWeek`, `activeDaysThisMonth`, `completedToday`, `totalProblems`
- Server streak uses user timezone (`src/utils/consistency.js`)
- Unlock re-check on `updateProgress`
- `reviewAt` on progress entries (7-day review queue)
- Dead `renderPanel` call removed from milestones

---

## Phase 5 — Mobile & navigation ✅ (partial)

- Mobile patterns drawer (`patternDrawerToggle` + slide-in sidebar)
- Pattern `(i)` from problem table
- `public/js/header.js` shared constants (full HTML partial deferred)

---

## Phase 6 — Quality over volume ✅

- Per-problem notes UI (📝 on done rows)
- Review queue on Game Plan (`reviewAt` backend)
- 3-step onboarding after signup (`/?onboarding=1`)

---

## Phase 7 — Growth without competition ✅

- Shareable milestone cards (Share win button)
- Weekly recap email (Sunday cron, opt-in via `reminderEnabled`)
- PWA install banner + `manifest.json`

---

## Deferred

| Idea | Reason |
|------|--------|
| Interview date → N problems/week | Conflicts with consistency motto; reframe as days-on-track if revisited |
| Leaderboards / XP | Out of scope |
| Expanding beyond 300 problems | Depth beats breadth |

---

## Deploy checklist (per release)

- [ ] Changes committed to `main`
- [ ] **Netlify** deploy (frontend in `public/`)
- [ ] **Railway** deploy if API / models changed
- [ ] Hard refresh + smoke test: login, mark problem, Journey Map, Game Plan
- [ ] Check mobile layout on one real phone

---

## Related docs

| Area | Location |
|------|----------|
| Pattern guides | `public/js/pattern-guides.js` |
| Home / problems | `public/js/app.js` |
| Progress | `public/js/progress-page.js` |
| Consistency stats API | `src/utils/consistency.js`, `src/controllers/progress.controller.js` |
| Reminders | `src/services/reminder.service.js`, `public/js/push.js` |

---

*Living doc — adjust phases based on user feedback.*
