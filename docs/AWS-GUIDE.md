# AWS Guide for AfterHours

A practical reference for deciding **why**, **where**, and **how** to use AWS with this project — before you create an account.

**Last updated:** July 2026  
**Live stack today:** Netlify (frontend) · Railway (API) · MongoDB Atlas (database) · Resend (email)

---

## Should You Use AWS Right Now?

- **Short answer:** Not required today. Your current stack is already doing the job well for a solo side project.
- **Railway + Netlify** are simpler to operate — deploy from git, no servers to patch, no VPCs or IAM policies to learn on day one.
- **AWS makes sense when** you want one cloud for everything, need finer cost control at scale, or are building features that map cleanly to AWS (heavy email, scheduled jobs, AI hints, file uploads).
- **Do not migrate just to “learn AWS.”** Create a free-tier sandbox account for learning; keep production on Railway/Netlify until you have a concrete reason to move.
- **AfterHours is small:** one Express API, static frontend, MongoDB, cron reminders, transactional email. You are not running video, large file storage, or high-traffic compute yet.

---

## Your Current Stack (What AWS Would Replace)

| What you have now | Role in AfterHours |
|-------------------|-------------------|
| **Netlify** | Serves `public/` (HTML, CSS, JS, study guides, PWA) |
| **Railway** | Runs Node/Express API + in-process `node-cron` reminders |
| **MongoDB Atlas** | Users, progress, streaks, journal entries, problems |
| **Resend** | Daily reminder + weekly recap emails |
| **Web Push (VAPID)** | Browser push notifications (runs in your API + service worker) |

---

## Why AWS? (General Benefits)

- **One vendor** — hosting, email, scheduling, secrets, CDN, and future AI in one billing account.
- **Fine-grained control** — pick exact instance size, region, scaling rules, and shutdown schedules.
- **Free tier** — 12 months of limited free usage on many services (EC2 t2/t3.micro, S3, Lambda, etc.).
- **Always Free** — some services stay free within limits forever (Lambda requests, DynamoDB on-demand tier, etc.).
- **Industry standard** — useful on a resume and transferable to jobs; most companies run on AWS or similar.
- **Room to grow** — when AfterHours adds uploads, AI hints, or mobile apps, AWS has ready-made pieces.

---

## AWS Services — What Each One Is For

### Compute (running your code)

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **EC2** | A virtual server (Linux/Windows) you SSH into and manage yourself | Possible but **heavy** — you install Node, PM2, patches, SSL. Best if you want full server control. |
| **App Runner** | Managed container service — push code/image, AWS runs it | **Best EC2 alternative** for your Express API. No SSH, auto HTTPS, simpler than raw EC2. |
| **Elastic Beanstalk** | PaaS — upload Node app, AWS handles infra | Similar to Railway; easy migration path from Express. |
| **Lambda** | Run a function on demand (no always-on server) | Good for **cron jobs** (reminders) or small API routes; less ideal as sole host for a long-running Express app unless refactored. |
| **ECS / Fargate** | Run Docker containers without managing servers | Overkill for now; useful if you containerize later. |
| **Lightsail** | Simplified VPS (fixed monthly price) | Easiest “small server” option — like DigitalOcean, not full AWS complexity. |

### Storage

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **S3** | Object storage (files, JSON, images, backups) | **Frontend hosting** (with CloudFront), future user uploads, backup exports. Not needed today — you have no file uploads. |
| **EBS** | Disk attached to EC2 | Only if you use EC2; stores the server’s filesystem. |
| **EFS** | Shared network filesystem | Not relevant for this project. |

### Database

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **DocumentDB** | AWS-managed MongoDB-compatible DB | Could replace Atlas if you want DB on AWS; migration effort + cost comparison needed. |
| **RDS** | Managed SQL (Postgres, MySQL) | Only if you **rewrite** from MongoDB to SQL — not recommended without a strong reason. |
| **DynamoDB** | Serverless key-value/document NoSQL | Would require schema/API changes; not a drop-in for Mongoose. |

