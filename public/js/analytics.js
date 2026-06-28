/* Privacy-light product analytics — local only, no third-party trackers */
const Analytics = (() => {
  const KEY = "afterhours_events";
  const MAX = 200;

  function track(event, meta = {}) {
    try {
      const list = JSON.parse(localStorage.getItem(KEY) || "[]");
      list.push({
        event,
        meta,
        at: new Date().toISOString(),
      });
      while (list.length > MAX) list.shift();
      localStorage.setItem(KEY, JSON.stringify(list));
    } catch {
      /* ignore storage errors */
    }
  }

  function getEvents() {
    try {
      return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
      return [];
    }
  }

  return { track, getEvents };
})();
