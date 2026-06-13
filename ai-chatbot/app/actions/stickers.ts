'use server'

import { db } from '@/lib/db'
import { stickerEntry } from '@/lib/db/schema'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { allStickerCodes } from '@/lib/catalog'
import { toEntryMap, type EntryMap } from '@/lib/stats'
import { getUserId } from './profile'

const VALID_CODES = new Set(allStickerCodes())

export async function getMyEntries(): Promise<EntryMap> {
  const userId = await getUserId()
  const rows = await db
    .select({ stickerCode: stickerEntry.stickerCode, count: stickerEntry.count })
    .from(stickerEntry)
    .where(eq(stickerEntry.userId, userId))
  return toEntryMap(rows)
}

// Upsert a single sticker's count. count is clamped to >= 0.
export async function setStickerCount(stickerCode: string, count: number) {
  const userId = await getUserId()
  if (!VALID_CODES.has(stickerCode)) throw new Error('Figurinha inválida')
  const safe = Math.max(0, Math.min(99, Math.floor(count)))

  await db
    .insert(stickerEntry)
    .values({ userId, stickerCode, count: safe })
    .onConflictDoUpdate({
      target: [stickerEntry.userId, stickerEntry.stickerCode],
      set: { count: safe, updatedAt: new Date() },
    })

  revalidatePath('/album')
  revalidatePath('/dashboard')
  revalidatePath('/repetidas')
  return safe
}

// Adjust a sticker's count by a delta (e.g. +1 / -1 buttons).
export async function adjustStickerCount(stickerCode: string, delta: number) {
  const userId = await getUserId()
  if (!VALID_CODES.has(stickerCode)) throw new Error('Figurinha inválida')

  const existing = await db
    .select({ count: stickerEntry.count })
    .from(stickerEntry)
    .where(and(eq(stickerEntry.userId, userId), eq(stickerEntry.stickerCode, stickerCode)))
    .limit(1)

  const current = existing[0]?.count ?? 0
  const next = Math.max(0, Math.min(99, current + delta))

  await db
    .insert(stickerEntry)
    .values({ userId, stickerCode, count: next })
    .onConflictDoUpdate({
      target: [stickerEntry.userId, stickerEntry.stickerCode],
      set: { count: next, updatedAt: new Date() },
    })

  revalidatePath('/album')
  revalidatePath('/dashboard')
  revalidatePath('/repetidas')
  return next
}

// Bulk set many codes at once (used by "marcar time inteiro").
export async function setManyCounts(updates: { stickerCode: string; count: number }[]) {
  const userId = await getUserId()
  const valid = updates.filter((u) => VALID_CODES.has(u.stickerCode))
  for (const u of valid) {
    const safe = Math.max(0, Math.min(99, Math.floor(u.count)))
    await db
      .insert(stickerEntry)
      .values({ userId, stickerCode: u.stickerCode, count: safe })
      .onConflictDoUpdate({
        target: [stickerEntry.userId, stickerEntry.stickerCode],
        set: { count: safe, updatedAt: new Date() },
      })
  }
  revalidatePath('/album')
  revalidatePath('/dashboard')
  revalidatePath('/repetidas')
}
