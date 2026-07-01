const cron = require("node-cron");
const User = require("../models/user.model");
const { sendPushReminder } = require("./push.service");
const { sendReminderEmail } = require("./email.service");
const { isReminderDueNow, wasReminderSentToday } = require("../utils/timezone");

let isRunning = false;

async function processDueReminders() {
  if (isRunning) return;
  isRunning = true;

  try {
    const users = await User.find({
      reminderEnabled: true,
    }).select(
      "name email pushSubscription reminderHour reminderMinute timezone lastReminderSentAt",
    );

    const now = new Date();
    let emailSent = 0;
    let pushSent = 0;
    let skipped = 0;

    for (const user of users) {
      if (!isReminderDueNow(user, now)) continue;

      if (wasReminderSentToday(user, now)) {
        skipped += 1;
        continue;
      }

      let delivered = false;

      try {
        await sendReminderEmail(user);
        emailSent += 1;
        delivered = true;
      } catch (error) {
        console.error(`[reminder] Email failed for ${user.email}:`, error.message);
      }

      if (user.pushSubscription?.endpoint) {
        try {
          await sendPushReminder(user);
          pushSent += 1;
          delivered = true;
        } catch (error) {
          if (error.subscriptionExpired) {
            user.pushSubscription = undefined;
          }
          console.error(`[reminder] Push failed for ${user._id}:`, error.message);
        }
      }

      if (delivered) {
        user.lastReminderSentAt = now;
        await user.save();
      }
    }

    if (emailSent > 0 || pushSent > 0 || skipped > 0) {
      console.log(
        `[reminder] Email: ${emailSent}, push: ${pushSent}, skipped today: ${skipped}`,
      );
    }
  } catch (error) {
    console.error("[reminder] Job error:", error.message);
  } finally {
    isRunning = false;
  }
}

async function processWeeklyRecaps() {
  const Progress = require("../models/progress.model");
  const { sendWeeklyRecapEmail } = require("./email.service");
  const {
    computeStreak,
    activeDaysThisWeek,
  } = require("../utils/consistency");

  try {
    const users = await User.find({ reminderEnabled: true }).select(
      "name email timezone streakFreezeDays",
    );

    for (const user of users) {
      try {
        const progress = await Progress.find({ userId: user._id, status: "done" }).select(
          "completedAt updatedAt",
        );
        const completedDates = progress.map((p) => p.completedAt || p.updatedAt).filter(Boolean);
        const timezone = user.timezone || "Asia/Kolkata";

        await sendWeeklyRecapEmail(user, {
          streak: computeStreak(completedDates, timezone, user.streakFreezeDays || []),
          activeDays: activeDaysThisWeek(completedDates, timezone),
          totalDone: progress.length,
        });
      } catch (error) {
        console.error(`[weekly] Failed for ${user.email}:`, error.message);
      }
    }
  } catch (error) {
    console.error("[weekly] Job error:", error.message);
  }
}

function startReminderCron() {
  if (process.env.REMINDER_CRON_ENABLED !== "true") {
    console.log("[reminder] Cron disabled (set REMINDER_CRON_ENABLED=true)");
    return;
  }

  cron.schedule("* * * * *", processDueReminders);
  cron.schedule("0 9 * * 0", processWeeklyRecaps);
  console.log("[reminder] Daily + weekly (Sunday 09:00 UTC) cron started");
}

module.exports = { startReminderCron, processDueReminders, processWeeklyRecaps };
