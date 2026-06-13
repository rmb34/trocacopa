// Single source of truth for freemium access decisions.
// Pure functions — applied server-side; the UI only renders their result.

export type PurchaseStatus = 'none' | 'pending' | 'paid'

export function isSupporter(status: PurchaseStatus): boolean {
  return status === 'paid'
}

export function canAccessTrades(status: PurchaseStatus): boolean {
  return isSupporter(status)
}

export function canShowTradeInventory(status: PurchaseStatus): boolean {
  return isSupporter(status)
}

export function showSupporterBadge(status: PurchaseStatus): boolean {
  return isSupporter(status)
}

// View-model for the public profile. Guarantees a free collector's duplicates
// are NEVER exposed: `duplicates` comes back empty unless the owner is a
// supporter. `missing` (the wishlist) is always available — it's the free,
// viral surface.
export function publicProfileSections(
  ownerStatus: PurchaseStatus,
  missing: string[],
  duplicates: string[],
): { missing: string[]; duplicates: string[]; showBadge: boolean } {
  const supporter = isSupporter(ownerStatus)
  return {
    missing,
    duplicates: supporter ? duplicates : [],
    showBadge: supporter,
  }
}
