'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, Check } from 'lucide-react'
import { publishProfile } from '@/app/actions/profile'
import { shareContent } from '@/lib/share'
import { toast } from 'sonner'

export function ShareProfileCard({
  slug,
  isPublic,
}: {
  slug: string
  isPublic: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [isPublicState, setIsPublicState] = useState(isPublic)

  async function handleClick() {
    const url = `${window.location.origin}/u/${slug}`
    try {
      // Share and publish in parallel: the share sheet must open inside the
      // tap's user activation, which an awaited server action would consume.
      const [shared, published] = await Promise.all([
        shareContent({
          text: 'Meu álbum da Copa 2026 no TrocaCopa — bora trocar figurinhas?',
          url,
        }),
        publishProfile(),
      ])

      setIsPublicState(true)
      if (published.activated) toast.success('Perfil público ativado!')

      if (shared === 'copied') {
        setCopied(true)
        toast.success('Link copiado!')
        setTimeout(() => setCopied(false), 2000)
      } else if (shared === 'failed') {
        toast.error('Não foi possível compartilhar o link. Tente de novo.')
      }
    } catch {
      toast.error('Não foi possível ativar seu link público. Tente de novo.')
    }
  }

  return (
    <button type="button" onClick={handleClick} className="text-left">
      <Card className="transition-colors hover:border-primary/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">Compartilhar</p>
            <p className="truncate text-xs text-muted-foreground">
              {isPublicState ? 'Link p/ trocas' : 'Ativar link p/ trocas'}
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