### Networking & CDN

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **CloudFront** | CDN — caches static assets globally | Pairs with **S3** to replace Netlify for the frontend; faster loads worldwide. |
| **Route 53** | DNS (your domain → AWS resources) | When you use a custom domain on AWS. |
| **API Gateway** | Managed HTTP API in front of Lambda | If you split the API into Lambda functions. |
| **Load Balancer (ALB)** | Distributes traffic across servers | Only needed with multiple EC2 instances — not for a solo app today. |

### Email & Messaging

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **SES (Simple Email Service)** | Send transactional email | **Direct replacement for Resend** — daily reminders, weekly recaps. Very cheap at low volume. |
| **SNS** | Pub/sub notifications | Mobile push later; browser Web Push can stay as-is. |
| **SQS** | Message queue | Future: decouple reminder sending from the API if volume grows. |

### Scheduling & Automation

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **EventBridge** | Cron-style rules that trigger Lambda or other services | **Better than `node-cron` on one server** — runs even if your API is asleep. |
| **Systems Manager** | Run commands, patch EC2, automation | Used for EC2 start/stop schedules (see below). |

### Security & Config

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **IAM** | Users, roles, permissions | Required everywhere on AWS — controls who/what can access what. |
| **Secrets Manager** | Store `JWT_SECRET`, `MONGO_URI`, VAPID keys | Safer than plain env vars on EC2. |
| **Parameter Store (SSM)** | Cheaper secret/config storage | Same use case as Secrets Manager for non-rotating secrets. |
| **Cognito** | User sign-up/login (OAuth, MFA) | Could replace custom JWT auth later — big refactor, not urgent. |

### AI (future)

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **Bedrock** | Access to Claude, Llama, etc. via API | Future: AI hints, journal summaries, personalized study tips. **Not used in the app today.** |

### Billing & Monitoring

| Service | What it is | Good for AfterHours? |
|---------|------------|----------------------|
| **Budgets** | Set monthly spend limits + email alerts | **Use from day one** — see section below. |
| **Cost Explorer** | Charts of what you spent | Review weekly during learning phase. |
| **CloudWatch** | Logs, metrics, alarms | Monitor API errors, CPU, Lambda failures. |

---

## Where AWS Helps AfterHours Specifically

### 1. Frontend (today: Netlify)

- **Replace with:** S3 (store `public/` files) + CloudFront (CDN) + optional Route 53 (DNS).
- **Why:** Same static hosting as Netlify; you control caching and custom domain in AWS.
- **When:** If you consolidate billing or need AWS-only deployment pipelines.
- **Effort:** Medium — CI uploads to S3 on each deploy; configure CloudFront invalidation.

### 2. Backend API (today: Railway)

- **Replace with:** App Runner, Elastic Beanstalk, or EC2 running your Express app.
- **Why:** Host `/api/v1/*` (auth, patterns, problems, progress, journal, reminders).
- **When:** You outgrow Railway pricing or want scheduled shutdown to save money.
- **Effort:** Low (Beanstalk/App Runner) to High (raw EC2).
- **Note:** Reminder cron (`node-cron`) on a **stopped EC2 does not run** — move reminders to EventBridge + Lambda if you schedule shutdowns.

### 3. Database (today: MongoDB Atlas)

- **Replace with:** DocumentDB — or **keep Atlas** (very common; no need to move).
- **Why move:** Single AWS bill, VPC-private connection to API.
- **Why stay:** Atlas free tier is generous; less ops work.
- **Effort:** High — export/import, connection string changes, compatibility testing.

### 4. Email reminders (today: Resend)

- **Replace with:** Amazon SES.
- **Why:** Pennies per thousand emails; integrates with EventBridge-triggered Lambda.
- **When:** Resend free tier limits or you want all infra on AWS.
- **Effort:** Low — swap `email.service.js` to use AWS SDK; verify domain in SES.

### 5. Scheduled jobs (today: `node-cron` inside Railway)

