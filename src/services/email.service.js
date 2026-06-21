const APP_URL =
  process.env.APP_URL || "https://afterhours-interview-prep.netlify.app";

function buildReminderEmail(name) {
  const firstName = String(name || "there").split(" ")[0];
  return {
    subject: "AfterHours — time to solve one problem tonight",
    text: `Hey ${firstName}!\n\nTime for today's AfterHours grind. Solve one problem and keep building your streak.\n\n${APP_URL}\n\n— AfterHours`,
    html: `
      <p>Hey ${firstName}!</p>
      <p>Time for today's <strong>AfterHours</strong> grind. Solve one problem and keep building your streak.</p>
      <p><a href="${APP_URL}">Open AfterHours →</a></p>
      <p style="color:#888;font-size:12px;">You're receiving this because you enabled daily reminders.</p>
    `,
  };
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
