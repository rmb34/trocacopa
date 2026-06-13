# Freemium "Apoiador" + Identidade Visual Brasil — Design

**Data:** 2026-06-13
**Produto:** TrocaCopa (`https://ai-chatbot-beta-plum.vercel.app`)

## Visão Geral

Duas mudanças estruturais combinadas:

1. **Modelo freemium** — abrir o produto para uso gratuito (rastrear o álbum inteiro) e travar a **camada de trocas/repetidas** atrás de um pagamento único de **R$ 10,99**, enquadrado como **"Apoie o projeto e libere as trocas"**. Quem paga vira **Apoiador** e ganha um selo ⭐ no perfil público.
2. **Rebrand visual para as cores do Brasil** — substituir a paleta magenta (Copa 26) por **verde-bandeira + amarelo-ouro + azul-bandeira + branco**, para apelo nacional. Identidade que remete à bandeira.

**Por que juntas:** ambas tocam os mesmos arquivos centrais (landing, dashboard, perfil público, `/comprar`, tokens de cor). Fazer junto evita retrabalho visual.

**Princípio de não-regressão (visual):** o app consome cores por tokens semânticos no `globals.css`. Rebrand = trocar valores de token; componentes herdam.

**Princípio de segurança (freemium):** a decisão de acesso a feature mora em **funções puras em `lib/entitlements.ts`**, aplicadas **server-side** (server components e server actions). A UI nunca é a fonte da verdade. Dados pagos (lista de repetidas, inventário de trocas) **não são enviados ao cliente** de usuários gratuitos.

---

## 1. Modelo Freemium — fronteira de features

Dois tiers, decididos pelo `purchase.status` já existente no schema:

- **Colecionador** (grátis) — motor de adesão e viralização
- **Apoiador** (`status === 'paid'`, R$ 10,99 uma vez) — desbloqueia a economia das trocas

| Capacidade | Colecionador (free) | Apoiador (paid) |
|---|---|---|
| Criar conta / login | ✓ | ✓ |
| Álbum: marcar tem / falta | ✓ | ✓ |
| Álbum: contar repetidas (`count > 1`) | ✓ | ✓ |
| Dashboard: % progresso, totais, **número** de repetidas | ✓ | ✓ |
| Perfil público "Procuro" (wishlist) compartilhável | ✓ | ✓ |
| `/repetidas`: lista organizada "tenho para troca" | 🔒 teaser | ✓ |
| Perfil público: seção "Tenho para troca" | ✗ (oculta) | ✓ |
| Compartilhar lista de trocas (WhatsApp) | 🔒 | ✓ |
| Selo ⭐ **Apoiador** no perfil público | ✗ | ✓ |

**Lógica "valor antes do muro":** o free **acumula e vê** o número de repetidas no dashboard ("você tem 37 repetidas"), mas a **lista organizada** e as **ferramentas de troca** (agir/compartilhar/exibir publicamente) exigem virar Apoiador. A parede cai no pico do hobby (tem duplicatas na mão e quer trocar).

---

## 2. Identidade Visual — Brasil

### Mapeamento de cor
- **Primary** = verde-bandeira (`#009C3B`) — botões, links, foco, hero
- **Accent** = amarelo-ouro (`#FFDF00`) — destaques, badges, **selo Apoiador**
- **Azul-bandeira** (`#002776`) — profundidade, informativos
- Acentos pontuais dos 3 stat cards: **Coladas → verde**, **Faltando → azul**, **Repetidas → amarelo**

### Tokens (`app/globals.css`)

`:root` (light) — substituir valores e manter os tokens de acento já existentes (`--success`/`--info`/`--warn`):

