import Link from 'next/link'
import { Lock, Star, ArrowRight } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

// Support-framed unlock card. Shows the real number of repeats the user has
// (computed server-side) without revealing the list.
export function TradesUpsell({ repeatCount }: { repeatCount: number }) {
  const hasRepeats = repeatCount > 0
  return (
    <Card className="overflow-hidden border-primary/30">
      <div className="h-1.5 w-full bg-gradient-to-r from-success via-warn to-info" />
      <CardContent className="flex flex-col items-center gap-4 p-8 text-center">
        <div className="grid h-12 w-12 place-items-center rounded-full bg-primary/10 text-primary">
          <Lock className="h-6 w-6" />
        </div>

        {hasRepeats ? (
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            Você tem {repeatCount} figurinha{repeatCount !== 1 ? 's' : ''} repetida
            {repeatCount !== 1 ? 's' : ''} para trocar
          </h2>
        ) : (
          <h2 className="font-heading text-xl font-extrabold text-foreground">
            Suas trocas ficam aqui
          </h2>
        )}

        <p className="max-w-sm text-sm leading-relaxed text-muted-foreground">
          As trocas existem graças a quem apoia o projeto. Vire <strong>Apoiador</strong> por
          R$&nbsp;10,99 (uma vez, pra sempre) e libere sua lista de repetidas para combinar trocas.
        </p>

        <Link
          href="/comprar"
          className="flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 text-base font-bold text-primary-foreground transition-opacity hover:opacity-90"
        >
          <Star className="h-4 w-4 fill-current" />
          Virar Apoiador
          <ArrowRight className="h-4 w-4" />
        </Link>

        <p className="text-xs text-muted-foreground">
          Sem anúncios · sem mensalidade · sem vender seus dados
        </p>
      </CardContent>
    </Card>
  )
}
