import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries } from '@/app/actions/stickers'
import { TEAMS } from '@/lib/catalog'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { buttonVariants } from '@/components/ui/button'
import { ShareButton } from '@/components/share-button'
import { TeamFlag } from '@/components/team-flag'
import { whatsappShareUrl } from '@/lib/share'
import { cn } from '@/lib/utils'
import { MessageCircle } from 'lucide-react'

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
          <div className="flex flex-wrap items-center gap-2">
            <a
              href={whatsappShareUrl(shareText)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), 'gap-2')}
            >
              <MessageCircle className="h-4 w-4" />
              Enviar no WhatsApp
            </a>
            <ShareButton text={shareText} label="Compartilhar" />
          </div>
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
                  <TeamFlag team={team} size="sm" />
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
