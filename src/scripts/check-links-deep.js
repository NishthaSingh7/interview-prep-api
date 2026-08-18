require("dotenv").config();

const { problems } = require("../data/seedData");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function fetchPage(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 20000);
  try {
    const res = await fetch(url, {
      method: "GET",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "text/html" },
    });
    const text = await res.text();
    return { status: res.status, finalUrl: res.url, text };
  } catch (err) {
    return { status: 0, error: err.message, text: "" };
  } finally {
    clearTimeout(timeout);
  }
}

function diagnose(url, status, finalUrl, html) {
  const lower = (html || "").toLowerCase();
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const title = (titleMatch ? titleMatch[1] : "").replace(/\s+/g, " ").trim();

  if (status === 0) return { ok: false, reason: "network", title };
  if (status === 404 || status === 410) return { ok: false, reason: `http ${status}`, title };

  if (url.includes("geeksforgeeks.org")) {
    if (
      /problem not found|this problem does not exist|page not found|404 - /i.test(html) ||
      title.toLowerCase().includes("page not found")
    ) {
      return { ok: false, reason: "gfg missing page", title };
    }
    // Practice pages that work include "Practice | GeeksforGeeks" in the title
    // or a JSON blob with problemName.
    const hasPractice = /Practice \| GeeksforGeeks/i.test(title) || /"problemName"\s*:/i.test(html);
    if (!hasPractice && /explore|login|courses/i.test(title) && !/"problemName"/i.test(html)) {
      return { ok: false, reason: "gfg not a problem page", title };
    }
    if (!hasPractice && html.length < 2000) {
      return { ok: false, reason: "gfg empty/short page", title };
    }
    return { ok: true, reason: "ok", title };
  }

  if (url.includes("leetcode.com")) {
    if (/page not found|problem not found|this question does not exist/i.test(html)) {
      return { ok: false, reason: "lc missing page", title };
    }
    if (/subscribe to unlock|premium membership|is a premium problem/i.test(lower)) {
      return { ok: false, reason: "lc premium", title };
    }
    return { ok: true, reason: "ok", title };
  }

  return { ok: status >= 200 && status < 400, reason: `http ${status}`, title };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const extra = process.argv.slice(2);
  const entries =
    extra.length > 0
      ? extra.map((url) => ({ title: url, slug: "", url, source: "candidate" }))
      : problems
          .map((p) => ({
            title: p.title,
            slug: p.slug,
            source: p.source || (p.leetcodeLink ? "LeetCode" : "Other"),
            url: p.leetcodeLink || p.practiceLink,
          }))
          .filter((e) => e.url);

  const failed = [];
  const premium = [];
  const ok = [];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const page = await fetchPage(e.url);
    const d = diagnose(e.url, page.status, page.finalUrl, page.text);
    const row = { ...e, status: page.status, ...d, error: page.error };
    if (d.reason === "lc premium") {
      premium.push(row);
      process.stdout.write("P");
    } else if (!d.ok) {
      failed.push(row);
      process.stdout.write("x");
    } else {
      ok.push(row);
      process.stdout.write(".");
    }
    if ((i + 1) % 40 === 0) console.log(` ${i + 1}/${entries.length}`);
    await sleep(80);
  }

  console.log("\n\n=== SUMMARY ===");
  console.log(`OK: ${ok.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`Premium: ${premium.length}`);

  if (failed.length) {
    console.log("\n--- Failed ---");
    failed.forEach((f) => {
      console.log(`[${f.source}] ${f.reason} | ${f.title}`);
      console.log(`  ${f.url}`);
      if (f.pageTitle || f.title) console.log(`  title: ${f.pageTitle || ""}`);
    });
  }

  if (premium.length) {
    console.log("\n--- LeetCode premium ---");
    premium.forEach((f) => {
      console.log(`${f.title}`);
      console.log(`  ${f.url}`);
    });
  }
}

main();
