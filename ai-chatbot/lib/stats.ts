import { TEAMS, TOTAL_STICKERS, allStickerCodes, parseStickerCode } from './catalog'

export type EntryMap = Record<string, number>

// Turn a list of {stickerCode, count} rows into a quick lookup map.
export function toEntryMap(rows: { stickerCode: string; count: number }[]): EntryMap {
  const map: EntryMap = {}
  for (const row of rows) map[row.stickerCode] = row.count
  return map
}

export type CollectionStats = {
  total: number
  owned: number // distinct stickers with count >= 1
  missing: number // distinct stickers with count === 0
  duplicates: number // sum of (count - 1) over count > 1
  percent: number // 0-100 completion
}

export function computeStats(entries: EntryMap): CollectionStats {
  let owned = 0
  let duplicates = 0
  for (const code of allStickerCodes()) {
    const count = entries[code] ?? 0
    if (count >= 1) owned += 1
    if (count > 1) duplicates += count - 1
  }
  const total = TOTAL_STICKERS
  const missing = total - owned
  const percent = total === 0 ? 0 : Math.round((owned / total) * 100)
  return { total, owned, missing, duplicates, percent }
}

// Per-team progress for the dashboard / album header.
export type TeamProgress = {
  code: string
  name: string
  group: string
  flag: string
  owned: number
  total: number
  percent: number
}

export function computeTeamProgress(entries: EntryMap): TeamProgress[] {
  return TEAMS.map((team) => {
    let owned = 0
    for (let n = 1; n <= team.stickerCount; n++) {
      if ((entries[`${team.code}-${n}`] ?? 0) >= 1) owned += 1
    }
    return {
      code: team.code,
      name: team.name,
      group: team.group,
      flag: team.flag,
      owned,
      total: team.stickerCount,
      percent: Math.round((owned / team.stickerCount) * 100),
    }
  })
}

// Codes the user is missing (count 0).
export function missingCodes(entries: EntryMap): string[] {
  return allStickerCodes().filter((code) => (entries[code] ?? 0) === 0)
}

// Codes the user has duplicates of (count > 1).
export function duplicateCodes(entries: EntryMap): string[] {
  return allStickerCodes().filter((code) => (entries[code] ?? 0) > 1)
}

// Given two collectors, find a mutually beneficial swap:
// - "youGet": stickers they have spare that you are missing
// - "youGive": stickers you have spare that they are missing
export function computeMatch(mine: EntryMap, theirs: EntryMap) {
  const myMissing = new Set(missingCodes(mine))
  const myDup = new Set(duplicateCodes(mine))
  const theirMissing = new Set(missingCodes(theirs))
  const theirDup = new Set(duplicateCodes(theirs))

  const youGet = [...theirDup].filter((c) => myMissing.has(c))
  const youGive = [...myDup].filter((c) => theirMissing.has(c))

  return {
    youGet: youGet.sort(sortCodes),
    youGive: youGive.sort(sortCodes),
    score: Math.min(youGet.length, youGive.length),
  }
}

export function sortCodes(a: string, b: string) {
  const pa = parseStickerCode(a)
  const pb = parseStickerCode(b)
  if (!pa || !pb) return a.localeCompare(b)
  if (pa.teamCode !== pb.teamCode) return pa.teamCode.localeCompare(pb.teamCode)
  return pa.n - pb.n
}
