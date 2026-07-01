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
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || "Request failed");
    return data;
  },
};
