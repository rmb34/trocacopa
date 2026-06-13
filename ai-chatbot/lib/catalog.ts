// lib/catalog.ts
export type Team = {
  code: string
  name: string
  group: string
  flag: string      // emoji — for text contexts (e.g. WhatsApp share)
  flagCode: string  // ISO 3166-1 alpha-2 for flagcdn.com; empty string for non-country entries
  stickerCount: number
}

export const STICKERS_PER_TEAM = 20

export const TEAMS: Team[] = [
  // Especial — Página inicial
  { code: 'FWC', name: 'FIFA World Cup History', group: 'Especial', flag: '🏆', flagCode: '',        stickerCount: 19 },
  { code: 'CC',  name: 'Coca-Cola',              group: 'Especial', flag: '🥤', flagCode: '',        stickerCount: 14 },
  // Group A
  { code: 'MEX', name: 'México',          group: 'A', flag: '🇲🇽', flagCode: 'mx',     stickerCount: STICKERS_PER_TEAM },
  { code: 'RSA', name: 'África do Sul',   group: 'A', flag: '🇿🇦', flagCode: 'za',     stickerCount: STICKERS_PER_TEAM },
  { code: 'KOR', name: 'Coreia do Sul',   group: 'A', flag: '🇰🇷', flagCode: 'kr',     stickerCount: STICKERS_PER_TEAM },
  { code: 'CZE', name: 'Rep. Tcheca',     group: 'A', flag: '🇨🇿', flagCode: 'cz',     stickerCount: STICKERS_PER_TEAM },
  // Group B
  { code: 'CAN', name: 'Canadá',          group: 'B', flag: '🇨🇦', flagCode: 'ca',     stickerCount: STICKERS_PER_TEAM },
  { code: 'BIH', name: 'Bósnia',          group: 'B', flag: '🇧🇦', flagCode: 'ba',     stickerCount: STICKERS_PER_TEAM },
  { code: 'QAT', name: 'Catar',           group: 'B', flag: '🇶🇦', flagCode: 'qa',     stickerCount: STICKERS_PER_TEAM },
  { code: 'SUI', name: 'Suíça',           group: 'B', flag: '🇨🇭', flagCode: 'ch',     stickerCount: STICKERS_PER_TEAM },
  // Group C
  { code: 'BRA', name: 'Brasil',          group: 'C', flag: '🇧🇷', flagCode: 'br',     stickerCount: STICKERS_PER_TEAM },
  { code: 'MAR', name: 'Marrocos',        group: 'C', flag: '🇲🇦', flagCode: 'ma',     stickerCount: STICKERS_PER_TEAM },
  { code: 'HAI', name: 'Haiti',           group: 'C', flag: '🇭🇹', flagCode: 'ht',     stickerCount: STICKERS_PER_TEAM },
  { code: 'SCO', name: 'Escócia',         group: 'C', flag: '🏴󠁧󠁢󠁳󠁣󠁴󠁿', flagCode: 'gb-sct', stickerCount: STICKERS_PER_TEAM },
  // Group D
  { code: 'USA', name: 'Estados Unidos',  group: 'D', flag: '🇺🇸', flagCode: 'us',     stickerCount: STICKERS_PER_TEAM },
  { code: 'PAR', name: 'Paraguai',        group: 'D', flag: '🇵🇾', flagCode: 'py',     stickerCount: STICKERS_PER_TEAM },
  { code: 'AUS', name: 'Austrália',       group: 'D', flag: '🇦🇺', flagCode: 'au',     stickerCount: STICKERS_PER_TEAM },
  { code: 'TUR', name: 'Turquia',         group: 'D', flag: '🇹🇷', flagCode: 'tr',     stickerCount: STICKERS_PER_TEAM },
  // Group E
  { code: 'GER', name: 'Alemanha',        group: 'E', flag: '🇩🇪', flagCode: 'de',     stickerCount: STICKERS_PER_TEAM },
  { code: 'CUW', name: 'Curaçao',         group: 'E', flag: '🇨🇼', flagCode: 'cw',     stickerCount: STICKERS_PER_TEAM },
  { code: 'CIV', name: 'Costa do Marfim', group: 'E', flag: '🇨🇮', flagCode: 'ci',     stickerCount: STICKERS_PER_TEAM },
  { code: 'ECU', name: 'Equador',         group: 'E', flag: '🇪🇨', flagCode: 'ec',     stickerCount: STICKERS_PER_TEAM },
  // Group F
  { code: 'NED', name: 'Holanda',         group: 'F', flag: '🇳🇱', flagCode: 'nl',     stickerCount: STICKERS_PER_TEAM },
  { code: 'JPN', name: 'Japão',           group: 'F', flag: '🇯🇵', flagCode: 'jp',     stickerCount: STICKERS_PER_TEAM },
  { code: 'SWE', name: 'Suécia',          group: 'F', flag: '🇸🇪', flagCode: 'se',     stickerCount: STICKERS_PER_TEAM },
  { code: 'TUN', name: 'Tunísia',         group: 'F', flag: '🇹🇳', flagCode: 'tn',     stickerCount: STICKERS_PER_TEAM },
  // Group G
  { code: 'BEL', name: 'Bélgica',         group: 'G', flag: '🇧🇪', flagCode: 'be',     stickerCount: STICKERS_PER_TEAM },
  { code: 'EGY', name: 'Egito',           group: 'G', flag: '🇪🇬', flagCode: 'eg',     stickerCount: STICKERS_PER_TEAM },
  { code: 'IRN', name: 'Irã',             group: 'G', flag: '🇮🇷', flagCode: 'ir',     stickerCount: STICKERS_PER_TEAM },
  { code: 'NZL', name: 'Nova Zelândia',   group: 'G', flag: '🇳🇿', flagCode: 'nz',     stickerCount: STICKERS_PER_TEAM },
  // Group H
  { code: 'ESP', name: 'Espanha',         group: 'H', flag: '🇪🇸', flagCode: 'es',     stickerCount: STICKERS_PER_TEAM },
  { code: 'CPV', name: 'Cabo Verde',      group: 'H', flag: '🇨🇻', flagCode: 'cv',     stickerCount: STICKERS_PER_TEAM },
  { code: 'KSA', name: 'Arábia Saudita',  group: 'H', flag: '🇸🇦', flagCode: 'sa',     stickerCount: STICKERS_PER_TEAM },
  { code: 'URU', name: 'Uruguai',         group: 'H', flag: '🇺🇾', flagCode: 'uy',     stickerCount: STICKERS_PER_TEAM },
  // Group I
  { code: 'FRA', name: 'França',          group: 'I', flag: '🇫🇷', flagCode: 'fr',     stickerCount: STICKERS_PER_TEAM },
  { code: 'SEN', name: 'Senegal',         group: 'I', flag: '🇸🇳', flagCode: 'sn',     stickerCount: STICKERS_PER_TEAM },
  { code: 'IRQ', name: 'Iraque',          group: 'I', flag: '🇮🇶', flagCode: 'iq',     stickerCount: STICKERS_PER_TEAM },
  { code: 'NOR', name: 'Noruega',         group: 'I', flag: '🇳🇴', flagCode: 'no',     stickerCount: STICKERS_PER_TEAM },
  // Group J
  { code: 'ARG', name: 'Argentina',       group: 'J', flag: '🇦🇷', flagCode: 'ar',     stickerCount: STICKERS_PER_TEAM },
  { code: 'ALG', name: 'Argélia',         group: 'J', flag: '🇩🇿', flagCode: 'dz',     stickerCount: STICKERS_PER_TEAM },
  { code: 'AUT', name: 'Áustria',         group: 'J', flag: '🇦🇹', flagCode: 'at',     stickerCount: STICKERS_PER_TEAM },
  { code: 'JOR', name: 'Jordânia',        group: 'J', flag: '🇯🇴', flagCode: 'jo',     stickerCount: STICKERS_PER_TEAM },
  // Group K
  { code: 'POR', name: 'Portugal',        group: 'K', flag: '🇵🇹', flagCode: 'pt',     stickerCount: STICKERS_PER_TEAM },
  { code: 'COD', name: 'Congo',           group: 'K', flag: '🇨🇩', flagCode: 'cd',     stickerCount: STICKERS_PER_TEAM },
  { code: 'UZB', name: 'Uzbequistão',     group: 'K', flag: '🇺🇿', flagCode: 'uz',     stickerCount: STICKERS_PER_TEAM },
  { code: 'COL', name: 'Colômbia',        group: 'K', flag: '🇨🇴', flagCode: 'co',     stickerCount: STICKERS_PER_TEAM },
  // Group L
  { code: 'ENG', name: 'Inglaterra',      group: 'L', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', flagCode: 'gb-eng', stickerCount: STICKERS_PER_TEAM },
  { code: 'CRO', name: 'Croácia',         group: 'L', flag: '🇭🇷', flagCode: 'hr',     stickerCount: STICKERS_PER_TEAM },
  { code: 'GHA', name: 'Gana',            group: 'L', flag: '🇬🇭', flagCode: 'gh',     stickerCount: STICKERS_PER_TEAM },
  { code: 'PAN', name: 'Panamá',          group: 'L', flag: '🇵🇦', flagCode: 'pa',     stickerCount: STICKERS_PER_TEAM },
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
