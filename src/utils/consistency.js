const { getDateParts } = require("./timezone");

function uniqueDateKeys(completedDates, timezone, extraDayKeys = []) {
  const keys = new Set(extraDayKeys);
  for (const raw of completedDates) {
    if (!raw) continue;
    keys.add(getDateParts(new Date(raw), timezone).dateKey);
  }
  return keys;
}

function prevDay(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function streakFromKeys(keys, timezone) {
  if (!keys.size) return 0;

  const now = new Date();
  let cursor = getDateParts(now, timezone).dateKey;

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

function computeStreak(completedDates, timezone = "Asia/Kolkata", freezeDayKeys = []) {
  const keys = uniqueDateKeys(completedDates, timezone, freezeDayKeys);
  return streakFromKeys(keys, timezone);
}

function computeLongestStreak(completedDates, timezone = "Asia/Kolkata", freezeDayKeys = []) {
  const keys = [...uniqueDateKeys(completedDates, timezone, freezeDayKeys)].sort();
  if (!keys.length) return 0;

  let best = 1;
  let run = 1;

  for (let i = 1; i < keys.length; i++) {
    if (prevDay(keys[i]) === keys[i - 1]) {
      run++;
      best = Math.max(best, run);
    } else {
      run = 1;
    }
  }

  return best;
}

function completedToday(completedDates, timezone = "Asia/Kolkata") {
  const todayKey = getDateParts(new Date(), timezone).dateKey;
  return completedDates.some((raw) => raw && getDateParts(new Date(raw), timezone).dateKey === todayKey);
}

function activeDaysInMonth(completedDates, timezone = "Asia/Kolkata", monthOffset = 0) {
  const now = new Date();
  const parts = getDateParts(now, timezone);
  let year = Number(parts.year);
  let month = Number(parts.month) - monthOffset;
  while (month <= 0) {
    month += 12;
    year -= 1;
  }
  const prefix = `${year}-${String(month).padStart(2, "0")}`;
  const keys = uniqueDateKeys(completedDates, timezone);
  let count = 0;
  for (const key of keys) {
    if (key.startsWith(prefix)) count++;
  }
  return count;
}

function activeDaysLastMonth(completedDates, timezone = "Asia/Kolkata") {
  return activeDaysInMonth(completedDates, timezone, 1);
}

function addDaysKey(dateKey, delta) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() + delta);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

function dateKeyToDate(dateKey, timezone) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const noon = Date.UTC(y, m - 1, d, 12, 0, 0);
  for (let delta = -36; delta <= 36; delta++) {
    const candidate = noon + delta * 3600000;
    if (getDateParts(new Date(candidate), timezone).dateKey === dateKey) {
      return new Date(candidate);
    }
  }
  return new Date(noon);
}

function weekdayMondayZero(dateKey, timezone) {
  const wd = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "short",
  }).format(dateKeyToDate(dateKey, timezone));
  const map = { Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6 };
  return map[wd] ?? 0;
}

function mondayOfWeekKey(dateKey, timezone) {
  return addDaysKey(dateKey, -weekdayMondayZero(dateKey, timezone));
}

function activeDaysLastWeek(completedDates, timezone = "Asia/Kolkata") {
  const todayKey = getDateParts(new Date(), timezone).dateKey;
  const lastMonday = addDaysKey(mondayOfWeekKey(todayKey, timezone), -7);
  const lastSunday = addDaysKey(lastMonday, 6);
  const keys = uniqueDateKeys(completedDates, timezone);
  let count = 0;
  for (const key of keys) {
    if (key >= lastMonday && key <= lastSunday) count++;
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

function daysSinceLastActive(completedDates, timezone = "Asia/Kolkata") {
  const keys = [...uniqueDateKeys(completedDates, timezone)].sort();
  if (!keys.length) return null;

  const todayKey = getDateParts(new Date(), timezone).dateKey;
  const lastKey = keys[keys.length - 1];
  if (lastKey === todayKey) return 0;

  const [y, m, d] = todayKey.split("-").map(Number);
  const [ly, lm, ld] = lastKey.split("-").map(Number);
  const todayMs = Date.UTC(y, m - 1, d);
  const lastMs = Date.UTC(ly, lm - 1, ld);
  return Math.round((todayMs - lastMs) / 86400000);
}

function interviewPaceInfo(interviewDate, completedDates, timezone = "Asia/Kolkata") {
  if (!interviewDate) return null;

  const target = new Date(interviewDate);
  if (Number.isNaN(target.getTime())) return null;

  const todayParts = getDateParts(new Date(), timezone);
  const interviewParts = getDateParts(target, timezone);
  const todayMs = Date.UTC(Number(todayParts.year), Number(todayParts.month) - 1, Number(todayParts.day));
  const interviewMs = Date.UTC(
    Number(interviewParts.year),
    Number(interviewParts.month) - 1,
    Number(interviewParts.day),
  );

  const nightsLeft = Math.max(0, Math.round((interviewMs - todayMs) / 86400000));
  const activeDays = activeDaysInMonth(completedDates, timezone);
  const onTrackNights = activeDaysThisWeek(completedDates, timezone);

  let message;
  if (nightsLeft === 0) {
    message = "Interview target is today — one focused rep if you can.";
  } else if (onTrackNights >= 5) {
    message = `${nightsLeft} nights until interview · you're on a strong 1/night pace this week`;
  } else {
    message = `${nightsLeft} nights until interview · aim for 1 quality rep per night`;
  }

  return {
    interviewDate: interviewParts.dateKey,
    nightsLeft,
    activeNightsThisWeek: onTrackNights,
    message,
  };
}

module.exports = {
  computeStreak,
  computeLongestStreak,
  completedToday,
  activeDaysInMonth,
  activeDaysLastMonth,
  activeDaysThisWeek,
  activeDaysLastWeek,
  uniqueDateKeys,
  daysSinceLastActive,
  interviewPaceInfo,
};
