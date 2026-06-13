import { describe, it, expect } from 'vitest'
import {
  isSupporter,
  canAccessTrades,
  canShowTradeInventory,
  showSupporterBadge,
  publicProfileSections,
  type PurchaseStatus,
} from '@/lib/entitlements'

const NON_PAID: PurchaseStatus[] = ['none', 'pending']

describe('isSupporter', () => {
  it('é true apenas para status paid', () => {
    expect(isSupporter('paid')).toBe(true)
  })
  it.each(NON_PAID)('é false para status %s', (s) => {
    expect(isSupporter(s)).toBe(false)
  })
})

describe('gates de feature espelham isSupporter', () => {
  it('canAccessTrades libera só para paid', () => {
    expect(canAccessTrades('paid')).toBe(true)
    expect(canAccessTrades('none')).toBe(false)
    expect(canAccessTrades('pending')).toBe(false)
  })
  it('canShowTradeInventory libera só para paid', () => {
    expect(canShowTradeInventory('paid')).toBe(true)
    expect(canShowTradeInventory('none')).toBe(false)
  })
  it('showSupporterBadge libera só para paid', () => {
    expect(showSupporterBadge('paid')).toBe(true)
    expect(showSupporterBadge('pending')).toBe(false)
  })
})

describe('publicProfileSections', () => {
  const missing = ['BRA-1', 'BRA-2']
  const duplicates = ['ARG-3', 'ARG-4']

  it.each(NON_PAID)('oculta duplicatas quando o dono é %s', (s) => {
    const r = publicProfileSections(s, missing, duplicates)
    expect(r.duplicates).toEqual([])
    expect(r.showBadge).toBe(false)
  })

  it('expõe duplicatas e selo quando o dono é Apoiador', () => {
    const r = publicProfileSections('paid', missing, duplicates)
    expect(r.duplicates).toEqual(duplicates)
    expect(r.showBadge).toBe(true)
  })

  it('mantém a wishlist (missing) intacta em qualquer tier', () => {
    expect(publicProfileSections('none', missing, duplicates).missing).toEqual(missing)
    expect(publicProfileSections('paid', missing, duplicates).missing).toEqual(missing)
  })
})
