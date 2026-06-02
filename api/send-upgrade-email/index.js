import { sendEmail } from '../../emails/sendEmail.js';
import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, doc, getDoc, updateDoc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey:            process.env.VITE_FIREBASE_API_KEY,
  authDomain:        process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId:         process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket:     process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId:             process.env.VITE_FIREBASE_APP_ID,
};

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);
const db  = getFirestore(app);

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

  // 1. Check Firestore — has this tier email already been sent?
  let memberSnap;
  try {
    memberSnap = await getDoc(doc(db, 'members', memberId));
  } catch (err) {
    return res.status(500).json({ error: `Firestore read failed: ${err.message}` });
  }

  if (!memberSnap.exists()) {
    return res.status(404).json({ error: 'Member not found in Firestore' });
  }

  const memberData = memberSnap.data();

  // Guard: if we already sent an email for this exact tier, stop here
  if (memberData.upgradeEmailSent === tier) {
    console.log(`[send-upgrade-email] Skipping — already sent ${tier} email to ${email}`);
    return res.status(200).json({ skipped: true, reason: `${tier} email already sent` });
  }

  // 2. Send the email
  const result = await sendEmail({
    to: email,
    subject: `Your SpaceX Membership Has Been Upgraded — ${tier}`,
    template: 'upgrade',
    fields: {
      title: `Tier Upgrade Confirmed`,
      tierName: tier.toUpperCase(),
      mainMessage: TIER_MESSAGES[tier] || 'Your membership tier has been updated.',
      buttonText: 'ACCESS PORTAL',
      buttonUrl: process.env.SITE_URL || 'https://yoursite.vercel.app/pages/login',
    }
  });

  if (!result.ok) {
    console.error('[send-upgrade-email]', result.error);
    return res.status(500).json({ error: result.error });
  }

  // 3. Mark as sent in Firestore so it never sends again for this tier
  try {
    await updateDoc(doc(db, 'members', memberId), {
      upgradeEmailSent: tier,
      upgradeEmailSentAt: new Date().toISOString(),
    });
  } catch (err) {
    // Email was sent successfully — just log the Firestore update failure
    console.error('[send-upgrade-email] Firestore update failed:', err.message);
  }

  return res.status(200).json({ success: true, id: result.id });
}