- **Replace with:** EventBridge rule (e.g. every minute / Sunday 09:00 UTC) → Lambda.
- **Why:** Reliable even when API server is off; no duplicate cron if you scale to multiple instances.
- **Maps to:** Daily reminders + weekly recap in `reminder.service.js`.
- **Effort:** Medium — extract reminder logic into a Lambda handler.

### 6. Secrets (today: Railway env vars)

- **Replace with:** Secrets Manager or SSM Parameter Store.
- **Stores:** `JWT_SECRET`, `MONGO_URI`, `RESEND_API_KEY` / SES creds, VAPID keys.
- **Effort:** Low once compute is on AWS.

### 7. Future features (not built yet)

- **User-uploaded avatars or notes → S3**
- **AI-powered hints or journal reflection → Bedrock**
- **Mobile app push → SNS**
- **Analytics exports / backups → S3**

---

## What You Do NOT Need on AWS (Yet)

- **EC2 cluster / Auto Scaling** — traffic does not require multiple servers.
- **RDS** — app is built on MongoDB/Mongoose.
- **S3 for user files** — no upload feature exists.
- **Bedrock** — no AI in production.
- **EKS / Kubernetes** — far too complex for this project size.
- **VPN / VPC peering** — unless you move DB into a private VPC on AWS.

---

## Recommended Path (When You Are Ready)

### Phase 0 — Learn (no production migration)

- Create AWS account with **Budget alert at $5–10/month**.
- Play in **Free Tier** only: S3 static site lab, one Lambda, SES sandbox.
- Keep AfterHours live on Railway + Netlify.

### Phase 1 — Lowest-risk wins

- Add **SES** for email (or keep Resend).
- Move **reminders** to **EventBridge + Lambda** (API stays on Railway).

### Phase 2 — Consolidate hosting

- Frontend → **S3 + CloudFront**.
- API → **App Runner** or **Elastic Beanstalk** (prefer over raw EC2).

### Phase 3 — Optional

- DocumentDB or stay on Atlas.
- Bedrock for AI features when product needs them.

---

## Cost & Budget Management

### Before you spend anything

- **Enable AWS Budgets** (free) on day one of account creation.
- Set a **monthly cost budget** — e.g. **$10** for learning, **$20–30** if running a small API 24/7.
- Add **email alerts** at **50%, 80%, and 100%** of budget (and optionally **forecasted** overage).
- Turn on **billing alerts** in Billing Preferences (account-level email when charges exceed thresholds).

### How to create a budget alert (console)

1. AWS Console → **Billing and Cost Management** → **Budgets**.
2. **Create budget** → **Cost budget** → Monthly → amount (e.g. $10).
3. Configure **alert thresholds** (50%, 80%, 100%).
4. Add your email; confirm subscription from the AWS email.

### Rough monthly cost for AfterHours on AWS (estimate)

| Setup | Approx. cost |
|-------|----------------|
| S3 + CloudFront (static site, low traffic) | $1–3 |
| App Runner or t3.micro EC2 (API, 24/7) | $5–15 |
| Lambda + EventBridge (reminders only) | $0–1 (often free tier) |
| SES (hundreds of emails/month) | < $1 |
| DocumentDB (smallest instance) | $50+ — **why many keep Atlas free tier** |
| **Learning sandbox (turn off EC2 nightly)** | **$3–8** |

- **Free Tier:** New accounts get 12 months free on many services (750 hrs/month of t2/t3.micro EC2, 5 GB S3, 1M Lambda requests, etc.).
- **Always check Cost Explorer** after the first week; delete unused Elastic IPs, unattached EBS volumes, and old snapshots — common surprise charges.

### Payment tips

- Attach a **debit/credit card**; AWS bills monthly in arrears.
- Set **billing alarm** + **budget** — do both, not one.
- Use **tags** (e.g. `Project=AfterHours`) on resources so Cost Explorer shows what AfterHours costs vs. experiments.
- **No automatic “hard stop”** at budget limit — AWS alerts you but does not shut services off unless you automate that yourself.

