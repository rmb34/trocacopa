# TrocaCopa MVP Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Atualizar catálogo Copa 2026, construir 4 páginas faltando, adicionar PWA, payment gate (Stripe, compra única) e mobile-first com bottom nav — finalizar com deploy no Vercel.

**Architecture:** Backend (server actions, stats, auth) já existe. O trabalho é: (1) novo catálogo estático, (2) schema de purchase no banco, (3) PWA via next-pwa, (4) Stripe Checkout para compra única, (5) gate na `(app)/layout.tsx`, (6) 4 páginas novas + ShareButton + ProfileForm, (7) bottom nav mobile no AppHeader, (8) deploy.

**Tech Stack:** Next.js 15, React 19, TypeScript, Drizzle ORM + drizzle-kit, PostgreSQL (Neon), better-auth, shadcn/ui, Stripe, @ducanh2912/next-pwa, Vercel

**Working directory:** `/home/lucas/Documents/trocaCopa/ai-chatbot`

---

## File Map

| File | Action |
|------|--------|
| `lib/catalog.ts` | Rewrite — 48 times + FWC + CC |
| `lib/db/schema.ts` | Add `purchase` table |
| `drizzle.config.ts` | Create — drizzle-kit config |
| `next.config.mjs` | Wrap com PWA |
| `public/manifest.json` | Create |
| `public/icon-192.png` | Generate |
| `public/icon-512.png` | Generate |
| `app/layout.tsx` | Manifest + theme-color meta |
| `app/(app)/layout.tsx` | Purchase gate + bottom nav padding |
| `app/comprar/page.tsx` | Payment page (client) |
| `app/api/checkout/route.ts` | Cria Stripe session |
| `app/api/webhooks/stripe/route.ts` | Marca purchase como pago |
| `app/actions/purchase.ts` | `getPurchaseStatus` server action |
| `components/app-header.tsx` | Bottom nav mobile |
| `components/share-button.tsx` | Client, reutilizável |
| `app/(app)/repetidas/page.tsx` | Create |
| `app/(app)/trocas/page.tsx` | Create |
| `app/u/[slug]/page.tsx` | Create (fora do app layout) |
| `app/(app)/perfil/page.tsx` | Create |
| `components/profile-form.tsx` | Client form |

---

## Task 1: Catálogo Copa 2026

**Files:** Modify `lib/catalog.ts`

- [ ] **Step 1: Substituir lib/catalog.ts**

