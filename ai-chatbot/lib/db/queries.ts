// Server-only read queries. NOT a 'use server' module — these functions are
// imported by server components only and must never be exposed as callable
// RPC endpoints (which 'use server' would do). Keeping reads here prevents
// IDOR: a client cannot invoke them with an arbitrary userId/slug.
import { db } from '@/lib/db'
import { profile, stickerEntry } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { toEntryMap, type EntryMap } from '@/lib/stats'

export async function getProfileBySlug(slug: string) {
  // Explicit select — `whatsapp` only leaves the server when the owner
  // explicitly opted in via `showWhatsapp`.
  const rows = await db
    .select({
      userId: profile.userId,
      displayName: profile.displayName,
      slug: profile.slug,
      city: profile.city,
      isPublic: profile.isPublic,
      whatsapp: profile.whatsapp,
      showWhatsapp: profile.showWhatsapp,
    })
    .from(profile)
    .where(eq(profile.slug, slug))
    .limit(1)
  const row = rows[0]
  if (!row) return null
  return { ...row, whatsapp: row.showWhatsapp ? row.whatsapp : null }
}

export async function getEntriesByUserId(userId: string): Promise<EntryMap> {
  const rows = await db
    .select({ stickerCode: stickerEntry.stickerCode, count: stickerEntry.count })
    .from(stickerEntry)
    .where(eq(stickerEntry.userId, userId))
  return toEntryMap(rows)
}
