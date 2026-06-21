const express = require("express");
const cors = require("cors");
const path = require("path");
const app = express();

const problemRoutes = require("./routes/problem.routes");
const patternRoutes = require("./routes/pattern.routes");
const authRoutes = require("./routes/auth.routes");
const progressRoutes = require("./routes/progress.routes");
const reminderRoutes = require("./routes/reminder.routes");
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

// Static UI is served on Netlify in production; keep local/Railway fallback.
if (process.env.SERVE_STATIC !== "false") {
  app.use(express.static(path.join(__dirname, "../public")));

  app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../public/index.html"));
  });
}

app.use(errorHandler);

module.exports = app;
