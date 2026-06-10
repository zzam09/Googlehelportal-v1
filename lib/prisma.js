// lib/prisma.js
// Prisma client singleton for Vercel Serverless.
//
// WHY: Each serverless function invocation is a fresh Node.js module evaluation.
// Without this pattern, every request creates a new PrismaClient → new DB
// connection → pool exhaustion under any real traffic.
//
// HOW: We attach the client to `globalThis` in development so hot-reloads
// don't spawn new connections. In production each container is long-lived
// enough that a module-level singleton is fine.

import { PrismaClient } from '@prisma/client';

const globalForPrisma = globalThis;

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query', 'error', 'warn'] : ['error'],
  });

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = prisma;
}
