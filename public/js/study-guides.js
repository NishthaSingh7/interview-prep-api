const StudyGuides = (() => {
  let data = null;
  let loadPromise = null;

  async function load() {
    if (data) return data;
    if (!loadPromise) {
      loadPromise = fetch("/data/study-guides.json")
        .then((r) => {
          if (!r.ok) throw new Error("Failed to load study guides");
          return r.json();
        })
        .then((json) => {
          data = json;
          return data;
        });
    }
    return loadPromise;
  }

  function getGuide(slug) {
    if (!data?.guides) return null;
    if (data.guides[slug]) return data.guides[slug];
    const suffix = `-${slug}`;
    const key = Object.keys(data.guides).find((k) => k === slug || k.endsWith(suffix));
    return key ? data.guides[key] : null;
  }

  function hasGuide(slug) {
    return Boolean(getGuide(slug));
  }

  return { load, getGuide, hasGuide };
})();
