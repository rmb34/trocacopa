import { Star } from 'lucide-react'
import { cn } from '@/lib/utils'

export function SupporterBadge({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1 rounded-full bg-accent px-2 py-0.5 text-[11px] font-bold text-accent-foreground',
        className,
      )}
    >
      <Star className="h-3 w-3 fill-current" />
      Apoiador
    </span>
  )
}
