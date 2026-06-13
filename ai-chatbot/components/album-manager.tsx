'use client'

import { useEffect, useMemo, useState, useTransition } from 'react'
import { TEAMS, GROUPS, type Team } from '@/lib/catalog'
import { TeamFlag } from '@/components/team-flag'
import { adjustStickerCount, setManyCounts } from '@/app/actions/stickers'
import { computeStats, type EntryMap } from '@/lib/stats'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { Check, Plus, Minus, CheckCheck } from 'lucide-react'
import { toast } from 'sonner'

type Filter = 'all' | 'missing' | 'owned' | 'duplicates'

export function AlbumManager({ initialEntries }: { initialEntries: EntryMap }) {
  const [entries, setEntries] = useState<EntryMap>(initialEntries)
  const [group, setGroup] = useState<string>(GROUPS[0])
  const [filter, setFilter] = useState<Filter>('all')
  const [visibleCount, setVisibleCount] = useState(10)
  const [, startTransition] = useTransition()

  const stats = useMemo(() => computeStats(entries), [entries])
  const teamsInGroup = useMemo(
    () => (group === 'Todas' ? TEAMS : TEAMS.filter((t) => t.group === group)),
    [group],
  )

  // Reset pagination when group changes
  useEffect(() => { setVisibleCount(10) }, [group])

  const visibleTeams = useMemo(
    () => group === 'Todas' ? teamsInGroup.slice(0, visibleCount) : teamsInGroup,
    [teamsInGroup, group, visibleCount],
  )
  const hasMore = group === 'Todas' && visibleCount < teamsInGroup.length

  function countFor(code: string) {
    return entries[code] ?? 0
  }

  // Optimistic update with server persistence.
  function adjust(code: string, delta: number) {
    const current = countFor(code)
    const next = Math.max(0, Math.min(99, current + delta))
    if (next === current) return
    setEntries((prev) => ({ ...prev, [code]: next }))
    startTransition(async () => {
      try {
        await adjustStickerCount(code, delta)
      } catch {
        // revert on failure
        setEntries((prev) => ({ ...prev, [code]: current }))
        toast.error('Não foi possível salvar. Tente de novo.')
      }
    })
  }

  function markTeamComplete(team: Team) {
    const updates = []
    const optimistic: EntryMap = {}
    for (let n = 1; n <= team.stickerCount; n++) {
      const code = `${team.code}-${n}`
      if (countFor(code) < 1) {
        updates.push({ stickerCode: code, count: 1 })
        optimistic[code] = 1
      }
    }
    if (updates.length === 0) {
      toast(`${team.name} já está completo!`)
      return
    }
    setEntries((prev) => ({ ...prev, ...optimistic }))
    startTransition(async () => {
      try {
        await setManyCounts(updates)
        toast.success(`${team.name} marcado como completo.`)
      } catch {
        toast.error('Não foi possível salvar. Tente de novo.')
      }
    })
  }

  const filters: { key: Filter; label: string }[] = [
    { key: 'all', label: 'Todas' },
    { key: 'missing', label: 'Faltando' },
    { key: 'owned', label: 'Tenho' },
    { key: 'duplicates', label: 'Repetidas' },
  ]

  function visibleNumbers(team: Team): number[] {
    const nums = Array.from({ length: team.stickerCount }, (_, i) => i + 1)
    if (filter === 'all') return nums
    return nums.filter((n) => {
      const c = countFor(`${team.code}-${n}`)
      if (filter === 'missing') return c === 0
      if (filter === 'owned') return c >= 1
      if (filter === 'duplicates') return c > 1
      return true
    })
  }

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Meu álbum
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Toque para colar uma figurinha. Use + para registrar repetidas.
          </p>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <Badge variant="secondary" className="gap-1">
            <Check className="h-3.5 w-3.5 text-primary" />
            {stats.owned}/{stats.total}
          </Badge>
          <Badge variant="secondary" className="gap-1">
            <span className="font-mono">{stats.percent}%</span>
          </Badge>
        </div>
      </div>

      <Progress value={stats.percent} className="h-2" />

      {/* Legend */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded border border-border bg-card" /> Falta
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-primary" /> Tenho
        </span>
        <span className="flex items-center gap-1.5">
          <span className="h-3 w-3 rounded bg-accent" /> Repetida
        </span>
      </div>

      {/* Group tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={group === 'Todas' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setGroup('Todas')}
        >
          Todas
        </Button>
        {GROUPS.map((g) => (
          <Button
            key={g}
            variant={group === g ? 'default' : 'outline'}
            size="sm"
            onClick={() => setGroup(g)}
          >
            {g === 'Especial' ? 'Especial' : `Grupo ${g}`}
          </Button>
        ))}
      </div>

      {/* Filter chips */}
      <div className="flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={cn(
              'rounded-full border px-3 py-1 text-sm font-medium transition-colors',
              filter === f.key
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-card text-muted-foreground hover:text-foreground',
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Teams */}
      <div className="flex flex-col gap-5">
        {visibleTeams.map((team) => {
          const nums = visibleNumbers(team)
          let owned = 0
          for (let n = 1; n <= team.stickerCount; n++) {
            if (countFor(`${team.code}-${n}`) >= 1) owned += 1
          }
          const complete = owned === team.stickerCount
          return (
            <Card key={team.code} className="p-4">
              <div className="mb-3 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <TeamFlag team={team} size="lg" />
                  <div>
                    <p className="font-heading font-bold leading-tight text-foreground">
                      {team.name}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {owned}/{team.stickerCount} coladas
                    </p>
                  </div>
                  {complete && (
                    <Badge className="ml-1 gap-1 bg-primary">
                      <CheckCheck className="h-3 w-3" /> Completo
                    </Badge>
                  )}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => markTeamComplete(team)}
                  disabled={complete}
                  className="gap-1.5"
                >
                  <CheckCheck className="h-4 w-4" />
                  <span className="hidden sm:inline">Completar time</span>
                </Button>
              </div>

              {nums.length === 0 ? (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  Nenhuma figurinha nesse filtro.
                </p>
              ) : (
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-6 lg:grid-cols-9">
                  {nums.map((n) => {
                    const code = `${team.code}-${n}`
                    const count = countFor(code)
                    return (
                      <StickerCell
                        key={code}
                        teamCode={team.code}
                        n={n}
                        count={count}
                        onToggle={() => adjust(code, count >= 1 ? -count : 1)}
                        onInc={() => adjust(code, 1)}
                        onDec={() => adjust(code, -1)}
                      />
                    )
                  })}
                </div>
              )}
            </Card>
          )
        })}

        {hasMore && (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setVisibleCount((c) => c + 10)}
          >
            Ver mais {Math.min(10, teamsInGroup.length - visibleCount)} seleções
          </Button>
        )}
      </div>
    </div>
  )
}

