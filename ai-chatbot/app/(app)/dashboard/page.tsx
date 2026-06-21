import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries } from '@/app/actions/stickers'
import { computeStats, computeTeamProgress } from '@/lib/stats'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, CheckCircle2, CircleDashed, Layers } from 'lucide-react'
import { TeamFlag } from '@/components/team-flag'
import { ShareProfileCard } from '@/components/share-profile-card'

export default async function DashboardPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const entries = await getMyEntries()
  const stats = computeStats(entries)
  const teams = computeTeamProgress(entries)
  const firstName = profile.displayName.split(' ')[0]

  const topTeams = [...teams].sort((a, b) => b.percent - a.percent).slice(0, 6)

  const inlineStats = [
    { label: 'coladas', value: stats.owned, icon: CheckCircle2, tone: 'text-success' },
    { label: 'faltando', value: stats.missing, icon: CircleDashed, tone: 'text-info' },
    { label: 'repetidas', value: stats.duplicates, icon: Layers, tone: 'text-warn' },
  ]

  return (
    <div className="flex flex-col gap-6">
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">Olá, {firstName} 👋</p>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Seu painel
        </h1>
      </div>

      {/* Quick actions: álbum + compartilhar perfil */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link href="/album">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Álbum</p>
                <p className="truncate text-xs text-muted-foreground">Ver figurinhas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <ShareProfileCard slug={profile.slug} isPublic={profile.isPublic} />
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="flex flex-col gap-4 p-5">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-3xl font-black leading-none text-foreground">
              {stats.percent}%
            </span>
            <span className="text-sm text-muted-foreground">completo</span>
          </div>
          <Progress value={stats.percent} className="h-2.5" />
          <div className="flex flex-wrap gap-x-5 gap-y-2">
            {inlineStats.map((s) => (
              <span key={s.label} className="flex items-center gap-1.5 text-sm">
                <s.icon className={`h-4 w-4 ${s.tone}`} />
                <span className="font-semibold text-foreground">{s.value}</span>
                <span className="text-muted-foreground">{s.label}</span>
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Team progress */}
      <Card>
        <CardHeader>
          <CardTitle className="font-heading text-lg">Progresso por seleção</CardTitle>
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
