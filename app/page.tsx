import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import type { Metadata } from 'next'
import { auth } from '@/lib/auth'
import { Logo } from '@/components/logo'
import { ProductPreview } from '@/components/landing/product-preview'
import { TOTAL_STICKERS } from '@/lib/catalog'
import { BookOpen, Copy, Users, Check, ArrowRight, Smartphone, Trophy } from 'lucide-react'

const SITE_URL = process.env.BETTER_AUTH_URL ?? 'https://troca-copa-26.vercel.app'

export const metadata: Metadata = {
  title: 'TrocaCopa — Álbum de figurinhas da Copa 2026 no celular',
  description:
    'Organize seu álbum de figurinhas da Copa do Mundo 2026: marque o que tem, veja o que falta, controle repetidas e compartilhe sua lista de trocas. 100% grátis.',
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
    description: 'Marque o que tem, veja o que falta e controle suas repetidas. 100% grátis.',
    images: [
      {
        url: '/og.png',
        width: 1200,
        height: 630,
        alt: 'TrocaCopa — álbum da Copa 2026, 100% grátis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'TrocaCopa — Álbum da Copa 2026 no celular',
    description: 'Controle figurinhas, repetidas e trocas. 100% grátis.',
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
  'Lista de repetidas organizada para trocar',
  'Inventário "tenho para troca" no perfil público',
  'Link público para divulgar e combinar trocas',
  'Instalável no celular (PWA)',
]

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Product',
  name: 'TrocaCopa',
  description: 'Álbum digital de figurinhas da Copa do Mundo 2026. 100% grátis, sem anúncios.',
  brand: { '@type': 'Brand', name: 'TrocaCopa' },
  offers: {
    '@type': 'Offer',
    price: '0',
    priceCurrency: 'BRL',
    availability: 'https://schema.org/InStock',
    url: SITE_URL,
  },
}

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  // The app is free for everyone — logged-in users go straight in.
  if (session?.user) redirect('/dashboard')

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
            className="rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
          >
            Criar conta
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-5xl items-center gap-10 px-4 pb-16 pt-10 md:grid-cols-2 md:pt-16">
          {/* Copy */}
          <div className="text-center md:text-left">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-1.5 text-sm font-semibold text-primary">
              <Trophy className="h-4 w-4" />
              Copa do Mundo 2026
            </div>

            <h1 className="mt-5 text-balance font-heading text-4xl font-black leading-[1.05] tracking-tight text-foreground sm:text-5xl md:text-6xl">
              Seu álbum da <span className="text-primary">Copa 2026</span> no bolso
            </h1>

            <p className="mx-auto mt-5 max-w-lg text-pretty text-lg leading-relaxed text-muted-foreground md:mx-0">
              Marque o que tem, veja o que falta e organize suas trocas. Sem papel nem planilha —
              e <strong className="text-foreground">100% grátis</strong>.
            </p>

            <div className="mt-7 flex items-center justify-center gap-3 md:justify-start">
              <div className="flex items-baseline gap-1 rounded-xl bg-success px-4 py-2 text-success-foreground">
                <span className="font-heading text-2xl font-black leading-none">Grátis</span>
              </div>
              <div className="text-left text-sm leading-tight text-muted-foreground">
                <span className="block font-semibold text-foreground">para sempre</span>
                sem mensalidade, sem cartão
              </div>
            </div>

            <div className="mt-7 flex flex-col items-center gap-3 sm:flex-row md:items-start">
              <Link
                href="/sign-up"
                className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-colors hover:bg-primary/80 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
              >
                Montar meu álbum agora
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href="/sign-in"
                className="flex w-full items-center justify-center rounded-lg border border-border px-6 py-3.5 text-base font-semibold text-foreground transition-colors hover:bg-secondary focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50 sm:w-auto"
              >
                Já tenho conta
              </Link>
            </div>
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
            Rastreamento e trocas, tudo incluído.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className={
                  'rounded-xl bg-card ring-1 ring-foreground/10 ' +
                  (i === 0 ? 'p-6 sm:col-span-2 lg:col-span-2 lg:row-span-2' : 'p-5')
                }
              >
                <div
                  className={
                    'grid place-items-center rounded-lg bg-primary/10 text-primary ' +
                    (i === 0 ? 'h-12 w-12' : 'h-10 w-10')
                  }
                >
                  <f.icon className={i === 0 ? 'h-6 w-6' : 'h-5 w-5'} />
                </div>
                <h3
                  className={
                    'mt-4 font-heading font-bold text-foreground ' +
                    (i === 0 ? 'text-xl' : 'text-base')
                  }
                >
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing statement — it's free, no pricing-table theatrics */}
      <section className="mx-auto max-w-5xl px-4 py-16">
        <div className="overflow-hidden rounded-2xl bg-primary px-6 py-10 text-primary-foreground sm:px-10 sm:py-14">
          <div className="grid gap-8 md:grid-cols-2 md:items-center">
            <div>
              <h2 className="font-heading text-3xl font-black leading-tight sm:text-4xl">
                É de graça. Sempre foi, sempre vai ser.
              </h2>
              <p className="mt-3 max-w-sm text-primary-foreground/85">
                Sem anúncios, sem mensalidade, sem vender seus dados — e sem letra miúda.
              </p>
              <Link
                href="/sign-up"
                className="mt-7 inline-flex items-center justify-center gap-2 rounded-lg bg-primary-foreground px-6 py-3 text-base font-bold text-primary transition-colors hover:bg-primary-foreground/90 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
              >
                Criar conta e começar
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
            <ul className="flex flex-col gap-3">
              {FREE_INCLUDED.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-primary-foreground/95">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
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
