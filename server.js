require("dotenv").config();

// Ensure Web Crypto API exists for MongoDB driver on all Node runtimes.
const nodeCrypto = require("crypto");
if (!global.crypto) {
  global.crypto = nodeCrypto.webcrypto;
}

const app = require("./src/app");
const connectDB = require("./src/config/db");

const startServer = async () => {
  try {
    await connectDB(); // ✅ MUST WAIT
    console.log("MongoDB Connected");

    const { startReminderCron } = require("./src/services/reminder.service");
    startReminderCron();

    const PORT = process.env.PORT || 3000;
    const HOST = "0.0.0.0";

    app.listen(PORT, HOST, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`\n  Open in browser:\n`);
      console.log(`  → http://localhost:${PORT}`);
      console.log(`  → http://127.0.0.1:${PORT}\n`);
    });
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

startServer();