function StickerCell({
  teamCode,
  n,
  count,
  onToggle,
  onInc,
  onDec,
}: {
  teamCode: string
  n: number
  count: number
  onToggle: () => void
  onInc: () => void
  onDec: () => void
}) {
  const owned = count >= 1
  const duplicate = count > 1

  return (
    <div
      className={cn(
        'group relative flex flex-col items-center justify-center rounded-lg border p-2 text-center transition-colors',
        duplicate
          ? 'border-accent bg-accent/30'
          : owned
            ? 'border-primary bg-primary/10'
            : 'border-dashed border-border bg-card',
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full flex-col items-center"
        aria-label={
          owned ? `Remover figurinha ${teamCode} ${n}` : `Colar figurinha ${teamCode} ${n}`
        }
      >
        <span className="font-mono text-[10px] uppercase text-muted-foreground">
          {teamCode}
        </span>
        <span
          className={cn(
            'font-heading text-lg font-extrabold leading-none',
            owned ? 'text-primary' : 'text-foreground',
          )}
        >
          {n}
        </span>
      </button>

      {/* Duplicate counter / controls */}
      {owned ? (
        <div className="mt-2 flex items-center gap-1">
          <button
            onClick={onDec}
            className="grid h-5 w-5 place-items-center rounded bg-background text-foreground shadow-sm hover:bg-secondary"
            aria-label={`Diminuir ${teamCode} ${n}`}
          >
            <Minus className="h-3 w-3" />
          </button>
          <span
            className={cn(
              'min-w-5 rounded px-1 text-center text-xs font-bold',
              duplicate ? 'text-accent-foreground' : 'text-muted-foreground',
            )}
          >
            {count}
          </span>
          <button
            onClick={onInc}
            className="grid h-5 w-5 place-items-center rounded bg-background text-foreground shadow-sm hover:bg-secondary"
            aria-label={`Aumentar ${teamCode} ${n}`}
          >
            <Plus className="h-3 w-3" />
          </button>
        </div>
      ) : (
        <button
          onClick={onInc}
          className="mt-2 flex items-center gap-0.5 rounded px-1.5 py-0.5 text-[11px] font-medium text-muted-foreground hover:text-primary"
          aria-label={`Adicionar ${teamCode} ${n}`}
        >
          <Plus className="h-3 w-3" /> tenho
        </button>
      )}

      {duplicate && (
        <Badge className="absolute -right-1 -top-1 h-5 min-w-5 justify-center bg-accent px-1 text-[10px] text-accent-foreground">
          +{count - 1}
        </Badge>
      )}
    </div>
  )
}
