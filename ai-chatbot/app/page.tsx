import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { getPurchaseStatus } from '@/app/actions/purchase'
import { Logo } from '@/components/logo'
import { ProductPreview } from '@/components/landing/product-preview'
import { TOTAL_STICKERS } from '@/lib/catalog'
import { BookOpen, Copy, Users, Check, ArrowRight, Smartphone, Trophy } from 'lucide-react'

const SITE_URL = process.env.BETTER_AUTH_URL ?? 'https://ai-chatbot-beta-plum.vercel.app'
const PRICE = '10,99'

export const metadata: Metadata = {
  title: 'TrocaCopa — Álbum de figurinhas da Copa 2026 no celular',
  description:
    'Organize seu álbum de figurinhas da Copa do Mundo 2026: marque o que tem, veja o que falta, controle repetidas e compartilhe sua lista de trocas. Acesso vitalício por R$ 10,99 — pagamento único, sem mensalidade.',
  keywords: [
    'álbum figurinhas Copa 2026',
    'figurinhas Copa do Mundo 2026',
    'controlar figurinhas repetidas',
    'trocar figurinhas Copa',
    'álbum digital Copa do Mundo',
    'Panini Copa 2026',
  ],
  alternates: { canonical: '/' },
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: SITE_URL,
    siteName: 'TrocaCopa',
    title: 'TrocaCopa — Álbum de figurinhas da Copa 2026 no celular',
    description:
      'Marque o que tem, veja o que falta e controle suas repetidas. Acesso vitalício por R$ 10,99, pagamento único.',
    images: [{ url: '/icon-512.png', width: 512, height: 512, alt: 'TrocaCopa' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrocaCopa — Álbum da Copa 2026 no celular',
    description: 'Controle figurinhas, repetidas e trocas. R$ 10,99, pagamento único.',
    images: ['/icon-512.png'],
  },
  robots: { index: true, follow: true },
}

const FEATURES = [
  {
    icon: BookOpen,
    title: 'Álbum completo no celular',
    desc: `Todas as ${TOTAL_STICKERS} figurinhas da Copa 2026. Marque o que você tem, o que falta e quantas repetidas acumulou — em segundos.`,
  },
  {
    icon: Copy,
    title: 'Repetidas organizadas',
    desc: 'Veja na hora quais figurinhas sobraram, agrupadas por seleção. Compartilhe a lista direto pelo WhatsApp.',
  },
  {
    icon: Users,
    title: 'Perfil público para trocas',
    desc: 'Seu link único com faltas e repetidas. Manda pra galera e combina trocas sem planilha.',
  },
  {
    icon: Smartphone,
    title: 'Instala no celular',
    desc: 'Funciona como app nativo — instale na tela inicial do iPhone ou Android. Sem App Store, sem Play Store.',
  },
]

const INCLUDED = [
  `${TOTAL_STICKERS} figurinhas — 48 seleções × 20 + FWC + Coca-Cola`,
  'Controle de repetidas com contador por figurinha',
  'Perfil público compartilhável por link',
  'Instalável no celular (PWA)',
  'Acesso vitalício — sem mensalidade, sem renovação',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'TrocaCopa — Acesso Completo',
  description:
    'Álbum digital de figurinhas da Copa do Mundo 2026. Controle de figurinhas, repetidas e trocas. Acesso vitalício.',
  brand: { '@type': 'Brand', name: 'TrocaCopa' },
  offers: {
    '@type': 'Offer',
    price: '10.99',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    url: SITE_URL,
  },
}

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  // Paid users go straight to the app. Logged-in-but-unpaid users can still
  // view the landing (so they aren't trapped on /comprar) — with CTAs that
  // point to checkout instead of sign-up.
  let pendingCheckout = false
  if (session?.user) {
    const status = await getPurchaseStatus(session.user.id)
    if (status === 'paid') redirect('/dashboard')
    pendingCheckout = true
  }

  const primaryCtaHref = pendingCheckout ? '/comprar' : '/sign-up'
  const primaryCtaLabel = pendingCheckout ? 'Finalizar compra' : 'Criar conta e começar'

  return (
    <div className="min-h-svh bg-background">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Copa accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-primary via-info to-success" />

      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <div className="flex items-center gap-2">
          {pendingCheckout ? (
            <Link
              href="/comprar"
              className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Finalizar compra
            </Link>
          ) : (
            <>
              <Link
                href="/sign-in"
                className="px-4 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
              >
                Entrar
              </Link>
              <Link
                href="/sign-up"
                className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                Começar
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        {/* Themed glow */}
        <div
          aria-hidden
          className="pointer-events-none absolute -top-24 left-1/2 h-72 w-[42rem] -translate-x-1/2 rounded-full bg-primary/15 blur-3xl"
        />
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-16">
          {/* Copy */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Trophy className="h-4 w-4" />
              Copa do Mundo 2026
            </div>

            <h1 className="mt-5 text-balance font-heading text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Seu álbum da{' '}
              <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Copa 2026
              </span>{' '}
              no bolso
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:mx-0">
              Marque o que você tem, veja o que falta e controle suas repetidas.
              Tudo no celular, sem papel nem planilha.
            </p>

            {/* Price highlight */}
            <div className="mt-7 flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-baseline gap-1 rounded-xl bg-foreground px-4 py-2 text-background">
                <span className="text-sm font-semibold">R$</span>
                <span className="font-heading text-3xl font-black leading-none">{PRICE}</span>
              </div>
              <div className="text-left text-sm leading-tight text-muted-foreground">
                <span className="block font-semibold text-foreground">Pagamento único</span>
                acesso vitalício, sem mensalidade
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link
                href={primaryCtaHref}
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                {primaryCtaLabel}
                <ArrowRight className="h-4 w-4" />
              </Link>
              {!pendingCheckout && (
                <Link
                  href="/sign-in"
                  className="flex w-full items-center justify-center rounded-lg border border-border px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
                >
                  Já tenho conta
                </Link>
              )}
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Cartão de crédito · Acesso imediato após o pagamento
            </p>
          </div>

          {/* Product preview */}
          <div className="mx-auto w-full max-w-sm md:max-w-none">
            <ProductPreview />
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-5xl px-4 py-16">
          <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
            O que você leva por R$&nbsp;{PRICE}
          </h2>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f) => (
              <div key={f.title} className="rounded-xl border border-border bg-card p-5 shadow-sm">
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-base font-bold text-foreground">{f.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Price section */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="mx-auto max-w-sm rounded-2xl border border-border bg-card p-8 shadow-md">
          {/* accent stripe */}
          <div className="mx-auto mb-6 h-1.5 w-16 rounded-full bg-gradient-to-r from-primary via-info to-success" />
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Acesso completo
          </p>
          <p className="mt-2 text-center font-heading text-6xl font-black text-foreground">
            R$<span className="text-5xl">10</span>
            <span className="text-3xl">,99</span>
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Pagamento único · Sem renovação
          </p>

          <ul className="mt-6 flex flex-col gap-3">
            {INCLUDED.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                {item}
              </li>
            ))}
          </ul>

          <Link
            href={primaryCtaHref}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
          >
            Comprar agora
            <ArrowRight className="h-4 w-4" />
          </Link>

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Cartão de crédito · Pagamento seguro via Stripe
          </p>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-xs text-muted-foreground">
            Não afiliado à FIFA, Panini ou Coca-Cola.
          </p>
        </div>
      </footer>
    </div>
  )
}
