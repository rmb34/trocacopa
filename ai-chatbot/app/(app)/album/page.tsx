import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getMyEntries } from '@/app/actions/stickers'
import { AlbumManager } from '@/components/album-manager'

export default async function AlbumPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const entries = await getMyEntries()
  return <AlbumManager initialEntries={entries} />
}
