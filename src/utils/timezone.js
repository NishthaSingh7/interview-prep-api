function getDateParts(date, timezone) {
  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });

  const parts = formatter.formatToParts(date);
  const lookup = Object.fromEntries(parts.map((p) => [p.type, p.value]));

  return {
    year: lookup.year,
    month: lookup.month,
    day: lookup.day,
    hour: Number(lookup.hour),
    minute: Number(lookup.minute),
    dateKey: `${lookup.year}-${lookup.month}-${lookup.day}`,
  };
}

function isReminderDueNow(user, now = new Date()) {
  const timezone = user.timezone || "Asia/Kolkata";
  const local = getDateParts(now, timezone);

  const scheduled = user.reminderHour * 60 + user.reminderMinute;
  const current = local.hour * 60 + local.minute;

  // Exact minute, plus 2-min grace if cron/server restarted
  return current >= scheduled && current <= scheduled + 2;
}

function wasReminderSentToday(user, now = new Date()) {
  if (!user.lastReminderSentAt) return false;

  const timezone = user.timezone || "Asia/Kolkata";
  const todayKey = getDateParts(now, timezone).dateKey;
  const sentKey = getDateParts(user.lastReminderSentAt, timezone).dateKey;

  return todayKey === sentKey;
}

module.exports = { getDateParts, isReminderDueNow, wasReminderSentToday };
