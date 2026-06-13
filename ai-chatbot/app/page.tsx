import Link from 'next/link'
import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { auth } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import { Logo } from '@/components/logo'
import { TEAMS, TOTAL_STICKERS } from '@/lib/catalog'
import { BookOpen, Copy, ArrowLeftRight, Users, ArrowRight } from 'lucide-react'

export default async function LandingPage() {
  const session = await auth.api.getSession({ headers: await headers() })
  if (session?.user) redirect('/dashboard')

  const features = [
    {
      icon: BookOpen,
      title: 'Seu álbum digital',
      desc: 'Marque o que você já tem, o que falta e quantas repetidas você acumulou — figurinha por figurinha.',
    },
    {
      icon: Copy,
      title: 'Controle de repetidas',
      desc: 'Veja na hora todas as suas repetidas organizadas por seleção, prontas para trocar.',
    },
    {
      icon: ArrowLeftRight,
      title: 'Trocas inteligentes',
      desc: 'A gente cruza sua coleção com a de outros colecionadores e mostra as melhores trocas.',
    },
    {
      icon: Users,
      title: 'Perfil público',
      desc: 'Compartilhe um link com suas faltas e repetidas para combinar trocas pelo WhatsApp.',
    },
  ]

  return (
    <div className="min-h-svh bg-background">
      {/* Nav */}
      <header className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5">
        <Logo />
        <div className="flex items-center gap-2">
          <Button variant="ghost" asChild>
            <Link href="/sign-in">Entrar</Link>
          </Button>
          <Button asChild>
            <Link href="/sign-up">Criar conta</Link>
          </Button>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-10 md:pt-20">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary px-3 py-1 text-xs font-semibold uppercase tracking-wide text-primary">
            Edição Copa do Mundo
          </span>
          <h1 className="mt-6 text-balance font-heading text-5xl font-black leading-[1.05] tracking-tight text-foreground md:text-7xl">
            Complete seu álbum.{' '}
            <span className="text-primary">Troque o que sobra.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-xl text-pretty text-lg leading-relaxed text-muted-foreground">
            O TrocaCopa organiza sua coleção de figurinhas, mostra exatamente o
            que falta e te conecta com quem tem as repetidas que você precisa.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button size="lg" className="w-full gap-2 sm:w-auto" asChild>
              <Link href="/sign-up">
                Montar meu álbum
                <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="w-full sm:w-auto" asChild>
              <Link href="/sign-in">Já tenho conta</Link>
            </Button>
          </div>
          <p className="mt-4 text-sm text-muted-foreground">
            {TEAMS.length} seleções · {TOTAL_STICKERS} figurinhas para colecionar
          </p>
        </div>

        {/* Flag strip */}
        <div className="mt-14 flex flex-wrap items-center justify-center gap-2">
          {TEAMS.map((t) => (
            <span
              key={t.code}
              className="rounded-md border border-border bg-card px-2.5 py-1.5 text-sm"
              title={t.name}
            >
              <span aria-hidden>{t.flag}</span>{' '}
              <span className="font-mono text-xs text-muted-foreground">{t.code}</span>
            </span>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="border-t border-border bg-secondary/40">
        <div className="mx-auto max-w-6xl px-4 py-16">
          <h2 className="font-heading text-3xl font-extrabold tracking-tight text-foreground md:text-4xl">
            Tudo para fechar o álbum
          </h2>
          <p className="mt-2 max-w-lg text-muted-foreground">
            Pare de anotar figurinhas em papel ou no bloco de notas. Centralize
            sua coleção e suas trocas em um só lugar.
          </p>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((f) => (
              <div
                key={f.title}
                className="rounded-xl border border-border bg-card p-5 shadow-sm"
              >
                <div className="grid h-10 w-10 place-items-center rounded-lg bg-primary/10 text-primary">
                  <f.icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 font-heading text-lg font-bold text-foreground">
                  {f.title}
                </h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                  {f.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="mx-auto max-w-6xl px-4 py-20">
        <div className="rounded-2xl bg-primary px-6 py-14 text-center text-primary-foreground md:px-12">
          <h2 className="text-balance font-heading text-3xl font-black tracking-tight md:text-4xl">
            Pronto para parar de figurinha repetida na gaveta?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-primary-foreground/80">
            Crie sua conta gratuita e comece a trocar hoje mesmo.
          </p>
          <Button size="lg" variant="secondary" className="mt-8 gap-2" asChild>
            <Link href="/sign-up">
              Começar agora
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 py-8 sm:flex-row">
          <Logo />
          <p className="text-sm text-muted-foreground">
            Feito para colecionadores. Não afiliado à FIFA ou a fabricantes de
            álbuns.
          </p>
        </div>
      </footer>
    </div>
  )
}
