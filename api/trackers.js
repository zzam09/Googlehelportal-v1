// api/trackers.js
// Vercel Serverless — Trackers CRUD
//
// GET    /api/trackers          → list all trackers
// POST   /api/trackers          → add new tracker
// PATCH  /api/trackers          → toggle enabled { id, enabled }
// DELETE /api/trackers?id=XXX   → delete tracker

import { prisma } from '../lib/prisma.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // ── GET — return all trackers ────────────────────────────────────────────
    if (req.method === 'GET') {
      const trackers = await prisma.tracker.findMany({
        orderBy: { createdAt: 'asc' },
      });
      return res.status(200).json({ trackers });
    }

    // ── POST — add new tracker ───────────────────────────────────────────────
    if (req.method === 'POST') {
      const { name, script, enabled = true } = req.body;
      if (!name || !script) {
        return res.status(400).json({ error: 'name and script are required' });
      }
      const tracker = await prisma.tracker.create({
        data: { name, script, enabled },
      });
      return res.status(201).json(tracker);
    }

    // ── PATCH — toggle enabled/disabled ─────────────────────────────────────
    if (req.method === 'PATCH') {
      const { id, enabled } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      const tracker = await prisma.tracker.update({
        where: { id },
        data: { enabled },
      });
      return res.status(200).json({ ok: true, tracker });
    }

    // ── DELETE — remove tracker ──────────────────────────────────────────────
    if (req.method === 'DELETE') {
      const { id } = req.query;
      if (!id) return res.status(400).json({ error: 'id query param required' });
      await prisma.tracker.delete({ where: { id } });
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    if (err.code === 'P2025') {
      return res.status(404).json({ error: 'Tracker not found' });
    }
    console.error('[api/trackers]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
