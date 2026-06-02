import { sendEmail } from '../emails/sendEmail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { to, subject, template, fields, html } = req.body;

  if (!to || !subject) {
    return res.status(400).json({ error: 'to and subject are required' });
  }

  // Option A: use a template file
  if (template) {
    const result = await sendEmail({ to, subject, template, fields });
    if (!result.ok) {
      console.error('[api/send]', result.error);
      return res.status(500).json({ error: result.error });
    }
    return res.status(200).json({ success: true, id: result.id });
  }

  // Option B: send raw HTML (used by MailOps composer)
  if (html) {
    const RESEND_API_KEY = process.env.RESEND_API_KEY;
    if (!RESEND_API_KEY) {
      return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
    }
    const FROM = process.env.RESEND_FROM_EMAIL || 'SpaceX Operations <onboarding@resend.dev>';
    const response = await fetch('https://api.resend.com/emails', {
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
    const data = await response.json();
    if (!response.ok) return res.status(response.status).json(data);
    return res.status(200).json(data);
  }

  return res.status(400).json({ error: 'Either "template" or "html" is required' });
}
