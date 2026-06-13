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
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'TrocaCopa — álbum da Copa 2026 por R$ 10,99',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrocaCopa — Álbum da Copa 2026 no celular',
    description: 'Controle figurinhas, repetidas e trocas. R$ 10,99, pagamento único.',
    images: ['/og.png'],
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

const FREE_INCLUDED = [
  `Rastrear as ${TOTAL_STICKERS} figurinhas — tem / falta`,
  'Progresso por seleção e total',
  'Link público "Procuro" para divulgar',
  'Instalável no celular (PWA)',
]

const SUPPORTER_INCLUDED = [
  'Tudo do plano grátis',
  'Lista de repetidas organizada para trocar',
  'Inventário "tenho para troca" no perfil público',
  'Selo ⭐ Apoiador no seu perfil',
  'Acesso vitalício — uma vez, sem mensalidade',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'TrocaCopa — Apoiador',
  description:
    'Álbum digital de figurinhas da Copa do Mundo 2026. Grátis para rastrear; Apoiador (R$ 10,99) libera as trocas. Acesso vitalício.',
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
  // view the landing (so they aren't trapped on /comprar). The page itself is
  // identical for everyone — pure marketing with login / sign-up.
  if (session?.user) {
    const status = await getPurchaseStatus(session.user.id)
    if (status === 'paid') redirect('/dashboard')
  }

  return (
    <div className="min-h-svh bg-background">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Copa accent bar */}
      <div className="h-1.5 w-full bg-gradient-to-r from-success via-warn to-info" />

      {/* Nav */}
      <header className="mx-auto flex max-w-5xl items-center justify-between px-4 py-4">
        <Logo />
        <div className="flex items-center gap-2">
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
            Criar conta
          </Link>
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
              Comece <strong className="text-foreground">grátis</strong>: marque o que tem, veja o
              que falta e acompanhe seu progresso. Sem papel nem planilha.
            </p>

            {/* Free + supporter highlight */}
            <div className="mt-7 flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-baseline gap-1 rounded-xl bg-success px-4 py-2 text-success-foreground">
                <span className="font-heading text-2xl font-black leading-none">Grátis</span>
              </div>
              <div className="text-left text-sm leading-tight text-muted-foreground">
                <span className="block font-semibold text-foreground">para começar</span>
                vire Apoiador (R$&nbsp;{PRICE}) e libere as trocas
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link
                href="/sign-up"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 sm:w-auto"
              >
                Montar meu álbum agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="flex w-full items-center justify-center rounded-lg border border-border px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary sm:w-auto"
              >
                Já tenho conta
              </Link>
            </div>

            <p className="mt-4 text-xs text-muted-foreground">
              Grátis para começar · sem cartão · Apoiador é pagamento único
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
            Tudo para completar seu álbum
          </h2>
          <p className="mx-auto mt-2 max-w-md text-center text-sm text-muted-foreground">
            O rastreamento é grátis. As trocas se desbloqueiam quando você vira Apoiador.
          </p>
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

      {/* Pricing — two tiers */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <h2 className="text-center font-heading text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
          Comece grátis. Apoie quando quiser.
        </h2>
        <div className="mx-auto mt-10 grid max-w-3xl gap-6 sm:grid-cols-2">
          {/* Colecionador */}
          <div className="flex flex-col rounded-2xl border border-border bg-card p-7 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
              Colecionador
            </p>
            <p className="mt-2 font-heading text-4xl font-black text-foreground">Grátis</p>
            <p className="mt-1 text-sm text-muted-foreground">Para sempre</p>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {FREE_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 text-base font-semibold text-foreground transition-colors hover:bg-secondary"
            >
              Começar grátis
            </Link>
          </div>

          {/* Apoiador */}
          <div className="relative flex flex-col rounded-2xl border-2 border-primary bg-card p-7 shadow-md">
            <span className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-accent px-3 py-0.5 text-xs font-bold text-accent-foreground">
              ⭐ Mais popular
            </span>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Apoiador</p>
            <p className="mt-2 font-heading text-4xl font-black text-foreground">
              R$&nbsp;10<span className="text-2xl">,99</span>
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Pagamento único · pra sempre</p>
            <ul className="mt-6 flex flex-1 flex-col gap-3">
              {SUPPORTER_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-success" />
                  {item}
                </li>
              ))}
            </ul>
            <Link
              href="/sign-up"
              className="mt-7 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Criar conta e começar
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
        <p className="mt-6 text-center text-xs text-muted-foreground">
          Sem anúncios · sem mensalidade · sem vender seus dados · pagamento seguro via Stripe
        </p>
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
