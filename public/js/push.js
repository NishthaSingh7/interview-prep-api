const Push = {
  _checkerStarted: false,

  supported() {
    return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
  },

  getTimezone() {
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "Asia/Kolkata";
    } catch {
      return "Asia/Kolkata";
    }
  },

  parseTimeInput(value) {
    const [hour, minute] = String(value || "18:30").split(":").map(Number);
    return {
      reminderHour: Number.isInteger(hour) ? hour : 18,
      reminderMinute: Number.isInteger(minute) ? minute : 30,
    };
  },

  formatTime(hour, minute) {
    return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
  },

  getLocalTimeParts(date, timezone) {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hourCycle: "h23",
    });
    const parts = Object.fromEntries(
      formatter.formatToParts(date).map((p) => [p.type, p.value]),
    );
    return {
      hour: Number(parts.hour),
      minute: Number(parts.minute),
      dateKey: `${parts.year}-${parts.month}-${parts.day}`,
    };
  },

  urlBase64ToUint8Array(base64String) {
    const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
    const raw = atob(base64);
    return Uint8Array.from([...raw].map((char) => char.charCodeAt(0)));
  },

  async registerServiceWorker() {
    const reg = await navigator.serviceWorker.register("/sw.js?v=2");
    await navigator.serviceWorker.ready;
    return reg;
  },

  async getPublicKey() {
    const { data } = await Auth.api("/api/v1/reminders/vapid-public-key");
    return data.publicKey;
  },

  tryOsNotification(title, body) {
    if (Notification.permission !== "granted") return;
    try {
      new Notification(title, { body, tag: "afterhours-os" });
    } catch {
      // ignore
    }
  },

  showInPageReminder({ title, body, url = "/" }) {
    let modal = document.getElementById("reminderModal");
    if (!modal) {
      modal = document.createElement("div");
      modal.id = "reminderModal";
      modal.className = "motivation-modal";
      modal.hidden = true;
      modal.innerHTML = `
        <div class="motivation-backdrop" data-reminder-close></div>
        <div class="motivation-dialog reminder-dialog" role="alertdialog" aria-labelledby="reminderTitle">
          <p class="motivation-kicker">daily reminder</p>
          <h2 id="reminderTitle"></h2>
          <p class="motivation-message" id="reminderBody"></p>
          <div class="motivation-actions">
            <a href="/" class="btn btn-primary" id="reminderCta">Solve a problem</a>
            <button type="button" class="btn btn-ghost" data-reminder-close>Dismiss</button>
          </div>
        </div>`;
      document.body.appendChild(modal);
      modal.querySelectorAll("[data-reminder-close]").forEach((el) => {
        el.addEventListener("click", () => Push.hideInPageReminder());
      });
    }

    modal.querySelector("#reminderTitle").textContent = title;
    modal.querySelector("#reminderBody").textContent = body;
    modal.querySelector("#reminderCta").href = url;
    modal.hidden = false;
    document.body.classList.add("motivation-open");
  },

  hideInPageReminder() {
    const modal = document.getElementById("reminderModal");
    if (modal) modal.hidden = true;
    document.body.classList.remove("motivation-open");
  },

  async subscribe() {
    if (!this.supported()) {
      throw new Error("Push notifications are not supported in this browser.");
    }

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission was denied.");
    }

    const publicKey = await this.getPublicKey();
    if (!publicKey) {
      throw new Error("Server push is not configured (VAPID keys missing).");
    }

    const reg = await this.registerServiceWorker();
    const existing = await reg.pushManager.getSubscription();
    if (existing) await existing.unsubscribe();

    let subscription;
    try {
      subscription = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: this.urlBase64ToUint8Array(publicKey),
      });
    } catch (err) {
      const msg = String(err.message || err);
      if (msg.includes("push service") || err.name === "AbortError") {
        throw new Error(
          "Push registration failed. Use Chrome on localhost, hard-refresh (Cmd+Shift+R), then try again.",
        );
      }
      throw err;
    }

    await Auth.api("/api/v1/reminders/subscribe", {
      method: "POST",
      body: JSON.stringify({ subscription: subscription.toJSON() }),
    });

    return subscription;
  },

  async savePreferences({ reminderEnabled, reminderHour, reminderMinute, timezone }) {
    await Auth.api("/api/v1/reminders/preferences", {
      method: "PUT",
      body: JSON.stringify({
        reminderEnabled,
        reminderHour,
        reminderMinute,
        timezone: timezone || this.getTimezone(),
      }),
    });
  },

  async getPreferences() {
    const { data } = await Auth.api("/api/v1/reminders/preferences");
    return data;
  },

  permissionStatus() {
    if (!this.supported()) return "unsupported";
    return Notification.permission;
  },

  statusLabel(status, prefs) {
    if (status === "unsupported") return "Not supported in this browser.";
    if (status === "denied") return "Notifications blocked — enable them in browser settings.";
    if (prefs?.reminderEnabled && !prefs?.pushSubscribed) {
      return "⚠ Reminders ON but not connected — click Save and Allow.";
    }
    if (prefs?.reminderEnabled) {
      return `✓ Active — daily email at ${this.formatTime(prefs.reminderHour, prefs.reminderMinute)} (${prefs.timezone})`;
    }
    if (prefs?.pushSubscribed) return "Subscribed — turn on daily reminders below.";
    return "Click Save reminder, then Allow when prompted.";
  },

  bindSignupFlow() {
    const checkbox = document.getElementById("reminderEnabled");
    const timeGroup = document.getElementById("reminderTimeGroup");
    if (!checkbox || !timeGroup) return;

    const sync = () => {
      timeGroup.hidden = !checkbox.checked;
    };
    checkbox.addEventListener("change", sync);
    sync();
  },

  async setupAfterSignup({ reminderEnabled, reminderHour, reminderMinute }) {
    if (!reminderEnabled || !Auth.isLoggedIn()) return;

    await this.savePreferences({
      reminderEnabled: true,
      reminderHour,
      reminderMinute,
      timezone: this.getTimezone(),
    });

    try {
      await this.subscribe();
    } catch (err) {
      console.warn("Push subscribe after signup:", err.message);
    }
  },

  async sendTestNotification() {
    const { message, data } = await Auth.api("/api/v1/reminders/test", {
      method: "POST",
    });

    const emailOk = data?.email?.ok;
    const pushOk = data?.push?.ok;

    if (pushOk) {
      this.tryOsNotification("AfterHours — test", "Browser push test");
    }

    if (!emailOk && !pushOk) {
      throw new Error(
        data?.email?.error || data?.push?.error || "Could not send test reminder.",
      );
    }

    return message;
  },

  async checkClientReminder() {
    if (!Auth.isLoggedIn()) return;

    try {
      const prefs = await this.getPreferences();
      if (!prefs.reminderEnabled) return;

      const tz = prefs.timezone || this.getTimezone();
      const local = this.getLocalTimeParts(new Date(), tz);
      const scheduled = prefs.reminderHour * 60 + prefs.reminderMinute;
      const current = local.hour * 60 + local.minute;
      const shownKey = `afterhours-reminder-${local.dateKey}`;

      if (localStorage.getItem(shownKey)) return;
      if (current < scheduled || current > scheduled + 5) return;

      localStorage.setItem(shownKey, "1");
      const user = Auth.getUser();
      const firstName = user?.name?.split(" ")[0] || "there";
      const payload = {
        title: "AfterHours — time to grind",
        body: `Hey ${firstName}! Solve one problem today and keep building your streak.`,
        url: "/",
      };
      this.showInPageReminder(payload);
      this.tryOsNotification(payload.title, payload.body);
    } catch {
      // ignore polling errors
    }
  },

  startClientReminderChecker() {
    if (this._checkerStarted || !Auth.isLoggedIn()) return;
    this._checkerStarted = true;

    this.checkClientReminder();
    setInterval(() => this.checkClientReminder(), 30000);

    navigator.serviceWorker?.addEventListener("message", (event) => {
      if (event.data?.type === "AFTERHOURS_REMINDER") {
        this.showInPageReminder(event.data);
      }
    });
  },

  async initSettingsPanel() {
    const panel = document.getElementById("reminderSettings");
    if (!panel || !Auth.isLoggedIn()) return;

    panel.hidden = false;
    this.startClientReminderChecker();

    const enabledEl = document.getElementById("prefReminderEnabled");
    const timeEl = document.getElementById("prefReminderTime");
    const statusEl = document.getElementById("pushStatus");
    const saveBtn = document.getElementById("saveReminderBtn");
    const testBtn = document.getElementById("testReminderBtn");
    const timeGroup = document.getElementById("reminderTimeGroup");

    if (!enabledEl || !timeEl || !saveBtn) return;

    let prefs = await this.getPreferences();
    enabledEl.checked = prefs.reminderEnabled;
    timeEl.value = this.formatTime(prefs.reminderHour, prefs.reminderMinute);
    statusEl.textContent = this.statusLabel(this.permissionStatus(), prefs);
    if (testBtn) testBtn.hidden = !prefs.reminderEnabled;

    const syncTimeVisibility = () => {
      timeGroup.hidden = !enabledEl.checked;
    };
    enabledEl.addEventListener("change", syncTimeVisibility);
    syncTimeVisibility();

    saveBtn.addEventListener("click", async () => {
      saveBtn.disabled = true;
      statusEl.textContent = "Saving…";

      try {
        const { reminderHour, reminderMinute } = this.parseTimeInput(timeEl.value);

        if (enabledEl.checked) {
          try {
            await this.subscribe();
          } catch {
            // Email reminders still work without browser push
          }
        }

        prefs = await this.savePreferencesAndReturn({
          reminderEnabled: enabledEl.checked,
          reminderHour,
          reminderMinute,
        });

        statusEl.textContent = this.statusLabel(this.permissionStatus(), prefs);
        if (testBtn) testBtn.hidden = !prefs.reminderEnabled;
      } catch (err) {
        statusEl.textContent = err.message;
      } finally {
        saveBtn.disabled = false;
      }
    });

    if (testBtn) {
      testBtn.addEventListener("click", async () => {
        testBtn.disabled = true;
        try {
          const msg = await this.sendTestNotification();
          statusEl.textContent = msg || "Test sent! Check your email inbox.";
        } catch (err) {
          statusEl.textContent = err.message;
        } finally {
          testBtn.disabled = false;
        }
      });
    }
  },

  async savePreferencesAndReturn(prefs) {
    await this.savePreferences({
      ...prefs,
      timezone: this.getTimezone(),
    });
    return this.getPreferences();
  },
};
