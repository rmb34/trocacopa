# Atalho de compartilhar perfil no dashboard + redesign do botão Álbum — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Adicionar um atalho de "Compartilhar perfil" no dashboard, ao lado do botão Álbum, e redesenhar os dois como cards de ação consistentes com o resto da página.

**Architecture:** Uma nova server action (`publishProfile`) ativa o perfil público de forma idempotente. Um novo client component (`ShareProfileCard`) chama essa action, copia o link e mostra feedback. O dashboard troca o `<Button>` solto do Álbum por um grid de 2 cards reaproveitando o padrão visual já existente no card "Minhas repetidas" (ícone em círculo + título + subtítulo).

**Tech Stack:** Next.js 15 (App Router, Server Actions), Drizzle ORM + Postgres (Neon), React 19, Tailwind, lucide-react, sonner (toast).

## Global Constraints

- Spec de referência: `docs/superpowers/specs/2026-06-20-dashboard-compartilhar-perfil-design.md`.
- `publishProfile()` só escreve no banco quando `isPublic` ainda é `false` (idempotente — não toca em `updatedAt` em cliques repetidos com perfil já público).
- Não alterar `components/profile-form.tsx` nem o card "Minhas repetidas" — fora de escopo.
- Sem popover, sem navegação no clique de "Compartilhar" — só copia o link.
- **Sobre testes:** este projeto não tem testes automatizados para nenhuma server action que toca o banco (`getOrCreateProfile`, `updateProfile`) nem para nenhum client component (`ShareButton`, `ProfileForm`) — só funções puras em `lib/` são testadas com Vitest (`__tests__/stats.test.ts`, `__tests__/catalog.test.ts`). Criar infraestrutura de teste de integração (banco de teste) agora seria uma expansão de escopo não pedida. Cada task abaixo usa **verificação manual** (curl contra o servidor real) em vez de testes automatizados, seguindo o padrão já estabelecido no código existente.

---

### Task 1: Server action `publishProfile()`

**Files:**
- Modify: `ai-chatbot/app/actions/profile.ts`

**Interfaces:**
- Produces: `publishProfile(): Promise<{ slug: string; activated: boolean }>` — usado pela Task 2.

- [ ] **Step 1: Adicionar `and` ao import do drizzle-orm**

Em `ai-chatbot/app/actions/profile.ts`, troque:

```ts
import { eq } from 'drizzle-orm'
```

por:

```ts
import { eq, and } from 'drizzle-orm'
```

- [ ] **Step 2: Adicionar a função `publishProfile`**

No final de `ai-chatbot/app/actions/profile.ts` (depois de `updateProfile`), adicione:

```ts
export async function publishProfile() {
  const userId = await getUserId()

  const [activated] = await db
    .update(profile)
    .set({ isPublic: true, updatedAt: new Date() })
    .where(and(eq(profile.userId, userId), eq(profile.isPublic, false)))
    .returning({ slug: profile.slug })

  if (activated) {
    revalidatePath('/perfil')
    revalidatePath('/dashboard')
    return { slug: activated.slug, activated: true }
  }

  const [existing] = await db
    .select({ slug: profile.slug })
    .from(profile)
    .where(eq(profile.userId, userId))
    .limit(1)

  return { slug: existing.slug, activated: false }
}
```

- [ ] **Step 3: Verificar TypeScript**

Run: `cd ai-chatbot && npx tsc --noEmit 2>&1 | grep -i "profile.ts"`
Expected: nenhuma linha de saída (sem erros novos em `profile.ts`).

- [ ] **Step 4: Verificação manual local**

Suba o dev server:

Run: `cd ai-chatbot && npm run dev`

Em outro terminal, crie uma conta de teste, capture o cookie de sessão e chame a action indiretamente visitando `/perfil` antes/depois — como `publishProfile` é uma server action sem rota HTTP própria, a verificação completa só é possível depois da Task 3 (quando o botão a expõe na UI). Por ora, confirme apenas que o arquivo compila e que `npm run dev` sobe sem erro:

Expected: servidor inicia em `http://localhost:3000` sem erro de compilação no terminal.

Pare o servidor (Ctrl+C) antes de seguir.

- [ ] **Step 5: Commit**

```bash
cd /home/lucas/Documents/trocaCopa
git add ai-chatbot/app/actions/profile.ts
git commit -m "feat(profile): adicionar publishProfile para ativação idempotente do perfil público"
```

---

### Task 2: Client component `ShareProfileCard`

**Files:**
- Create: `ai-chatbot/components/share-profile-card.tsx`

