# Revisão Visual + Perfil + Privacidade — Design

**Data:** 2026-06-13
**Produto:** TrocaCopa (`https://ai-chatbot-beta-plum.vercel.app`)

## Visão Geral

Revisão visual e de privacidade do TrocaCopa, sem regressão. Quatro frentes:

1. **Paleta Copa 26** — substituir a base azul FIFA por uma identidade multicolor oficial (magenta primária + acentos verde/azul/amarelo pontuais), via tokens semânticos.
2. **Botão do álbum** — corrigir o texto que estoura o botão (altura fixa).
3. **Menu da conta** — tornar o perfil alcançável (avatar clicável) e migrar o dark mode para esse menu.
4. **Privacidade** — perfil privado por padrão para novos usuários + não carregar WhatsApp no payload público.

**Princípio anti-regressão central:** o app já consome cores por variáveis CSS semânticas (`--primary`, `--accent`, `--secondary`…) mapeadas pelo Tailwind v4. Trocar a paleta = editar tokens em `app/globals.css`, **não** os componentes. Tudo que usa `bg-primary`, `from-primary`, `text-accent-foreground` etc. herda automaticamente.

---

## 1. Sistema de Cor — Copa 26

### Estratégia
- **Magenta** vira a cor primária (`--primary`): botões, links, foco, hero.
- **Amarelo/dourado** continua como `--accent` (badges "para troca", destaques).
- Três **tokens de acento nomeados** novos para uso pontual multicolor: `--success` (verde), `--info` (azul), `--warn` (amarelo). Usados só onde já há separação semântica (os 3 stat cards do dashboard).
- Resto da UI: neutros + magenta. Sem multicolor distribuído.

### Valores de token

Em `app/globals.css`, bloco `:root` (light) — substituir os valores existentes e **adicionar** os 3 novos pares de acento:

```css
:root {
  /* Copa 2026 — magenta vibrante + acentos */
  --primary: oklch(0.56 0.24 352);
  --primary-foreground: oklch(0.99 0 0);
  --ring: oklch(0.56 0.24 352);
  --accent: oklch(0.82 0.16 90);
  --accent-foreground: oklch(0.25 0.06 80);

  /* acentos pontuais (novos) */
  --success: oklch(0.62 0.16 150);
  --success-foreground: oklch(0.99 0 0);
  --info: oklch(0.58 0.18 250);
  --info-foreground: oklch(0.99 0 0);
  --warn: oklch(0.78 0.16 85);
  --warn-foreground: oklch(0.25 0.06 80);

  /* charts realinhados à nova paleta */
  --chart-1: oklch(0.56 0.24 352);
  --chart-2: oklch(0.82 0.16 90);
  --chart-3: oklch(0.58 0.18 250);
  --chart-4: oklch(0.62 0.16 150);
  --chart-5: oklch(0.46 0.18 352);

  --sidebar-primary: oklch(0.56 0.24 352);
  --sidebar-ring: oklch(0.56 0.24 352);
}
```

Os tokens neutros que dependiam do matiz azul 264 (`--secondary`, `--muted`, `--border`, `--foreground`, `--background`) passam a um neutro levemente quente/magenta para coerência. Atualizar:

```css
  --background: oklch(0.98 0.004 350);
  --foreground: oklch(0.18 0.03 350);
  --secondary: oklch(0.95 0.02 350);
  --secondary-foreground: oklch(0.30 0.06 350);
  --muted: oklch(0.96 0.012 350);
  --muted-foreground: oklch(0.52 0.03 350);
  --border: oklch(0.91 0.012 350);
  --input: oklch(0.91 0.012 350);
  --card-foreground: oklch(0.18 0.03 350);
  --popover-foreground: oklch(0.18 0.03 350);
  --sidebar-foreground: oklch(0.18 0.03 350);
  --sidebar-accent: oklch(0.95 0.02 350);
  --sidebar-accent-foreground: oklch(0.30 0.06 350);
  --sidebar-border: oklch(0.91 0.012 350);
```

No bloco `.dark` **e** no bloco `@media (prefers-color-scheme: dark) { :root:not(.light) }` (são duplicados hoje — manter ambos em sincronia), aplicar as versões mais claras:

```css
  --primary: oklch(0.68 0.22 352);
  --primary-foreground: oklch(0.12 0.03 352);
  --ring: oklch(0.68 0.22 352);
  --accent: oklch(0.84 0.16 90);
  --accent-foreground: oklch(0.16 0.04 80);
  --success: oklch(0.70 0.16 150);
  --success-foreground: oklch(0.12 0.03 150);
  --info: oklch(0.66 0.16 250);
  --info-foreground: oklch(0.12 0.03 250);
  --warn: oklch(0.82 0.16 85);
  --warn-foreground: oklch(0.16 0.04 80);
  --background: oklch(0.14 0.02 350);
  --foreground: oklch(0.97 0.005 350);
  --secondary: oklch(0.24 0.03 350);
  --muted: oklch(0.24 0.02 350);
  --muted-foreground: oklch(0.66 0.03 350);
  /* (replicar card/popover/sidebar/border conforme os pares acima) */
```

