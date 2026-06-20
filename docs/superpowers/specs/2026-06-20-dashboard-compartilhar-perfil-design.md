# Atalho de compartilhar perfil no dashboard + redesign do botão Álbum

## Contexto

Hoje o link público (`/u/[slug]`) só existe dentro de `/perfil` (`components/profile-form.tsx`), escondido dentro do formulário de edição. O usuário precisa entrar em "perfil" pra achar o link que envia pra outras pessoas verem suas figurinhas.

O botão "Álbum" no topo do dashboard (`app/(app)/dashboard/page.tsx`) é um `<Button asChild>` simples, visualmente solto e inconsistente com o resto da página — que já tem um padrão de "card de ação" (ícone em círculo colorido + título + subtítulo), usado no card "Minhas repetidas" mais abaixo na mesma página.

## Objetivo

Colocar o link público de fácil acesso na tela principal (dashboard), ao lado do botão Álbum, e redesenhar os dois como um par de cards de ação consistentes com o padrão visual já existente no app.

## Decisões

1. **Perfil privado ao compartilhar:** se `profile.isPublic === false`, clicar em "Compartilhar" ativa o perfil público automaticamente (sem navegar pra outra tela) e já copia o link.
2. **Ação do clique:** copiar o link direto pra área de transferência (sem popover, sem navegação) — mesmo padrão do `ShareButton` já usado em `/perfil`.
3. **Estilo visual:** dois cards de ação lado a lado, mesmo peso visual, reaproveitando o padrão existente do card "Minhas repetidas" (ícone em círculo `bg-primary/10`/`text-primary`, título em negrito, subtítulo em `text-muted-foreground`).

## Design

### Layout (`app/(app)/dashboard/page.tsx`)

Abaixo do cabeçalho "Olá, {nome}" / "Seu painel", remove-se o `Button` solto do Álbum. No lugar, um grid de 2 colunas full-width com dois cards de ação, no mesmo estilo do card "Minhas repetidas":

- **Álbum** — ícone `BookOpen`, título "Álbum", subtítulo "Ver figurinhas". Continua sendo um `Link` para `/album`.
- **Compartilhar** — ícone `Share2` (trocando para `Check` por 2s após copiar, igual ao `ShareButton`), título "Compartilhar", subtítulo "Link p/ trocas". Vira o novo client component `ShareProfileCard`.

O card "Minhas repetidas" mais abaixo na página **não muda** — continua como está, fora de escopo.

### Nova server action — `app/actions/profile.ts`

```ts
export async function publishProfile() {
  const userId = await getUserId()
  const [row] = await db
    .update(profile)
    .set({ isPublic: true, updatedAt: new Date() })
    .where(and(eq(profile.userId, userId), eq(profile.isPublic, false)))
    .returning({ slug: profile.slug })

  if (row) {
    revalidatePath('/perfil')
    return { slug: row.slug, activated: true }
  }

  const [existing] = await db
    .select({ slug: profile.slug })
    .from(profile)
    .where(eq(profile.userId, userId))
    .limit(1)
  return { slug: existing.slug, activated: false }
}
```

- Só escreve no banco quando `isPublic` ainda é `false` (idempotente, não reseta `updatedAt` à toa em cliques repetidos com perfil já público).
- Retorna `slug` (pra montar a URL no client) e `activated` (pra decidir a mensagem do toast).

### Novo componente — `components/share-profile-card.tsx`

Client component, recebe `slug: string` e `isPublic: boolean` via props (vindos do `profile` já carregado no dashboard).

Comportamento:
1. Ao clicar, chama `publishProfile()`.
2. Monta `${window.location.origin}/u/${result.slug}` e copia via `navigator.clipboard.writeText`.
3. Toast: `"Perfil ativado e link copiado!"` se `result.activated === true`, senão `"Link copiado!"`.
4. Ícone alterna `Share2` → `Check` por 2s após copiar (replicando `ShareButton`).
5. Visual: mesma estrutura de `Card`/ícone-círculo/título/subtítulo do card "Álbum" ao lado — não é um `<Button>`, é um `<Card>` clicável (`role="button"`, ou um `<button>` estilizado como o card), para manter consistência visual com o card do Álbum.

### Fora de escopo

- Edição de WhatsApp/cidade/nome — fica só em `/perfil`.
- O `ShareButton`/card em `/perfil` continuam existindo como estão (redundância aceitável — é o lugar natural pra quem já está ajustando o perfil).
- Não há popover com opções de compartilhamento (WhatsApp direto etc.) — fora de escopo, mencionado e descartado na conversa.

## Testes

- `publishProfile()`: usuário com perfil privado → ativa e retorna `activated: true`; usuário já público → não escreve no banco, retorna `activated: false`.
- `ShareProfileCard`: clique copia a URL correta (`origin + /u/ + slug`) pro clipboard; toast varia conforme `activated`.
- Dashboard: os dois cards aparecem lado a lado, mesmo tamanho, com o mesmo estilo visual do card "Minhas repetidas".
