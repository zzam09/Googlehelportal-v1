# Supabase Migration Plan — `Googlehelportal-v1`

> **Repository:** https://github.com/spacexhq/Googlehelportal-v1  
> **Live Site:** https://googlehelportal-v1.vercel.app  
> **Goal:** Remove Firebase entirely. Use Supabase (Auth + PostgreSQL) for everything.

---

## 1. Project Structure Analysis

### What this app does
A **private member portal** (SpaceX-themed) where:
- Members log in via **magic link / OTP** email
- Members view their own profile page (tier, status, clearance, role)
- An admin panel manages members (add, edit, delete, search)
- Automated welcome emails are sent when a member's status turns ACTIVE

### Core Stack
| Layer | Technology |
|---|---|
| Frontend | Vanilla HTML/CSS/JS + Vite bundler |
| Backend | Node.js + Express (`server.js`) |
| Hosting | Vercel (serverless) |
| Auth | **Supabase Auth** (OTP/magic link) ✅ already Supabase |
| Database | **Firebase Firestore** ❌ needs to migrate |
| User Management | Supabase Auth Admin API ✅ already Supabase |
| Email | **Resend** API |

### Directory Layout
```
/
├── index.html              # Landing / redirect page
├── server.js               # Express server (dev + prod)
├── package.json
├── vite.config.js
├── vercel.json
├── api/
│   ├── trackers.js                     # Serverless: Tracker CRUD
│   ├── send.js                         # Serverless: Generic email sender
│   ├── email-template.js               # Email HTML builder
│   ├── manage-supabase-user/index.js   # Serverless: Supabase Auth admin
│   └── send-welcome-email/index.js     # Serverless: Welcome email trigger
├── js/
│   ├── firebase-config.js   # Firebase init ❌
│   ├── auth.js              # Supabase OTP auth ✅
│   ├── user.js              # Profile page — reads Firestore ❌
│   └── admin.js             # Admin panel — reads/writes Firestore ❌
├── pages/
│   ├── login.html
│   ├── user.html            # Member profile page
│   ├── hq-control-7x9k.html # Admin panel
│   └── admin-tracker-manager.html
└── emails/                  # Email templates
```

---

## 2. All API Endpoints & Routes

| Method | Route | Location | What it does |
|---|---|---|---|
| `POST` | `/api/manage-supabase-user` | `api/manage-supabase-user/index.js` | Creates or deletes a user in Supabase Auth (admin action). Used by admin panel. |
| `POST` | `/api/send-welcome-email` | `api/send-welcome-email/index.js` | Sends a welcome email via Resend when a member is activated. |
| `POST` | `/api/send` | `api/send.js` | Generic email sender — supports both template-based and raw HTML emails. Used by the MailOps composer. |
| `GET` | `/api/trackers` | `api/trackers.js` | Lists all tracking scripts stored in Firestore. |
| `POST` | `/api/trackers` | `api/trackers.js` | Adds a new tracker script to Firestore. |
| `PATCH` | `/api/trackers` | `api/trackers.js` | Toggles a tracker's enabled/disabled state in Firestore. |
| `DELETE` | `/api/trackers?id=XXX` | `api/trackers.js` | Deletes a tracker from Firestore. |

**Pages (HTML routes):**

| Page | Path | Description |
|---|---|---|
| Login | `/pages/login.html` | Email OTP login form |
| User Profile | `/pages/user.html` | Member profile viewer |
| Admin Panel | `/pages/hq-control-7x9k.html` | Hidden admin dashboard |
| Tracker Manager | `/pages/admin-tracker-manager.html` | Manage tracking scripts |

---

## 3. Current Firebase Usage

Firebase is used in **3 places** — all for Firestore (the database). Auth is already on Supabase.

### `js/firebase-config.js`
Initializes the Firebase app and exports `db` (Firestore) and `auth` (Firebase Auth — unused in favor of Supabase).

### `js/user.js` (Frontend — Profile Page)
- **Reads** a single member doc by ID: `getDoc(doc(db, 'members', userId))`
- **Queries** members by email: `query(collection(db, 'members'), where('email', '==', email))`

### `js/admin.js` (Frontend — Admin Panel)
- **Real-time listener** on entire `members` collection: `onSnapshot(collection(db, 'members'), ...)`
- **Adds** new members: `addDoc(collection(db, 'members'), {...})`
- **Updates** members: `setDoc(doc(db, 'members', id), {...}, { merge: true })`
- **Deletes** members: `deleteDoc(doc(db, 'members', id))`

### `api/trackers.js` (Serverless — Backend)
- Full CRUD on a `trackers` Firestore collection (GET, POST, PATCH, DELETE)

### `server.js` (Node.js backend)
- Initializes Firebase Admin
- Watches the `members` collection with `onSnapshot` to auto-send welcome emails when a member's status becomes `ACTIVE`

---

## 4. Supabase Migration Plan (Step-by-Step)

