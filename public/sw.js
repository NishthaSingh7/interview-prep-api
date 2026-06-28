self.addEventListener("install", () => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

function parsePushPayload(event) {
  const defaults = {
    title: "AfterHours — your after-hours slot is open",
    body: "Solve one problem today and keep your streak alive.",
    url: "/",
  };

  if (!event.data) return defaults;

  try {
    return { ...defaults, ...event.data.json() };
  } catch {
    return defaults;
  }
}

async function notifyAllClients(payload) {
  const clients = await self.clients.matchAll({
    type: "window",
    includeUncontrolled: true,
  });
  for (const client of clients) {
    client.postMessage({ type: "AFTERHOURS_REMINDER", ...payload });
  }
}

self.addEventListener("push", (event) => {
  const payload = parsePushPayload(event);

  event.waitUntil(
    (async () => {
      await self.registration.showNotification(payload.title, {
        body: payload.body,
        tag: "afterhours-daily-reminder",
        renotify: true,
        data: { url: payload.url || "/" },
      });
      await notifyAllClients(payload);
    })(),
  );
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const target = event.notification.data?.url || "/";
  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((list) => {
      for (const client of list) {
        if (client.url.includes(self.location.origin) && "focus" in client) {
          return client.focus();
        }
      }
      if (clients.openWindow) return clients.openWindow(target);
    }),
  );
});
