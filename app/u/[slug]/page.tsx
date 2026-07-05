import { notFound } from 'next/navigation'
import { headers } from 'next/headers'
import { getProfileBySlug, getEntriesByUserId } from '@/lib/db/queries'
import { computeStats, missingCodes, duplicateCodes } from '@/lib/stats'
import { TEAMS } from '@/lib/catalog'
import { Progress } from '@/components/ui/progress'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Logo } from '@/components/logo'
import { ShareButton } from '@/components/share-button'
import { TeamFlag } from '@/components/team-flag'
import { buttonVariants } from '@/components/ui/button'
import { whatsappChatUrl } from '@/lib/share'
import { cn } from '@/lib/utils'
import { ArrowRight, MessageCircle } from 'lucide-react'
import Link from 'next/link'
import type { Metadata } from 'next'

type Props = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile || !profile.isPublic) return {}
  const entries = await getEntriesByUserId(profile.userId)
  const stats = computeStats(entries)
  return {
    title: `${profile.displayName} — TrocaCopa`,
    description: `${stats.percent}% do álbum completo · ${stats.duplicates} figurinhas para troca`,
  }
}

export default async function PublicProfilePage({ params }: Props) {
  const { slug } = await params
  const profile = await getProfileBySlug(slug)
  if (!profile || !profile.isPublic) notFound()

  const entries = await getEntriesByUserId(profile.userId)
  const stats = computeStats(entries)

  const missing = new Set(missingCodes(entries))
  const duplicates = new Set(duplicateCodes(entries))

  const teamsWithMissing = TEAMS.map((team) => ({
    team,
    codes: Array.from({ length: team.stickerCount }, (_, i) => i + 1).filter((n) =>
      missing.has(`${team.code}-${n}`),
    ),
  })).filter((t) => t.codes.length > 0)

  const teamsWithDuplicates = TEAMS.map((team) => ({
    team,
    codes: Array.from({ length: team.stickerCount }, (_, i) => i + 1).filter((n) =>
      duplicates.has(`${team.code}-${n}`),
    ),
  })).filter((t) => t.codes.length > 0)

  const headersList = await headers()
  const host = headersList.get('host') ?? ''
  const proto = host.includes('localhost') ? 'http' : 'https'
  const publicUrl = `${proto}://${host}/u/${slug}`

  return (
    <div className="min-h-svh bg-secondary/30">
      <header className="border-b border-border bg-background px-4 py-4">
        <div className="mx-auto flex max-w-4xl items-center justify-between">
          <Link href="/">
            <Logo />
          </Link>
          <ShareButton
            url={publicUrl}
            label="Compartilhar"
            labelCopied="Link copiado!"
          />
        </div>
      </header>

      <main className="mx-auto max-w-4xl px-4 py-6 sm:py-8">
        <div className="mb-5">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="font-heading text-2xl font-extrabold text-foreground sm:text-3xl">
              {profile.displayName}
            </h1>
          </div>
          {profile.city && (
            <p className="mt-1 text-sm text-muted-foreground">{profile.city}</p>
          )}
          {profile.whatsapp && (
            <a
              href={whatsappChatUrl(
                profile.whatsapp,
                `Oi, ${profile.displayName.split(' ')[0]}! Vi seu álbum no TrocaCopa e quero combinar uma troca de figurinhas.`,
              )}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants(), 'mt-3 gap-2')}
            >
              <MessageCircle className="h-4 w-4" />
              Chamar no WhatsApp
            </a>
          )}
        </div>

        <Card className="mb-6">
          <CardContent className="flex flex-col gap-3 p-5">
            <div className="flex items-baseline gap-2">
              <span className="font-heading text-4xl font-black text-primary">
                {stats.percent}%
              </span>
              <span className="text-sm text-muted-foreground">do álbum completo</span>
            </div>
            <Progress value={stats.percent} className="h-3" />
            <p className="text-sm text-muted-foreground">
              {stats.owned} de {stats.total} figurinhas ·{' '}
              <span className="font-medium text-foreground">{stats.duplicates}</span> para troca
            </p>
          </CardContent>
        </Card>

        <div className="grid gap-6 lg:grid-cols-2">
          <section>
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              Procuro <Badge variant="secondary">{stats.missing}</Badge>
            </h2>
            {teamsWithMissing.length === 0 ? (
              <p className="text-sm text-muted-foreground">Álbum completo!</p>
            ) : (
              <div className="flex flex-col gap-2">
                {teamsWithMissing.map(({ team, codes }) => (
                  <Card key={team.code}>
                    <CardContent className="p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <TeamFlag team={team} size="sm" />
                        <span className="text-sm font-medium text-foreground">{team.name}</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {codes.join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section>
            <h2 className="mb-3 flex items-center gap-2 font-heading text-lg font-bold text-foreground">
              Tenho para troca <Badge variant="secondary">{stats.duplicates}</Badge>
            </h2>
            {teamsWithDuplicates.length === 0 ? (
              <p className="text-sm text-muted-foreground">Nenhuma repetida ainda.</p>
            ) : (
              <div className="flex flex-col gap-2">
                {teamsWithDuplicates.map(({ team, codes }) => (
                  <Card key={team.code}>
                    <CardContent className="p-3">
                      <div className="mb-1.5 flex items-center gap-1.5">
                        <TeamFlag team={team} size="sm" />
                        <span className="text-sm font-medium text-foreground">{team.name}</span>
                      </div>
                      <p className="font-mono text-xs text-muted-foreground">
                        {codes.join(', ')}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </section>
        </div>

        {/* Visitor CTA — this page is how new collectors discover the app */}
        <Card className="mt-8">
          <CardContent className="flex flex-col items-center gap-3 p-6 text-center sm:flex-row sm:justify-between sm:text-left">
            <div>
              <p className="font-heading text-lg font-bold text-foreground">
                Monte o seu álbum também
              </p>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Controle figurinhas, repetidas e trocas. 100% grátis.
              </p>
            </div>
            <Link href="/sign-up" className={cn(buttonVariants(), 'shrink-0 gap-2')}>
              Criar meu álbum
              <ArrowRight className="h-4 w-4" />
            </Link>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
