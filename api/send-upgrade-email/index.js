// api/send-upgrade-email/index.js
// Vercel Serverless — Send tier upgrade email
// Replaces Firestore reads/writes with Prisma

import { sendEmail } from '../../emails/sendEmail.js';
import { prisma } from '../../lib/prisma.js';

const TIER_MESSAGES = {
  Pioneer: 'You now have access to exclusive Pioneer-tier briefings, priority event access, and expanded mission documents.',
  Vanguard: 'You have reached the highest tier. Vanguard members receive direct mission updates, private event invitations, and full archive access.',
  Explorer: 'Your Explorer membership is now active. Welcome to the fleet.',
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { memberId, email, name, tier } = req.body;
  if (!memberId || !email || !tier) {
    return res.status(400).json({ error: 'memberId, email, and tier are required' });
  }

  // 1. Read member from Postgres via Prisma
  let member;
  try {
    member = await prisma.member.findUnique({ where: { id: memberId } });
  } catch (err) {
    return res.status(500).json({ error: `DB read failed: ${err.message}` });
  }

  if (!member) {
    return res.status(404).json({ error: 'Member not found' });
  }

  // 2. Guard: if we already sent an email for this exact tier, stop here
  if (member.upgradeEmailSent === tier) {
    console.log(`[send-upgrade-email] Skipping — already sent ${tier} email to ${email}`);
    return res.status(200).json({ skipped: true, reason: `${tier} email already sent` });
  }

  // 3. Send the email
  const result = await sendEmail({
    to: email,
    subject: `Your SpaceX Membership Has Been Upgraded — ${tier}`,
    template: 'upgrade',
    fields: {
      title: 'Tier Upgrade Confirmed',
      tierName: tier.toUpperCase(),
      mainMessage: TIER_MESSAGES[tier] || 'Your membership tier has been updated.',
      buttonText: 'ACCESS PORTAL',
      buttonUrl: process.env.SITE_URL || 'https://yoursite.vercel.app/pages/login',
    },
  });

  if (!result.ok) {
    console.error('[send-upgrade-email]', result.error);
    return res.status(500).json({ error: result.error });
  }

  // 4. Mark as sent in Postgres so it never sends again for this tier
  try {
    await prisma.member.update({
      where: { id: memberId },
      data: {
        upgradeEmailSent: tier,
        upgradeEmailSentAt: new Date().toISOString(),
      },
    });
  } catch (err) {
    // Email was sent successfully — log the DB update failure but don't error
    console.error('[send-upgrade-email] DB update failed:', err.message);
  }

  return res.status(200).json({ success: true, id: result.id });
}