**Interfaces:**
- Consumes: `publishProfile(): Promise<{ slug: string; activated: boolean }>` (Task 1, de `@/app/actions/profile`).
- Produces: `ShareProfileCard({ slug, isPublic }: { slug: string; isPublic: boolean })` — usado pela Task 3.

- [ ] **Step 1: Criar o componente**

Crie `ai-chatbot/components/share-profile-card.tsx`:

```tsx
'use client'

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Share2, Check } from 'lucide-react'
import { publishProfile } from '@/app/actions/profile'
import { toast } from 'sonner'

export function ShareProfileCard({
  slug,
  isPublic,
}: {
  slug: string
  isPublic: boolean
}) {
  const [copied, setCopied] = useState(false)
  const [isPublicState, setIsPublicState] = useState(isPublic)

  async function handleClick() {
    const result = await publishProfile()
    const url = `${window.location.origin}/u/${result.slug}`

    await navigator.clipboard.writeText(url)
    setCopied(true)
    setIsPublicState(true)
    toast.success(result.activated ? 'Perfil ativado e link copiado!' : 'Link copiado!')
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <button type="button" onClick={handleClick} className="text-left">
      <Card className="transition-colors hover:border-primary/50">
        <CardContent className="flex items-center gap-3 p-4">
          <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
            {copied ? <Check className="h-5 w-5" /> : <Share2 className="h-5 w-5" />}
          </div>
          <div className="min-w-0">
            <p className="font-semibold text-foreground">Compartilhar</p>
            <p className="truncate text-xs text-muted-foreground">
              {isPublicState ? 'Link p/ trocas' : 'Ativar link p/ trocas'}
            </p>
          </div>
        </CardContent>
      </Card>
    </button>
  )
}
```

Nota: `slug` é recebido via prop mas não usado diretamente no JSX — é só o valor inicial vindo do server; o componente sempre usa o `slug` retornado por `publishProfile()` (que é o mesmo valor, mas evita depender de uma prop potencialmente desatualizada após revalidação). Isso é intencional: a prop existe para deixar a interface explícita sobre o que o componente representa, mesmo sem leitura direta no JSX.

- [ ] **Step 2: Verificar TypeScript**

Run: `cd ai-chatbot && npx tsc --noEmit 2>&1 | grep -i "share-profile-card"`
Expected: nenhuma linha de saída.

- [ ] **Step 3: Commit**

```bash
cd /home/lucas/Documents/trocaCopa
git add ai-chatbot/components/share-profile-card.tsx
git commit -m "feat(profile): criar ShareProfileCard para compartilhar link público"
```

---

### Task 3: Wire no dashboard

**Files:**
- Modify: `ai-chatbot/app/(app)/dashboard/page.tsx`

**Interfaces:**
- Consumes: `ShareProfileCard` (Task 2), `profile.slug` e `profile.isPublic` (já retornados por `getOrCreateProfile()`, chamado na linha 13 do arquivo).

- [ ] **Step 1: Atualizar imports**

Em `ai-chatbot/app/(app)/dashboard/page.tsx`, troque:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { BookOpen, Copy, CheckCircle2, CircleDashed, Layers } from 'lucide-react'
import { TeamFlag } from '@/components/team-flag'
```

por:

```tsx
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Copy, CheckCircle2, CircleDashed, Layers } from 'lucide-react'
import { TeamFlag } from '@/components/team-flag'
import { ShareProfileCard } from '@/components/share-profile-card'
```

(`Button` removido — não é mais usado neste arquivo depois do Step 2.)

- [ ] **Step 2: Substituir o cabeçalho**

Troque o bloco do cabeçalho (heading + botão Álbum):

```tsx
      {/* Heading */}
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-muted-foreground">Olá, {firstName} 👋</p>
          <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
            Seu painel
          </h1>
        </div>
        <Button asChild size="lg" className="h-auto shrink-0 gap-2 px-4 py-2.5">
          <Link href="/album">
            <BookOpen className="h-4 w-4" />
            Álbum
          </Link>
        </Button>
      </div>
```

por:

```tsx
      {/* Heading */}
      <div>
        <p className="text-sm font-medium text-muted-foreground">Olá, {firstName} 👋</p>
        <h1 className="font-heading text-3xl font-extrabold tracking-tight text-foreground">
          Seu painel
        </h1>
      </div>

      {/* Quick actions: álbum + compartilhar perfil */}
      <div className="grid grid-cols-2 gap-3">
        <Link href="/album">
          <Card className="transition-colors hover:border-primary/50">
            <CardContent className="flex items-center gap-3 p-4">
              <div className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
                <BookOpen className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="font-semibold text-foreground">Álbum</p>
                <p className="truncate text-xs text-muted-foreground">Ver figurinhas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <ShareProfileCard slug={profile.slug} isPublic={profile.isPublic} />
      </div>
