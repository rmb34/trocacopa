'use server'

import { auth } from '@/lib/auth'
import { db } from '@/lib/db'
import { profile } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'

export async function getUserId() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) throw new Error('Unauthorized')
  return session.user.id
}

export async function getSessionUser() {
  const session = await auth.api.getSession({ headers: await headers() })
  return session?.user ?? null
}

function slugify(input: string) {
  return input
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 32)
}

// Returns the current user's profile, creating a default one if missing.
export async function getOrCreateProfile() {
  const user = await getSessionUser()
  if (!user) return null

  const existing = await db
    .select()
    .from(profile)
    .where(eq(profile.userId, user.id))
    .limit(1)

  if (existing.length > 0) return existing[0]

  // Generate a unique slug from the user's name/email.
  const base = slugify(user.name || user.email.split('@')[0] || 'colecionador') || 'colecionador'
  let slug = base
  let suffix = 1
  // Ensure uniqueness.
  while (
    (await db.select({ id: profile.id }).from(profile).where(eq(profile.slug, slug)).limit(1))
      .length > 0
  ) {
    suffix += 1
    slug = `${base}-${suffix}`
  }

  const inserted = await db
    .insert(profile)
    .values({
      userId: user.id,
      displayName: user.name || 'Colecionador',
      slug,
    })
    .returning()

  return inserted[0]
}

export async function updateProfile(input: {
  displayName: string
  city: string
  whatsapp: string
  isPublic: boolean
}) {
  const userId = await getUserId()
  await db
    .update(profile)
    .set({
      displayName: input.displayName.trim().slice(0, 60) || 'Colecionador',
      city: input.city.trim().slice(0, 80) || null,
      whatsapp: input.whatsapp.replace(/\D/g, '').slice(0, 15) || null,
      isPublic: input.isPublic,
      updatedAt: new Date(),
    })
    .where(eq(profile.userId, userId))

  revalidatePath('/perfil')
  revalidatePath('/dashboard')
}

export async function getProfileBySlug(slug: string) {
  const rows = await db.select().from(profile).where(eq(profile.slug, slug)).limit(1)
  return rows[0] ?? null
}
