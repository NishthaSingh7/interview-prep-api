const webpush = require("web-push");

const APP_URL =
  process.env.APP_URL || "https://afterhours-interview-prep.netlify.app";

let vapidConfigured = false;

function ensureVapid() {
  if (vapidConfigured) return true;

  const publicKey = process.env.VAPID_PUBLIC_KEY;
  const privateKey = process.env.VAPID_PRIVATE_KEY;

  if (!publicKey || !privateKey) {
    return false;
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT || "mailto:support@afterhours.app",
    publicKey,
    privateKey,
  );
  vapidConfigured = true;
  return true;
}

function getPublicKey() {
  return process.env.VAPID_PUBLIC_KEY || "";
}

function buildReminderPayload(user) {
  const firstName = String(user.name || "there").split(" ")[0];
  return JSON.stringify({
    title: "AfterHours — your after-hours slot is open",
    body: `Hey ${firstName}! Tonight's one problem is waiting — log your win when you're done.`,
    url: APP_URL,
  });
}

async function sendPushReminder(user) {
  if (!ensureVapid()) {
    throw new Error("VAPID keys are not configured.");
  }

  if (!user.pushSubscription?.endpoint) {
    throw new Error("User has no push subscription.");
  }

  try {
    await webpush.sendNotification(
      user.pushSubscription,
      buildReminderPayload(user),
    );
    return { ok: true, provider: "web-push" };
  } catch (error) {
    if (error.statusCode === 404 || error.statusCode === 410) {
      error.subscriptionExpired = true;
    }
    throw error;
  }
}

module.exports = { getPublicKey, sendPushReminder, buildReminderPayload, ensureVapid };
