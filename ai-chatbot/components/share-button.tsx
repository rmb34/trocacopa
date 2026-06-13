'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Share2, Check } from 'lucide-react'

type Props = {
  text: string
  label?: string
  labelCopied?: string
  variant?: 'default' | 'outline' | 'secondary'
}

export function ShareButton({
  text,
  label = 'Compartilhar',
  labelCopied = 'Copiado!',
  variant = 'outline',
}: Props) {
  const [copied, setCopied] = useState(false)

  function handleClick() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <Button variant={variant} onClick={handleClick} className="gap-2">
      {copied ? (
        <Check className="h-4 w-4 text-primary" />
      ) : (
        <Share2 className="h-4 w-4" />
      )}
      {copied ? labelCopied : label}
    </Button>
  )
}
