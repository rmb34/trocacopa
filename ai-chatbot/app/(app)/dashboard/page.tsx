import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getPurchaseStatus } from '@/app/actions/purchase'
import { getMyEntries } from '@/app/actions/stickers'
import { computeStats, computeTeamProgress } from '@/lib/stats'
import { canAccessTrades } from '@/lib/entitlements'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { BookOpen, Copy, CheckCircle2, CircleDashed, Layers, Star } from 'lucide-react'
import { TeamFlag } from '@/components/team-flag'

export default async function DashboardPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const status = await getPurchaseStatus(profile.userId)
  const isSupporter = canAccessTrades(status)
  const entries = await getMyEntries()
  const stats = computeStats(entries)
  const teams = computeTeamProgress(entries)
  const firstName = profile.displayName.split(' ')[0]

  const topTeams = [...teams].sort((a, b) => b.percent - a.percent).slice(0, 6)

  const cards = [
    {
      label: 'Coladas',
      value: stats.owned,
      sub: `de ${stats.total}`,
      icon: CheckCircle2,
      tone: 'text-success',
    },
    {
      label: 'Faltando',
      value: stats.missing,
      sub: 'para completar',
      icon: CircleDashed,
      tone: 'text-info',
    },
    {
      label: 'Repetidas',
      value: stats.duplicates,
      sub: 'prontas p/ trocar',
      icon: Layers,
      tone: 'text-warn',
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Olá, {firstName} 👋</p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Seu painel
          </h1>
        </div>
        <Button asChild size="lg" className="h-auto shrink-0 gap-2 px-4 py-2.5">
          <Link href="/album">
            <BookOpen className="h-4 w-4" />
            Álbum
          </Link>
        </Button>
      </div>

      {/* Completion hero */}
      <Card className="overflow-hidden border-0 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground shadow-md">
        <CardContent className="flex flex-col gap-4 p-6">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-6xl font-black leading-none">
              {stats.percent}%
            </span>
            <span className="text-primary-foreground/70 text-sm">completo</span>
          </div>
          <Progress
            value={stats.percent}
            className="h-2.5 bg-primary-foreground/20 [&>div]:bg-primary-foreground"
          />
          <p className="text-sm text-primary-foreground/80">
            {stats.owned} de {stats.total} figurinhas ·{' '}
            <span className="font-semibold text-primary-foreground">{stats.missing}</span> faltando
          </p>
        </CardContent>
      </Card>

      {/* Stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.label}>
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-12 w-12 place-items-center rounded-lg bg-secondary">
                <c.icon className={`h-6 w-6 ${c.tone}`} />
              </div>
              <div>
                <p className="font-heading text-3xl font-extrabold leading-none text-foreground">
                  {c.value}
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {c.label} <span className="text-xs">· {c.sub}</span>
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick action */}
      {isSupporter ? (
        <Link href="/repetidas">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-primary/10 text-primary">
                <Copy className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">Minhas repetidas</p>
                <p className="text-sm text-muted-foreground">
                  Veja o que sobra e compartilhe para trocar
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      ) : (
        <Link href="/comprar">
          <Card className="border-primary/30 transition-colors hover:border-primary/60">
            <CardContent className="flex items-center gap-4 p-5">
              <div className="grid h-11 w-11 place-items-center rounded-lg bg-accent text-accent-foreground">
                <Star className="h-5 w-5 fill-current" />
              </div>
              <div>
                <p className="font-semibold text-foreground">
                  {stats.duplicates > 0
                    ? `Você tem ${stats.duplicates} repetida${stats.duplicates !== 1 ? 's' : ''} para trocar`
                    : 'Libere suas trocas'}
                </p>
                <p className="text-sm text-muted-foreground">
                  Vire Apoiador por R$ 10,99 e organize suas trocas
                </p>
              </div>
            </CardContent>
          </Card>
        </Link>
      )}

      {/* Team progress */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="font-heading text-lg">Progresso por seleção</CardTitle>
          <Link
            href="/album"
            className="text-sm font-medium text-primary underline-offset-4 hover:underline"
          >
            Ver todas
          </Link>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {topTeams.map((t) => (
            <div key={t.code} className="flex flex-col gap-2">
              <div className="flex items-center justify-between text-sm">
                <span className="flex items-center gap-1.5 font-medium text-foreground">
                  <TeamFlag team={t} size="sm" />
                  {t.name}
                </span>
                <span className="text-muted-foreground">
                  {t.owned}/{t.total}
                </span>
              </div>
              <Progress value={t.percent} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  )
}