```typescript
// lib/catalog.ts
export type Team = {
  code: string
  name: string
  group: string
  flag: string
  stickerCount: number
}

export const STICKERS_PER_TEAM = 20

export const TEAMS: Team[] = [
  // Especial — Página inicial
  { code: 'FWC', name: 'FIFA World Cup History', group: 'Especial', flag: '🏆', stickerCount: 19 },
  { code: 'CC',  name: 'Coca-Cola',              group: 'Especial', flag: '🥤', stickerCount: 14 },
  // Group A
  { code: 'MEX', name: 'México',          group: 'A', flag: '🇲🇽', stickerCount: STICKERS_PER_TEAM },
  { code: 'RSA', name: 'África do Sul',   group: 'A', flag: '🇿🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'KOR', name: 'Coreia do Sul',   group: 'A', flag: '🇰🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'CZE', name: 'Rep. Tcheca',     group: 'A', flag: '🇨🇿', stickerCount: STICKERS_PER_TEAM },
  // Group B
  { code: 'CAN', name: 'Canadá',          group: 'B', flag: '🇨🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'BIH', name: 'Bósnia',          group: 'B', flag: '🇧🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'QAT', name: 'Catar',           group: 'B', flag: '🇶🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'SUI', name: 'Suíça',           group: 'B', flag: '🇨🇭', stickerCount: STICKERS_PER_TEAM },
  // Group C
  { code: 'BRA', name: 'Brasil',          group: 'C', flag: '🇧🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'MAR', name: 'Marrocos',        group: 'C', flag: '🇲🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'HAI', name: 'Haiti',           group: 'C', flag: '🇭🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'SCO', name: 'Escócia',         group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stickerCount: STICKERS_PER_TEAM },
  // Group D
  { code: 'USA', name: 'Estados Unidos',  group: 'D', flag: '🇺🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'PAR', name: 'Paraguai',        group: 'D', flag: '🇵🇾', stickerCount: STICKERS_PER_TEAM },
  { code: 'AUS', name: 'Austrália',       group: 'D', flag: '🇦🇺', stickerCount: STICKERS_PER_TEAM },
  { code: 'TUR', name: 'Turquia',         group: 'D', flag: '🇹🇷', stickerCount: STICKERS_PER_TEAM },
  // Group E
  { code: 'GER', name: 'Alemanha',        group: 'E', flag: '🇩🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'CUW', name: 'Curaçao',         group: 'E', flag: '🇨🇼', stickerCount: STICKERS_PER_TEAM },
  { code: 'CIV', name: 'Costa do Marfim', group: 'E', flag: '🇨🇮', stickerCount: STICKERS_PER_TEAM },
  { code: 'ECU', name: 'Equador',         group: 'E', flag: '🇪🇨', stickerCount: STICKERS_PER_TEAM },
  // Group F
  { code: 'NED', name: 'Holanda',         group: 'F', flag: '🇳🇱', stickerCount: STICKERS_PER_TEAM },
  { code: 'JPN', name: 'Japão',           group: 'F', flag: '🇯🇵', stickerCount: STICKERS_PER_TEAM },
  { code: 'SWE', name: 'Suécia',          group: 'F', flag: '🇸🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'TUN', name: 'Tunísia',         group: 'F', flag: '🇹🇳', stickerCount: STICKERS_PER_TEAM },
  // Group G
  { code: 'BEL', name: 'Bélgica',         group: 'G', flag: '🇧🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'EGY', name: 'Egito',           group: 'G', flag: '🇪🇬', stickerCount: STICKERS_PER_TEAM },
  { code: 'IRN', name: 'Irã',             group: 'G', flag: '🇮🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'NZL', name: 'Nova Zelândia',   group: 'G', flag: '🇳🇿', stickerCount: STICKERS_PER_TEAM },
  // Group H
  { code: 'ESP', name: 'Espanha',         group: 'H', flag: '🇪🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'CPV', name: 'Cabo Verde',      group: 'H', flag: '🇨🇻', stickerCount: STICKERS_PER_TEAM },
  { code: 'KSA', name: 'Arábia Saudita',  group: 'H', flag: '🇸🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'URU', name: 'Uruguai',         group: 'H', flag: '🇺🇾', stickerCount: STICKERS_PER_TEAM },
  // Group I
  { code: 'FRA', name: 'França',          group: 'I', flag: '🇫🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'SEN', name: 'Senegal',         group: 'I', flag: '🇸🇳', stickerCount: STICKERS_PER_TEAM },
  { code: 'IRQ', name: 'Iraque',          group: 'I', flag: '🇮🇶', stickerCount: STICKERS_PER_TEAM },
  { code: 'NOR', name: 'Noruega',         group: 'I', flag: '🇳🇴', stickerCount: STICKERS_PER_TEAM },
  // Group J
  { code: 'ARG', name: 'Argentina',       group: 'J', flag: '🇦🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'ALG', name: 'Argélia',         group: 'J', flag: '🇩🇿', stickerCount: STICKERS_PER_TEAM },
  { code: 'AUT', name: 'Áustria',         group: 'J', flag: '🇦🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'JOR', name: 'Jordânia',        group: 'J', flag: '🇯🇴', stickerCount: STICKERS_PER_TEAM },
  // Group K
  { code: 'POR', name: 'Portugal',        group: 'K', flag: '🇵🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'COD', name: 'Congo',           group: 'K', flag: '🇨🇩', stickerCount: STICKERS_PER_TEAM },
  { code: 'UZB', name: 'Uzbequistão',     group: 'K', flag: '🇺🇿', stickerCount: STICKERS_PER_TEAM },
  { code: 'COL', name: 'Colômbia',        group: 'K', flag: '🇨🇴', stickerCount: STICKERS_PER_TEAM },
  // Group L
  { code: 'ENG', name: 'Inglaterra',      group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stickerCount: STICKERS_PER_TEAM },
  { code: 'CRO', name: 'Croácia',         group: 'L', flag: '🇭🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'GHA', name: 'Gana',            group: 'L', flag: '🇬🇭', stickerCount: STICKERS_PER_TEAM },
  { code: 'PAN', name: 'Panamá',          group: 'L', flag: '🇵🇦', stickerCount: STICKERS_PER_TEAM },
]

export const TOTAL_STICKERS = TEAMS.reduce((sum, t) => sum + t.stickerCount, 0)
// 19 + 14 + 48×20 = 993

export const GROUPS = Array.from(new Set(TEAMS.map((t) => t.group))).sort((a, b) => {
  if (a === 'Especial') return 1
  if (b === 'Especial') return -1
  return a.localeCompare(b)
})
// ['A','B','C','D','E','F','G','H','I','J','K','L','Especial']

export function stickerCode(teamCode: string, n: number) {
  return `${teamCode}-${n}`
}

export function parseStickerCode(code: string): { teamCode: string; n: number } | null {
  const idx = code.lastIndexOf('-')
  if (idx === -1) return null
  const teamCode = code.slice(0, idx)
  const n = Number(code.slice(idx + 1))
  if (!teamCode || Number.isNaN(n)) return null
  return { teamCode, n }
}

export function teamByCode(code: string): Team | undefined {
  return TEAMS.find((t) => t.code === code)
}

export function allStickerCodes(): string[] {
  const codes: string[] = []
  for (const team of TEAMS) {
    for (let n = 1; n <= team.stickerCount; n++) {
      codes.push(stickerCode(team.code, n))
    }
  }
  return codes
}

export function stickerLabel(code: string) {
  const parsed = parseStickerCode(code)
  if (!parsed) return code
  return `${parsed.teamCode} ${parsed.n}`
}
```

