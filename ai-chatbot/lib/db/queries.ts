// Server-only read queries. NOT a 'use server' module — these functions are
// imported by server components only and must never be exposed as callable
// RPC endpoints (which 'use server' would do). Keeping reads here prevents
// IDOR: a client cannot invoke them with an arbitrary userId/slug.
import { db } from '@/lib/db'
import { profile, stickerEntry, purchase } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { toEntryMap, type EntryMap } from '@/lib/stats'
import type { PurchaseStatus } from '@/lib/entitlements'

export async function getProfileBySlug(slug: string) {
  // Explicit select — never expose `whatsapp` on the public payload.
  const rows = await db
    .select({
      userId: profile.userId,
      displayName: profile.displayName,
      slug: profile.slug,
      city: profile.city,
      isPublic: profile.isPublic,
    })
    .from(profile)
    .where(eq(profile.slug, slug))
    .limit(1)
  return rows[0] ?? null
}

export async function getEntriesByUserId(userId: string): Promise<EntryMap> {
  const rows = await db
    .select({ stickerCode: stickerEntry.stickerCode, count: stickerEntry.count })
    .from(stickerEntry)
    .where(eq(stickerEntry.userId, userId))
  return toEntryMap(rows)
}

export async function getPurchaseStatus(userId: string): Promise<PurchaseStatus> {
  const rows = await db
    .select({ status: purchase.status })
    .from(purchase)
    .where(eq(purchase.userId, userId))
    .limit(1)
  return (rows[0]?.status as 'pending' | 'paid') ?? 'none'
}