---

## Turning EC2 Off at Night (Save Money)

> **Important for AfterHours:** If your API and `node-cron` run on the same EC2 box, **stopping the instance stops reminders too**. Use **EventBridge + Lambda** for reminders, or a separate always-on Lambda, before scheduling nightly shutdown.

### Option A — Instance Scheduler (AWS solution)

- Deploy the **Instance Scheduler on AWS** solution (CloudFormation template from AWS Solutions Library).
- Define **office hours** tags or schedules — e.g. run **08:00–23:00 IST**, stop overnight.
- Works across regions; good if you have multiple instances.

### Option B — EventBridge + Lambda (start/stop scripts)

- Create two EventBridge rules:
  - **Start:** e.g. cron `cron(30 2 * * ? *)` → 8:00 AM IST (adjust for UTC).
  - **Stop:** e.g. cron `cron(30 17 * * ? *)` → 11:00 PM IST.
- Lambda calls `ec2:StartInstances` / `ec2:StopInstances` on your instance ID.
- **Stopped instance:** no compute charge; you still pay for **EBS storage** (~$0.10/GB/month).

### Option C — AWS Systems Manager Maintenance Windows

- Less common for daily sleep/wake; better for patching. Prefer A or B for hourly schedules.

### Option D — Don’t use EC2 at all

- **App Runner** scales to zero in some configurations, or use **Lambda** for API routes — pay only when invoked.
- For a low-traffic API, this is often **cheaper and simpler** than scheduling EC2.

### What “stop” vs “terminate” means

- **Stop** — instance sleeps; data on disk kept; can start again. **Use this for nightly savings.**
- **Terminate** — instance deleted; disk gone unless snapshotted. **Do not use for daily shutdown.**

---

## Before Creating an AWS Account — Checklist

- [ ] Decide **learning only** vs. **production migration** — different paths.
- [ ] Pick a **root account email** you control long-term; enable **MFA** on root immediately.
- [ ] Create an **IAM admin user** for daily work; do not use root for CLI/console day-to-day.
- [ ] Set **Budget** ($5–10) + **billing alerts** before launching any resource.
- [ ] Choose **region** closest to users (e.g. `ap-south-1` Mumbai for India) — affects latency and some pricing.
- [ ] Read **Free Tier** limits so you know what expires after 12 months.
- [ ] Plan **reminder architecture** before stopping EC2 at night (EventBridge + Lambda).
- [ ] Keep **MongoDB Atlas** on free tier unless you have a clear reason to pay for DocumentDB.

---

## Quick Decision Guide

| Your goal | Recommendation |
|-----------|----------------|
| Learn AWS without touching production | Free-tier account + Budget alert; build a toy S3 site + Lambda |
| Reduce monthly cost of live app | Compare Railway/Netlify bill vs. App Runner + S3; optimize before migrating |
| Reliable nightly email reminders | EventBridge + Lambda + SES (whether API is on Railway or AWS) |
| Cheapest always-on API | Railway or Lightsail may beat EC2 after ops time is counted |
| Full control / resume project | EC2 or App Runner + S3/CloudFront |
| AI hints later | Bedrock when feature ships; not needed for account setup now |

---

## Summary

- **AWS is useful for AfterHours**, mainly for **hosting (S3/CloudFront, App Runner)**, **email (SES)**, **scheduled reminders (EventBridge + Lambda)**, and **future AI/storage** — not because the current stack is broken.
- **EC2 is one option**, not the default — App Runner, Beanstalk, or staying on Railway are simpler for a solo Express app.
- **Set budget alerts on day one**; use Cost Explorer weekly; tag resources `AfterHours`.
- **Schedule EC2 stop/start** with EventBridge + Lambda or Instance Scheduler — but **move cron jobs off the EC2 box first**.
- **Create the AWS account when you are ready to learn or migrate a specific piece** — not as a prerequisite to shipping features on Railway + Netlify.