### Prerequisites
- Supabase project already exists (URL + keys are in `.env.example` ✅)
- Supabase Auth with OTP/magic link is already working ✅

---

### Step 1 — Create the PostgreSQL Schema in Supabase

Run this SQL in the Supabase dashboard → **SQL Editor**:

```sql
-- Members table (replaces Firestore 'members' collection)
CREATE TABLE members (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  role        TEXT NOT NULL,
  email       TEXT UNIQUE,
  tier        TEXT DEFAULT 'Explorer' CHECK (tier IN ('Explorer', 'Pioneer', 'Vanguard')),
  clearance   TEXT DEFAULT 'INTERNAL',
  status      TEXT DEFAULT 'PENDING' CHECK (status IN ('ACTIVE', 'PENDING')),
  joined      TEXT,
  avatar_url  TEXT,
  background_url TEXT,
  welcome_email_sent BOOLEAN DEFAULT FALSE,
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW()
);

-- Trackers table (replaces Firestore 'trackers' collection)
CREATE TABLE trackers (
  id         UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name       TEXT NOT NULL,
  script     TEXT NOT NULL,
  enabled    BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE members  ENABLE ROW LEVEL SECURITY;
ALTER TABLE trackers ENABLE ROW LEVEL SECURITY;

-- Policy: Members can only read their own record
CREATE POLICY "Members read own record"
  ON members FOR SELECT
  USING (email = auth.jwt() ->> 'email');

-- Policy: Service role (admin) can do everything (handled by service key in API)
-- No anon policies needed — public reads are blocked
```

---

### Step 2 — Migrate Data from Firestore to Supabase

Run this one-time migration script locally:

```js
// scripts/migrate-to-supabase.js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
dotenv.config();

const fbApp = initializeApp({ /* your firebase config */ });
const firestoreDb = getFirestore(fbApp);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

async function migrate() {
  // Migrate members
  const memberSnap = await getDocs(collection(firestoreDb, 'members'));
  const members = memberSnap.docs.map(d => ({
    name: d.data().name,
    role: d.data().role,
    email: d.data().email,
    tier: d.data().tier,
    clearance: d.data().clearance,
    status: d.data().status,
    joined: d.data().joined,
    avatar_url: d.data().avatarUrl,
    background_url: d.data().backgroundUrl,
    welcome_email_sent: d.data().welcomeEmailSent || false,
  }));
  const { error: mErr } = await supabase.from('members').insert(members);
  if (mErr) console.error('Members migration error:', mErr);
  else console.log(`✅ Migrated ${members.length} members`);

  // Migrate trackers
  const trackerSnap = await getDocs(collection(firestoreDb, 'trackers'));
  const trackers = trackerSnap.docs.map(d => ({
    name: d.data().name,
    script: d.data().script,
    enabled: d.data().enabled,
  }));
  const { error: tErr } = await supabase.from('trackers').insert(trackers);
  if (tErr) console.error('Trackers migration error:', tErr);
  else console.log(`✅ Migrated ${trackers.length} trackers`);
}

migrate();
```

Run with: `node scripts/migrate-to-supabase.js`

---

### Step 3 — Replace `js/firebase-config.js`

Delete this file entirely. Replace all imports in `user.js` and `admin.js` with a shared Supabase client:

**Create `js/supabase-client.js`:**
```js
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

export const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);
```

Add to `.env`:
```
VITE_SUPABASE_URL=https://wrqwbzdwkuipaomufjjq.supabase.co
VITE_SUPABASE_ANON_KEY=<your anon key>
```

---

### Step 4 — Rewrite `js/user.js`

Replace the two Firestore calls with Supabase equivalents:

```js
// BEFORE (Firestore)
const snap = await getDoc(doc(firestoreDb, 'members', userId));

// AFTER (Supabase — fetch by UUID)
const { data, error } = await supabase
  .from('members')
  .select('*')
  .eq('id', userId)
  .single();
```

```js
// BEFORE (Firestore)
const q = query(collection(firestoreDb, 'members'), where('email', '==', email));

// AFTER (Supabase — fetch by email)
const { data, error } = await supabase
  .from('members')
  .select('*')
  .eq('email', email)
  .single();
```

Remove the `import` for `firebase-config.js` and all Firestore SDK imports.

---

### Step 5 — Rewrite `js/admin.js`

Replace Firestore real-time listener and CRUD with Supabase:

```js
// BEFORE: onSnapshot real-time listener
onSnapshot(collection(firestoreDb, 'members'), (snapshot) => { ... });

// AFTER: Initial load + Supabase real-time subscription
const { data } = await supabase.from('members').select('*');
// populate table from data...

supabase
  .channel('members-changes')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'members' }, (payload) => {
    // handle insert / update / delete in real-time
  })
  .subscribe();
```

```js
// BEFORE: addDoc
await addDoc(collection(firestoreDb, 'members'), { name, role, ... });

// AFTER: Supabase insert (use service role via API endpoint for admin ops)
await fetch('/api/admin-member', {
  method: 'POST',
  body: JSON.stringify({ action: 'create', name, role, email, tier, clearance, status, joined })
});
```

