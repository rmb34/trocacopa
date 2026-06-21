import { TEAMS } from '@/lib/catalog'
import { TeamFlag } from '@/components/team-flag'

// Teams shown in the faux album grid (real flags via flagcdn).
const PREVIEW_TEAMS = TEAMS.filter((t) => t.flagCode).slice(0, 15)
// Which cells render as "ainda não tenho" (dimmed) to convey the collecting loop.
const MISSING = new Set([3, 6, 9, 13])

// A self-contained, non-interactive mock of the real app: progress card + flag
// grid. Server-rendered so it ships in the initial HTML (good for SEO/LCP).
export function ProductPreview() {
  return (
    <div className="relative">
      {/* Copa accent stripe */}
      <div className="absolute -top-3 left-6 right-6 h-1.5 rounded-full bg-gradient-to-r from-success via-warn to-info" />

      <div className="overflow-hidden rounded-2xl bg-card ring-1 ring-foreground/10">
        {/* Faux app bar */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
          <span className="text-sm font-semibold text-foreground">Meu álbum</span>
          <span className="ml-auto rounded-full bg-warn/20 px-2 py-0.5 text-[11px] font-bold text-warn-foreground">
            41 repetidas
          </span>
        </div>

        {/* Progress block */}
        <div className="bg-primary px-4 py-4 text-primary-foreground">
          <div className="flex items-baseline gap-2">
            <span className="font-heading text-4xl font-black leading-none">68%</span>
            <span className="text-sm text-primary-foreground/80">completo</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-primary-foreground/25">
            <div className="h-full w-[68%] rounded-full bg-primary-foreground" />
          </div>
          <p className="mt-2 text-xs text-primary-foreground/80">676 de 993 figurinhas</p>
        </div>

        {/* Flag grid */}
        <div className="grid grid-cols-5 gap-2.5 p-4">
          {PREVIEW_TEAMS.map((team, i) => {
            const missing = MISSING.has(i)
            return (
              <div
                key={team.code}
                className={
                  'flex aspect-square flex-col items-center justify-center gap-1 rounded-lg border ' +
                  (missing
                    ? 'border-dashed border-border bg-secondary/40'
                    : 'border-border bg-background ring-1 ring-foreground/5')
                }
              >
                <span className={missing ? 'opacity-30 grayscale' : ''}>
                  <TeamFlag team={team} size="md" />
                </span>
                <span className="text-[9px] font-medium leading-none text-muted-foreground">
                  {missing ? 'falta' : '✓'}
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
