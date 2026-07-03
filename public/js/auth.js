const Auth = {
  getToken() {
    return localStorage.getItem("token") || "";
  },

  getUser() {
    try {
      return JSON.parse(localStorage.getItem("user") || "null");
    } catch {
      return null;
    }
  },

  setSession(data) {
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ name: data.name, email: data.email }));
  },

  clearSession() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  isLoggedIn() {
    return !!this.getToken();
  },

  async api(path, options = {}) {
    const headers = { "Content-Type": "application/json", ...options.headers };
    const token = this.getToken();
    if (token) headers.Authorization = `Bearer ${token}`;

    try {
      const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
      if (tz) headers["X-Timezone"] = tz;
    } catch {
      /* ignore */
    }

    const res = await fetch(path, { ...options, headers });
    const text = await res.text();
    let data = {};
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        throw new Error(
          res.ok
            ? "Server returned an invalid response. Try again in a moment."
            : `Request failed (${res.status}). Check your connection and try again.`,
        );
      }
    }
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
};
