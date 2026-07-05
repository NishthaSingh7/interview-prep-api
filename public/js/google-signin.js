const GoogleSignIn = (() => {
  let clientId = "";
  let scriptLoaded = false;

  function loadScript() {
    if (scriptLoaded) return Promise.resolve();
    return new Promise((resolve, reject) => {
      if (document.querySelector('script[src*="accounts.google.com/gsi/client"]')) {
        scriptLoaded = true;
        resolve();
        return;
      }
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      script.onload = () => {
        scriptLoaded = true;
        resolve();
      };
      script.onerror = () => reject(new Error("Could not load Google Sign-In."));
      document.head.appendChild(script);
    });
  }

  async function fetchConfig() {
    const res = await fetch("/api/v1/auth/config");
    const json = await res.json();
    clientId = json?.data?.googleClientId || "";
    return Boolean(json?.data?.googleSignInEnabled && clientId);
  }

  function redirectAfterLogin() {
    const next = new URLSearchParams(window.location.search).get("next");
    const onboarding = new URLSearchParams(window.location.search).get("onboarding");
    if (onboarding) {
      window.location.href = "/?onboarding=1";
      return;
    }
    window.location.href =
      next === "progress" ? "/progress" : next === "companion" ? "/companion" : "/";
  }

  async function handleCredential(response, onError) {
    try {
      let timezone;
      try {
        timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
      } catch {
        timezone = undefined;
      }

      const { data } = await Auth.api("/api/v1/auth/google", {
        method: "POST",
        body: JSON.stringify({
          credential: response.credential,
          timezone,
        }),
      });
      Auth.setSession(data);
      redirectAfterLogin();
    } catch (err) {
      if (onError) onError(err.message);
    }
  }

  async function mount(containerId, { onError } = {}) {
    const container = document.getElementById(containerId);
    if (!container) return false;

    const enabled = await fetchConfig();
    if (!enabled) {
      container.hidden = true;
      return false;
    }

    await loadScript();

    container.hidden = false;
    container.innerHTML = "";

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: (response) => handleCredential(response, onError),
      auto_select: false,
      cancel_on_tap_outside: true,
    });

    window.google.accounts.id.renderButton(container, {
      type: "standard",
      theme: document.documentElement.dataset.theme === "light" ? "outline" : "filled_black",
      size: "large",
      text: container.dataset.googleText || "continue_with",
      shape: "rectangular",
      width: container.offsetWidth > 320 ? 320 : Math.max(container.offsetWidth, 260),
    });

    return true;
  }

  return { mount };
})();