### Exposição dos tokens ao Tailwind

No bloco `@theme inline` de `app/globals.css`, adicionar o mapeamento dos novos tokens para gerar utilitários `bg-success`, `text-info`, etc.:

```css
  --color-success: var(--success);
  --color-success-foreground: var(--success-foreground);
  --color-info: var(--info);
  --color-info-foreground: var(--info-foreground);
  --color-warn: var(--warn);
  --color-warn-foreground: var(--warn-foreground);
```

### Uso pontual dos acentos

Em `app/(app)/dashboard/page.tsx`, o array `cards` hoje usa `tone: 'text-primary' | 'text-foreground' | 'text-accent-foreground'`. Trocar por:
- "Coladas" → `text-success`
- "Faltando" → `text-info`
- "Repetidas" → `text-warn`

Nenhuma outra mudança de classe. O hero (`from-primary to-primary/80`), badges e progress bars herdam o magenta automaticamente.

### Manifest / PWA

`public/manifest.json` e a meta `theme_color`: atualizar de `#003DA5` para o magenta equivalente (`#D81E83`, aproximação sRGB do `oklch(0.56 0.24 352)` — validar no build). Atualizar também qualquer `theme-color` em `app/layout.tsx` se existir.

---

## 2. Botão do Álbum

### Causa raiz
`components/ui/button.tsx` define as variantes de `size` com **altura fixa** (`default: h-8`, `lg: h-9`). No dashboard, `<Button asChild size="default">` envolve um `<Link>` com ícone + "Álbum"; o conteúdo (linha do texto + ícone) excede 32px e estoura.

### Correção (cirúrgica, sem tocar no componente compartilhado)
Em `app/(app)/dashboard/page.tsx`, o botão "Álbum" passa a usar uma instância com altura adequada ao conteúdo, alinhada ao padrão já usado na landing e em `/comprar` (que usam `py-3.5`):

```tsx
<Button asChild size="lg" className="h-auto shrink-0 gap-2 px-4 py-2.5">
  <Link href="/album">
    <BookOpen className="h-4 w-4" />
    Álbum
  </Link>
</Button>
```

O `h-auto` neutraliza a altura fixa da variante; `py-2.5` dá respiro vertical. **Não** alterar `components/ui/button.tsx` — outros usos densos dependem das alturas atuais.

### Verificação
Screenshot do dashboard antes/depois (desktop + mobile, light + dark) confirmando o texto contido no botão.

---

## 3. Menu da Conta (avatar) + Dark Mode

### Estado atual
- `/perfil` existe e renderiza `ProfileForm` (link público + copiar/compartilhar + toggle público + nome/cidade/WhatsApp), mas **nada aponta pra ela**.
- O avatar em `components/app-header.tsx` é decorativo (não clicável).
- `ThemeToggle` flutua solto no header; "Sair" é um botão separado.

### Mudança
O avatar vira gatilho de um `DropdownMenu` (componente `components/ui/dropdown-menu.tsx` já existe; funciona em desktop e mobile/touch — sem novo componente). Conteúdo do menu:

- **Meu perfil** → `Link` para `/perfil`
- **Modo escuro** → o controle do `ThemeToggle` migra para um item do menu (item com ícone sol/lua que alterna o tema)
- separador
- **Sair** → ação `signOut()` existente

No header desktop, **mantém-se** a nav Painel/Álbum/Repetidas como está; remove-se o `ThemeToggle` solto e o botão "Sair" textual (ambos passam para o menu). No bottom-nav mobile, remove-se o botão "Sair" (vai para o menu do avatar) — Painel/Álbum/Repetidas permanecem.

### Componentes
- **Modificar:** `components/app-header.tsx` — avatar dentro de `DropdownMenu`, itens acima. Usa o `slug` que o layout já passa (hoje ignorado) para nada extra; o link público fica em `/perfil`.
- **Modificar:** `components/theme-toggle.tsx` — extrair a lógica de alternância para ser usada como item de menu (ou expor um componente `ThemeMenuItem`). Manter o comportamento atual (localStorage + classe `dark` + `prefers-color-scheme`).
- **Reaproveitar:** `app/(app)/perfil/page.tsx` e `components/profile-form.tsx` (já prontos).

### Acesso ao /perfil
A rota já existe e está protegida pelo `app/(app)/layout.tsx` (exige sessão + compra paga). Só passa a ser linkada.

---

## 4. Privacidade

