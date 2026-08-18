const { getPublicKey } = require("../services/push.service");

const getVapidPublicKey = (req, res) => {
  const publicKey = getPublicKey();
  if (!publicKey) {
    return res.status(503).json({
      success: false,
      message: "Push notifications are not configured on this server.",
    });
  }
  res.status(200).json({ success: true, data: { publicKey } });
};

const subscribe = async (req, res) => {
  try {
    const { subscription } = req.body;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return res.status(400).json({
        success: false,
        message: "Invalid push subscription.",
      });
    }

    req.user.pushSubscription = {
      endpoint: subscription.endpoint,
      expirationTime: subscription.expirationTime || null,
      keys: {
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
      },
    };
    await req.user.save();

    res.status(200).json({
      success: true,
      data: { subscribed: true },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const unsubscribe = async (req, res) => {
  try {
    req.user.pushSubscription = undefined;
    await req.user.save();
    res.status(200).json({ success: true, data: { subscribed: false } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getPreferences = (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      reminderEnabled: req.user.reminderEnabled,
      reminderHour: req.user.reminderHour,
      reminderMinute: req.user.reminderMinute,
      timezone: req.user.timezone,
      interviewDate: req.user.interviewDate || null,
      pushSubscribed: Boolean(req.user.pushSubscription?.endpoint),
    },
  });
};

const updatePreferences = async (req, res) => {
  try {
    const { reminderEnabled, reminderHour, reminderMinute, timezone, interviewDate } = req.body;

    if (reminderEnabled !== undefined) {
      req.user.reminderEnabled = Boolean(reminderEnabled);
    }

    if (reminderHour !== undefined) {
      const hour = Number(reminderHour);
      if (!Number.isInteger(hour) || hour < 0 || hour > 23) {
        return res.status(400).json({
          success: false,
          message: "reminderHour must be between 0 and 23.",
        });
      }
      req.user.reminderHour = hour;
    }

    if (reminderMinute !== undefined) {
      const minute = Number(reminderMinute);
      if (!Number.isInteger(minute) || minute < 0 || minute > 59) {
        return res.status(400).json({
          success: false,
          message: "reminderMinute must be between 0 and 59.",
        });
      }
      req.user.reminderMinute = minute;
    }

    if (timezone !== undefined) {
      req.user.timezone = String(timezone).trim() || "Asia/Kolkata";
    }

    if (interviewDate !== undefined) {
      if (interviewDate === null || interviewDate === "") {
        req.user.interviewDate = undefined;
      } else {
        const parsed = new Date(interviewDate);
        if (Number.isNaN(parsed.getTime())) {
          return res.status(400).json({
            success: false,
            message: "interviewDate must be a valid date.",
          });
        }
        req.user.interviewDate = parsed;
      }
    }

    // Reset daily send lock when reminder schedule changes.
    req.user.lastReminderSentAt = undefined;

    await req.user.save();

    res.status(200).json({
      success: true,
      data: {
        reminderEnabled: req.user.reminderEnabled,
        reminderHour: req.user.reminderHour,
        reminderMinute: req.user.reminderMinute,
        timezone: req.user.timezone,
        interviewDate: req.user.interviewDate || null,
        pushSubscribed: Boolean(req.user.pushSubscription?.endpoint),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const sendTestPush = async (req, res) => {
  try {
    const results = { email: null, push: null };

    try {
      const { sendWeeklyRecapEmail } = require("../services/email.service");
      const { buildUserWeekStats } = require("../services/reminder.service");
      const stats = await buildUserWeekStats(req.user);
      results.email = await sendWeeklyRecapEmail(req.user, stats);
    } catch (error) {
      results.email = { ok: false, error: error.message };
    }

    if (req.user.pushSubscription?.endpoint) {
      try {
        const { sendPushReminder } = require("../services/push.service");
        results.push = await sendPushReminder(req.user);
      } catch (error) {
        results.push = { ok: false, error: error.message };
      }
    } else {
      results.push = { ok: false, error: "No browser push subscription." };
    }

    res.status(200).json({
      success: true,
      message: "Test week-in-review sent. Check your email inbox.",
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const runWeeklyRecap = async (req, res) => {
  try {
    const { processWeeklyRecaps } = require("../services/reminder.service");
    const result = await processWeeklyRecaps();
    res.status(200).json({ success: true, data: result });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

function requireCronSecret(req, res, next) {
  const secret = process.env.CRON_SECRET;
  if (!secret) {
    return res.status(503).json({ success: false, message: "CRON_SECRET is not configured." });
  }
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  if (token !== secret) {
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }
  next();
}

module.exports = {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  getPreferences,
  updatePreferences,
  sendTestPush,
  runWeeklyRecap,
  requireCronSecret,
};
