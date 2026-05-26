// ============================================================
//  /api/trackers.js — Tracker CRUD API
//  Vercel serverless function
//
//  GET    /api/trackers          → list all trackers
//  POST   /api/trackers          → add new tracker
//  DELETE /api/trackers?id=XXX   → delete tracker
//  PATCH  /api/trackers          → toggle enabled { id, enabled }
// ============================================================

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc, deleteDoc, doc, updateDoc, serverTimestamp } from 'firebase/firestore';

// Reuse existing Firebase config from env vars
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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PATCH,DELETE,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {

    // ── GET — return all trackers ──────────────────────────
    if (req.method === 'GET') {
      const snap = await getDocs(collection(db, 'trackers'));
      const trackers = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      return res.status(200).json({ trackers });
    }

    // ── POST — add new tracker ─────────────────────────────
    if (req.method === 'POST') {
      const { name, script, enabled = true } = req.body;
      if (!name || !script) {
        return res.status(400).json({ error: 'name and script are required' });
      }
      const ref = await addDoc(collection(db, 'trackers'), {
        name,
        script,
        enabled,
        createdAt: serverTimestamp(),
      });
      return res.status(201).json({ id: ref.id, name, script, enabled });
    }

    // ── PATCH — toggle enabled/disabled ───────────────────
    if (req.method === 'PATCH') {
      const { id, enabled } = req.body;
      if (!id) return res.status(400).json({ error: 'id is required' });
      await updateDoc(doc(db, 'trackers', id), { enabled });
      return res.status(200).json({ ok: true });
    }

    // ── DELETE — remove tracker ────────────────────────────
    if (req.method === 'DELETE') {
      const id = req.query.id;
      if (!id) return res.status(400).json({ error: 'id query param required' });
      await deleteDoc(doc(db, 'trackers', id));
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method not allowed' });

  } catch (err) {
    console.error('[trackers API]', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}