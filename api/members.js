// api/members.js
// Vercel Serverless — Members CRUD
//
// GET    /api/members          → list all members
// POST   /api/members          → create member (+ invite to Supabase Auth)
// PUT    /api/members          → update member (+ sync Supabase Auth metadata)
// DELETE /api/members?id=XXX   → delete member (+ remove from Supabase Auth)

import { prisma } from '../lib/prisma.js';

// ─── Supabase Auth helper (mirrors manage-supabase-user logic inline) ─────────
async function manageSupabaseUser(action, email, name = '', tier = '') {
  const supabaseUrl = process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!supabaseUrl || !serviceRoleKey) {
    console.error('[members] Supabase env vars missing — skipping auth sync');
    return;
  }

  const res = await fetch('/api/manage-supabase-user', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, email, name, tier }),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    console.error(`[members] Auth sync failed for ${action} ${email}:`, err);
  }
}

// ─── Handler ──────────────────────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── GET — list all members ───────────────────────────────────────────────
    if (req.method === 'GET') {
      const members = await prisma.member.findMany({
        orderBy: { createdAt: 'desc' },
      });
      return res.status(200).json({ members });
    }

    // ── POST — create member ─────────────────────────────────────────────────
    if (req.method === 'POST') {
      const {
        name, email, role, tier = 'Explorer',
        clearance = 'INTERNAL', status = 'PENDING',
        joined, avatarUrl, backgroundUrl,
      } = req.body;

      if (!name || !email || !role || !joined) {
        return res.status(400).json({ error: 'name, email, role, and joined are required' });
      }
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        return res.status(400).json({ error: 'Invalid email address' });
      }

      const member = await prisma.member.create({
        data: {
          name,
          email: email.toLowerCase(),
          role,
          tier,
          clearance,
          status,
          joined,
          avatarUrl: avatarUrl || null,
          backgroundUrl: backgroundUrl || null,
        },
      });

      // Invite to Supabase Auth (fire-and-forget — DB record already safe)
      await manageSupabaseUser('add', member.email, member.name, member.tier);

      return res.status(201).json({ member });
    }

    // ── PUT — update member ──────────────────────────────────────────────────
    if (req.method === 'PUT') {
      const {
        id, name, role, email, tier, clearance,
        status, joined, avatarUrl, backgroundUrl,
      } = req.body;

      if (!id) return res.status(400).json({ error: 'id is required' });

      const member = await prisma.member.update({
        where: { id },
        data: {
          ...(name       !== undefined && { name }),
          ...(role       !== undefined && { role }),
          ...(email      !== undefined && { email: email.toLowerCase() }),
          ...(tier       !== undefined && { tier }),
          ...(clearance  !== undefined && { clearance }),
          ...(status     !== undefined && { status }),
          ...(joined     !== undefined && { joined }),
          ...(avatarUrl  !== undefined && { avatarUrl: avatarUrl || null }),
          ...(backgroundUrl !== undefined && { backgroundUrl: backgroundUrl || null }),
        },
      });

      // Sync metadata update to Supabase Auth
      if (email || name || tier) {
        await manageSupabaseUser(
          'update',
          member.email,
          member.name,
          member.tier
        );
      }

      return res.status(200).json({ member });
    }

    // ── DELETE — remove member ───────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param is required' });

      // Fetch email before deleting so we can clean up Supabase Auth
      const existing = await prisma.member.findUnique({ where: { id } });
      if (!existing) return res.status(404).json({ error: 'Member not found' });

      await prisma.member.delete({ where: { id } });

      // Remove from Supabase Auth (fire-and-forget)
      await manageSupabaseUser('delete', existing.email);

      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    // Prisma unique constraint = duplicate email
    if (err.code === 'P2002') {
      return res.status(409).json({ error: 'A member with that email already exists' });
    }
    // Prisma record not found (update/delete on missing id)
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Member not found' });
    }
    console.error('[api/members]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