> **Tip for MVP:** Keep the admin CRUD going through a server-side API endpoint (just like `manage-supabase-user`) so the service role key stays secret. Never use the service role key on the frontend.

---

### Step 6 — Rewrite `api/trackers.js`

Replace Firestore calls with Supabase:

```js
// BEFORE
import { getFirestore, collection, getDocs, ... } from 'firebase/firestore';

// AFTER
import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// GET
const { data } = await supabase.from('trackers').select('*');

// POST
const { data } = await supabase.from('trackers').insert({ name, script, enabled }).select().single();

// PATCH
await supabase.from('trackers').update({ enabled }).eq('id', id);

// DELETE
await supabase.from('trackers').delete().eq('id', id);
```

---

### Step 7 — Rewrite `server.js` (Remove Firebase Watcher)

The `server.js` file currently uses `onSnapshot` on Firestore to watch for newly ACTIVE members and send welcome emails. Replace this with a **Supabase Database Webhook** or a simple polling approach:

**Option A (Recommended — Supabase Webhook):**
1. In Supabase dashboard → **Database → Webhooks → Create a new hook**
2. Listen on `members` table, `UPDATE` event, filter `status = ACTIVE`
3. Point it at `POST /api/send-welcome-email`
4. This completely removes the need for the Firebase watcher in `server.js`

**Option B (Simple — Remove watcher, keep manual trigger):**
Remove the `onSnapshot` block from `server.js` entirely. Welcome emails fire when the admin saves a member with status `ACTIVE` via the admin panel (call `/api/send-welcome-email` from the `saveUser()` function in `admin.js`).

Remove all Firebase imports from `server.js`:
```js
// DELETE THESE LINES:
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, ... } from 'firebase/firestore';
const firebaseConfig = { ... };
const fbApp = initializeApp(firebaseConfig);
const db = getFirestore(fbApp);
```

---

### Step 8 — Clean Up `.env`

Remove all Firebase env vars. Final `.env` should look like:

```env
# Supabase
VITE_SUPABASE_URL=
VITE_SUPABASE_ANON_KEY=
SUPABASE_URL=
SUPABASE_SERVICE_ROLE_KEY=

# Resend (email)
RESEND_API_KEY=
RESEND_FROM_EMAIL=

# App
SITE_URL=
```

---

### Step 9 — Remove Firebase from `package.json`

```bash
npm uninstall firebase
```

Final `dependencies` should be:
```json
{
  "@supabase/supabase-js": "^2.x",
  "cors": "^2.x",
  "dotenv": "^17.x",
  "express": "^5.x"
}
```

---

## 5. MVP Simplification Recommendations

These are optional cuts that will make the migration faster and the codebase leaner:

| Feature | Current Complexity | MVP Recommendation |
|---|---|---|
| Real-time admin table | Firestore `onSnapshot` (complex) | Load once on page load + manual refresh button. Add Supabase realtime later if needed. |
| Welcome email trigger | Firebase watcher in `server.js` | Trigger from admin panel when status is set to ACTIVE. Remove the background watcher entirely. |
| `analytics.js` | Unknown analytics hooks | Audit and remove if not critical for MVP |
| `GEMINI_API_KEY` in `.env.example` | AI integration (unused?) | Skip for MVP unless actively used |
| `scripts/upload-to-notion.js` | Notion sync script | Skip for MVP |
| `api/send-upgrade-email/` | Upgrade email flow | Skip for MVP — add back after launch |

---

## 6. Migration Checklist

```
[ ] Step 1 — Create members + trackers tables in Supabase SQL Editor
[ ] Step 2 — Run data migration script (Firestore → Supabase)
[ ] Step 3 — Create js/supabase-client.js, add VITE_ env vars
[ ] Step 4 — Rewrite js/user.js (remove Firestore, use Supabase)
[ ] Step 5 — Rewrite js/admin.js (remove Firestore, use Supabase)
[ ] Step 6 — Rewrite api/trackers.js (remove Firestore, use Supabase)
[ ] Step 7 — Clean up server.js (remove Firebase watcher)
[ ] Step 8 — Update .env files
[ ] Step 9 — npm uninstall firebase
[ ] Step 10 — Delete js/firebase-config.js
[ ] Step 11 — Test login flow (OTP → profile page)
[ ] Step 12 — Test admin CRUD (add, edit, delete member)
[ ] Step 13 — Test welcome email trigger
[ ] Step 14 — Deploy to Vercel and verify all env vars are set
```

---

## Summary

The app is already **halfway migrated** — Supabase Auth is fully in place. The only thing connecting to Firebase is the **`members` and `trackers` Firestore collections** (database reads/writes) and a **background watcher** in `server.js`. Swap those three areas out, run the one-time data migration, and you'll have a clean, Firebase-free app running entirely on Supabase.
