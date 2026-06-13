'use client'

import { useState, useEffect, useTransition } from 'react'
import { updateProfile } from '@/app/actions/profile'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { ShareButton } from '@/components/share-button'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

type ProfileData = {
  displayName: string
  city: string | null
  whatsapp: string | null
  isPublic: boolean
  slug: string
}

export function ProfileForm({ profile }: { profile: ProfileData }) {
  const [displayName, setDisplayName] = useState(profile.displayName)
  const [city, setCity] = useState(profile.city ?? '')
  const [whatsapp, setWhatsapp] = useState(profile.whatsapp ?? '')
  const [isPublic, setIsPublic] = useState(profile.isPublic)
  const [publicUrl, setPublicUrl] = useState(`/u/${profile.slug}`)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    setPublicUrl(`${window.location.origin}/u/${profile.slug}`)
  }, [profile.slug])

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    startTransition(async () => {
      try {
        await updateProfile({ displayName, city, whatsapp, isPublic })
        toast.success('Perfil atualizado!')
      } catch {
        toast.error('Não foi possível salvar. Tente de novo.')
      }
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-heading text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
          Meu perfil
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Personalize como você aparece para outros colecionadores.
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold">Seu link público</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center gap-2">
          <code className="flex-1 truncate rounded bg-secondary px-3 py-2 text-xs text-muted-foreground sm:text-sm">
            {publicUrl}
          </code>
          <ShareButton
            text={publicUrl}
            label="Copiar"
            labelCopied="Copiado!"
            variant="outline"
          />
        </CardContent>
      </Card>

      <form onSubmit={handleSubmit}>
        <Card>
          <CardContent className="flex flex-col gap-5 p-5">
            <div className="flex flex-col gap-2">
              <Label htmlFor="displayName">Nome *</Label>
              <Input
                id="displayName"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                maxLength={60}
                required
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="city">Cidade</Label>
              <Input
                id="city"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                maxLength={80}
                placeholder="São Paulo, SP"
              />
            </div>

            <div className="flex flex-col gap-2">
              <Label htmlFor="whatsapp">WhatsApp</Label>
              <Input
                id="whatsapp"
                value={whatsapp}
                onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ''))}
                placeholder="11999999999"
                maxLength={15}
                inputMode="numeric"
              />
              <p className="text-xs text-muted-foreground">
                Só números com DDD. Guardado em privado — não aparece no seu perfil público.
              </p>
            </div>

            <div className="flex items-center justify-between rounded-lg border border-border p-4">
              <div className="flex-1 pr-4">
                <Label htmlFor="isPublic" className="cursor-pointer font-medium">
                  Perfil público
                </Label>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Quando ativo, outros colecionadores podem te encontrar para trocas
                </p>
              </div>
              <Switch
                id="isPublic"
                checked={isPublic}
                onCheckedChange={setIsPublic}
              />
            </div>

            <Button type="submit" disabled={isPending} size="lg" className="w-full gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Salvando…
                </>
              ) : (
                'Salvar alterações'
              )}
            </Button>
          </CardContent>
        </Card>
      </form>
    </div>
  )
}
