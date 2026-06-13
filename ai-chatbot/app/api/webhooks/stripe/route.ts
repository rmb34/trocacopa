import Stripe from 'stripe'
import { db } from '@/lib/db'
import { purchase } from '@/lib/db/schema'

export async function POST(request: Request) {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!)
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
