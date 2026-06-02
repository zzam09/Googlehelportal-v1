// emails/sendEmail.js
// One function to send any email in this project.
//
// Usage:
//   import { sendEmail } from '../../emails/sendEmail.js'
//   const result = await sendEmail({
//     to: 'member@example.com',
//     subject: 'Welcome to the Fleet',
//     template: 'welcome',
//     fields: {
//       title: 'Welcome, Newton',
//       mainMessage: 'Access granted.',
//       buttonText: 'ACCESS PORTAL',
//       buttonUrl: 'https://yoursite.com/pages/login',
//       heroImage: 'https://images.unsplash.com/...',
//     }
//   })
//   if (result.ok) { /* success */ }
//   else { console.error(result.error) }

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

function fillTemplate(html, fields) {
  return html.replace(/\{\{\s*([a-zA-Z0-9_]+)\s*\}\}/g, (_, key) => {
    return fields[key] !== undefined ? String(fields[key]) : '';
  });
}

export async function sendEmail({ to, subject, template, fields = {} }) {

  // 1. Validate inputs
  if (!to)       return { ok: false, error: 'sendEmail: missing "to" address' };
  if (!subject)  return { ok: false, error: 'sendEmail: missing "subject"' };
  if (!template) return { ok: false, error: 'sendEmail: missing "template" name' };

  // 2. Check API key
  const RESEND_API_KEY = process.env.RESEND_API_KEY;
  if (!RESEND_API_KEY) {
    return { ok: false, error: 'sendEmail: RESEND_API_KEY is not set in environment variables' };
  }

  // 3. Load template file
  const templatePath = path.join(__dirname, 'templates', `${template}.html`);
  if (!fs.existsSync(templatePath)) {
    return {
      ok: false,
      error: `sendEmail: template file not found → emails/templates/${template}.html`
    };
  }

  let html;
  try {
    const raw = fs.readFileSync(templatePath, 'utf-8');
    html = fillTemplate(raw, {
      year: new Date().getFullYear(),
      ...fields,
    });
  } catch (err) {
    return { ok: false, error: `sendEmail: failed to read template — ${err.message}` };
  }

  // 4. Send via Resend
  const FROM = process.env.RESEND_FROM_EMAIL || 'SpaceX Operations <onboarding@resend.dev>';

  let response;
  try {
    response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: FROM,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
      }),
    });
  } catch (err) {
    return { ok: false, error: `sendEmail: network error — ${err.message}` };
  }

  // 5. Handle response
  const data = await response.json();
  if (!response.ok) {
    return {
      ok: false,
      error: `sendEmail: Resend error ${response.status} — ${data.message || JSON.stringify(data)}`
    };
  }

  return { ok: true, id: data.id };
}
