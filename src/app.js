const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const problemRoutes = require("./routes/problem.routes");
const patternRoutes = require("./routes/pattern.routes");
const authRoutes = require("./routes/auth.routes");
const progressRoutes = require("./routes/progress.routes");
const reminderRoutes = require("./routes/reminder.routes");
const journalRoutes = require("./routes/journal.routes");
const ideRoutes = require("./routes/ide.routes");
const errorHandler = require("./middleware/errorHandler");

app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => {
  res.status(200).json({ success: true, message: "API is running" });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/patterns", patternRoutes);
app.use("/api/v1/problems", problemRoutes);
app.use("/api/v1/progress", progressRoutes);
app.use("/api/v1/reminders", reminderRoutes);
app.use("/api/v1/journal", journalRoutes);
app.use("/api/v1/ide", ideRoutes);

// Netlify serves the UI in production. Skip static files on Railway unless
// SERVE_STATIC=true (saves RAM/egress). Local `npm start` still serves public/.
const onRailway = Boolean(
  process.env.RAILWAY_ENVIRONMENT || process.env.RAILWAY_PROJECT_ID,
);
const serveStatic =
  process.env.SERVE_STATIC === "true" ||
  (process.env.SERVE_STATIC !== "false" && !onRailway);

if (serveStatic) {
  const publicDir = path.join(__dirname, "../public");
  app.use(express.static(publicDir));

  const htmlPages = [
    ["/", "index.html"],
    ["/learn", "study.html"],
    ["/study", "study.html"],
    ["/about", "about.html"],
    ["/progress", "progress.html"],
    ["/companion", "companion.html"],
    ["/newsletter", "newsletter.html"],
    ["/ide", "ide.html"],
    ["/login", "login.html"],
    ["/signup", "signup.html"],
  ];

  for (const [route, file] of htmlPages) {
    app.get(route, (req, res) => {
      res.sendFile(path.join(publicDir, file));
    });
  }
} else {
  console.log("Static UI disabled — API-only (Netlify serves the site)");
}

app.use(errorHandler);

module.exports = app;
