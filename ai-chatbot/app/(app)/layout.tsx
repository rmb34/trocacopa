import { redirect } from 'next/navigation'
import { getOrCreateProfile } from '@/app/actions/profile'
import { getPurchaseStatus } from '@/app/actions/purchase'
import { isSupporter } from '@/lib/entitlements'
import { AppHeader } from '@/components/app-header'

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // Freemium: every authenticated user gets in. Feature gating happens
  // server-side per page (see lib/entitlements).
  const profile = await getOrCreateProfile()
  if (!profile) redirect('/sign-in')

  const status = await getPurchaseStatus(profile.userId)

  return (
    <div className="min-h-svh bg-secondary/30">
      <AppHeader
        displayName={profile.displayName}
        slug={profile.slug}
        supporter={isSupporter(status)}
      />
      <main className="mx-auto max-w-6xl px-4 py-6 pb-24 md:py-8 md:pb-8">
        {children}
      </main>
    </div>
  )
}
