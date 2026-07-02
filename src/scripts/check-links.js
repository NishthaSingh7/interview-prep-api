require("dotenv").config();

const { problems } = require("../data/seedData");

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

async function checkUrl(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    let res = await fetch(url, {
      method: "HEAD",
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": UA, Accept: "text/html" },
    });
    if (res.status === 405 || res.status === 403 || res.status === 501) {
      res = await fetch(url, {
        method: "GET",
        redirect: "follow",
        signal: controller.signal,
        headers: { "User-Agent": UA, Accept: "text/html" },
      });
    }
    return { status: res.status, finalUrl: res.url };
  } catch (err) {
    return { status: 0, error: err.message };
  } finally {
    clearTimeout(timeout);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function main() {
  const entries = problems
    .map((p) => ({
      title: p.title,
      slug: p.slug,
      patternSlug: p.patternSlug,
      source: p.source || (p.leetcodeLink ? "LeetCode" : "Other"),
      url: p.leetcodeLink || p.practiceLink,
    }))
    .filter((e) => e.url);

  const noLink = problems.filter((p) => !p.leetcodeLink && !p.practiceLink);
  console.log(`Checking ${entries.length} URLs (${noLink.length} problems have no link)...\n`);

  const failed = [];
  const ok = [];

  for (let i = 0; i < entries.length; i++) {
    const e = entries[i];
    const result = await checkUrl(e.url);
    const bad =
      result.status === 404 ||
      result.status === 410 ||
      result.status === 0 ||
      (result.status >= 400 && result.status < 500 && result.status !== 403);

    if (bad) {
      failed.push({ ...e, ...result });
      process.stdout.write("x");
    } else {
      ok.push({ ...e, ...result });
      process.stdout.write(".");
    }

    if ((i + 1) % 50 === 0) console.log(` ${i + 1}/${entries.length}`);
    await sleep(120);
  }

  console.log("\n\n=== SUMMARY ===");
  console.log(`OK: ${ok.length}`);
  console.log(`Failed: ${failed.length}`);
  console.log(`No link: ${noLink.length}`);

  if (noLink.length) {
    console.log("\n--- Problems without any link ---");
    noLink.forEach((p) => console.log(`  [${p.patternSlug}] ${p.title}`));
  }

  if (failed.length) {
    console.log("\n--- Failed URLs ---");
    failed.forEach((f) => {
      console.log(`\n[${f.source}] ${f.status || "ERR"} ${f.title}`);
      console.log(`  slug: ${f.slug}`);
      console.log(`  url:  ${f.url}`);
      if (f.error) console.log(`  err:  ${f.error}`);
      if (f.finalUrl && f.finalUrl !== f.url) console.log(`  final: ${f.finalUrl}`);
    });
  }

  process.exit(failed.length ? 1 : 0);
}

main();