### 4.1 `isPublic` privado por padrão (novos usuários)
- `lib/db/schema.ts`: `isPublic` muda de `.default(true)` para `.default(false)`.
- **Migração de banco:** apenas o default da coluna. Perfis existentes **não** são alterados (quem já compartilhou continua público).

SQL:
```sql
ALTER TABLE "profile" ALTER COLUMN "isPublic" SET DEFAULT false;
```

**Aplicação:** direto no banco via MCP da Neon. Se o MCP da Neon não estiver conectado no ambiente de execução, aplicar via `psql "$DATABASE_URL" -c '<sql>'` usando a env var já existente. Não gerar arquivo de migração Drizzle que altere dados existentes.

### 4.2 WhatsApp fora do payload público
- `app/actions/profile.ts`, `getProfileBySlug`: trocar `select()` (todas as colunas) por `select` explícito **sem `whatsapp`** — a página pública não usa esse campo.

```ts
export async function getProfileBySlug(slug: string) {
  const rows = await db
    .select({
      userId: profile.userId,
      displayName: profile.displayName,
      slug: profile.slug,
      city: profile.city,
      isPublic: profile.isPublic,
    })
    .from(profile)
    .where(eq(profile.slug, slug))
    .limit(1)
  return rows[0] ?? null
}
```

### 4.3 WhatsApp: opcional, oculto, copy corrigida
- O campo permanece em `components/profile-form.tsx`, **opcional** (já é — só `displayName` é `required`).
- Corrigir o texto de ajuda que hoje promete visibilidade pública falsa. De:
  > "Só números com DDD. Outros colecionadores verão para combinar trocas."

  Para:
  > "Só números com DDD. Guardado em privado — não aparece no seu perfil público."

---

## Arquivos Afetados

| Arquivo | Mudança |
|---|---|
| `app/globals.css` | Novos valores de token (light + 2 blocos dark) + mapeamento `@theme inline` dos acentos |
| `app/(app)/dashboard/page.tsx` | `tone` dos stat cards → `text-success/info/warn`; botão "Álbum" com `h-auto py-2.5` |
| `components/app-header.tsx` | Avatar → `DropdownMenu` (Meu perfil / Modo escuro / Sair); remove toggle e "Sair" soltos |
| `components/theme-toggle.tsx` | Lógica reaproveitável como item de menu |
| `components/profile-form.tsx` | Copy do WhatsApp corrigida |
| `app/actions/profile.ts` | `getProfileBySlug` com `select` explícito sem `whatsapp` |
| `lib/db/schema.ts` | `isPublic` default `false` |
| `public/manifest.json` | `theme_color` magenta |
| Banco (Neon) | `ALTER TABLE profile ALTER COLUMN isPublic SET DEFAULT false` |

**Não tocar:** `components/ui/button.tsx` (alturas fixas usadas por outros), página pública `/u/[slug]` (já não exibe WhatsApp), `ProfileForm` além da copy.

---

## Testes / Não-Regressão

### Visual (manual, light + dark)
Checklist de páginas a conferir após troca de tokens — cada uma legível e sem cor quebrada:
- [ ] Landing `/` (hero, price card, features)
- [ ] `/sign-in`, `/sign-up`
- [ ] `/comprar`
- [ ] Dashboard (hero gradiente, stat cards com 3 acentos, progress)
- [ ] Álbum `/album` (tabs, flags, paginação)
- [ ] Repetidas `/repetidas`
- [ ] Perfil `/perfil`
- [ ] Página pública `/u/[slug]`

### Botão
- [ ] Screenshot dashboard antes/depois: texto "Álbum" contido no botão (desktop + mobile).

### Menu da conta
- [ ] Avatar abre menu em desktop e mobile.
- [ ] "Meu perfil" navega para `/perfil`.
- [ ] "Modo escuro" alterna tema e persiste (reload mantém).
- [ ] "Sair" desloga e redireciona para `/`.

### Privacidade
- [ ] Usuário novo: `isPublic=false` no banco; `/u/[slug]` dele retorna `notFound()` até ativar.
- [ ] Perfil existente público continua acessível após a migração.
- [ ] HTML de `/u/[slug]` não contém o número de WhatsApp (inspecionar fonte da página).

---

## Riscos e Pendências
- **Contraste magenta:** validar contraste de `primary-foreground` (branco) sobre magenta no hero e botões em ambos os temas (WCAG AA). Ajustar luminosidade do `--primary` se necessário.
- **`theme_color` do PWA:** o hex magenta é aproximação do oklch; conferir no dispositivo após deploy.
- **MCP da Neon:** não conectado no ambiente atual; fallback via `psql`/`DATABASE_URL` documentado em 4.1.
- **Ícones PWA:** continuam com o logo atual; não fazem parte desta revisão.
