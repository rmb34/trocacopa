import { pgTable, text, timestamp, boolean, integer, serial } from 'drizzle-orm/pg-core'

// --- Better Auth required tables -------------------------------------------
// Column names are camelCase to match Better Auth's defaults. Do not rename.

export const user = pgTable('user', {
  id: text('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('emailVerified').notNull().default(false),
  image: text('image'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const session = pgTable('session', {
  id: text('id').primaryKey(),
  expiresAt: timestamp('expiresAt').notNull(),
  token: text('token').notNull().unique(),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
  ipAddress: text('ipAddress'),
  userAgent: text('userAgent'),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
})

export const account = pgTable('account', {
  id: text('id').primaryKey(),
  accountId: text('accountId').notNull(),
  providerId: text('providerId').notNull(),
  userId: text('userId')
    .notNull()
    .references(() => user.id, { onDelete: 'cascade' }),
  accessToken: text('accessToken'),
  refreshToken: text('refreshToken'),
  idToken: text('idToken'),
  accessTokenExpiresAt: timestamp('accessTokenExpiresAt'),
  refreshTokenExpiresAt: timestamp('refreshTokenExpiresAt'),
  scope: text('scope'),
  password: text('password'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

export const verification = pgTable('verification', {
  id: text('id').primaryKey(),
  identifier: text('identifier').notNull(),
  value: text('value').notNull(),
  expiresAt: timestamp('expiresAt').notNull(),
  createdAt: timestamp('createdAt').defaultNow(),
  updatedAt: timestamp('updatedAt').defaultNow(),
})

// --- App tables ------------------------------------------------------------

// Public collector profile. One per user. `slug` powers the public page /u/[slug].
export const profile = pgTable('profile', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull().unique(),
  displayName: text('displayName').notNull(),
  slug: text('slug').notNull().unique(),
  city: text('city'),
  whatsapp: text('whatsapp'),
  isPublic: boolean('isPublic').notNull().default(true),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// One row per sticker the user owns at least once (or has touched).
// `count` = total copies owned. 0 = missing, 1 = owned, >1 = owned + repeats.
// `stickerCode` is the catalog code, e.g. "BRA-1".
export const stickerEntry = pgTable('sticker_entry', {
  id: serial('id').primaryKey(),
  userId: text('userId').notNull(),
  stickerCode: text('stickerCode').notNull(),
  count: integer('count').notNull().default(0),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
  updatedAt: timestamp('updatedAt').notNull().defaultNow(),
})

// One purchase record per user (unique userId). Tracks Stripe checkout status.
export const purchase = pgTable('purchase', {
  id: serial('id').primaryKey(),
  userId: text('userId')
    .notNull()
    .unique()
    .references(() => user.id, { onDelete: 'cascade' }),
  status: text('status').notNull().default('pending'),
  stripeSessionId: text('stripeSessionId'),
  paidAt: timestamp('paidAt'),
  createdAt: timestamp('createdAt').notNull().defaultNow(),
})
