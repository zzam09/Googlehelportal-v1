import { sendEmail } from '../../emails/sendEmail.js';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;

  if (!email) {
    return res.status(400).json({ error: 'email is required' });
  }

  const result = await sendEmail({
    to: email,
    subject: 'Welcome to the SpaceX Fleet',
    template: 'welcome',
    fields: {
      title: `Welcome to the Fleet, ${name || 'Space Voyager'}`,
      mainMessage: 'Access granted. Your SpaceX Member Portal is now online. Use it to schedule meetings, find local meetups, and access exclusive member documents.',
      buttonText: 'ACCESS PORTAL',
      buttonUrl: process.env.SITE_URL || 'https://yoursite.vercel.app/pages/login',
      heroImage: 'https://images.unsplash.com/photo-1517976487492-5750f3195933?auto=format&fit=crop&w=1200&q=80',
    }
  });

  if (!result.ok) {
    console.error('[send-welcome-email]', result.error);
    return res.status(500).json({ error: result.error });
  }

  return res.status(200).json({ success: true, id: result.id });
}
