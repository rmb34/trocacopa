import { describe, it, expect } from 'vitest'
import {
  computeStats,
  computeTeamProgress,
  computeMatch,
  missingCodes,
  duplicateCodes,
  toEntryMap,
  sortCodes,
  type EntryMap,
} from '@/lib/stats'
import { TOTAL_STICKERS, TEAMS, allStickerCodes } from '@/lib/catalog'

const empty: EntryMap = {}

const full: EntryMap = Object.fromEntries(allStickerCodes().map((c) => [c, 1]))

function withEntries(overrides: EntryMap): EntryMap {
  return { ...overrides }
}

describe('toEntryMap', () => {
  it('converte lista de rows para map', () => {
    const rows = [
      { stickerCode: 'BRA-1', count: 2 },
      { stickerCode: 'BRA-2', count: 0 },
    ]
    expect(toEntryMap(rows)).toEqual({ 'BRA-1': 2, 'BRA-2': 0 })
  })

  it('retorna map vazio para lista vazia', () => {
    expect(toEntryMap([])).toEqual({})
  })
})

describe('computeStats — álbum vazio', () => {
  it('owned=0, missing=TOTAL, percent=0', () => {
    const s = computeStats(empty)
    expect(s.total).toBe(TOTAL_STICKERS)
    expect(s.owned).toBe(0)
    expect(s.missing).toBe(TOTAL_STICKERS)
    expect(s.duplicates).toBe(0)
    expect(s.percent).toBe(0)
  })
})

describe('computeStats — álbum completo', () => {
  it('owned=TOTAL, missing=0, percent=100', () => {
    const s = computeStats(full)
    expect(s.owned).toBe(TOTAL_STICKERS)
    expect(s.missing).toBe(0)
    expect(s.duplicates).toBe(0)
    expect(s.percent).toBe(100)
  })
})

describe('computeStats — parcial com repetidas', () => {
  it('conta duplicatas corretamente: count=3 = 2 extras', () => {
    const entries: EntryMap = { 'BRA-1': 3, 'BRA-2': 1, 'MEX-1': 0 }
    const s = computeStats(entries)
    expect(s.owned).toBe(2) // BRA-1 e BRA-2
    expect(s.duplicates).toBe(2) // BRA-1 tem 2 extras
    expect(s.missing).toBe(TOTAL_STICKERS - 2)
  })

  it('ignorar entradas com count=0 no owned', () => {
    const s = computeStats({ 'ARG-1': 0, 'ARG-2': 1 })
    expect(s.owned).toBe(1)
  })

  it('percent é arredondado', () => {
    // 1 de 993 ≈ 0%
    const s = computeStats({ 'BRA-1': 1 })
    expect(s.percent).toBe(0)
  })
})

describe('missingCodes', () => {
  it('álbum vazio → todos faltando', () => {
    const missing = missingCodes(empty)
    expect(missing).toHaveLength(TOTAL_STICKERS)
  })

  it('álbum completo → nenhum faltando', () => {
    expect(missingCodes(full)).toHaveLength(0)
  })

  it('detecta corretamente quais faltam', () => {
    const entries: EntryMap = { 'BRA-1': 1, 'BRA-2': 0 }
    const missing = missingCodes(entries)
    expect(missing).not.toContain('BRA-1')
    expect(missing).toContain('BRA-2')
    expect(missing).toContain('MEX-1')
  })
})

describe('duplicateCodes', () => {
  it('álbum vazio → sem repetidas', () => {
    expect(duplicateCodes(empty)).toHaveLength(0)
  })

  it('count=1 não é repetida, count>1 é', () => {
    const entries: EntryMap = { 'BRA-1': 1, 'BRA-2': 2, 'BRA-3': 5 }
    const dups = duplicateCodes(entries)
    expect(dups).not.toContain('BRA-1')
    expect(dups).toContain('BRA-2')
    expect(dups).toContain('BRA-3')
  })
})

