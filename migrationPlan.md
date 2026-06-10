# Migration Plan — `Googlehelportal-v1`

> Firebase → Prisma + Supabase PostgreSQL
> **Repo:** https://github.com/zzam09/Googlehelportal-v1
> **Live:** https://googlehelportal-v1.vercel.app

---

## Status

| Ticket | File | Status |
|---|---|---|
| ZAM-6 | `prisma/schema.prisma` — Member + Tracker models | ✅ Done |
| ZAM-7 | `lib/prisma.js` — Prisma singleton for serverless | ✅ Done |
| ZAM-8 | `api/members.js` — CRUD endpoint (GET/POST/PUT/DELETE) | ✅ Done |
| ZAM-9 | `api/member.js` — GET single member by email or id | ✅ Done |
| ZAM-10 | `api/trackers.js` — Tracker CRUD via Prisma | ✅ Done |
| ZAM-11 | `js/admin.js` — Already using fetch /api/members | ✅ Done |
| ZAM-12 | `js/user.js` — Firestore removed, uses fetch /api/member | ✅ Done |
| ZAM-13 | `js/firebase-config.js` — Deleted | ✅ Done |
| ZAM-14 | `package.json` + `.env.example` — firebase removed, @prisma/client added | ✅ Done |

---

## Remaining

| Task | Notes |
|---|---|
| Set Vercel env vars | `DATABASE_URL`, `DIRECT_URL`, `SUPABASE_URL`, `SUPABASE_SERVICE_ROLE_KEY` |
| Run `prisma migrate deploy` | Apply schema to Supabase PostgreSQL in production |
| Data migration | Export Firestore members + trackers → INSERT into Supabase Postgres |
| Smoke test | Login → profile, admin CRUD, tracker CRUD, welcome email |
| Remove Vercel `VITE_FIREBASE_*` env vars | Clean up old Firebase vars from Vercel dashboard |

---

## Stack (final)

| Layer | Before | After |
|---|---|---|
| Database | Firebase Firestore | Supabase PostgreSQL + Prisma ORM |
| DB Client (server) | Firebase Admin SDK | `@prisma/client` via `lib/prisma.js` |
| DB Client (frontend) | Firebase JS SDK (CDN) | REST fetch to `/api/member` + `/api/members` |
| Auth | Supabase Auth ✅ | Supabase Auth ✅ (unchanged) |
| Hosting | Vercel ✅ | Vercel ✅ (unchanged) |

---

## Env Vars Required in Vercel

```
DATABASE_URL=        # Supabase Transaction pooler (port 6543)
DIRECT_URL=          # Supabase Direct connection (port 5432)
SUPABASE_URL=        # https://<project>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
RESEND_API_KEY=
SITE_URL=            # https://googlehelportal-v1.vercel.app
```

Remove: all `VITE_FIREBASE_*` vars.
