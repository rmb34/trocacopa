import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries, getOtherCollectors } from '@/app/actions/stickers'
import { computeMatch } from '@/lib/stats'
import { Card, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ArrowLeftRight, MessageCircle, Users } from 'lucide-react'

export default async function TrocasPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const mine = await getMyEntries()
  const others = await getOtherCollectors(profile.userId)

  const matches = others
    .map((o) => ({ ...o, match: computeMatch(mine, o.entries) }))
    .filter((o) => o.match.score > 0)
    .sort((a, b) => b.match.score - a.match.score)

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Encontrar trocas
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Colecionadores que têm o que você precisa e precisam do que você tem.
        </p>
      </div>

      {matches.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
            <Users className="h-8 w-8 text-muted-foreground/40" />
            <p className="text-muted-foreground">Nenhuma troca compatível encontrada ainda.</p>
            <p className="text-xs text-muted-foreground">
              Isso muda conforme mais colecionadores se cadastrarem e marcarem suas figurinhas.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="flex flex-col gap-4">
          {matches.map(({ profile: other, match }) => (
            <Card key={other.id}>
              <CardContent className="p-4 sm:p-5">
                <div className="flex flex-col gap-4">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-foreground">{other.displayName}</p>
                      {other.city && (
                        <p className="text-xs text-muted-foreground">{other.city}</p>
                      )}
                    </div>
                    <Badge className="flex-shrink-0 gap-1">
                      <ArrowLeftRight className="h-3 w-3" />
                      {match.score} troca{match.score !== 1 ? 's' : ''}
                    </Badge>
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <div className="rounded-md bg-secondary/60 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Você recebe ({match.youGet.length})
                      </p>
                      <p className="font-mono text-xs leading-relaxed text-foreground">
                        {match.youGet.slice(0, 12).join(', ')}
                        {match.youGet.length > 12 && (
                          <span className="text-muted-foreground">
                            {' '}e mais {match.youGet.length - 12}
                          </span>
                        )}
                      </p>
                    </div>
                    <div className="rounded-md bg-secondary/60 p-3">
                      <p className="mb-1.5 text-xs font-medium text-muted-foreground">
                        Você dá ({match.youGive.length})
                      </p>
                      <p className="font-mono text-xs leading-relaxed text-foreground">
                        {match.youGive.slice(0, 12).join(', ')}
                        {match.youGive.length > 12 && (
                          <span className="text-muted-foreground">
                            {' '}e mais {match.youGive.length - 12}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    {other.whatsapp ? (
                      <Button asChild size="sm" className="gap-2">
                        <a
                          href={`https://wa.me/55${other.whatsapp}`}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          <MessageCircle className="h-4 w-4" />
                          Contatar no WhatsApp
                        </a>
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" disabled>
                        Sem WhatsApp cadastrado
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
