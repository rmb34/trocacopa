'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, Check } from 'lucide-react'
import { publishProfile } from '@/app/actions/profile'
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
    const result = await publishProfile()
    const url = `${window.location.origin}/u/${result.slug}`

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setIsPublicState(true)
    toast.success(result.activated ? 'Perfil ativado e link copiado!' : 'Link copiado!')
    setTimeout(() => setCopied(false), 2000)
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
