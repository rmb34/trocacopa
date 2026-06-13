import { cn } from '@/lib/utils'

export function Logo({ className }: { className?: string }) {
  return (
    <span className={cn('inline-flex items-center gap-2', className)}>
      <span
        aria-hidden
        className="grid h-8 w-8 place-items-center rounded-md bg-primary text-primary-foreground font-heading text-lg font-black"
      >
        T
      </span>
      <span className="font-heading text-xl font-extrabold tracking-tight text-foreground">
        Troca<span className="text-primary">Copa</span>
      </span>
    </span>
  )
}