- [ ] **Step 2: Commit**

```bash
git add lib/catalog.ts && git commit -m "feat(catalog): atualizar para Copa 2026 — 48 seleções + FWC + CC"
```

---

## Task 2: DB — Tabela purchase + drizzle-kit

**Files:** Modify `lib/db/schema.ts`, Create `drizzle.config.ts`

- [ ] **Step 1: Instalar drizzle-kit**

```bash
pnpm add -D drizzle-kit
```

- [ ] **Step 2: Criar drizzle.config.ts**

```typescript
// drizzle.config.ts
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema: './lib/db/schema.ts',
  out: './drizzle',
  dialect: 'postgresql',
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
})
```

- [ ] **Step 3: Adicionar tabela purchase em lib/db/schema.ts**

Adicionar ao final do arquivo (após a tabela `stickerEntry`):

```typescript
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
```

- [ ] **Step 4: Criar .env.local com DATABASE_URL**

O arquivo `.env.local` deve conter a mesma `DATABASE_URL` que está configurada no Vercel. Buscar no painel Vercel → Settings → Environment Variables.

```bash
# .env.local (não commitar — já está no .gitignore)
DATABASE_URL=postgresql://...
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:3000
```

- [ ] **Step 5: Aplicar migration**

```bash
pnpm drizzle-kit push
```

Esperado: `[✓] Changes applied` com a tabela `purchase` criada.

- [ ] **Step 6: Commit**

```bash
git add lib/db/schema.ts drizzle.config.ts && git commit -m "feat(db): adicionar tabela purchase para compra única"
```

---

## Task 3: PWA

**Files:** Modify `next.config.mjs`, `app/layout.tsx`. Create `public/manifest.json`, icons.

- [ ] **Step 1: Instalar next-pwa**

```bash
pnpm add @ducanh2912/next-pwa
```

- [ ] **Step 2: Gerar ícones PWA a partir do SVG existente**

```bash
# Requer imagemagick instalado (sudo apt install imagemagick)
convert -background none /home/lucas/Documents/trocaCopa/ai-chatbot/public/icon.svg \
  -resize 192x192 /home/lucas/Documents/trocaCopa/ai-chatbot/public/icon-192.png

convert -background none /home/lucas/Documents/trocaCopa/ai-chatbot/public/icon.svg \
  -resize 512x512 /home/lucas/Documents/trocaCopa/ai-chatbot/public/icon-512.png
```

Se ImageMagick não estiver disponível:
```bash
sudo apt-get install -y imagemagick
```

- [ ] **Step 3: Criar public/manifest.json**

```json
{
  "name": "TrocaCopa",
  "short_name": "TrocaCopa",
  "description": "Organize suas figurinhas da Copa do Mundo 2026",
  "start_url": "/dashboard",
  "display": "standalone",
  "orientation": "portrait",
  "background_color": "#ffffff",
  "theme_color": "#16a34a",
  "icons": [
    {
      "src": "/icon-192.png",
      "sizes": "192x192",
      "type": "image/png",
      "purpose": "any maskable"
    },
    {
      "src": "/icon-512.png",
      "sizes": "512x512",
      "type": "image/png",
      "purpose": "any maskable"
    }
  ]
}
```

- [ ] **Step 4: Atualizar next.config.mjs**

```javascript
// next.config.mjs
import withPWA from '@ducanh2912/next-pwa'

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
}

export default withPWA({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  cacheOnFrontEndNav: true,
})(nextConfig)
```

- [ ] **Step 5: Adicionar meta tags em app/layout.tsx**

Localizar o `<head>` em `app/layout.tsx` e adicionar:

```tsx
<link rel="manifest" href="/manifest.json" />
<meta name="theme-color" content="#16a34a" />
<meta name="apple-mobile-web-app-capable" content="yes" />
<meta name="apple-mobile-web-app-status-bar-style" content="default" />
<link rel="apple-touch-icon" href="/icon-192.png" />
```

- [ ] **Step 6: Adicionar sw.js ao .gitignore (gerado automaticamente)**

```bash
echo "public/sw.js\npublic/workbox-*.js\npublic/sw.js.map" >> .gitignore
```

