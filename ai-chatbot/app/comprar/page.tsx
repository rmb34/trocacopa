'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { authClient } from '@/lib/auth-client'
import { Logo } from '@/components/logo'
import { LogoutButton } from '@/components/logout-button'
import { Check, ArrowRight, Loader2, ArrowLeft } from 'lucide-react'

const FEATURES = [
  'Álbum digital completo — 993 figurinhas',
  'Controle de repetidas por seleção',
  'Perfil público compartilhável por link',
  'Instala no celular (PWA) — sem App Store',
  'Acesso vitalício, sem assinatura',
]

export default function ComprarPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  // Redirect to sign-in if not authenticated
  useEffect(() => {
    authClient.getSession().then((s) => {
      if (!s.data?.user) router.replace('/sign-in')
    })
  }, [router])

  async function handleCheckout() {
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/checkout', { method: 'POST' })
      const data = await res.json()
      if (data.url) {
        window.location.href = data.url
      } else {
        setError(data.error ?? 'Erro ao iniciar pagamento. Tente novamente.')
        setLoading(false)
      }
    } catch {
      setError('Erro de conexão. Tente novamente.')
      setLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-svh flex-col items-center justify-center bg-secondary/30 px-4 py-12">
      <Link
        href="/"
        className="absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Voltar
      </Link>

      <LogoutButton className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-md px-2 py-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
        Sair da conta
      </LogoutButton>

      <Link href="/" aria-label="Início">
        <Logo />
      </Link>

      <div className="mt-8 w-full max-w-sm">
        <div className="rounded-2xl border border-border bg-card p-8 shadow-md">
          {/* Price */}
          <p className="text-center text-sm font-semibold uppercase tracking-wide text-muted-foreground">
            Acesso completo
          </p>
          <p className="mt-2 text-center font-heading text-6xl font-black text-foreground">
            R$<span className="text-5xl">10</span><span className="text-3xl">,99</span>
          </p>
          <p className="mt-1 text-center text-sm text-muted-foreground">
            Pagamento único · Sem mensalidade
          </p>

          {/* Features */}
          <ul className="mt-6 flex flex-col gap-3">
            {FEATURES.map((f) => (
              <li key={f} className="flex items-start gap-2.5 text-sm text-foreground">
                <Check className="mt-0.5 h-4 w-4 flex-shrink-0 text-primary" />
                {f}
              </li>
            ))}
          </ul>

          {/* CTA */}
          <button
            onClick={handleCheckout}
            disabled={loading}
            className="mt-8 flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3.5 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
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
          </button>

          {error && (
            <p className="mt-3 text-center text-sm text-destructive">{error}</p>
          )}

          <p className="mt-3 text-center text-xs text-muted-foreground">
            Pagamento seguro via Stripe · Cartão de crédito
          </p>
        </div>
      </div>
    </div>
  )
}
