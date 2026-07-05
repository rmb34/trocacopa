'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { authClient } from '@/lib/auth-client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card } from '@/components/ui/card'
import { Logo } from '@/components/logo'

export function AuthForm({ mode }: { mode: 'sign-in' | 'sign-up' }) {
  const router = useRouter()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  const isSignUp = mode === 'sign-up'

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = isSignUp
      ? await authClient.signUp.email({ email, password, name })
      : await authClient.signIn.email({ email, password })

    setLoading(false)

    if (error) {
      setError(
        error.message === 'Invalid email or password'
          ? 'E-mail ou senha inválidos.'
          : (error.message ?? 'Algo deu errado. Tente novamente.'),
      )
      return
    }

    router.push('/dashboard')
    router.refresh()
  }

  return (
    <main className="min-h-svh bg-secondary flex items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm">
        <Link href="/" className="flex justify-center mb-6">
          <Logo />
        </Link>
        <Card className="w-full p-6">
          <div className="mb-6">
            <h1 className="text-2xl font-heading font-extrabold tracking-tight text-foreground">
              {isSignUp ? 'Criar conta' : 'Bem-vindo de volta'}
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              {isSignUp
                ? 'Comece a montar seu álbum em segundos.'
                : 'Entre para acessar seu álbum e suas trocas.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {isSignUp && (
              <div className="flex flex-col gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  autoComplete="name"
                  placeholder="Como te chamam?"
                />
              </div>
            )}
            <div className="flex flex-col gap-2">
              <Label htmlFor="email">E-mail</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
                placeholder="voce@email.com"
              />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="password">Senha</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                autoComplete={isSignUp ? 'new-password' : 'current-password'}
                placeholder="Mínimo de 8 caracteres"
              />
            </div>

            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}

            <Button type="submit" disabled={loading} className="w-full">
              {loading ? 'Aguarde...' : isSignUp ? 'Criar conta' : 'Entrar'}
            </Button>
          </form>

          <p className="text-sm text-muted-foreground text-center mt-6">
            {isSignUp ? 'Já tem uma conta? ' : 'Ainda não tem conta? '}
            <Link
              href={isSignUp ? '/sign-in' : '/sign-up'}
              className="text-primary font-semibold underline-offset-4 hover:underline"
            >
              {isSignUp ? 'Entrar' : 'Criar conta'}
            </Link>
          </p>
        </Card>
      </div>
    </main>
  )
}