```

- [ ] **Step 3: Verificar TypeScript e lint**

Run: `cd ai-chatbot && npx tsc --noEmit 2>&1 | grep -i "dashboard/page"`
Expected: nenhuma linha de saída referente a este arquivo (os erros pré-existentes de `comprar/page`, `checkout/route`, `webhooks/stripe/route` e `album-manager.tsx` continuam — não são deste arquivo).

Run: `cd ai-chatbot && npx eslint "app/(app)/dashboard/page.tsx" "components/share-profile-card.tsx" "app/actions/profile.ts"`
Expected: sem erros.

- [ ] **Step 4: Commit**

```bash
cd /home/lucas/Documents/trocaCopa
git add "ai-chatbot/app/(app)/dashboard/page.tsx"
git commit -m "feat(dashboard): redesenhar atalho do álbum e adicionar compartilhar perfil"
```

---

### Task 4: Deploy e verificação manual end-to-end

**Files:** nenhum (deploy only).

- [ ] **Step 1: Deploy preview**

Run: `cd ai-chatbot && vercel --yes 2>&1 | tail -10`
Expected: saída com uma URL `https://trocacopa-<hash>-lucassantos-5212s-projects.vercel.app` e `"readyState": "READY"`.

- [ ] **Step 2: Criar usuário de teste e validar o fluxo completo**

Substitua `<PREVIEW_URL>` pela URL retornada no Step 1.

```bash
PREVIEW_URL="<PREVIEW_URL>"
curl -s -X POST "$PREVIEW_URL/api/auth/sign-up/email" \
  -H "Content-Type: application/json" \
  -d '{"email":"plan-verify-trocacopa@example.com","password":"TesteSenha123!","name":"Plan Verify"}' \
  -i | grep -i "set-cookie\|HTTP"
```

Expected: `HTTP/2 200` e um header `set-cookie` com `__Secure-better-auth.session_token=...`.

```bash
COOKIE='<cole aqui o valor completo do set-cookie copiado acima, até o primeiro ;>'
curl -s "$PREVIEW_URL/dashboard" -H "Cookie: $COOKIE" -o /tmp/dashboard.html -w "%{http_code}\n"
grep -o "Compartilhar\|Ativar link p/ trocas\|Álbum" /tmp/dashboard.html | sort -u
```

Expected: `200` e as três strings aparecem no HTML (confirma que os dois cards renderizaram).

- [ ] **Step 3: Verificar logs de erro no preview**

Use a ferramenta MCP `mcp__plugin_vercel_vercel__get_runtime_logs` com `projectId: "prj_mk4LmIRXvmzJXlj24Enqg3dGxqON"`, `teamId: "team_oGIII2yIZoItpkz3knOOBV7i"`, `environment: "preview"`, `level: ["error", "fatal"]`, `since: "5m"`.
Expected: nenhuma linha mencionando `publishProfile`, `ShareProfileCard` ou erro de insert/update relacionado a `profile`.

- [ ] **Step 4: Limpar usuário de teste**

```bash
EP="ep-lingering-feather-ahx5g80o-pooler"
URL="postgresql://neondb_owner:npg_1nivKbXl7xRI@${EP}.c-3.us-east-1.aws.neon.tech/neondb?sslmode=require&options=endpoint%3D${EP}"
psql "$URL" -c "
  delete from \"profile\" where \"userId\" in (select id from \"user\" where email = 'plan-verify-trocacopa@example.com');
  delete from \"session\" where \"userId\" in (select id from \"user\" where email = 'plan-verify-trocacopa@example.com');
  delete from \"account\" where \"userId\" in (select id from \"user\" where email = 'plan-verify-trocacopa@example.com');
  delete from \"user\" where email = 'plan-verify-trocacopa@example.com';
"
```

Expected: cada `delete` retorna `DELETE <n>` sem erro.

- [ ] **Step 5: Promover para produção**

Run: `cd ai-chatbot && vercel --prod --yes 2>&1 | tail -10`
Expected: saída com `"target": "production"` e `"readyState": "READY"`.

- [ ] **Step 6: Push**

```bash
cd /home/lucas/Documents/trocaCopa
git push
```

Expected: push aceito sem conflito.
