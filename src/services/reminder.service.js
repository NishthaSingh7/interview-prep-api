const cron = require("node-cron");
const User = require("../models/user.model");
const Progress = require("../models/progress.model");
const { sendWeeklyRecapEmail } = require("./email.service");
const { getDateParts } = require("../utils/timezone");
const {
  computeStreak,
  mondayOfWeekKey,
  weekDayBreakdown,
  solvesInCalendarWeek,
  weekRangeLabel,
} = require("../utils/consistency");

let isRunning = false;

function wasWeeklyRecapSentThisWeek(user, now = new Date()) {
  if (!user.lastWeeklyRecapSentAt) return false;
  const timezone = user.timezone || "Asia/Kolkata";
  const sentKey = getDateParts(user.lastWeeklyRecapSentAt, timezone).dateKey;
  const todayKey = getDateParts(now, timezone).dateKey;
  return mondayOfWeekKey(sentKey, timezone) === mondayOfWeekKey(todayKey, timezone);
}

async function buildUserWeekStats(user) {
  const progress = await Progress.find({ userId: user._id, status: "done" }).select(
    "completedAt updatedAt",
  );
  const completedDates = progress.map((p) => p.completedAt || p.updatedAt).filter(Boolean);
  const timezone = user.timezone || "Asia/Kolkata";
  const days = weekDayBreakdown(completedDates, timezone);
  const activeDays = days.filter((d) => d.done).length;

  return {
    streak: computeStreak(completedDates, timezone, user.streakFreezeDays || []),
    activeDays,
    solvesThisWeek: solvesInCalendarWeek(completedDates, timezone),
    totalDone: progress.length,
    weekLabel: weekRangeLabel(timezone),
    days,
  };
}

async function processWeeklyRecaps() {
  if (isRunning) return { sent: 0, skipped: 0, failed: 0 };
  isRunning = true;

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  try {
    const users = await User.find({ reminderEnabled: true }).select(
      "name email timezone streakFreezeDays lastWeeklyRecapSentAt",
    );
    const now = new Date();

    for (const user of users) {
      if (wasWeeklyRecapSentThisWeek(user, now)) {
        skipped += 1;
        continue;
      }

      try {
        const stats = await buildUserWeekStats(user);
        await sendWeeklyRecapEmail(user, stats);
        user.lastWeeklyRecapSentAt = now;
        await user.save();
        sent += 1;
      } catch (error) {
        failed += 1;
        console.error(`[weekly] Failed for ${user.email}:`, error.message);
      }
    }

    console.log(`[weekly] Recap email sent: ${sent}, skipped: ${skipped}, failed: ${failed}`);
  } catch (error) {
    console.error("[weekly] Job error:", error.message);
  } finally {
    isRunning = false;
  }

  return { sent, skipped, failed };
}

function startReminderCron() {
  if (process.env.REMINDER_CRON_ENABLED !== "true") {
    console.log("[reminder] Cron disabled (set REMINDER_CRON_ENABLED=true)");
    return;
  }

  // Sunday 03:00 UTC = 8:30 AM IST. Unreliable if Serverless is asleep — HTTP trigger is the backup.
  cron.schedule("0 3 * * 0", () => {
    processWeeklyRecaps().catch((err) => console.error("[weekly] Cron error:", err.message));
  });
  console.log("[reminder] Sunday week-in-review cron started (03:00 UTC)");
}

module.exports = {
  startReminderCron,
  processWeeklyRecaps,
  buildUserWeekStats,
};
