import { describe, it, expect } from 'vitest'
import {
  TEAMS,
  GROUPS,
  TOTAL_STICKERS,
  STICKERS_PER_TEAM,
  allStickerCodes,
  parseStickerCode,
  stickerCode,
  teamByCode,
  stickerLabel,
  normalizeSearch,
  searchTeams,
} from '@/lib/catalog'

describe('catalog — integridade dos dados', () => {
  it('tem exatamente 50 entradas (48 seleções + FWC + CC)', () => {
    expect(TEAMS).toHaveLength(50)
  })

  it('tem 48 seleções com 20 figurinhas cada', () => {
    const regular = TEAMS.filter((t) => t.group !== 'Especial')
    expect(regular).toHaveLength(48)
    for (const t of regular) {
      expect(t.stickerCount, `${t.code} deve ter ${STICKERS_PER_TEAM}`).toBe(STICKERS_PER_TEAM)
    }
  })

  it('seção FWC tem 19 figurinhas', () => {
    const fwc = TEAMS.find((t) => t.code === 'FWC')
    expect(fwc).toBeDefined()
    expect(fwc!.stickerCount).toBe(19)
  })

  it('seção CC tem 14 figurinhas', () => {
    const cc = TEAMS.find((t) => t.code === 'CC')
    expect(cc).toBeDefined()
    expect(cc!.stickerCount).toBe(14)
  })

  it('TOTAL_STICKERS é 993', () => {
    expect(TOTAL_STICKERS).toBe(993)
  })

  it('TOTAL_STICKERS bate com soma real das stickerCount', () => {
    const sum = TEAMS.reduce((s, t) => s + t.stickerCount, 0)
    expect(TOTAL_STICKERS).toBe(sum)
  })

  it('grupos A–L + Especial presentes (13 grupos)', () => {
    expect(GROUPS).toHaveLength(13)
    expect(GROUPS).toContain('Especial')
    for (const g of ['A','B','C','D','E','F','G','H','I','J','K','L']) {
      expect(GROUPS).toContain(g)
    }
  })

  it('Especial é sempre o último grupo em GROUPS', () => {
    expect(GROUPS[GROUPS.length - 1]).toBe('Especial')
  })

  it('cada grupo A–L tem exatamente 4 seleções', () => {
    for (const g of ['A','B','C','D','E','F','G','H','I','J','K','L']) {
      const teams = TEAMS.filter((t) => t.group === g)
      expect(teams, `grupo ${g}`).toHaveLength(4)
    }
  })

  it('todos os códigos de seleção são únicos', () => {
    const codes = TEAMS.map((t) => t.code)
    expect(new Set(codes).size).toBe(codes.length)
  })

  it('allStickerCodes() retorna 993 códigos únicos', () => {
    const codes = allStickerCodes()
    expect(codes).toHaveLength(993)
    expect(new Set(codes).size).toBe(993)
  })
})

describe('parseStickerCode', () => {
  it('parse de código simples', () => {
    expect(parseStickerCode('BRA-1')).toEqual({ teamCode: 'BRA', n: 1 })
    expect(parseStickerCode('MEX-20')).toEqual({ teamCode: 'MEX', n: 20 })
  })

  it('parse de código com hífen no teamCode (FWC é simples, mas RSA-SA não existe — garantir robustez)', () => {
    // parseStickerCode usa lastIndexOf('-') então pega o último segmento
    expect(parseStickerCode('FWC-19')).toEqual({ teamCode: 'FWC', n: 19 })
    expect(parseStickerCode('CC-14')).toEqual({ teamCode: 'CC', n: 14 })
  })

  it('retorna null para código inválido', () => {
    expect(parseStickerCode('')).toBeNull()
    expect(parseStickerCode('BRA')).toBeNull()
    expect(parseStickerCode('BRA-abc')).toBeNull()
  })
})

describe('stickerCode', () => {
  it('gera código no formato correto', () => {
    expect(stickerCode('BRA', 1)).toBe('BRA-1')
    expect(stickerCode('FWC', 19)).toBe('FWC-19')
  })
})

describe('teamByCode', () => {
  it('encontra seleção por código', () => {
    const bra = teamByCode('BRA')
    expect(bra).toBeDefined()
    expect(bra!.name).toBe('Brasil')
  })

  it('retorna undefined para código inexistente', () => {
    expect(teamByCode('XYZ')).toBeUndefined()
  })
})

describe('stickerLabel', () => {
  it('retorna label legível', () => {
    expect(stickerLabel('BRA-1')).toBe('BRA 1')
    expect(stickerLabel('MEX-20')).toBe('MEX 20')
  })

  it('retorna o código original se inválido', () => {
    expect(stickerLabel('INVALIDO')).toBe('INVALIDO')
  })
})

describe('normalizeSearch', () => {
  it('ignora maiúsculas/minúsculas', () => {
    expect(normalizeSearch('Brasil')).toBe(normalizeSearch('brasil'))
  })

  it('ignora acentos', () => {
    expect(normalizeSearch('México')).toBe(normalizeSearch('Mexico'))
    expect(normalizeSearch('África do Sul')).toBe(normalizeSearch('Africa do Sul'))
  })

  it('remove espaços nas pontas', () => {
    expect(normalizeSearch('  Brasil  ')).toBe('brasil')
  })
})

describe('searchTeams', () => {
  it('sem query, retorna a lista original', () => {
    expect(searchTeams(TEAMS, '')).toBe(TEAMS)
    expect(searchTeams(TEAMS, '   ')).toBe(TEAMS)
  })

  it('encontra por nome completo ou parcial, sem diferenciar caixa', () => {
    expect(searchTeams(TEAMS, 'brasil').map((t) => t.code)).toEqual(['BRA'])
    expect(searchTeams(TEAMS, 'BRASIL').map((t) => t.code)).toEqual(['BRA'])
    expect(searchTeams(TEAMS, 'bras').map((t) => t.code)).toEqual(['BRA'])
  })

  it('encontra por nome ignorando acentuação', () => {
    expect(searchTeams(TEAMS, 'mexico').map((t) => t.code)).toEqual(['MEX'])
    expect(searchTeams(TEAMS, 'africa').map((t) => t.code)).toEqual(['RSA'])
  })

  it('encontra pela sigla oficial do álbum', () => {
    expect(searchTeams(TEAMS, 'BRA').map((t) => t.code)).toEqual(['BRA'])
    expect(searchTeams(TEAMS, 'ger').map((t) => t.code)).toEqual(['GER'])
  })

  it('retorna lista vazia quando nada casa', () => {
    expect(searchTeams(TEAMS, 'zzz-nao-existe')).toEqual([])
  })

  it('opera sobre a lista passada, não sempre sobre TEAMS inteiro', () => {
    const groupA = TEAMS.filter((t) => t.group === 'A')
    expect(searchTeams(groupA, 'BRA')).toEqual([])
  })
})
