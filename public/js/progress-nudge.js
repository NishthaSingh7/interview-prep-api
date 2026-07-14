const ProgressNudge = (() => {
  const DAY_KEY = "afterhours_progress_nudge_day_v2";
  const SESSION_KEY = "afterhours_progress_nudge_session_v2";
  let bound = false;

  function todayKey() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  function isLocalHost() {
    const host = location.hostname;
    return host === "localhost" || host === "127.0.0.1";
  }

  function forceRequested() {
    return new URLSearchParams(location.search).get("progressNudge") === "1";
  }

  function wasDismissed() {
    try {
      if (forceRequested()) return false;
      // Local: only hide for this tab/session so refresh testing is easy
      if (isLocalHost()) {
        return sessionStorage.getItem(SESSION_KEY) === "1";
      }
      return localStorage.getItem(DAY_KEY) === todayKey();
    } catch {
      return false;
    }
  }

  function markSeen() {
    try {
      if (isLocalHost()) {
        sessionStorage.setItem(SESSION_KEY, "1");
      } else {
        localStorage.setItem(DAY_KEY, todayKey());
      }
    } catch {
      /* ignore */
    }
  }

  function clearSeen() {
    try {
      sessionStorage.removeItem(SESSION_KEY);
      localStorage.removeItem(DAY_KEY);
      localStorage.removeItem("afterhours_progress_nudge_date");
    } catch {
      /* ignore */
    }
  }

  function banner() {
    return document.getElementById("progressNudgeBanner");
  }

  function hide() {
    const el = banner();
    if (el) el.hidden = true;
  }

  function shouldShow() {
    if (typeof Auth === "undefined" || !Auth.isLoggedIn()) return false;
    const page = document.body?.dataset?.page;
    if (page && page !== "solve") return false;
    if (new URLSearchParams(location.search).get("onboarding") === "1") return false;
    if (forceRequested()) return true;
    return !wasDismissed();
  }

  function bind() {
    const el = banner();
    if (!el || bound) return;
    bound = true;

    el.querySelector("#progressNudgeBannerGo")?.addEventListener("click", () => {
      markSeen();
    });

    el.querySelector("#progressNudgeBannerDismiss")?.addEventListener("click", () => {
      markSeen();
      hide();
      if (forceRequested()) history.replaceState(null, "", "/");
    });
  }

  function show() {
    bind();
    const el = banner();
    if (!el) {
      console.warn("[ProgressNudge] banner element missing");
      return false;
    }
    if (!shouldShow()) {
      hide();
      return false;
    }
    el.hidden = false;
    console.info("[ProgressNudge] banner shown");
    return true;
  }

  function init() {
    bind();
    if (forceRequested()) clearSeen();
    show();
    [400, 1000, 2000].forEach((ms) => window.setTimeout(show, ms));
  }

  return { init, show, markSeen, clearSeen, shouldShow };
})();

// Self-start as soon as the page is ready (does not depend on app.js finishing)
document.addEventListener("DOMContentLoaded", () => {
  // Auth module is already a global by script order when this runs at end of body;
  // wait a tick so Auth token is readable after Nav settles.
  window.setTimeout(() => {
    if (typeof ProgressNudge !== "undefined") ProgressNudge.init();
  }, 100);
});
