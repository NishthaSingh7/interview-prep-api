require("dotenv").config();

const connectDB = require("../config/db");
const User = require("../models/user.model");
const { sendPushReminder } = require("../services/push.service");

async function main() {
  const email = process.argv[2];

  await connectDB();

  const user = await User.findOne(
    email ? { email: email.toLowerCase() } : { "pushSubscription.endpoint": { $exists: true } },
  ).select("name email pushSubscription");

  if (!user?.pushSubscription?.endpoint) {
    console.error("No user with push subscription found.");
    process.exit(1);
  }

  console.log(`Sending test push to ${user.name} (${user.email || email})…`);
  const result = await sendPushReminder(user);
  console.log("Sent:", result);
  process.exit(0);
}

main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});
