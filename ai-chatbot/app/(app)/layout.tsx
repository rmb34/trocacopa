import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { AppHeader } from '@/components/app-header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  return (
    <div className="min-h-svh bg-secondary/30">
      <AppHeader displayName={profile.displayName} slug={profile.slug} />
      <main className="mx-auto max-w-6xl px-4 py-6 md:py-8">{children}</main>
    </div>
  )
}
