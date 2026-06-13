import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries } from '@/app/actions/stickers'
import { getPurchaseStatus } from '@/lib/db/queries'
import { canAccessTrades } from '@/lib/entitlements'
import { AlbumManager } from '@/components/album-manager'

export default async function AlbumPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const status = await getPurchaseStatus(profile.userId)
  const entries = await getMyEntries()
  return <AlbumManager initialEntries={entries} supporter={canAccessTrades(status)} />
}
