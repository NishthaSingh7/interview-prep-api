const fs = require("fs");
const path = require("path");

const apiUrl = process.env.RAILWAY_API_URL;

if (!apiUrl) {
  console.error(
    "Missing RAILWAY_API_URL.\n" +
      "Set it in Netlify → Site settings → Environment variables.\n" +
      "Example: https://your-app.up.railway.app",
  );
  process.exit(1);
}

const base = apiUrl.replace(/\/$/, "");
const redirectsPath = path.join(__dirname, "../public/_redirects");

const pageRoutes = [
  "/study      /study.html     200",
  "/learn      /study.html     200",
  "/about      /about.html     200",
  "/progress   /progress.html  200",
  "/companion  /companion.html 200",
  "/newsletter /newsletter.html 200",
  "/login      /login.html     200",
  "/signup     /signup.html    200",
  "/study.html      /study      301",
  "/learn.html      /study      301",
  "/learn           /study      301",
  "/about.html      /about      301",
  "/progress.html   /progress   301",
  "/login.html      /login      301",
  "/signup.html     /signup     301",
  "/companion.html  /companion  301",
  "/newsletter.html /newsletter 301",
].join("\n");

// Clean URLs + proxy /api/* to Railway so the static site can use relative API paths.
const content = `${pageRoutes}\n/api/*  ${base}/api/:splat  200\n`;

fs.writeFileSync(redirectsPath, content, "utf8");
console.log(`Netlify proxy: /api/* → ${base}/api/*`);
