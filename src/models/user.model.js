const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const pushSubscriptionSchema = new mongoose.Schema(
  {
    endpoint: { type: String, required: true },
    expirationTime: { type: Number },
    keys: {
      p256dh: { type: String, required: true },
      auth: { type: String, required: true },
    },
  },
  { _id: false },
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    pushSubscription: pushSubscriptionSchema,
    reminderEnabled: {
      type: Boolean,
      default: false,
    },
    reminderHour: {
      type: Number,
      default: 18,
      min: 0,
      max: 23,
    },
    reminderMinute: {
      type: Number,
      default: 30,
      min: 0,
      max: 59,
    },
    timezone: {
      type: String,
      default: "Asia/Kolkata",
      trim: true,
    },
    lastReminderSentAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 12);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
