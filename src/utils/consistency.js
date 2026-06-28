const { getDateParts } = require("./timezone");

function uniqueDateKeys(completedDates, timezone) {
  const keys = new Set();
  for (const raw of completedDates) {
    if (!raw) continue;
    const key = getDateParts(new Date(raw), timezone).dateKey;
    keys.add(key);
  }
  return keys;
}

function computeStreak(completedDates, timezone = "Asia/Kolkata") {
  const keys = uniqueDateKeys(completedDates, timezone);
  if (!keys.size) return 0;

  const now = new Date();
  let cursor = getDateParts(now, timezone).dateKey;

  const prevDay = (dateKey) => {
    const [y, m, d] = dateKey.split("-").map(Number);
    const dt = new Date(Date.UTC(y, m - 1, d));
    dt.setUTCDate(dt.getUTCDate() - 1);
    return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
  };

  if (!keys.has(cursor)) {
    cursor = prevDay(cursor);
  }

  let streak = 0;
  while (keys.has(cursor)) {
    streak++;
    cursor = prevDay(cursor);
  }

  return streak;
}

function completedToday(completedDates, timezone = "Asia/Kolkata") {
  const todayKey = getDateParts(new Date(), timezone).dateKey;
  return completedDates.some((raw) => raw && getDateParts(new Date(raw), timezone).dateKey === todayKey);
}

function activeDaysInMonth(completedDates, timezone = "Asia/Kolkata") {
  const now = new Date();
  const parts = getDateParts(now, timezone);
  const prefix = `${parts.year}-${parts.month}`;
  const keys = uniqueDateKeys(completedDates, timezone);
  let count = 0;
  for (const key of keys) {
    if (key.startsWith(prefix)) count++;
  }
  return count;
}

function activeDaysThisWeek(completedDates, timezone = "Asia/Kolkata") {
  const keys = [...uniqueDateKeys(completedDates, timezone)].sort();
  if (!keys.length) return 0;

  const todayKey = getDateParts(new Date(), timezone).dateKey;
  const [y, m, d] = todayKey.split("-").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d));
  start.setUTCDate(start.getUTCDate() - 6);
  const startKey = `${start.getUTCFullYear()}-${String(start.getUTCMonth() + 1).padStart(2, "0")}-${String(start.getUTCDate()).padStart(2, "0")}`;

  return keys.filter((k) => k >= startKey && k <= todayKey).length;
}

module.exports = {
  computeStreak,
  completedToday,
  activeDaysInMonth,
  activeDaysThisWeek,
  uniqueDateKeys,
};