- [ ] **Step 7: Commit**

```bash
git add next.config.mjs public/manifest.json public/icon-192.png public/icon-512.png app/layout.tsx .gitignore && git commit -m "feat: adicionar suporte a PWA com manifest e service worker"
```

---

## Task 4: Payment — Server Action + API Routes + /comprar Page

**Files:** Create `app/actions/purchase.ts`, `app/api/checkout/route.ts`, `app/api/webhooks/stripe/route.ts`, `app/comprar/page.tsx`

- [ ] **Step 1: Instalar Stripe**

```bash
pnpm add stripe
```

- [ ] **Step 2: Criar app/actions/purchase.ts**

```typescript
// app/actions/purchase.ts
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
```

- [ ] **Step 3: Criar app/api/checkout/route.ts**

```typescript
// app/api/checkout/route.ts
import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { purchase } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (!session?.user) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const existing = await db
    .select({ status: purchase.status })
    .from(purchase)
    .where(eq(purchase.userId, session.user.id))
    .limit(1)

  if (existing[0]?.status === 'paid') {
    return Response.json({ url: '/dashboard' })
  }

  const baseUrl = process.env.BETTER_AUTH_URL ?? 'http://localhost:3000'

  const checkoutSession = await stripe.checkout.sessions.create({
    mode: 'payment',
    payment_method_types: ['card', 'pix'],
    line_items: [
      {
        price_data: {
          currency: 'brl',
          product_data: {
            name: 'TrocaCopa — Acesso Completo',
            description: 'Controle seu álbum da Copa 2026. Pagamento único, sem assinatura.',
          },
          unit_amount: Number(process.env.PRICE_CENTS ?? 1990),
        },
        quantity: 1,
      },
    ],
    metadata: { userId: session.user.id },
    success_url: `${baseUrl}/dashboard?pagamento=sucesso`,
    cancel_url: `${baseUrl}/comprar`,
  })

  return Response.json({ url: checkoutSession.url })
}
```

- [ ] **Step 4: Criar app/api/webhooks/stripe/route.ts**

```typescript
// app/api/webhooks/stripe/route.ts
import Stripe from 'stripe'
import { db } from '@/lib/db'
import { purchase } from '@/lib/db/schema'

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)

export async function POST(request: Request) {
  const body = await request.text()
  const sig = request.headers.get('stripe-signature')

  if (!sig) {
    return Response.json({ error: 'Missing signature' }, { status: 400 })
  }

  let event: Stripe.Event
  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET!)
  } catch {
    return Response.json({ error: 'Invalid signature' }, { status: 400 })
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session
    const userId = session.metadata?.userId

    if (userId && session.payment_status === 'paid') {
      await db
        .insert(purchase)
        .values({
          userId,
          status: 'paid',
          stripeSessionId: session.id,
          paidAt: new Date(),
        })
        .onConflictDoUpdate({
          target: [purchase.userId],
          set: {
            status: 'paid',
            stripeSessionId: session.id,
            paidAt: new Date(),
          },
        })
    }
  }

  return Response.json({ received: true })
}
```

- [ ] **Step 5: Criar pasta e página /comprar**

```bash
mkdir -p /home/lucas/Documents/trocaCopa/ai-chatbot/app/comprar
```

```tsx
// app/comprar/page.tsx
'use client'

import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, ArrowRight, Loader2 } from 'lucide-react'

const FEATURES = [
  'Álbum digital completo — 993 figurinhas',
  'Controle de repetidas por seleção',
  'Match automático de trocas com WhatsApp',
  'Perfil público compartilhável',
  'Funciona offline — instale no celular (PWA)',
  'Acesso vitalício, sem assinatura',
]

export default function ComprarPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Erro ao iniciar pagamento. Tente novamente.')
        setLoading(false)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Logo />

      <div className="mt-8 w-full max-w-sm">
        <Card>
          <CardContent className="flex flex-col gap-6 p-6">
            {/* Price */}
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Acesso completo</p>
              <p className="mt-1 font-heading text-5xl font-black text-foreground">
                R$&nbsp;19<span className="text-3xl">,90</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pagamento único · Sem mensalidade
              </p>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              size="lg"
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Aguarde…
                </>
              ) : (
                <>
                  Comprar agora
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Pagamento seguro via Stripe · Pix ou cartão
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
```

- [ ] **Step 6: Adicionar env vars ao Vercel**

No Vercel Dashboard → Settings → Environment Variables (ou via Vercel MCP), adicionar:
```
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_... (obtido ao cadastrar o endpoint no Stripe Dashboard)
PRICE_CENTS=1990
```

Em `.env.local` para desenvolvimento:
```
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_... (usar Stripe CLI para testar localmente)
PRICE_CENTS=1990
```

- [ ] **Step 7: Commit**

