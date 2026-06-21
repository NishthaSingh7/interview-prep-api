(function () {
  const OVERRIDE_KEY = "afterhours-theme-override";
  const PERIOD_KEY = "afterhours-theme-period";

  const DARK_START_HOUR = 18;
  const DARK_START_MINUTE = 30;

  let scheduleTimer = null;

  function isNightPeriod() {
    const now = new Date();
    const minutes = now.getHours() * 60 + now.getMinutes();
    return minutes >= DARK_START_HOUR * 60 + DARK_START_MINUTE;
  }

  function getPeriod() {
    return isNightPeriod() ? "night" : "day";
  }

  function scheduledTheme() {
    return isNightPeriod() ? "dark" : "light";
  }

  function getTheme() {
    return document.documentElement.getAttribute("data-theme") || scheduledTheme();
  }

  function updateToggleButtons(theme) {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      const isDark = theme === "dark";
      btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
      btn.setAttribute("title", isDark ? "Light mode" : "Dark mode");
    });
  }

  function apply(theme) {
    document.documentElement.setAttribute("data-theme", theme);
    updateToggleButtons(theme);
  }

  function resolveTheme() {
    const period = getPeriod();
    const savedPeriod = localStorage.getItem(PERIOD_KEY);
    const override = localStorage.getItem(OVERRIDE_KEY);

    if (savedPeriod !== period) {
      localStorage.setItem(PERIOD_KEY, period);
      localStorage.removeItem(OVERRIDE_KEY);
      return scheduledTheme();
    }

    if (override === "light" || override === "dark") {
      return override;
    }

    return scheduledTheme();
  }

  function getNextTransitionTime() {
    const now = new Date();
    const eveningCutoff = new Date(now);
    eveningCutoff.setHours(DARK_START_HOUR, DARK_START_MINUTE, 0, 0);

    if (now < eveningCutoff) {
      return eveningCutoff;
    }

    const nextMidnight = new Date(now);
    nextMidnight.setDate(nextMidnight.getDate() + 1);
    nextMidnight.setHours(0, 0, 0, 0);
    return nextMidnight;
  }

  function onScheduleTick() {
    localStorage.setItem(PERIOD_KEY, getPeriod());
    localStorage.removeItem(OVERRIDE_KEY);
    apply(scheduledTheme());
    scheduleNextTransition();
  }

  function scheduleNextTransition() {
    if (scheduleTimer) {
      clearTimeout(scheduleTimer);
    }

    const delay = getNextTransitionTime().getTime() - Date.now();
    scheduleTimer = setTimeout(onScheduleTick, Math.max(delay, 0));
  }

  function toggle() {
    const next = getTheme() === "dark" ? "light" : "dark";
    localStorage.setItem(PERIOD_KEY, getPeriod());
    localStorage.setItem(OVERRIDE_KEY, next);
    apply(next);
  }

  function init() {
    apply(resolveTheme());
    scheduleNextTransition();
  }

  window.AfterHoursTheme = { toggle, apply, getTheme, scheduledTheme };

  init();

  document.addEventListener("DOMContentLoaded", () => {
    document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
      btn.addEventListener("click", toggle);
    });
  });
})();
