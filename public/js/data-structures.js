const DataStructures = (() => {
  let cache = null;
  let loadPromise = null;

  function load() {
    if (cache) return Promise.resolve(cache);
    if (loadPromise) return loadPromise;
    loadPromise = fetch("/data/data-structures.json")
      .then((r) => {
        if (!r.ok) throw new Error("Failed to load data structures");
        return r.json();
      })
      .then((data) => {
        cache = data.structures || {};
        return cache;
      });
    return loadPromise;
  }

  function get(slug) {
    if (!cache) return null;
    return cache[slug] || null;
  }

  function all() {
    return cache ? Object.values(cache) : [];
  }

  return { load, get, all };
})();
