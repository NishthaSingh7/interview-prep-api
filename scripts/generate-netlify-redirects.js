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

// Proxy /api/* to Railway so the static site can use relative API paths.
const content = `/api/*  ${base}/api/:splat  200\n`;

fs.writeFileSync(redirectsPath, content, "utf8");
console.log(`Netlify proxy: /api/* → ${base}/api/*`);
