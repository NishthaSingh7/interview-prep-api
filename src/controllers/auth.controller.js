const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const User = require("../models/user.model");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
};

const sessionPayload = (user) => ({
  _id: user._id,
  name: user.name,
  email: user.email,
  authProvider: user.authProvider,
  token: generateToken(user._id),
});

const getAuthConfig = (req, res) => {
  const googleClientId = process.env.GOOGLE_CLIENT_ID || "";
  res.status(200).json({
    success: true,
    data: {
      googleClientId,
      googleSignInEnabled: Boolean(googleClientId),
    },
  });
};

const register = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      reminderEnabled = false,
      reminderHour = 18,
      reminderMinute = 30,
      timezone = "Asia/Kolkata",
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide name, email, and password.",
      });
    }

    const hour = Number(reminderHour);
    const minute = Number(reminderMinute);
    if (
      !Number.isInteger(hour) ||
      hour < 0 ||
      hour > 23 ||
      !Number.isInteger(minute) ||
      minute < 0 ||
      minute > 59
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid reminder time.",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists.",
      });
    }

    const user = await User.create({
      name,
      email,
      password,
      authProvider: "local",
      reminderEnabled: Boolean(reminderEnabled),
      reminderHour: hour,
      reminderMinute: minute,
      timezone,
    });

    res.status(201).json({
      success: true,
      data: {
        ...sessionPayload(user),
        reminderEnabled: user.reminderEnabled,
        reminderHour: user.reminderHour,
        reminderMinute: user.reminderMinute,
        timezone: user.timezone,
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password, timezone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Please provide email and password.",
      });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    if (!user.password && user.googleId) {
      return res.status(401).json({
        success: false,
        message: "This account uses Google Sign-In. Continue with Google instead.",
      });
    }

    if (!(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password.",
      });
    }

    const { isValidTimezone } = require("../utils/timezone");
    if (timezone && isValidTimezone(String(timezone).trim())) {
      const tz = String(timezone).trim();
      if (user.timezone !== tz) {
        user.timezone = tz;
        await user.save();
      }
    }

    res.status(200).json({
      success: true,
      data: sessionPayload(user),
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const googleLogin = async (req, res) => {
  try {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    if (!clientId) {
      return res.status(503).json({
        success: false,
        message: "Google Sign-In is not configured yet.",
      });
    }

    const { credential, timezone } = req.body;
    if (!credential) {
      return res.status(400).json({
        success: false,
        message: "Missing Google credential.",
      });
    }

    const client = new OAuth2Client(clientId);
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: clientId,
    });
    const payload = ticket.getPayload();
    const googleId = payload.sub;
    const email = payload.email?.toLowerCase()?.trim();
    const name = payload.name?.trim() || email?.split("@")[0] || "AfterHours user";

    if (!email || !payload.email_verified) {
      return res.status(401).json({
        success: false,
        message: "Google account email is not verified.",
      });
    }

    let user = await User.findOne({ $or: [{ googleId }, { email }] });

    if (user) {
      if (user.googleId && user.googleId !== googleId) {
        return res.status(409).json({
          success: false,
          message: "This email is linked to a different Google account.",
        });
      }

      user.googleId = googleId;
      if (user.password) {
        user.authProvider = "both";
      } else {
        user.authProvider = "google";
      }
      if (name && user.name !== name) user.name = name;

      const { isValidTimezone } = require("../utils/timezone");
      if (timezone && isValidTimezone(String(timezone).trim())) {
        user.timezone = String(timezone).trim();
      }

      await user.save();
    } else {
      const { isValidTimezone } = require("../utils/timezone");
      user = await User.create({
        name,
        email,
        googleId,
        authProvider: "google",
        timezone: timezone && isValidTimezone(String(timezone).trim()) ? String(timezone).trim() : "Asia/Kolkata",
      });
    }

    res.status(200).json({
      success: true,
      data: sessionPayload(user),
      linked: Boolean(user.authProvider === "both"),
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Google Sign-In failed. Try again.",
    });
  }
};

const getMe = async (req, res) => {
  const user = req.user.toObject();
  delete user.pushSubscription;
  user.pushSubscribed = Boolean(req.user.pushSubscription?.endpoint);
  res.status(200).json({ success: true, data: user });
};

module.exports = { register, login, googleLogin, getAuthConfig, getMe };