```bash
git add app/actions/purchase.ts app/api/ app/comprar/ && git commit -m "feat: adicionar compra única via Stripe (Pix + cartão)"
```

---

## Task 5: Payment Gate no App Layout

**Files:** Modify `app/(app)/layout.tsx`

- [ ] **Step 1: Atualizar app/(app)/layout.tsx com gate de pagamento**

```tsx
// app/(app)/layout.tsx
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getPurchaseStatus } from '@/app/actions/purchase'
import { AppHeader } from '@/components/app-header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const status = await getPurchaseStatus(profile.userId)
  if (status !== 'paid') redirect('/comprar')

  return (
    <div className="min-h-svh bg-secondary/30">
      <AppHeader displayName={profile.displayName} slug={profile.slug} />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:py-8 md:pb-8">
        {children}
      </main>
    </div>
  )
}
```

**Nota:** `pb-24` no main dá espaço para o bottom nav mobile que será adicionado no AppHeader (Task 6). `md:pb-8` reverte no desktop onde o bottom nav não aparece.

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/layout.tsx && git commit -m "feat: adicionar gate de pagamento no layout autenticado"
```

---

## Task 6: Mobile Bottom Nav

**Files:** Modify `components/app-header.tsx`

- [ ] **Step 1: Adicionar bottom nav mobile ao AppHeader**

Substituir o conteúdo de `components/app-header.tsx`:

```tsx
// components/app-header.tsx
'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  BookOpen,
  Copy,
  ArrowLeftRight,
  User,
  LogOut,
} from 'lucide-react'

const NAV = [
  { href: '/dashboard', label: 'Painel',    icon: LayoutDashboard },
  { href: '/album',     label: 'Álbum',     icon: BookOpen },
  { href: '/repetidas', label: 'Repetidas', icon: Copy },
  { href: '/trocas',    label: 'Trocas',    icon: ArrowLeftRight },
]

export function AppHeader({
  displayName,
  slug,
}: {
  displayName: string
  slug: string
}) {
  const pathname = usePathname()
  const router = useRouter()

  const initials = displayName
    .split(' ')
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase()

  async function signOut() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <>
      {/* Top header — desktop only */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-4">
          <div className="flex items-center gap-8">
            <Link href="/dashboard" aria-label="TrocaCopa">
              <Logo />
            </Link>
            {/* Desktop nav */}
            <nav className="hidden items-center gap-1 md:flex">
              {NAV.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-colors',
                    isActive(item.href)
                      ? 'bg-secondary text-primary'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground',
                  )}
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* User menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="gap-2 px-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                    {initials || 'TC'}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden max-w-[8rem] truncate text-sm font-medium sm:inline">
                  {displayName}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel className="truncate">{displayName}</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem asChild>
                <Link href="/perfil">
                  <User className="mr-2 h-4 w-4" />
                  Meu perfil
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link href={`/u/${slug}`}>
                  <BookOpen className="mr-2 h-4 w-4" />
                  Ver perfil público
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={signOut}
                className="text-destructive focus:text-destructive"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      {/* Bottom nav — mobile only */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 border-t border-border bg-background/95 backdrop-blur md:hidden">
        <div className="flex items-center justify-around px-2 py-1 safe-area-inset-bottom">
          {NAV.map((item) => {
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex min-h-[44px] min-w-[44px] flex-col items-center justify-center gap-0.5 rounded-lg px-3 py-1 transition-colors',
                  active ? 'text-primary' : 'text-muted-foreground',
                )}
              >
                <item.icon className={cn('h-5 w-5', active && 'text-primary')} />
                <span className="text-[10px] font-medium leading-none">{item.label}</span>
              </Link>
            )
          })}
        </div>
      </nav>
    </>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/app-header.tsx && git commit -m "feat: adicionar bottom nav mobile e remover hamburger menu"
```

---

## Task 7: ShareButton reutilizável

**Files:** Create `components/share-button.tsx`

- [ ] **Step 1: Criar components/share-button.tsx**

`text` é string serializável — pode ser passada de server components diretamente.

```tsx
// components/share-button.tsx
'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

type Props = {
  text: string
  label?: string
  labelCopied?: string
  variant?: 'default' | 'outline' | 'secondary'
}

export function ShareButton({
  text,
  label = 'Compartilhar',
  labelCopied = 'Copiado!',
  variant = 'outline',
}: Props) {
  const [copied, setCopied] = useState(false)

  function handleClick() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant={variant} onClick={handleClick} className="gap-2">
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {copied ? labelCopied : label}
    </Button>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add components/share-button.tsx && git commit -m "feat: ShareButton client component reutilizável"
```

---

## Task 8: Página /repetidas

**Files:** Create `app/(app)/repetidas/page.tsx`

**Mobile-first:** Cards empilhados em coluna, badges de contagem visíveis em telas pequenas.

- [ ] **Step 1: Criar app/(app)/repetidas/page.tsx**

```tsx
// app/(app)/repetidas/page.tsx
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries } from '@/app/actions/stickers'
import { TEAMS } from '@/lib/catalog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ShareButton } from '@/components/share-button'

