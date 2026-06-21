const APP_URL =
  process.env.APP_URL || "https://afterhours-interview-prep.netlify.app";

const HEADLINES = [
  "The grind doesn't sleep. Neither should your streak.",
  "One problem tonight. Future you will thank present you.",
  "While others scroll, you solve. That's the difference.",
  "Your interview prep is calling. Pick up.",
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

  const subject = `${firstName}, your daily DSA grind is waiting 🌙`;

  const text = `Hey ${firstName}!

${headline.replace(/&amp;/g, "&")}

Tonight's mission: solve ONE problem on AfterHours.
300 problems · 20 patterns · your pace.

→ ${url}

Don't break the chain. Even 15 minutes after dark counts.

— AfterHours
grind after dark

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
                    <p style="margin:2px 0 0;font-family:ui-monospace,Menlo,Monaco,monospace;font-size:11px;color:#8b949e;">grind after dark</p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding:32px;">
              <p style="margin:0 0 8px;font-family:ui-monospace,Menlo,Monaco,monospace;font-size:11px;font-weight:600;color:#f59e0b;text-transform:uppercase;letter-spacing:0.08em;">Daily reminder</p>
              <h1 style="margin:0 0 20px;font-size:26px;font-weight:700;color:#f0f6fc;line-height:1.25;letter-spacing:-0.03em;">Hey ${firstName}, time to grind.</h1>
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
                    <p style="margin:0;font-size:20px;font-weight:700;color:#f59e0b;">300</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#8b949e;">problems</p>
                  </td>
                  <td width="33%" align="center" style="padding:12px 8px;background-color:#0d1117;border-top:1px solid #30363d;border-bottom:1px solid #30363d;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#f59e0b;">20</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#8b949e;">patterns</p>
                  </td>
                  <td width="33%" align="center" style="padding:12px 8px;background-color:#0d1117;border:1px solid #30363d;border-radius:0 8px 8px 0;">
                    <p style="margin:0;font-size:20px;font-weight:700;color:#f59e0b;">1</p>
                    <p style="margin:4px 0 0;font-size:11px;color:#8b949e;">tonight</p>
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
                Don't break the chain.<br />
                <em style="color:#6e7681;">Even 15 minutes after dark counts.</em>
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="padding:20px 32px;background-color:#0d1117;border-top:1px solid #30363d;">
              <p style="margin:0;font-size:12px;color:#6e7681;line-height:1.5;text-align:center;">
                You're receiving this because you enabled daily reminders on AfterHours.<br />
                <a href="${url}/progress.html" style="color:#f59e0b;text-decoration:none;">Manage reminder settings</a>
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

module.exports = { sendReminderEmail, buildReminderEmail };
