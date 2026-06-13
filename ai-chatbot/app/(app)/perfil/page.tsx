import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { ProfileForm } from '@/components/profile-form'

export default async function PerfilPage() {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')
  return <ProfileForm profile={profile} />
}
