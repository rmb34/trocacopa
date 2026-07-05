'use client'

import { useEffect, useState } from 'react'
import { useTheme } from 'next-themes'
import { Moon, Sun } from 'lucide-react'

// Thin wrapper over next-themes: exposes the resolved dark state (false until
// mounted, so server and first client render always agree) and a toggle that
// pins an explicit light/dark choice.
export function useDarkMode() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const dark = mounted && resolvedTheme === 'dark'

  function toggle() {
    setTheme(dark ? 'light' : 'dark')
  }

  return { dark, toggle }
}

export function ThemeToggle() {
  const { dark, toggle } = useDarkMode()

  return (
    <button
      onClick={toggle}
      aria-label={dark ? 'Ativar modo claro' : 'Ativar modo escuro'}
      className="grid h-9 w-9 place-items-center rounded-md text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
    >
      {dark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  )
}
