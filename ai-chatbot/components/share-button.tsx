'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check, Copy } from 'lucide-react'
import { copyText, shareContent } from '@/lib/share'
import { toast } from 'sonner'

type Props = {
  text?: string
  url?: string
  label?: string
  labelCopied?: string
  variant?: 'default' | 'outline' | 'secondary'
  // 'share' opens the native share sheet (with clipboard fallback);
  // 'copy' always copies — use it when the label promises copying.
  mode?: 'share' | 'copy'
}

export function ShareButton({
  text,
  url,
  label = 'Compartilhar',
  labelCopied = 'Copiado!',
  variant = 'outline',
  mode = 'share',
}: Props) {
  const [copied, setCopied] = useState(false)

  async function handleClick() {
    const result =
      mode === 'copy'
        ? await copyText([text, url].filter(Boolean).join('\n'))
        : await shareContent({ text, url })

    if (result === 'copied') {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } else if (result === 'failed') {
      toast.error('Não foi possível compartilhar. Tente de novo.')
    }
  }

  const Icon = mode === 'copy' ? Copy : Share2

  return (
    <Button variant={variant} onClick={handleClick} className="gap-2">
      {copied ? <Check className="h-4 w-4 text-primary" /> : <Icon className="h-4 w-4" />}
      {copied ? labelCopied : label}
    </Button>
  )
}
