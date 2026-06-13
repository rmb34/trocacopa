// lib/catalog.ts
export type Team = {
  code: string
  name: string
  group: string
  flag: string
  stickerCount: number
}

export const STICKERS_PER_TEAM = 20

export const TEAMS: Team[] = [
  // Especial — Página inicial
  { code: 'FWC', name: 'FIFA World Cup History', group: 'Especial', flag: '🏆', stickerCount: 19 },
  { code: 'CC',  name: 'Coca-Cola',              group: 'Especial', flag: '🥤', stickerCount: 14 },
  // Group A
  { code: 'MEX', name: 'México',          group: 'A', flag: '🇲🇽', stickerCount: STICKERS_PER_TEAM },
  { code: 'RSA', name: 'África do Sul',   group: 'A', flag: '🇿🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'KOR', name: 'Coreia do Sul',   group: 'A', flag: '🇰🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'CZE', name: 'Rep. Tcheca',     group: 'A', flag: '🇨🇿', stickerCount: STICKERS_PER_TEAM },
  // Group B
  { code: 'CAN', name: 'Canadá',          group: 'B', flag: '🇨🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'BIH', name: 'Bósnia',          group: 'B', flag: '🇧🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'QAT', name: 'Catar',           group: 'B', flag: '🇶🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'SUI', name: 'Suíça',           group: 'B', flag: '🇨🇭', stickerCount: STICKERS_PER_TEAM },
  // Group C
  { code: 'BRA', name: 'Brasil',          group: 'C', flag: '🇧🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'MAR', name: 'Marrocos',        group: 'C', flag: '🇲🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'HAI', name: 'Haiti',           group: 'C', flag: '🇭🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'SCO', name: 'Escócia',         group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', stickerCount: STICKERS_PER_TEAM },
  // Group D
  { code: 'USA', name: 'Estados Unidos',  group: 'D', flag: '🇺🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'PAR', name: 'Paraguai',        group: 'D', flag: '🇵🇾', stickerCount: STICKERS_PER_TEAM },
  { code: 'AUS', name: 'Austrália',       group: 'D', flag: '🇦🇺', stickerCount: STICKERS_PER_TEAM },
  { code: 'TUR', name: 'Turquia',         group: 'D', flag: '🇹🇷', stickerCount: STICKERS_PER_TEAM },
  // Group E
  { code: 'GER', name: 'Alemanha',        group: 'E', flag: '🇩🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'CUW', name: 'Curaçao',         group: 'E', flag: '🇨🇼', stickerCount: STICKERS_PER_TEAM },
  { code: 'CIV', name: 'Costa do Marfim', group: 'E', flag: '🇨🇮', stickerCount: STICKERS_PER_TEAM },
  { code: 'ECU', name: 'Equador',         group: 'E', flag: '🇪🇨', stickerCount: STICKERS_PER_TEAM },
  // Group F
  { code: 'NED', name: 'Holanda',         group: 'F', flag: '🇳🇱', stickerCount: STICKERS_PER_TEAM },
  { code: 'JPN', name: 'Japão',           group: 'F', flag: '🇯🇵', stickerCount: STICKERS_PER_TEAM },
  { code: 'SWE', name: 'Suécia',          group: 'F', flag: '🇸🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'TUN', name: 'Tunísia',         group: 'F', flag: '🇹🇳', stickerCount: STICKERS_PER_TEAM },
  // Group G
  { code: 'BEL', name: 'Bélgica',         group: 'G', flag: '🇧🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'EGY', name: 'Egito',           group: 'G', flag: '🇪🇬', stickerCount: STICKERS_PER_TEAM },
  { code: 'IRN', name: 'Irã',             group: 'G', flag: '🇮🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'NZL', name: 'Nova Zelândia',   group: 'G', flag: '🇳🇿', stickerCount: STICKERS_PER_TEAM },
  // Group H
  { code: 'ESP', name: 'Espanha',         group: 'H', flag: '🇪🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'CPV', name: 'Cabo Verde',      group: 'H', flag: '🇨🇻', stickerCount: STICKERS_PER_TEAM },
  { code: 'KSA', name: 'Arábia Saudita',  group: 'H', flag: '🇸🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'URU', name: 'Uruguai',         group: 'H', flag: '🇺🇾', stickerCount: STICKERS_PER_TEAM },
  // Group I
  { code: 'FRA', name: 'França',          group: 'I', flag: '🇫🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'SEN', name: 'Senegal',         group: 'I', flag: '🇸🇳', stickerCount: STICKERS_PER_TEAM },
  { code: 'IRQ', name: 'Iraque',          group: 'I', flag: '🇮🇶', stickerCount: STICKERS_PER_TEAM },
  { code: 'NOR', name: 'Noruega',         group: 'I', flag: '🇳🇴', stickerCount: STICKERS_PER_TEAM },
  // Group J
  { code: 'ARG', name: 'Argentina',       group: 'J', flag: '🇦🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'ALG', name: 'Argélia',         group: 'J', flag: '🇩🇿', stickerCount: STICKERS_PER_TEAM },
  { code: 'AUT', name: 'Áustria',         group: 'J', flag: '🇦🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'JOR', name: 'Jordânia',        group: 'J', flag: '🇯🇴', stickerCount: STICKERS_PER_TEAM },
  // Group K
  { code: 'POR', name: 'Portugal',        group: 'K', flag: '🇵🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'COD', name: 'Congo',           group: 'K', flag: '🇨🇩', stickerCount: STICKERS_PER_TEAM },
  { code: 'UZB', name: 'Uzbequistão',     group: 'K', flag: '🇺🇿', stickerCount: STICKERS_PER_TEAM },
  { code: 'COL', name: 'Colômbia',        group: 'K', flag: '🇨🇴', stickerCount: STICKERS_PER_TEAM },
  // Group L
  { code: 'ENG', name: 'Inglaterra',      group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stickerCount: STICKERS_PER_TEAM },
  { code: 'CRO', name: 'Croácia',         group: 'L', flag: '🇭🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'GHA', name: 'Gana',            group: 'L', flag: '🇬🇭', stickerCount: STICKERS_PER_TEAM },
  { code: 'PAN', name: 'Panamá',          group: 'L', flag: '🇵🇦', stickerCount: STICKERS_PER_TEAM },
]

export const TOTAL_STICKERS = TEAMS.reduce((sum, t) => sum + t.stickerCount, 0)
// 19 + 14 + 48×20 = 993

export const GROUPS = Array.from(new Set(TEAMS.map((t) => t.group))).sort((a, b) => {
  if (a === 'Especial') return 1
  if (b === 'Especial') return -1
  return a.localeCompare(b)
})
// ['A','B','C','D','E','F','G','H','I','J','K','L','Especial']

export function stickerCode(teamCode: string, n: number) {
  return `${teamCode}-${n}`
}

export function parseStickerCode(code: string): { teamCode: string; n: number } | null {
  const idx = code.lastIndexOf('-')
  if (idx === -1) return null
  const teamCode = code.slice(0, idx)
  const n = Number(code.slice(idx + 1))
  if (!teamCode || Number.isNaN(n)) return null
  return { teamCode, n }
}

export function teamByCode(code: string): Team | undefined {
  return TEAMS.find((t) => t.code === code)
}

export function allStickerCodes(): string[] {
  const codes: string[] = []
  for (const team of TEAMS) {
    for (let n = 1; n <= team.stickerCount; n++) {
      codes.push(stickerCode(team.code, n))
    }
  }
  return codes
}

export function stickerLabel(code: string) {
  const parsed = parseStickerCode(code)
  if (!parsed) return code
  return `${parsed.teamCode} ${parsed.n}`
}
