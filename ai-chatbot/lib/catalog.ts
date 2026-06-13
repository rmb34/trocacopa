// Static catalog for the World Cup album. The catalog itself is not stored in
// the database — only a user's owned quantities are (keyed by sticker `code`).
//
// Each team has a fixed set of player stickers. The sticker code is
// `${team.code}-${n}`, e.g. "BRA-1".

export type Team = {
  code: string
  name: string
  group: string
  // Flag emoji is only used as a small decorative accent next to the country
  // name. Real flag images would be ideal but emojis keep the catalog static.
  flag: string
  stickerCount: number
}

// 32-team field grouped A–H, 18 stickers per team (album-style).
export const STICKERS_PER_TEAM = 18

export const TEAMS: Team[] = [
  // Group A
  { code: 'QAT', name: 'Catar', group: 'A', flag: '🇶🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'ECU', name: 'Equador', group: 'A', flag: '🇪🇨', stickerCount: STICKERS_PER_TEAM },
  { code: 'SEN', name: 'Senegal', group: 'A', flag: '🇸🇳', stickerCount: STICKERS_PER_TEAM },
  { code: 'NED', name: 'Holanda', group: 'A', flag: '🇳🇱', stickerCount: STICKERS_PER_TEAM },
  // Group B
  { code: 'ENG', name: 'Inglaterra', group: 'B', flag: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', stickerCount: STICKERS_PER_TEAM },
  { code: 'IRN', name: 'Irã', group: 'B', flag: '🇮🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'USA', name: 'Estados Unidos', group: 'B', flag: '🇺🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'WAL', name: 'País de Gales', group: 'B', flag: '🏴󠁧󠁢󠁷󠁬󠁳󠁿', stickerCount: STICKERS_PER_TEAM },
  // Group C
  { code: 'ARG', name: 'Argentina', group: 'C', flag: '🇦🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'KSA', name: 'Arábia Saudita', group: 'C', flag: '🇸🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'MEX', name: 'México', group: 'C', flag: '🇲🇽', stickerCount: STICKERS_PER_TEAM },
  { code: 'POL', name: 'Polônia', group: 'C', flag: '🇵🇱', stickerCount: STICKERS_PER_TEAM },
  // Group D
  { code: 'FRA', name: 'França', group: 'D', flag: '🇫🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'AUS', name: 'Austrália', group: 'D', flag: '🇦🇺', stickerCount: STICKERS_PER_TEAM },
  { code: 'DEN', name: 'Dinamarca', group: 'D', flag: '🇩🇰', stickerCount: STICKERS_PER_TEAM },
  { code: 'TUN', name: 'Tunísia', group: 'D', flag: '🇹🇳', stickerCount: STICKERS_PER_TEAM },
  // Group E
  { code: 'ESP', name: 'Espanha', group: 'E', flag: '🇪🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'CRC', name: 'Costa Rica', group: 'E', flag: '🇨🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'GER', name: 'Alemanha', group: 'E', flag: '🇩🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'JPN', name: 'Japão', group: 'E', flag: '🇯🇵', stickerCount: STICKERS_PER_TEAM },
  // Group F
  { code: 'BEL', name: 'Bélgica', group: 'F', flag: '🇧🇪', stickerCount: STICKERS_PER_TEAM },
  { code: 'CAN', name: 'Canadá', group: 'F', flag: '🇨🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'MAR', name: 'Marrocos', group: 'F', flag: '🇲🇦', stickerCount: STICKERS_PER_TEAM },
  { code: 'CRO', name: 'Croácia', group: 'F', flag: '🇭🇷', stickerCount: STICKERS_PER_TEAM },
  // Group G
  { code: 'BRA', name: 'Brasil', group: 'G', flag: '🇧🇷', stickerCount: STICKERS_PER_TEAM },
  { code: 'SRB', name: 'Sérvia', group: 'G', flag: '🇷🇸', stickerCount: STICKERS_PER_TEAM },
  { code: 'SUI', name: 'Suíça', group: 'G', flag: '🇨🇭', stickerCount: STICKERS_PER_TEAM },
  { code: 'CMR', name: 'Camarões', group: 'G', flag: '🇨🇲', stickerCount: STICKERS_PER_TEAM },
  // Group H
  { code: 'POR', name: 'Portugal', group: 'H', flag: '🇵🇹', stickerCount: STICKERS_PER_TEAM },
  { code: 'GHA', name: 'Gana', group: 'H', flag: '🇬🇭', stickerCount: STICKERS_PER_TEAM },
  { code: 'URU', name: 'Uruguai', group: 'H', flag: '🇺🇾', stickerCount: STICKERS_PER_TEAM },
  { code: 'KOR', name: 'Coreia do Sul', group: 'H', flag: '🇰🇷', stickerCount: STICKERS_PER_TEAM },
]

export const TOTAL_STICKERS = TEAMS.reduce((sum, t) => sum + t.stickerCount, 0)

export const GROUPS = Array.from(new Set(TEAMS.map((t) => t.group))).sort()

export function stickerCode(teamCode: string, n: number) {
  return `${teamCode}-${n}`
}

export function parseStickerCode(code: string): { teamCode: string; n: number } | null {
  const [teamCode, nStr] = code.split('-')
  const n = Number(nStr)
  if (!teamCode || Number.isNaN(n)) return null
  return { teamCode, n }
}

export function teamByCode(code: string): Team | undefined {
  return TEAMS.find((t) => t.code === code)
}

// All sticker codes in catalog order.
export function allStickerCodes(): string[] {
  const codes: string[] = []
  for (const team of TEAMS) {
    for (let n = 1; n <= team.stickerCount; n++) {
      codes.push(stickerCode(team.code, n))
    }
  }
  return codes
}

// Human-friendly label, e.g. "BRA 5".
export function stickerLabel(code: string) {
  const parsed = parseStickerCode(code)
  if (!parsed) return code
  return `${parsed.teamCode} ${parsed.n}`
}