export default async function ReptidasPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const entries = await getMyEntries()

  const teamDuplicates = TEAMS.map((team) => {
    const extras: { n: number; extra: number }[] = []
    for (let n = 1; n <= team.stickerCount; n++) {
      const count = entries[`${team.code}-${n}`] ?? 0
      if (count > 1) extras.push({ n, extra: count - 1 })
    }
    return { team, extras }
  }).filter((t) => t.extras.length > 0)

  const totalCodes = teamDuplicates.reduce((s, t) => s + t.extras.length, 0)
  const totalCopies = teamDuplicates.reduce(
    (s, t) => s + t.extras.reduce((a, e) => a + e.extra, 0),
    0,
  )

  const shareText = [
    'Tenho para troca (TrocaCopa):',
    ...teamDuplicates.map(({ team, extras }) => {
      const codes = extras.map((e) => `${e.n}(×${e.extra + 1})`).join(', ')
      return `${team.flag} ${team.name}: ${codes}`
    }),
  ].join('\n')

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
            Minhas repetidas
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalCodes} figurinha{totalCodes !== 1 ? 's' : ''} repetidas ·{' '}
            {totalCopies} cópia{totalCopies !== 1 ? 's' : ''} extra
          </p>
        </div>
        {teamDuplicates.length > 0 && (
          <ShareButton text={shareText} label="Compartilhar lista" />
        )}
      </div>

      {teamDuplicates.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center text-muted-foreground">
            Nenhuma figurinha repetida ainda. Continue colando!
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {teamDuplicates.map(({ team, extras }) => (
            <Card key={team.code}>
              <CardHeader className="pb-2 pt-4">
                <CardTitle className="flex items-center gap-2 text-sm font-semibold">
                  <span aria-hidden>{team.flag}</span>
                  {team.name}
                  <Badge variant="secondary" className="ml-auto">
                    {extras.length}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-4">
                <div className="flex flex-wrap gap-2">
                  {extras.map(({ n, extra }) => (
                    <div
                      key={n}
                      className="relative flex items-center gap-1 rounded-md border border-accent bg-accent/20 px-2 py-1"
                    >
                      <span className="font-mono text-xs font-bold text-foreground">
                        {team.code}-{n}
                      </span>
                      <Badge className="h-4 bg-accent px-1 text-[10px] text-accent-foreground">
                        +{extra}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/repetidas/page.tsx && git commit -m "feat: adicionar página /repetidas"
```

---

## Task 9: Página /trocas

**Files:** Create `app/(app)/trocas/page.tsx`

**Mobile-first:** Cards em coluna, listas de stickers rolam horizontalmente em mobile.

- [ ] **Step 1: Criar app/(app)/trocas/page.tsx**

```tsx
// app/(app)/trocas/page.tsx
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries, getOtherCollectors } from '@/app/actions/stickers'
import { computeMatch } from '@/lib/stats'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight, MessageCircle, Users } from 'lucide-react'

export default async function TrocasPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const mine = await getMyEntries()
  const others = await getOtherCollectors(profile.userId)

  const matches = others
    .map((o) => ({ ...o, match: computeMatch(mine, o.entries) }))
    .filter((o) => o.match.score > 0)
    .sort((a, b) => b.match.score - a.match.score)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Encontrar trocas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Colecionadores que têm o que você precisa e precisam do que você tem.
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-muted-foreground">Nenhuma troca compatível encontrada ainda.</p>
            <p className="text-xs text-muted-foreground">
              Isso muda conforme mais colecionadores se cadastrarem e marcarem suas figurinhas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map(({ profile: other, match }) => (
            <Card key={other.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4">
                  {/* Header do colecionador */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{other.displayName}</p>
                      {other.city && (
                        <p className="text-xs text-muted-foreground">{other.city}</p>
                      )}
                    </div>
                    <Badge className="flex-shrink-0 gap-1">
                      <ArrowLeftRight className="h-3 w-3" />
                      {match.score} troca{match.score !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  {/* Stickers */}
                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-secondary/60 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Você recebe ({match.youGet.length})
                      </p>
                      <p className="font-mono text-xs leading-relaxed text-foreground">
                        {match.youGet.slice(0, 12).join(', ')}
                        {match.youGet.length > 12 && (
                          <span className="text-muted-foreground">
                            {' '}e mais {match.youGet.length - 12}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="rounded-md bg-secondary/60 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Você dá ({match.youGive.length})
                      </p>
                      <p className="font-mono text-xs leading-relaxed text-foreground">
                        {match.youGive.slice(0, 12).join(', ')}
                        {match.youGive.length > 12 && (
                          <span className="text-muted-foreground">
                            {' '}e mais {match.youGive.length - 12}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  {/* CTA */}
                  <div className="flex justify-end">
                    {other.whatsapp ? (
                      <Button asChild size="sm" className="gap-2">
                        <a
                          href={`https://wa.me/55${other.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contatar no WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Sem WhatsApp cadastrado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 2: Commit**

```bash
git add app/\(app\)/trocas/page.tsx && git commit -m "feat: adicionar página /trocas com match automático"
```

---

## Task 10: Página pública /u/[slug]

**Files:** Create `app/u/[slug]/page.tsx`

**Mobile-first:** Coluna única em mobile, duas colunas em lg.

- [ ] **Step 1: Criar pasta**

```bash
mkdir -p "/home/lucas/Documents/trocaCopa/ai-chatbot/app/u/[slug]"
```

- [ ] **Step 2: Criar app/u/[slug]/page.tsx**

```tsx
// app/u/[slug]/page.tsx
import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getProfileBySlug } from '@/app/actions/profile'
import { getEntriesByUserId } from '@/app/actions/stickers'
import { computeStats, missingCodes, duplicateCodes } from '@/lib/stats'
import { TEAMS } from '@/lib/catalog'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/logo'
import { ShareButton } from '@/components/share-button'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile || !profile.isPublic) return {}
  const entries = await getEntriesByUserId(profile.userId)
  const stats = computeStats(entries)
  return {
    title: `${profile.displayName} — TrocaCopa`,
    description: `${stats.percent}% do álbum completo · ${stats.duplicates} figurinhas para troca`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile || !profile.isPublic) notFound()

  const entries = await getEntriesByUserId(profile.userId)
  const stats = computeStats(entries)
  const missing = new Set(missingCodes(entries))
  const duplicates = new Set(duplicateCodes(entries))

  const teamsWithMissing = TEAMS.map((team) => ({
    team,
    codes: Array.from({ length: team.stickerCount }, (_, i) => i + 1).filter((n) =>
      missing.has(`${team.code}-${n}`),
    ),
  })).filter((t) => t.codes.length > 0)

  const teamsWithDuplicates = TEAMS.map((team) => ({
    team,
    codes: Array.from({ length: team.stickerCount }, (_, i) => i + 1).filter((n) =>
      duplicates.has(`${team.code}-${n}`),
    ),
  })).filter((t) => t.codes.length > 0)

  // Deriva URL dinamicamente — funciona em qualquer domínio
  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const proto = host.includes('localhost') ? 'http' : 'https'
  const publicUrl = `${proto}://${host}/u/${slug}`

  return (
    <div className="min-h-svh bg-secondary/30">
      <header className="border-b border-border bg-background px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <ShareButton
            text={publicUrl}
            label="Compartilhar"
            labelCopied="Link copiado!"
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        {/* Collector header */}
        <div className="mb-5">
          <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
            {profile.displayName}
          </h1>
          {profile.city && (
            <p className="mt-1 text-sm text-muted-foreground">{profile.city}</p>
          )}
        </div>

        {/* Progress */}
        <Card className="mb-6">
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-black text-primary">
                {stats.percent}%
              </span>
              <span className="text-sm text-muted-foreground">do álbum completo</span>
            </div>
            <Progress value={stats.percent} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {stats.owned} de {stats.total} figurinhas ·{' '}
              <span className="font-medium text-foreground">{stats.duplicates}</span> para troca
            </p>
          </CardContent>
        </Card>

        {/* Two columns */}
        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              Procuro <Badge variant="secondary">{stats.missing}</Badge>
            </h2>
            {teamsWithMissing.length === 0 ? (
              <p className="text-sm text-muted-foreground">Álbum completo!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {teamsWithMissing.map(({ team, codes }) => (
                  <Card key={team.code}>
                    <CardContent className="p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span aria-hidden className="text-base">{team.flag}</span>
                        <span className="text-sm font-medium text-foreground">{team.name}</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {codes.join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              Tenho para troca <Badge variant="secondary">{stats.duplicates}</Badge>
            </h2>
            {teamsWithDuplicates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma repetida ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {teamsWithDuplicates.map(({ team, codes }) => (
                  <Card key={team.code}>
                    <CardContent className="p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <span aria-hidden className="text-base">{team.flag}</span>
                        <span className="text-sm font-medium text-foreground">{team.name}</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {codes.join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>
      </main>
    </div>
  )
}
```

- [ ] **Step 3: Commit**

```bash
git add "app/u/" && git commit -m "feat: adicionar página pública /u/[slug]"
```

---

## Task 11: Página /perfil

**Files:** Create `app/(app)/perfil/page.tsx`, `components/profile-form.tsx`

**Mobile-first:** Form em coluna única, campos full-width, toggle bem espaçado.

- [ ] **Step 1: Criar components/profile-form.tsx**

```tsx
// components/profile-form.tsx
'use client'

import { useState, useEffect, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ShareButton } from '@/components/share-button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type ProfileData = {
  displayName: string
  city: string | null
  whatsapp: string | null
  isPublic: boolean
  slug: string
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [city, setCity] = useState(profile.city ?? '')
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? '')
  const [isPublic, setIsPublic] = useState(profile.isPublic)
  const [publicUrl, setPublicUrl] = useState(`/u/${profile.slug}`)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setPublicUrl(`${window.location.origin}/u/${profile.slug}`)
  }, [profile.slug])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateProfile({ displayName, city, whatsapp, isPublic })
        toast.success('Perfil atualizado!')
      } catch {
        toast.error('Não foi possível salvar. Tente de novo.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Meu perfil
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize como você aparece para outros colecionadores.
        </p>
      </div>

      {/* Public URL */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Seu link público</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-secondary px-3 py-2 text-xs text-muted-foreground sm:text-sm">
            {publicUrl}
          </code>
          <ShareButton
            text={publicUrl}
            label="Copiar"
            labelCopied="Copiado!"
            variant="outline"
          />
        </CardContent>
      </Card>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Nome *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={80}
                placeholder="São Paulo, SP"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                placeholder="11999999999"
                maxLength={15}
                inputMode="numeric"
              />
              <p className="text-xs text-muted-foreground">
                Só números com DDD. Outros colecionadores verão para combinar trocas.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex-1 pr-4">
                <Label htmlFor="isPublic" className="cursor-pointer font-medium">
                  Perfil público
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Quando ativo, outros colecionadores podem te encontrar para trocas
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <Button type="submit" disabled={isPending} size="lg" className="w-full gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
```

- [ ] **Step 2: Criar app/(app)/perfil/page.tsx**

```tsx
// app/(app)/perfil/page.tsx
import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { ProfileForm } from '@/components/profile-form'

export default async function PerfilPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')
  return <ProfileForm profile={profile} />
}
```

- [ ] **Step 3: Commit**

```bash
git add app/\(app\)/perfil/page.tsx components/profile-form.tsx && git commit -m "feat: adicionar página /perfil com edição de perfil"
```

---

## Task 12: Build local

- [ ] **Step 1: Instalar todas as dependências**

```bash
pnpm install
```

- [ ] **Step 2: Build de produção**

```bash
pnpm build 2>&1
```

Esperado: `✓ Compiled successfully`. Rotas esperadas na saída:
```
○ /comprar
○ /u/[slug]
● /dashboard
● /album
● /repetidas
● /trocas
● /perfil
```

Se houver erros: corrigir e commitar antes de prosseguir.

---

## Task 13: Deploy no Vercel

- [ ] **Step 1: Verificar projeto existente via Vercel MCP**

```
mcp__plugin_vercel_vercel__list_projects
```

Anotar o `projectId` do TrocaCopa.

- [ ] **Step 2: Verificar env vars no Vercel**

Via Vercel MCP ou Dashboard, confirmar que existem:
- `DATABASE_URL`
- `BETTER_AUTH_SECRET`
- `BETTER_AUTH_URL`
- `STRIPE_SECRET_KEY`
- `STRIPE_WEBHOOK_SECRET`
- `PRICE_CENTS` (ex: `1990`)

- [ ] **Step 3: Deploy**

```bash
git push origin master
```

Ou via Vercel MCP:
```
mcp__plugin_vercel_vercel__deploy_to_vercel
```

- [ ] **Step 4: Configurar webhook do Stripe (pós-deploy)**

No Stripe Dashboard → Developers → Webhooks → Add endpoint:
- URL: `https://{seu-dominio}/api/webhooks/stripe`
- Eventos: `checkout.session.completed`
- Copiar o `Signing secret` (começa com `whsec_`) → salvar como `STRIPE_WEBHOOK_SECRET` no Vercel

- [ ] **Step 5: Verificar todas as rotas**

Abrir no browser e testar:
- `/` — landing (sem auth)
- Criar conta → deve cair em `/comprar`
- Pagar → deve ir para `/dashboard`
- `/album` — grupos A–L + Especial, 20 figurinhas/seleção
- `/repetidas` — lista de repetidas
- `/trocas` — matches
- `/u/{slug}` — perfil público
- `/perfil` — edição de perfil
- Instalar PWA no celular (botão "Adicionar à tela inicial")
