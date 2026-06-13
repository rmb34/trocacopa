'use server'

import { db } from '@/lib/db'
import { purchase } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function getPurchaseStatus(userId: string): Promise<'none' | 'pending' | 'paid'> {
  const rows = await db
    .select({ status: purchase.status })
    .from(purchase)
    .where(eq(purchase.userId, userId))
    .limit(1)
  return (rows[0]?.status as 'pending' | 'paid') ?? 'none'
}
