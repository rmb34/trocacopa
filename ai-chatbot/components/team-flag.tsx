import { cn } from '@/lib/utils'

type FlagTeam = { flag: string; flagCode: string; name: string }

export function TeamFlag({
  team,
  size = 'md',
  className,
}: {
  team: FlagTeam
  size?: 'sm' | 'md' | 'lg'
  className?: string
}) {
  const dims = { sm: { w: 20, h: 15 }, md: { w: 28, h: 21 }, lg: { w: 40, h: 30 } }[size]

  if (!team.flagCode) {
    const textSize = { sm: 'text-sm', md: 'text-xl', lg: 'text-2xl' }[size]
    return (
      <span aria-hidden className={cn('leading-none', textSize, className)}>
        {team.flag}
      </span>
    )
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://flagcdn.com/w40/${team.flagCode}.png`}
      alt={team.name}
      width={dims.w}
      height={dims.h}
      className={cn('inline-block rounded-sm object-cover align-middle shadow-sm', className)}
      loading="lazy"
    />
  )
}