```css
:root {
  /* Brasil — verde-bandeira + amarelo-ouro + azul-bandeira */
  --background: oklch(0.99 0.005 120);
  --foreground: oklch(0.20 0.04 200);
  --primary: oklch(0.56 0.15 152);
  --primary-foreground: oklch(0.99 0 0);
  --secondary: oklch(0.95 0.03 150);
  --secondary-foreground: oklch(0.30 0.06 160);
  --muted: oklch(0.96 0.015 150);
  --muted-foreground: oklch(0.50 0.03 165);
  --accent: oklch(0.88 0.17 98);
  --accent-foreground: oklch(0.28 0.08 150);
  --success: oklch(0.60 0.16 150);
  --success-foreground: oklch(0.99 0 0);
  --info: oklch(0.42 0.15 264);
  --info-foreground: oklch(0.99 0 0);
  --warn: oklch(0.82 0.16 95);
  --warn-foreground: oklch(0.28 0.08 90);
  --border: oklch(0.90 0.015 150);
  --input: oklch(0.90 0.015 150);
  --ring: oklch(0.56 0.15 152);
  --chart-1: oklch(0.56 0.15 152);
  --chart-2: oklch(0.82 0.16 95);
  --chart-3: oklch(0.42 0.15 264);
  --chart-4: oklch(0.60 0.16 150);
  --chart-5: oklch(0.40 0.10 200);
  /* sidebar-* espelham primary/secondary/border conforme acima */
}
```

`.dark` **e** `@media (prefers-color-scheme: dark) { :root:not(.light) }` (manter os dois em sincronia) — versões mais claras:

```css
  --primary: oklch(0.66 0.16 152);
  --primary-foreground: oklch(0.14 0.03 150);
  --accent: oklch(0.86 0.16 98);
  --accent-foreground: oklch(0.16 0.05 150);
  --success: oklch(0.68 0.16 150);
  --info: oklch(0.58 0.15 264);
  --warn: oklch(0.84 0.16 95);
  --background: oklch(0.15 0.02 200);
  --foreground: oklch(0.97 0.01 120);
  /* card/popover/secondary/muted/border/ring/sidebar conforme o padrão */
```

> Tuning final de luminosidade (contraste WCAG AA) acontece na implementação. Pontos críticos: branco sobre verde (primary) e **texto escuro sobre amarelo** (accent/warn nunca usam texto branco).

### Gradientes decorativos (cor da bandeira)
- Barra de acento da landing (`app/page.tsx`) e stripe do preview (`components/landing/product-preview.tsx`): trocar `from-primary via-info to-success` por **verde → amarelo → azul** explícito (`from-success via-warn to-info` ou classes equivalentes), evocando a bandeira.

### Assets de marca
- **`public/og.png`** — regenerar com Pillow na paleta Brasil (fundo verde, faixa amarela/azul, selo de preço). Mesmo layout 1200×630.
- **`public/manifest.json`** `theme_color` → `#009C3B`.
- **`app/layout.tsx`** `viewport.themeColor` → `#009C3B`.
- **Logo** (`public/logo.png`): mantido. **Risco:** conferir se a arte combina com fundo verde; se destoar, é item separado (não regenerar nesta spec sem ver).

---

## 3. Arquitetura — de paywall único para gating por feature

### 3.1 Módulo de entitlements (puro, testável)
**Criar `lib/entitlements.ts`** — única fonte de verdade das decisões de acesso:

```ts
export type PurchaseStatus = 'none' | 'pending' | 'paid'

export function isSupporter(status: PurchaseStatus): boolean {
  return status === 'paid'
}
export function canAccessTrades(status: PurchaseStatus): boolean {
  return isSupporter(status)
}
export function canShowTradeInventory(status: PurchaseStatus): boolean {
  return isSupporter(status)
}
export function showSupporterBadge(status: PurchaseStatus): boolean {
  return isSupporter(status)
}

// View-model do perfil público — garante (e testa) que duplicatas de free
// NUNCA são expostas. `duplicates` vem vazio quando o dono não é Apoiador.
export function publicProfileSections(
  ownerStatus: PurchaseStatus,
  missing: string[],
  duplicates: string[],
): { missing: string[]; duplicates: string[]; showBadge: boolean } {
  const supporter = isSupporter(ownerStatus)
  return {
    missing,
    duplicates: supporter ? duplicates : [],
    showBadge: supporter,
  }
}
```

### 3.2 Remover o paywall único
**`app/(app)/layout.tsx`** — hoje redireciona `status !== 'paid'` → `/comprar`. **Remover esse redirect.** Mantém só a checagem de sessão (sem sessão → `/sign-in`). Todo usuário autenticado entra no app.

