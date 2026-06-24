# AfterHours — Improvement Plan

A phased roadmap for product, UX, and technical improvements.  
**Last updated:** June 2026  
**Live:** [afterhours-interview-prep.netlify.app](https://afterhours-interview-prep.netlify.app)

---

## Vision

AfterHours should stay a **focused late-night interview prep tracker** — not a full learning platform. The goal is to help people with a day job open their laptop after dinner, know **what to solve**, **why that pattern matters**, and **feel progress** without spreadsheet homework.

**Core strengths to protect:**
- 300 problems across 20 patterns
- Pattern info guides (diagrams, clues, disguises, pseudocode)
- Progress, milestones, unlocks, reminders
- Personal, friendly tone (About page, tagline)

**Avoid for now:** forums, video courses, leaderboards, expanding beyond 300 problems.

---

## Phase 1 — Quick wins (1–2 weeks)

High impact, relatively small builds. Ship these first.

| # | Feature | What | Why | Main files / areas |
|---|---------|------|-----|-------------------|
| 1.1 | **Tonight's problem** | Home card: one suggested problem (weakest pattern, next unlocked, or random) with link to LeetCode | Removes “what do I solve tonight?” friction — matches brand | `app.js`, `insights.js`, `index.html`, `style.css` |
| 1.2 | **Continue where you left off** | Persist last pattern, difficulty filter, search in `localStorage`; restore on load | Feels continuous across sessions | `app.js` |
| 1.3 | **Guest home CTA** | Stronger copy for logged-out users: “300 problems · 20 patterns · free · syncs across devices” | Clearer signup motivation | `index.html`, `app.js`, `style.css` |
| 1.4 | **Fix weakest-pattern math** | Use `problemCount` from API instead of hardcoded `10` in insights | Accurate “weak pattern” suggestions | `insights.js`, `progress-page.js` |
| 1.5 | **SEO / social meta** | `description`, Open Graph, Twitter cards on home + about | Better link previews when shared | `index.html`, `about.html`, `progress.html` |

### Phase 1 — Acceptance criteria

- [x] Logged-in user sees a “Tonight” problem on home within 2s of load
- [x] Returning user lands on last-selected pattern (if still valid)
- [x] Guest sees clear value prop above problem table
- [x] Weakest pattern on Progress page matches real per-pattern totals
- [x] Shared link shows title, description, and favicon in Slack/iMessage/LinkedIn

---

## Phase 2 — Mobile & navigation (1–2 weeks)

| # | Feature | What | Why | Main files / areas |
|---|---------|------|-----|-------------------|
| 2.1 | **Mobile patterns drawer** | Collapsible sidebar / bottom sheet for pattern list on small screens | 20 patterns + info buttons are cramped on phone | `index.html`, `style.css`, `app.js` |
| 2.2 | **Pattern guide from problem table** | Small `(i)` on pattern column opens same `PatternInfo` modal | Guides where users actually work | `app.js`, `pattern-info.js` |
| 2.3 | **Shared header partial** | Single source for logo, nav, scripts (inject via JS or build step) | Stops 5 HTML files drifting apart | `public/js/header.js` or template, all `*.html` |

### Phase 2 — Acceptance criteria

- [ ] On viewport &lt; 768px, patterns are usable without endless scrolling
- [ ] Pattern info opens from sidebar and from problem row
- [ ] Logo/tagline change only requires editing one place

---

## Phase 3 — Learning & retention (2–4 weeks)

Differentiators that turn a checklist into a study system.

| # | Feature | What | Why | Main files / areas |
|---|---------|------|-----|-------------------|
| 3.1 | **Per-problem notes** | User notes on each problem: “stuck”, “redo”, free text | Revisit beats one-time checkbox | Backend: `progress` model, API; Frontend: modal or inline on row |
| 3.2 | **Review queue** | Done problems resurface after 7 / 14 days | Spaced repetition for interview prep | Backend: `reviewAt` on progress; Frontend: home card + filter |
| 3.3 | **Disguise hints on Progress** | “You’re weak on BFS — these questions are really BFS” + 1 example from guides | Connects guides to action | `progress-page.js`, `pattern-guides.js` |
| 3.4 | **Onboarding (3 steps)** | New signup: goal → reminder time → mark first problem | Faster time-to-value | `signup.html`, new `onboarding.js` |

### Phase 3 — Data model notes (notes + review)

```
Progress entry (extend existing):
  - notes: string (optional, max ~500 chars)
  - reviewAt: date (optional, set when marked done)
  - struggled: boolean (optional quick flag)
```

### Phase 3 — Acceptance criteria

- [ ] User can save a note and see it on next visit
- [ ] “Due for review” filter shows problems past `reviewAt`
- [ ] New user completes onboarding in under 60 seconds

---

## Phase 4 — Motivation & growth (2–3 weeks)

| # | Feature | What | Why | Main files / areas |
|---|---------|------|-----|-------------------|
| 4.1 | **Shareable milestone cards** | On milestone unlock: copy text or generate simple share image / OG | Social proof, organic growth | `milestones.js`, optional canvas or static template |
| 4.2 | **Interview date + pace** | Optional profile field: interview date → “~N problems/week needed” | Turns tracker into a plan | User model, `progress.html`, `insights.js` |
| 4.3 | **Weekly recap email** | Sunday email: done this week, streak, weakest pattern | Complements daily reminder | `email.service.js`, cron, user prefs |
| 4.4 | **PWA install prompt** | Subtle “Add to home screen” after engagement | Mobile after-hours use | `sw.js`, small banner component |

### Phase 4 — Acceptance criteria

- [ ] User can share milestone achievement in one click
- [ ] Pace widget shows realistic weekly target when interview date is set
- [ ] Weekly email is opt-in and respects reminder settings

---

## Phase 5 — Polish & scale (ongoing)

| # | Item | Notes |
|---|------|-------|
| 5.1 | **Performance** | Cache static assets in SW; lazy-load pattern guides if bundle grows |
| 5.2 | **Accessibility** | Audit modals, table on mobile, focus trap, contrast in light mode |
| 5.3 | **Analytics (privacy-light)** | Optional: page views, signup funnel, “tonight” click-through — no creepy tracking |
| 5.4 | **Error states** | API down banner, retry on progress save failure |
| 5.5 | **Tests** | API tests for progress/notes; smoke test for critical paths |

---

## Priority matrix

```
                    HIGH IMPACT
                        │
     Phase 1            │         Phase 3
  Tonight's problem      │    Notes + review queue
  Continue + guest CTA   │    Onboarding
  Weakest pattern fix    │
                        │
  LOW EFFORT ────────────┼──────────── HIGH EFFORT
                        │
     Phase 1.5          │         Phase 4
  SEO meta               │    Weekly email
                        │    Interview pace
     Phase 2             │    Share cards
  Mobile drawer          │
                        │
                    LOW IMPACT (defer)
```

---

## Recommended build order

If doing one thing at a time:

1. **Tonight's problem** (1.1)  
2. **Continue where you left off** (1.2)  
3. **Fix weakest-pattern math** (1.4)  
4. **Mobile patterns drawer** (2.1)  
5. **Per-problem notes** (3.1)  
6. **Review queue** (3.2)  
7. **Onboarding** (3.4)  
8. **Interview date + pace** (4.2)  
9. Everything else in phase order  

---

## Out of scope (for now)

| Idea | Reason to defer |
|------|-----------------|
| More than 300 problems | Curriculum is complete; depth beats breadth |
| Discussion / comments | Support burden; not core to solo grind |
| Video lessons | Huge scope; pattern guides cover “what/why” |
| Leaderboards / XP | Can distract from real interview prep |
| Native mobile app | PWA + responsive web is enough for v1 |

---

## Deploy checklist (per release)

- [ ] Changes committed to `main`
- [ ] **Netlify** deploy (frontend in `public/`)
- [ ] **Railway** deploy if API / models changed
- [ ] Hard refresh + smoke test: login, mark problem, pattern `(i)` modal, progress page
- [ ] Check mobile layout on one real phone

---

## Related docs

| Area | Location |
|------|----------|
| Pattern guides content | `public/js/pattern-guides.js` |
| Pattern diagrams | `public/js/pattern-diagrams.js` |
| Pattern modal UI | `public/js/pattern-info.js` |
| Home / problems | `public/js/app.js` |
| Progress charts | `public/js/progress-page.js` |
| Milestones | `public/js/milestones.js` |
| Unlocks | `public/js/unlocks.js` + `src/utils/unlocks.js` |
| Reminders | `public/js/push.js`, `src/services/email.service.js` |

---

*This plan is a living doc — tick acceptance criteria as features ship and adjust phases based on user feedback.*
