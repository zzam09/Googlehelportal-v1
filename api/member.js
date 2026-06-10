// api/member.js
// Vercel Serverless — Member profile lookup
//
// GET /api/member?email=xxx   → find member by email (used by user.js on login)
// GET /api/member?id=xxx      → find member by id   (used by user.js with ?id= param)

import { prisma } from '../lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, id } = req.query;

  if (!email && !id) {
    return res.status(400).json({ error: 'email or id query param is required' });
  }

  try {
    let member = null;

    if (id) {
      member = await prisma.member.findUnique({ where: { id } });
    } else {
      member = await prisma.member.findUnique({
        where: { email: email.toLowerCase() },
      });
    }

    if (!member) {
      return res.status(404).json({ error: 'Member not found' });
    }

    return res.status(200).json({ member });

  } catch (err) {
    console.error('[api/member]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
