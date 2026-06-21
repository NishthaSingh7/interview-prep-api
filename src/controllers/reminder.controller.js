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
      pushSubscribed: Boolean(req.user.pushSubscription?.endpoint),
    },
  });
};

const updatePreferences = async (req, res) => {
  try {
    const { reminderEnabled, reminderHour, reminderMinute, timezone } = req.body;

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
      const { sendReminderEmail } = require("../services/email.service");
      results.email = await sendReminderEmail(req.user);
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
      message: "Test reminder sent. Check your email inbox (and Mac notifications if push is set up).",
      data: results,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  getVapidPublicKey,
  subscribe,
  unsubscribe,
  getPreferences,
  updatePreferences,
  sendTestPush,
};
