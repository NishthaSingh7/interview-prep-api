const APP_URL =
  process.env.APP_URL || "https://afterhours-interview-prep.netlify.app";

const HEADLINES = [
  "Your after-hours slot is open — one problem tonight.",
  "One problem after work. That's the whole strategy.",
  "While others scroll, you show up. That's the difference.",
  "Consistency beats cramming. Tonight counts.",
];

function pickHeadline(name) {
  const day = new Date().getDate();
  return HEADLINES[day % HEADLINES.length].replace("{name}", name);
}

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function buildReminderEmail(name) {
  const firstName = escapeHtml(String(name || "there").split(" ")[0]);
  const headline = escapeHtml(pickHeadline(firstName));
  const url = APP_URL;

  const subject = `${firstName}, your after-hours slot is open 🌙`;

  const text = `Hey ${firstName}!

${headline.replace(/&amp;/g, "&")}

Tonight's mission: solve ONE problem on AfterHours.
20 patterns · one rep per night · your pace.

→ ${url}

Show up today. Same time tomorrow.

— AfterHours
Progress Never Clocks Out.

---
You're getting this because you turned on daily reminders.
`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>AfterHours Daily Reminder</title>
</head>
<body style="margin:0;padding:0;background-color:#0d1117;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d1117;padding:32px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:520px;background-color:#161b22;border:1px solid #30363d;border-radius:12px;overflow:hidden;">
          <!-- Header -->
          <tr>
            <td style="padding:28px 32px 20px;border-bottom:3px solid #f59e0b;">
              <table role="presentation" cellspacing="0" cellpadding="0">
                <tr>
                  <td style="width:44px;height:44px;background:linear-gradient(135deg,#f59e0b,#d97706);border-radius:10px;text-align:center;vertical-align:middle;">
                    <span style="font-family:ui-monospace,Menlo,Monaco,monospace;font-size:14px;font-weight:700;color:#0d1117;line-height:44px;">AH</span>
                  </td>
                  <td style="padding-left:14px;vertical-align:middle;">
                    <p style="margin:0;font-size:18px;font-weight:700;color:#f0f6fc;letter-spacing:-0.02em;">AfterHours</p>
                    <p style="margin:2px 0 0;font-family:ui-monospace,Menlo,Monaco,monospace;font-size:11px;color:#8b949e;">Progress Never Clocks Out.</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-family:ui-monospace,Menlo,Monaco,monospace;font-size:11px;font-weight:600;color:#f59e0b;text-transform:uppercase;letter-spacing:0.08em;">Daily reminder</p>
              <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;color:#f0f6fc;line-height:1.25;letter-spacing:-0.03em;">Hey ${firstName}, your slot is open.</h1>
              <p style="margin:0 0 24px;font-size:16px;line-height:1.6;color:#c9d1d9;">${headline}</p>

              <!-- Mission card -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="background-color:#0d1117;border:1px solid #30363d;border-radius:8px;margin-bottom:28px;">
                <tr>
                  <td style="padding:20px 22px;">
                    <p style="margin:0 0 6px;font-family:ui-monospace,Menlo,Monaco,monospace;font-size:10px;font-weight:600;color:#8b949e;text-transform:uppercase;letter-spacing:0.06em;">Tonight's mission</p>
                    <p style="margin:0;font-size:15px;font-weight:600;color:#f0f6fc;line-height:1.5;">Solve <span style="color:#f59e0b;">one problem</span> before you call it a night.</p>
                  </td>
                </tr>
              </table>

              <!-- Stats row -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom:32px;">
                <tr>
                  <td width="33%" align="center" style="padding:12px 8px;background-color:#0d1117;border:1px solid #30363d;border-radius:8px 0 0 8px;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#f59e0b;">1</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#8b949e;">tonight</p>
                  </td>
                  <td width="33%" align="center" style="padding:12px 8px;background-color:#0d1117;border-top:1px solid #30363d;border-bottom:1px solid #30363d;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#f59e0b;">20</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#8b949e;">patterns</p>
                  </td>
                  <td width="33%" align="center" style="padding:12px 8px;background-color:#0d1117;border:1px solid #30363d;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#f59e0b;">∞</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#8b949e;">consistency</p>
                  </td>
                </tr>
              </table>

              <!-- CTA -->
              <table role="presentation" cellspacing="0" cellpadding="0" align="center">
                <tr>
                  <td style="border-radius:8px;background:linear-gradient(135deg,#f59e0b,#d97706);">
                    <a href="${url}" target="_blank" style="display:inline-block;padding:14px 32px;font-size:15px;font-weight:700;color:#0d1117;text-decoration:none;letter-spacing:-0.01em;">Open AfterHours →</a>
                  </td>
                </tr>
              </table>

              <p style="margin:28px 0 0;font-size:14px;line-height:1.6;color:#8b949e;text-align:center;">
                Show up today. Same time tomorrow.<br />
                <em style="color:#6e7681;">One quality rep after work beats ten rushed ones.</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#0d1117;border-top:1px solid #30363d;">
              <p style="margin:0;font-size:12px;color:#6e7681;line-height:1.5;text-align:center;">
                You're receiving this because you enabled daily reminders on AfterHours.<br />
                <a href="${url}/progress" style="color:#f59e0b;text-decoration:none;">Manage reminder settings</a>
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

async function sendViaResend(to, name) {
  const apiKey = process.env.RESEND_API_KEY;
  const from =
    process.env.REMINDER_EMAIL_FROM || "AfterHours <onboarding@resend.dev>";

  if (!apiKey) {
    throw new Error("RESEND_API_KEY is not configured.");
  }

  const { subject, html, text } = buildReminderEmail(name);

  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Resend email failed.");
  }

  return { ok: true, provider: "resend", id: data.id };
}

