'use client'

import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'

export function LogoutButton({ className, children }: { className?: string; children: React.ReactNode }) {
  const router = useRouter()

  async function handle() {
    await authClient.signOut()
    router.push('/')
    router.refresh()
  }

  return (
    <button type="button" onClick={handle} className={className}>
      {children}
    </button>
  )
}