### 3.3 Gating server-side por feature

**`app/(app)/repetidas/page.tsx`** (server component):
- Buscar `status = getPurchaseStatus(userId)`.
- `canAccessTrades(status)` → renderiza a lista atual.
- Senão → renderiza `<TradesUpsell repeatCount={N} />`, computando `N` server-side via `duplicateCodes(entries).length`, **sem enviar a lista** ao cliente.

**`components/trades-upsell.tsx`** (novo) — card com enquadramento de apoio:
> 🔒 **Você tem {N} figurinhas repetidas para trocar.**
> As trocas existem graças a quem apoia o projeto.
> **Vire Apoiador por R$ 10,99** (uma vez, pra sempre) e libere sua lista de trocas.
>
> *Sem anúncios · sem mensalidade · sem vender seus dados.*
>
> [ Virar Apoiador ⭐ ] → `/comprar`

**`app/u/[slug]/page.tsx`** (server component, perfil público):
- Buscar o **status do dono** do perfil: `getPurchaseStatus(profile.userId)`.
- Usar `publicProfileSections(ownerStatus, missing, duplicates)`:
  - Free → renderiza **só "Procuro"** (wishlist). Sem "Tenho para troca", sem selo.
  - Apoiador → "Procuro" + "Tenho para troca" + **selo ⭐ Apoiador** ao lado do nome.
- A decisão usa o status do **dono**, não do visitante.

**`components/supporter-badge.tsx`** (novo) — selo ⭐ em amarelo-ouro (`bg-accent text-accent-foreground`), usado no `/u/slug` e opcionalmente no header do app.

**Server actions de troca/compartilhamento** — qualquer action que gere/exponha o inventário de trocas valida `canAccessTrades(await getStatus())` server-side e lança/erra se não-Apoiador. Sem confiar em UI.

### 3.4 Conversão (nudges)
- **Dashboard** (`app/(app)/dashboard/page.tsx`): quando free **e** `stats.duplicates > 0`, exibir um card discreto "Você tem N repetidas para trocar 🔒 Vire Apoiador" → `/comprar`. (Substitui o card "Minhas repetidas" atual para free.)
- **Menu da conta** (`components/app-header.tsx`): para Apoiador, mostrar "⭐ Apoiador"; para free, item "Apoiar o projeto" → `/comprar`.

### 3.5 Página de upgrade
**`app/comprar/page.tsx`** — rebrand de "Acesso completo / Comprar" para **"Vire Apoiador"** com o enquadramento de apoio. Preço **R$ 10,99** inalterado. O fluxo de checkout (Stripe) e o webhook **não mudam**. Atualizar o nome do line item em `app/api/checkout/route.ts` para `'TrocaCopa — Apoiador'`.

---

## 4. Banco de Dados

**`lib/db/schema.ts`** — `isPublic` volta a `.default(true)`.

**Justificativa (reverte decisão da spec anterior, deliberadamente):** o motor viral do free depende do compartilhamento fácil do perfil "Procuro". A página pública só expõe dado de baixa sensibilidade (nome, cidade, wishlist; WhatsApp já é removido do payload e nunca renderizado; e-mail nunca sai). O usuário mantém o toggle para desativar. Alternativa considerada (ativar `isPublic` ao clicar "Compartilhar") fica como possível refinamento futuro.

**Migração (via MCP da Neon; fallback `psql "$DATABASE_URL"` com workaround SNI `?options=endpoint%3D<id>`):**
```sql
ALTER TABLE "profile" ALTER COLUMN "isPublic" SET DEFAULT true;
```
Não altera linhas existentes.

---

## 5. Testes (vitest)

Toda decisão de acesso é função pura em `lib/entitlements.ts` (coberta pelo `include: ['lib/**']` do `vitest.config.ts`).

**`__tests__/entitlements.test.ts`** (novo):