async function sendViaConsole(to, name) {
  const { subject, text } = buildReminderEmail(name);
  console.log(`[email:console] → ${to}\nSubject: ${subject}\n${text}`);
  return { ok: true, provider: "console" };
}

async function sendReminderEmail(user) {
  const to = user.email;
  if (!to) throw new Error("User has no email address.");

  if (process.env.RESEND_API_KEY) {
    return sendViaResend(to, user.name);
  }
  return sendViaConsole(to, user.name);
}

function buildWeeklyRecapEmail(name, { streak = 0, activeDays = 0, totalDone = 0 } = {}) {
  const firstName = escapeHtml(String(name || "there").split(" ")[0]);
  const url = APP_URL;
  const subject = `${firstName}, your week on AfterHours`;

  const text = `Hey ${firstName}!

This week you showed up ${activeDays} day(s). Current streak: ${streak} day(s). Lifetime solves: ${totalDone}.

Consistency is the win — not how fast you hit 300.

→ ${url}/progress

— AfterHours`;

  const html = `<!DOCTYPE html><html><body style="font-family:sans-serif;background:#0d1117;color:#c9d1d9;padding:24px;">
    <h1 style="color:#f0f6fc;">Your week, ${firstName}</h1>
    <p>Active days this week: <strong style="color:#f59e0b;">${activeDays}</strong></p>
    <p>Current streak: <strong style="color:#f59e0b;">${streak}</strong> day(s)</p>
    <p>Lifetime solves: ${totalDone} <span style="color:#8b949e;">(secondary — habit is primary)</span></p>
    <p><a href="${url}/progress" style="color:#f59e0b;">View your Journey Map →</a></p>
  </body></html>`;

  return { subject, text, html };
}

async function sendWeeklyRecapEmail(user, stats) {
  const to = user.email;
  if (!to) throw new Error("User has no email address.");
  const { subject, html, text } = buildWeeklyRecapEmail(user.name, stats);

  if (!process.env.RESEND_API_KEY) {
    console.log(`[email:weekly] → ${to}\n${text}`);
    return { ok: true, provider: "console" };
  }

  const from = process.env.REMINDER_EMAIL_FROM || "AfterHours <onboarding@resend.dev>";
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ from, to, subject, html, text }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Weekly recap email failed.");
  return { ok: true, provider: "resend", id: data.id };
}

module.exports = { sendReminderEmail, buildReminderEmail, sendWeeklyRecapEmail, buildWeeklyRecapEmail };
