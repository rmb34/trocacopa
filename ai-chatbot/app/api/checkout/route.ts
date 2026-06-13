import { auth } from '@/lib/auth'
import { headers } from 'next/headers'
import { db } from '@/lib/db'
import { purchase } from '@/lib/db/schema'
import { eq } from 'drizzle-orm'

export async function POST() {
  try {
    const key = process.env.STRIPE_SECRET_KEY
    if (!key) {
      return Response.json({ error: 'Stripe não configurado.' }, { status: 500 })
    }

    const session = await auth.api.getSession({ headers: await headers() })
    if (!session?.user) {
      return Response.json({ error: 'Não autenticado.' }, { status: 401 })
    }

    const existing = await db
      .select({ status: purchase.status })
      .from(purchase)
      .where(eq(purchase.userId, session.user.id))
      .limit(1)

    if (existing[0]?.status === 'paid') {
      return Response.json({ url: '/dashboard' })
    }

    const baseUrl = (process.env.BETTER_AUTH_URL ?? 'http://localhost:3000').trim()
    const priceCents = String(parseInt((process.env.PRICE_CENTS ?? '1099').trim(), 10))

    // Direct Stripe API call — bypasses SDK compatibility issues
    const body = new URLSearchParams({
      mode: 'payment',
      'payment_method_types[]': 'card',
      'line_items[0][price_data][currency]': 'brl',
      'line_items[0][price_data][product_data][name]': 'TrocaCopa — Acesso Completo',
      'line_items[0][price_data][product_data][description]': 'Álbum digital da Copa 2026. Pagamento único.',
      'line_items[0][price_data][unit_amount]': priceCents,
      'line_items[0][quantity]': '1',
      'metadata[userId]': session.user.id,
      success_url: `${baseUrl}/dashboard?pagamento=sucesso`,
      cancel_url: `${baseUrl}/comprar`,
    })

    const stripeRes = await fetch('https://api.stripe.com/v1/checkout/sessions', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: body.toString(),
    })

    const data = await stripeRes.json()

    if (!stripeRes.ok) {
      console.error('[checkout] Stripe error:', JSON.stringify(data))
      return Response.json({ error: data?.error?.message ?? 'Erro no pagamento.' }, { status: 500 })
    }

    return Response.json({ url: data.url })
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : String(err)
    console.error('[checkout] error:', msg)
    return Response.json({ error: msg }, { status: 500 })
  }
}
