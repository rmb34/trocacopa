'use client'

import { useState } from 'react'
import { Logo } from '@/components/logo'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Check, ArrowRight, Loader2 } from 'lucide-react'

const FEATURES = [
  'Álbum digital completo — 993 figurinhas',
  'Controle de repetidas por seleção',
  'Match automático de trocas com WhatsApp',
  'Perfil público compartilhável',
  'Funciona offline — instale no celular (PWA)',
  'Acesso vitalício, sem assinatura',
]

export default function ComprarPage() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError('Erro ao iniciar pagamento. Tente novamente.')
        setLoading(false)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Logo />

      <div className="mt-8 w-full max-w-sm">
        <Card>
          <CardContent className="flex flex-col gap-6 p-6">
            {/* Price */}
            <div className="text-center">
              <p className="text-sm font-medium text-muted-foreground">Acesso completo</p>
              <p className="mt-1 font-heading text-5xl font-black text-foreground">
                R$&nbsp;19<span className="text-3xl">,90</span>
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                Pagamento único · Sem mensalidade
              </p>
            </div>

            {/* Features */}
            <ul className="flex flex-col gap-2.5">
              {FEATURES.map((f) => (
                <li key={f} className="flex items-start gap-2 text-sm text-foreground">
                  <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                  {f}
                </li>
              ))}
            </ul>

            {/* CTA */}
            <Button
              onClick={handleCheckout}
              disabled={loading}
              size="lg"
              className="w-full gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Aguarde…
                </>
              ) : (
                <>
                  Comprar agora
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </Button>

            {error && (
              <p className="text-center text-sm text-destructive">{error}</p>
            )}

            <p className="text-center text-xs text-muted-foreground">
              Pagamento seguro via Stripe · Pix ou cartão
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
