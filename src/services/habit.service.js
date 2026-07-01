const User = require("../models/user.model");
const Progress = require("../models/progress.model");
const { getDateParts } = require("../utils/timezone");
const {
  computeStreak,
  computeLongestStreak,
  activeDaysInMonth,
  activeDaysLastMonth,
  activeDaysThisWeek,
  activeDaysLastWeek,
  daysSinceLastActive,
  interviewPaceInfo,
  completedToday,
} = require("../utils/consistency");

function monthPrefix(timezone) {
  const { year, month } = getDateParts(new Date(), timezone);
  return `${year}-${month}`;
}

function prevDayKey(dateKey) {
  const [y, m, d] = dateKey.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  dt.setUTCDate(dt.getUTCDate() - 1);
  return `${dt.getUTCFullYear()}-${String(dt.getUTCMonth() + 1).padStart(2, "0")}-${String(dt.getUTCDate()).padStart(2, "0")}`;
}

async function getCompletedDates(userId) {
  const progress = await Progress.find({ userId, status: "done" }).select(
    "completedAt updatedAt createdAt",
  );
  return progress.map((p) => p.completedAt || p.updatedAt || p.createdAt).filter(Boolean);
}

async function syncUserHabitStats(user) {
  const timezone = user.timezone || "Asia/Kolkata";
  const completedDates = await getCompletedDates(user._id);
  const freezeDays = user.streakFreezeDays || [];

  const streak = computeStreak(completedDates, timezone, freezeDays);
  const longest = computeLongestStreak(completedDates, timezone, freezeDays);
  user.bestStreak = Math.max(user.bestStreak || 0, longest, streak);

  const currentMonth = monthPrefix(timezone);
  const activeThisMonth = activeDaysInMonth(completedDates, timezone);
  if (activeThisMonth >= 5 && user.freezeCreditsMonth !== currentMonth) {
    user.streakFreezeCredits = Math.min(1, (user.streakFreezeCredits || 0) + 1);
    user.freezeCreditsMonth = currentMonth;
  }

  await user.save();
  return { streak, bestStreak: user.bestStreak, streakFreezeCredits: user.streakFreezeCredits };
}

async function useStreakFreeze(user) {
  const timezone = user.timezone || "Asia/Kolkata";
  const todayKey = getDateParts(new Date(), timezone).dateKey;
  const yesterdayKey = prevDayKey(todayKey);

  if ((user.streakFreezeCredits || 0) < 1) {
    const err = new Error("No streak freeze available. Show up 5 nights in a month to earn one.");
    err.status = 400;
    throw err;
  }

  const freezeDays = [...(user.streakFreezeDays || [])];
  if (freezeDays.includes(yesterdayKey)) {
    const err = new Error("Yesterday is already covered by a streak freeze.");
    err.status = 400;
    throw err;
  }

  const completedDates = await getCompletedDates(user._id);
  const activeKeys = new Set(
    completedDates.map((d) => getDateParts(new Date(d), timezone).dateKey),
  );

  if (activeKeys.has(yesterdayKey)) {
    const err = new Error("You showed up yesterday — no freeze needed.");
    err.status = 400;
    throw err;
  }

  freezeDays.push(yesterdayKey);
  user.streakFreezeDays = freezeDays;
  user.streakFreezeCredits = Math.max(0, (user.streakFreezeCredits || 0) - 1);
  await user.save();
  await syncUserHabitStats(user);

  return user;
}

async function buildHabitStats(user, timezoneOverride, completedDatesOverride) {
  const timezone = timezoneOverride || user.timezone || "Asia/Kolkata";
  const completedDates =
    completedDatesOverride || (await getCompletedDates(user._id));
  const freezeDays = user.streakFreezeDays || [];

  const streak = computeStreak(completedDates, timezone, freezeDays);
  const bestStreak = Math.max(user.bestStreak || 0, computeLongestStreak(completedDates, timezone, freezeDays));
  const activeDaysThisMonth = activeDaysInMonth(completedDates, timezone);
  const activeDaysLastMo = activeDaysLastMonth(completedDates, timezone);
  const daysIdle = daysSinceLastActive(completedDates, timezone);
  const todayKey = getDateParts(new Date(), timezone).dateKey;
  const yesterdayKey = prevDayKey(todayKey);
  const activeKeys = new Set(
    completedDates.map((d) => getDateParts(new Date(d), timezone).dateKey),
  );
  const canUseStreakFreeze =
    (user.streakFreezeCredits || 0) >= 1 &&
    !freezeDays.includes(yesterdayKey) &&
    !activeKeys.has(yesterdayKey);

  return {
    streak,
    bestStreak,
    streakFreezeCredits: user.streakFreezeCredits || 0,
    streakFreezeDays: freezeDays,
    activeDaysThisMonth,
    activeDaysLastMonth: activeDaysLastMo,
    activeDaysThisWeek: activeDaysThisWeek(completedDates, timezone),
    activeDaysLastWeek: activeDaysLastWeek(completedDates, timezone),
    monthDelta: activeDaysThisMonth - activeDaysLastMo,
    daysSinceLastActive: daysIdle,
    completedToday: completedToday(completedDates, timezone),
    canUseStreakFreeze,
    interview: interviewPaceInfo(user.interviewDate, completedDates, timezone),
    timezone,
    completedDates,
  };
}

module.exports = {
  syncUserHabitStats,
  useStreakFreeze,
  buildHabitStats,
  getCompletedDates,
};
