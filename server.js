require("dotenv").config();

const app = require("./src/app");
const connectDB = require("./src/config/db");

const startServer = async () => {
  try {
    await connectDB(); // ✅ MUST WAIT
    console.log("MongoDB Connected");

    const PORT = process.env.PORT || 6000;

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("DB connection failed:", error);
  }
};

startServer();