describe('computeMatch — isolamento multi-tenant', () => {
  it('dois colecionadores sem overlap → score=0', () => {
    const mine: EntryMap = { 'BRA-1': 2 } // tenho BRA-1 repetida
    const theirs: EntryMap = { 'BRA-1': 1 } // eles só têm BRA-1 (não falta)
    const match = computeMatch(mine, theirs)
    expect(match.score).toBe(0)
  })

  it('troca perfeita — youGet e youGive', () => {
    // Eu tenho BRA-1 repetida mas falta MEX-1
    // Outro tem MEX-1 repetida mas falta BRA-1
    const mine: EntryMap = { 'BRA-1': 2 }   // tenho BRA-1 repetida
    const theirs: EntryMap = { 'MEX-1': 2 }  // têm MEX-1 repetida

    const match = computeMatch(mine, theirs)
    expect(match.youGet).toContain('MEX-1') // eles têm repetida que eu preciso
    expect(match.youGive).toContain('BRA-1') // eu tenho repetida que eles precisam
    expect(match.score).toBe(1)
  })

  it('usuário A não vê figurinhas de B como suas (isolamento)', () => {
    const userA: EntryMap = { 'BRA-1': 1, 'BRA-2': 1 }
    const userB: EntryMap = { 'ARG-1': 1, 'ARG-2': 2 }

    const statsA = computeStats(userA)
    const statsB = computeStats(userB)

    // A não tem ARG-1 — não pode aparecer como owned de A
    expect(missingCodes(userA)).toContain('ARG-1')
    // B não tem BRA-1 — não pode aparecer como owned de B
    expect(missingCodes(userB)).toContain('BRA-1')

    // Stats são independentes
    expect(statsA.owned).toBe(2)
    expect(statsB.owned).toBe(2)
  })

  it('score é o mínimo entre youGet e youGive', () => {
    const mine: EntryMap = { 'BRA-1': 2, 'BRA-2': 2, 'BRA-3': 2 }
    const theirs: EntryMap = { 'MEX-1': 2 }

    const match = computeMatch(mine, theirs)
    // youGive tem 3 (BRA-1,2,3), youGet tem 1 (MEX-1)
    expect(match.score).toBe(1)
  })

  it('álbuns vazios → score=0', () => {
    const match = computeMatch(empty, empty)
    expect(match.score).toBe(0)
    expect(match.youGet).toHaveLength(0)
    expect(match.youGive).toHaveLength(0)
  })
})

describe('computeTeamProgress', () => {
  it('álbum vazio → todos os times com 0%', () => {
    const progress = computeTeamProgress(empty)
    expect(progress).toHaveLength(TEAMS.length)
    for (const p of progress) {
      expect(p.owned).toBe(0)
      expect(p.percent).toBe(0)
    }
  })

  it('time completo → 100%', () => {
    const bra = TEAMS.find((t) => t.code === 'BRA')!
    const entries: EntryMap = {}
    for (let n = 1; n <= bra.stickerCount; n++) {
      entries[`BRA-${n}`] = 1
    }
    const progress = computeTeamProgress(entries)
    const braProgress = progress.find((p) => p.code === 'BRA')!
    expect(braProgress.owned).toBe(20)
    expect(braProgress.percent).toBe(100)
  })

  it('total por time bate com stickerCount', () => {
    const progress = computeTeamProgress(empty)
    for (const p of progress) {
      const team = TEAMS.find((t) => t.code === p.code)!
      expect(p.total).toBe(team.stickerCount)
    }
  })
})

describe('sortCodes', () => {
  it('ordena por teamCode e depois por n', () => {
    const codes = ['BRA-10', 'ARG-1', 'BRA-2', 'ARG-20']
    const sorted = [...codes].sort(sortCodes)
    expect(sorted).toEqual(['ARG-1', 'ARG-20', 'BRA-2', 'BRA-10'])
  })
})