| Teste | Verifica |
|---|---|
| `isSupporter` retorna true só para `'paid'` | `'none'`/`'pending'` → false; `'paid'` → true |
| `canAccessTrades` espelha `isSupporter` | gating de trocas |
| `showSupporterBadge` espelha `isSupporter` | selo só para pago |
| `publicProfileSections` oculta duplicatas de free | dono `'none'`/`'pending'` → `duplicates: []`, `showBadge: false` |
| `publicProfileSections` expõe duplicatas de Apoiador | dono `'paid'` → `duplicates` intacto, `showBadge: true` |
| `publicProfileSections` nunca mexe em `missing` | wishlist sempre presente nos dois tiers |

**`__tests__/stats.test.ts`** / **`catalog.test.ts`** — sem mudança de comportamento; devem continuar verdes (rodar `pnpm test` antes/depois como regressão).

> Gating em server components depende de DB/sessão (borda do sistema) — não é alvo de unit test. A segurança fica garantida por (a) a decisão pura testada e (b) os componentes apenas renderizarem o resultado de `publicProfileSections`/`canAccessTrades`.

---

## 6. Arquivos Afetados

| Arquivo | Mudança |
|---|---|
| `lib/entitlements.ts` | **Novo** — decisões de acesso (puras) |
| `app/globals.css` | Tokens paleta Brasil (light + 2 dark) |
| `app/(app)/layout.tsx` | Remover paywall único; manter só auth |
| `app/(app)/repetidas/page.tsx` | Gating: lista (Apoiador) vs `TradesUpsell` (free) |
| `components/trades-upsell.tsx` | **Novo** — card de apoio com contagem |
| `app/u/[slug]/page.tsx` | Seções via `publicProfileSections`; selo |
| `components/supporter-badge.tsx` | **Novo** — selo ⭐ Apoiador |
| `app/(app)/dashboard/page.tsx` | Nudge de conversão para free; acentos Brasil |
| `app/comprar/page.tsx` | Rebrand "Vire Apoiador" + cópia de apoio |
| `app/api/checkout/route.ts` | Nome do line item → "TrocaCopa — Apoiador" |
| `components/app-header.tsx` | Item "Apoiar"/"⭐ Apoiador" no menu |
| `app/page.tsx` | Gradiente Brasil; cópia da landing (tiers/apoio) |
| `components/landing/product-preview.tsx` | Stripe verde/amarelo/azul |
| `public/og.png` | Regenerar paleta Brasil |
| `public/manifest.json`, `app/layout.tsx` | `theme_color`/`themeColor` verde |
| `lib/db/schema.ts` | `isPublic` default `true` |
| `__tests__/entitlements.test.ts` | **Novo** — testes do gating |
| Banco (Neon) | `ALTER ... isPublic SET DEFAULT true` |

**Não tocar:** `components/ui/button.tsx`, fluxo de checkout/webhook (lógica), `lib/stats.ts` (reutilizado como está).

---

## 7. Segurança — checklist

- [ ] Gating sempre server-side (server components / server actions) via `lib/entitlements`.
- [ ] Lista de repetidas e inventário de trocas de usuário **free não trafegam ao cliente** (`/repetidas` envia só contagem; `/u/slug` usa `publicProfileSections` que zera `duplicates`).
- [ ] Selo e inventário público dependem do status do **dono** do perfil.
- [ ] Server actions de troca validam `canAccessTrades` antes de retornar dados.
- [ ] WhatsApp permanece fora do payload público (já feito).
- [ ] Checkout/webhook inalterados (já validados e seguros).

---

## 8. Riscos e Pendências
- **Contraste:** verde+branco e amarelo+texto-escuro precisam passar AA; ajustar luminosidade dos tokens na implementação.
- **Logo sobre verde:** validar; pode exigir variante (fora do escopo até inspeção visual).
- **Reversão de privacidade (`isPublic` default true):** trade-off consciente pela viralização; mitigado por payload de baixa sensibilidade + toggle de opt-out.
- **Free "completo demais":** monitorar conversão; se o free retiver gente sem nunca atritar, considerar mover algum limite (ex.: destaque de trocas) — não fazer agora (YAGNI).
- **og.png:** hex de fundo é aproximação sRGB do oklch; conferir no device após deploy.
