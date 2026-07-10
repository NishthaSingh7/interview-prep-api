const JUDGE0_URL = (process.env.JUDGE0_URL || "https://ce.judge0.com").replace(/\/$/, "");

const LANGUAGE_IDS = {
  python: 100,
  java: 91,
  cpp: 54,
  c: 50,
};

const MAX_CODE_LENGTH = 32 * 1024;
const MAX_STDIN_LENGTH = 8 * 1024;
const RATE_LIMIT_WINDOW_MS = 60 * 1000;
const RATE_LIMIT_MAX = 30;

const rateBuckets = new Map();

function getClientIp(req) {
  const forwarded = req.headers["x-forwarded-for"];
  if (typeof forwarded === "string" && forwarded.length) {
    return forwarded.split(",")[0].trim();
  }
  return req.ip || "unknown";
}

function checkRateLimit(ip) {
  const now = Date.now();
  const bucket = rateBuckets.get(ip);

  if (!bucket || now - bucket.start >= RATE_LIMIT_WINDOW_MS) {
    rateBuckets.set(ip, { start: now, count: 1 });
    return null;
  }

  bucket.count += 1;
  if (bucket.count > RATE_LIMIT_MAX) {
    const retryAfter = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - bucket.start)) / 1000);
    return retryAfter;
  }

  return null;
}

function formatJudge0Result(payload) {
  const stdout = payload.stdout || "";
  const stderr = payload.stderr || "";
  const compileOutput = payload.compile_output || "";
  const status = payload.status?.description || "Unknown";
  const time = payload.time ? `${payload.time}s` : "—";
  const memory = payload.memory ? `${payload.memory} KB` : "—";

  return {
    stdout,
    stderr,
    compileOutput,
    status,
    time,
    memory,
    exitCode: payload.status?.id ?? null,
  };
}

const runCode = async (req, res) => {
  try {
    const ip = getClientIp(req);
    const retryAfter = checkRateLimit(ip);
    if (retryAfter) {
      return res.status(429).json({
        success: false,
        message: `Too many runs. Try again in ${retryAfter}s.`,
      });
    }

    const { language, code, stdin = "" } = req.body || {};

    if (!language || !LANGUAGE_IDS[language]) {
      return res.status(400).json({
        success: false,
        message: "Unsupported language. Choose python, java, cpp, or c.",
      });
    }

    if (typeof code !== "string" || !code.trim()) {
      return res.status(400).json({
        success: false,
        message: "Code is required.",
      });
    }

    if (code.length > MAX_CODE_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Code is too long (max ${MAX_CODE_LENGTH / 1024} KB).`,
      });
    }

    if (typeof stdin !== "string" || stdin.length > MAX_STDIN_LENGTH) {
      return res.status(400).json({
        success: false,
        message: `Input is too long (max ${MAX_STDIN_LENGTH / 1024} KB).`,
      });
    }

    const judgeRes = await fetch(
      `${JUDGE0_URL}/submissions?base64_encoded=false&wait=true&fields=stdout,stderr,compile_output,status,time,memory`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source_code: code,
          language_id: LANGUAGE_IDS[language],
          stdin,
          cpu_time_limit: 5,
          wall_time_limit: 10,
          memory_limit: 128000,
        }),
      },
    );

    const text = await judgeRes.text();
    let payload = {};
    if (text) {
      try {
        payload = JSON.parse(text);
      } catch {
        return res.status(502).json({
          success: false,
          message: "Code runner returned an invalid response. Try again shortly.",
        });
      }
    }

    if (!judgeRes.ok) {
      return res.status(502).json({
        success: false,
        message: payload.message || payload.error || "Code runner is unavailable right now.",
      });
    }

    res.status(200).json({
      success: true,
      data: formatJudge0Result(payload),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message || "Failed to run code.",
    });
  }
};

module.exports = { runCode };
