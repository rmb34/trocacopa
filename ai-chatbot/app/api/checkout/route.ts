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
