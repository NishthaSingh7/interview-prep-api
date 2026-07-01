const jwt = require("jsonwebtoken");
const User = require("../models/user.model");

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "30d" });
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
      reminderEnabled: Boolean(reminderEnabled),
      reminderHour: hour,
      reminderMinute: minute,
      timezone,
    });

    res.status(201).json({
      success: true,
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        reminderEnabled: user.reminderEnabled,
        reminderHour: user.reminderHour,
        reminderMinute: user.reminderMinute,
        timezone: user.timezone,
        token: generateToken(user._id),
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
    if (!user || !(await user.matchPassword(password))) {
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
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  const user = req.user.toObject();
  delete user.pushSubscription;
  user.pushSubscribed = Boolean(req.user.pushSubscription?.endpoint);
  res.status(200).json({ success: true, data: user });
};

module.exports = { register, login, getMe };
