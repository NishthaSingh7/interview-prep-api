const cron = require("node-cron");
const User = require("../models/user.model");
const { sendPushReminder } = require("./push.service");
const { isReminderDueNow, wasReminderSentToday } = require("../utils/timezone");

let isRunning = false;

async function processDueReminders() {
  if (isRunning) return;
  isRunning = true;

  try {
    const users = await User.find({
      reminderEnabled: true,
    }).select(
      "name pushSubscription reminderHour reminderMinute timezone lastReminderSentAt",
    );

    const now = new Date();
    let sent = 0;
    let skipped = 0;
    let expired = 0;
    let noSubscription = 0;

    for (const user of users) {
      if (!isReminderDueNow(user, now)) continue;

      if (!user.pushSubscription?.endpoint) {
        noSubscription += 1;
        continue;
      }

      if (wasReminderSentToday(user, now)) {
        skipped += 1;
        continue;
      }

      try {
        await sendPushReminder(user);
        user.lastReminderSentAt = now;
        await user.save();
        sent += 1;
      } catch (error) {
        if (error.subscriptionExpired) {
          user.pushSubscription = undefined;
          await user.save();
          expired += 1;
        }
        console.error(
          `[reminder] Push failed for ${user._id}:`,
          error.message,
        );
      }
    }

    if (sent > 0 || skipped > 0 || expired > 0 || noSubscription > 0) {
      console.log(
        `[reminder] Push sent: ${sent}, skipped today: ${skipped}, no subscription: ${noSubscription}, expired subs: ${expired}`,
      );
    }
  } catch (error) {
    console.error("[reminder] Job error:", error.message);
  } finally {
    isRunning = false;
  }
}

function startReminderCron() {
  if (process.env.REMINDER_CRON_ENABLED !== "true") {
    console.log("[reminder] Cron disabled (set REMINDER_CRON_ENABLED=true)");
    return;
  }

  cron.schedule("* * * * *", processDueReminders);
  console.log("[reminder] Push reminder cron started (checks every minute)");
}

module.exports = { startReminderCron, processDueReminders };
