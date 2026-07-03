const LEETCODE_GRAPHQL = "https://leetcode.com/graphql";

const CONTENT_QUERY = `
  query questionContent($titleSlug: String!) {
    question(titleSlug: $titleSlug) {
      content
      exampleTestcases
    }
  }
`;

function leetcodeSlugFromUrl(url = "") {
  const match = String(url).match(/leetcode\.com\/problems\/([^/?#]+)/i);
  return match ? match[1].replace(/\/$/, "") : "";
}

function decodeHtmlEntities(text) {
  return String(text)
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&amp;/g, "&")
    .replace(/<sup>(.*?)<\/sup>/gi, "^$1");
}

function inlineHtmlToText(html) {
  return decodeHtmlEntities(
    String(html)
      .replace(/<code>(.*?)<\/code>/gi, "`$1`")
      .replace(/<strong>(.*?)<\/strong>/gi, "$1")
      .replace(/<em>(.*?)<\/em>/gi, "$1")
      .replace(/<[^>]+>/g, ""),
  )
    .replace(/\s+/g, " ")
    .trim();
}

function htmlToParagraphs(html) {
  const intro = String(html).split(/<p><strong class="example">Example\s+\d+:/i)[0];
  const chunks = intro
    .split(/<\/p>\s*<p>/i)
    .map((chunk) => inlineHtmlToText(chunk.replace(/^<p>/i, "").replace(/<\/p>$/i, "")))
    .map((s) => s.trim())
    .filter(Boolean);

  return chunks.filter((p) => !/^constraints?:?$/i.test(p) && !/^follow-up/i.test(p));
}

function parseExamples(html) {
  const examples = [];
  const re = /<p><strong class="example">Example\s+\d+:<\/strong><\/p>[\s\S]*?<pre>\s*([\s\S]*?)<\/pre>/gi;
  let match;

  while ((match = re.exec(html))) {
    const block = decodeHtmlEntities(match[1].replace(/<[^>]+>/g, "")).trim();
    const inputMatch = block.match(/Input:\s*(.+?)(?:\n|$)/i);
    const outputMatch = block.match(/Output:\s*(.+?)(?:\n|$)/i);
    const explainMatch = block.match(/Explanation:\s*(.+?)(?:\n|$)/i);

    if (!inputMatch || !outputMatch) continue;

    examples.push({
      input: inputMatch[1].trim(),
      output: outputMatch[1].trim(),
      explanation: explainMatch ? explainMatch[1].trim() : "",
    });
  }

  return examples;
}

function humanizeSentence(sentence) {
  let s = sentence.trim();
  if (!s || /^follow-up/i.test(s)) return "";

  s = s.replace(/^given /i, "You are given ");
  s = s.replace(/, return /i, ". Return ");
  s = s.replace(/indices of the two numbers such that they add up to/gi, "two positions whose values add up to");
  s = s.replace(/indices/gi, "positions");
  s = s.replace(/such that they add up to/gi, "that add up to");
  s = s.replace(/such that /gi, "where ");
  s = s.replace(/You may assume that /i, "You can assume ");
  s = s.replace(/you may not use the same element twice/gi, "you cannot use the same position twice");
  s = s.replace(/You can return the answer in any order\.?/gi, "The order of values in your answer does not matter.");
  s = s.replace(/exactly one solution/gi, "exactly one valid answer");
  s = s.replace(/integer array/gi, "list of numbers");
  s = s.replace(/an array of integers/gi, "a list of numbers");
  s = s.replace(/a string/gi, "a text string");
  s = s.replace(/O\([^)]+\)/gi, "");
  s = s.replace(/\s{2,}/g, " ").trim();

  if (s && !/[.!?]$/.test(s)) s += ".";
  return s;
}

function simplifyDescription(paragraphs) {
  const lines = paragraphs
    .map(humanizeSentence)
    .filter(Boolean)
    .filter((p) => p.length > 8);

  return lines.join("\n\n");
}

async function fetchLeetcodeHtml(slug) {
  if (!slug) throw new Error("Missing LeetCode slug");

  const res = await fetch(LEETCODE_GRAPHQL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "User-Agent": "AfterHours-InterviewPrep/1.0",
    },
    body: JSON.stringify({
      query: CONTENT_QUERY,
      variables: { titleSlug: slug },
    }),
  });

  if (!res.ok) throw new Error(`LeetCode HTTP ${res.status} for ${slug}`);

  const json = await res.json();
  const content = json?.data?.question?.content;
  if (!content) throw new Error(`No LeetCode content for ${slug}`);

  return content;
}

function buildBriefFromLeetcodeHtml(html, fallbackExamples = []) {
  const paragraphs = htmlToParagraphs(html);
  const scenario = simplifyDescription(paragraphs);
  const parsed = parseExamples(html);
  const examples = (parsed.length >= 2 ? parsed : [...parsed, ...fallbackExamples]).slice(0, 2);

  if (!scenario) throw new Error("Could not build description from LeetCode HTML");

  return {
    scenario,
    given: "",
    output: "",
    constraints: "",
    examples,
    fromLeetcode: true,
  };
}

async function fetchLeetcodeBrief(leetcodeLink, fallbackExamples = []) {
  const slug = leetcodeSlugFromUrl(leetcodeLink);
  const html = await fetchLeetcodeHtml(slug);
  const brief = buildBriefFromLeetcodeHtml(html, fallbackExamples);

  if (!brief.examples || brief.examples.length < 2) {
    throw new Error(`Fewer than 2 examples for ${slug}`);
  }

  return brief;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = {
  leetcodeSlugFromUrl,
  fetchLeetcodeHtml,
  buildBriefFromLeetcodeHtml,
  fetchLeetcodeBrief,
  simplifyDescription,
  parseExamples,
  sleep,
};
