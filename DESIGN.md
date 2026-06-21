---
name: TrocaCopa
description: Free, mobile-first sticker-album tracker for the FIFA World Cup 2026, themed in Brazil's flag colors
colors:
  background: "oklch(0.99 0.005 120)"
  foreground: "oklch(0.20 0.04 200)"
  card: "oklch(1 0 0)"
  primary-verde-bandeira: "oklch(0.56 0.15 152)"
  primary-foreground: "oklch(0.99 0 0)"
  secondary: "oklch(0.95 0.03 150)"
  secondary-foreground: "oklch(0.30 0.06 160)"
  muted: "oklch(0.96 0.015 150)"
  muted-foreground: "oklch(0.50 0.03 165)"
  accent-amarelo-ouro: "oklch(0.88 0.17 98)"
  accent-foreground: "oklch(0.28 0.08 150)"
  success: "oklch(0.60 0.16 150)"
  info-azul-bandeira: "oklch(0.42 0.15 264)"
  warn: "oklch(0.82 0.16 95)"
  destructive: "oklch(0.58 0.21 27)"
  border: "oklch(0.90 0.015 150)"
typography:
  display:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "clamp(2rem, 6vw, 3.75rem)"
    fontWeight: 900
    lineHeight: 1.05
    letterSpacing: "-0.02em"
  headline:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "1.5rem"
    fontWeight: 800
    lineHeight: 1.2
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Archivo, Geist Sans, sans-serif"
    fontSize: "1.125rem"
    fontWeight: 700
    lineHeight: 1.3
    letterSpacing: "-0.02em"
  body:
    fontFamily: "Geist Sans, sans-serif"
    fontSize: "0.875rem"
    fontWeight: 400
    lineHeight: 1.6
  label:
    fontFamily: "Geist Sans, sans-serif"
    fontSize: "0.75rem"
    fontWeight: 600
rounded:
  sm: "0.45rem"
  md: "0.6rem"
  lg: "0.75rem"
  xl: "1.05rem"
  2xl: "1.35rem"
components:
  button-primary:
    backgroundColor: "{colors.primary-verde-bandeira}"
    textColor: "{colors.primary-foreground}"
    rounded: "{rounded.lg}"
    padding: "14px 24px"
  button-primary-hover:
    backgroundColor: "{colors.primary-verde-bandeira}"
  button-outline:
    backgroundColor: "{colors.background}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.lg}"
  card-default:
    backgroundColor: "{colors.card}"
    textColor: "{colors.foreground}"
    rounded: "{rounded.xl}"
    padding: "16px"
---

# Design System: TrocaCopa

## 1. Overview

**Creative North Star: "O Álbum de Bolso"**

TrocaCopa traduz o álbum físico Panini para o celular: a referência não é um produto de software, é um objeto de colecionador. Capas firmes, grade organizada de figurinhas, cores que vêm direto da bandeira do Brasil, não de uma paleta corporativa. O sistema rejeita explicitamente qualquer assinatura de SaaS genérico: gradientes corporativos, grids de cards idênticos repetidos sem variação, o template de hero-métrica (número grande + label pequena + stats + acento em gradiente), glassmorphism decorativo, modais como primeira resposta a qualquer interação. É um produto brasileiro caseiro, de graça, sem fricção comercial — não um SaaS de Vale do Silício com sotaque carioca.

A paleta segue estratégia **Full palette**: verde-bandeira, amarelo-ouro e azul-bandeira não são acentos pontuais, cada um carrega um papel funcional deliberado (primário/sucesso, destaque/aviso, informativo) e aparece com peso real na superfície — não escondido em 5% de um ícone.

**Key Characteristics:**
- Três cores nomeadas da bandeira, cada uma com função, nunca decorativas
- Tipografia de display em peso preto (900) para títulos, corpo neutro e legível
- Cards achatados (ring sutil, não sombra) — profundidade vem de cor e tipografia, não de elevação
- Tom caloroso e direto, sem linguagem de upsell ou "premium"

## 2. Colors

A paleta é a bandeira do Brasil reduzida a tokens semânticos: três hues nomeados, cada um com um papel funcional fixo no sistema, mais neutros levemente esverdeados que nunca chegam a preto ou branco puro.

### Primary
- **Verde-Bandeira** (oklch(0.56 0.15 152)): cor primária de ação — botões de CTA, links, foco de inputs, ring de seleção. Carrega a maior parte do peso visual da marca: é a primeira cor que qualquer tela mostra.

### Secondary
- **Verde-Pálido** (oklch(0.95 0.03 150)): superfícies secundárias e seções alternadas (faixa de features da landing, badges de seleção no álbum).

### Tertiary
- **Amarelo-Ouro** (oklch(0.88 0.17 98)): destaque e aviso — usado em `accent` e `warn`, no selo de progresso "Repetidas" e em badges de atenção. É a cor mais saturada da paleta; usada com intenção, nunca como preenchimento.
- **Azul-Bandeira** (oklch(0.42 0.15 264)): informativo — token `info`, usado no card "Faltando" do dashboard e em elementos que comunicam dados neutros (não ação, não alerta).

### Neutral
- **Quase-Branco Esverdeado** (oklch(0.99 0.005 120)): fundo de página. Tintado, não `#fff` puro.
- **Azul-Carvão** (oklch(0.20 0.04 200)): texto principal. Tintado para frio, não `#000` puro.
- **Branco Puro** (oklch(1 0 0)): fundo de card — única superfície sem tint no sistema atual.
- **Cinza-Verde Médio** (oklch(0.50 0.03 165)): texto secundário/muted.

### Named Rules
**The Flag-as-System Rule.** Verde, amarelo e azul não são decoração: cada um mapeia a um papel semântico fixo (primary/success, accent/warn, info) e deve ser usado nesse papel, nunca trocado por capricho visual.

**The No-Pure-White Card Exception.** O token `card` é `oklch(1 0 0)`, branco puro sem tint — a única exceção à regra geral de neutros tintados no sistema. Tratar como dívida de design a resolver, não como precedente para novos tokens.

## 3. Typography

**Display Font:** Archivo (com fallback Geist Sans)
**Body Font:** Geist Sans
**Label/Mono Font:** Geist Mono (usado em dados técnicos pontuais, não em UI geral)

**Character:** Archivo em peso preto/extra-bold para títulos dá o peso "capa de álbum" — denso, confiante, quase um logotipo. Geist Sans no corpo mantém leitura neutra e rápida para uso fragmentado no celular.

### Hierarchy
- **Display** (900, clamp(2rem, 6vw, 3.75rem), line-height 1.05, letter-spacing -0.02em): hero da landing, único uso por página.
- **Headline** (800, 1.5rem, line-height 1.2, letter-spacing -0.02em): títulos de seção ("Seu painel", "Tudo para completar seu álbum").
- **Title** (700, 1.125rem, line-height 1.3, letter-spacing -0.02em): títulos de card.
- **Body** (400, 0.875rem, line-height 1.6): texto corrido, máximo ~65ch por bloco.
- **Label** (600, 0.75rem): legendas, badges, texto auxiliar abaixo de números.

### Named Rules
**The Heading-Tightening Rule.** Toda a família `font-heading` aplica `letter-spacing: -0.02em` — títulos sempre ligeiramente comprimidos, nunca soltos. Texto de corpo nunca recebe essa compressão.

## 4. Elevation

O sistema é achatado por padrão: profundidade vem de um anel sutil (`ring-1 ring-foreground/10`), não de sombra projetada. Essa é a intenção real do componente `Card` compartilhado — cards não "flutuam", eles têm uma borda quase imperceptível que os separa do fundo sem sugerir luz ou camada física.

### Shadow Vocabulary
- **Nenhuma sombra no vocabulário formal.** O componente `Card` usa apenas `ring-1 ring-foreground/10`.

### Named Rules
**The Ring-Not-Shadow Rule.** Profundidade de card é comunicada por `ring-1 ring-foreground/10`, nunca por `box-shadow`. Onde `shadow-sm` aparece hoje (cards ad-hoc da landing page, fora do componente `Card` compartilhado), é uma inconsistência herdada — não um segundo padrão válido de elevação.

## 5. Components

### Buttons
- **Shape:** cantos arredondados médios (`rounded-lg`, 12px via `--radius-lg`)
- **Primary:** fundo verde-bandeira, texto quase-branco, altura 32px no tamanho padrão (escala xs/sm/default/lg/icon disponível)
- **Hover / Focus:** primary escurece com `hover:bg-primary/80`; foco usa `ring-3 ring-ring/50` mais borda destacada — sem mudança de escala ou sombra
- **Secondary / Ghost / Outline / Destructive / Link:** seis variantes via `cva`, todas compartilhando a mesma forma e altura, diferindo só em cor de fundo/texto

### Cards / Containers
- **Corner Style:** `rounded-xl` (~17px via `--radius-xl`)
- **Background:** `card` (branco puro — ver Named Rule da seção Colors)
- **Shadow Strategy:** nenhuma — ver Elevation
- **Border:** `ring-1 ring-foreground/10` no componente compartilhado; cards ad-hoc da landing usam `border border-border` + `shadow-sm`, divergindo do padrão
- **Internal Padding:** 16px (`--card-spacing: --spacing(4)`), 12px na variante `sm`

### Inputs / Fields
- **Style:** altura 32px, `rounded-lg`, borda `border-input`, fundo transparente
- **Focus:** borda muda para `ring` + halo `ring-3 ring-ring/50`
- **Error / Disabled:** estado de erro usa `aria-invalid` com borda e ring em `destructive`; desabilitado reduz opacidade e bloqueia ponteiro

### Action Cards (componente recorrente, não-canônico do shadcn)
- **Estilo:** ícone em círculo de 44px com fundo `bg-primary/10` e cor `text-primary`, título em `font-semibold`, subtítulo em `text-muted-foreground` — usado nos cards "Álbum", "Compartilhar" e "Minhas repetidas" do dashboard
- **Estado:** `hover:border-primary/50` como único feedback de hover, sem elevação

### Navigation
- **Landing:** header simples, logo + dois links de texto (Entrar / Criar conta), sem menu hambúrguer, sem sticky scroll-driven behavior
- **App:** não documentado nesta passada — fora do escopo de páginas escaneadas

## 6. Do's and Don'ts

### Do:
- **Do** usar as três cores da bandeira com papel funcional fixo (verde = ação/sucesso, azul = informativo, amarelo = destaque/aviso) — nunca como decoração intercambiável.
- **Do** manter `ring-1 ring-foreground/10` como único vocabulário de profundidade em cards.
- **Do** tintar todo neutro novo com chroma 0.005–0.02 na hue 120-200 (familia verde-azulada já estabelecida) — nunca introduzir um neutro cinza puro sem tint.
- **Do** manter peso 900/Archivo reservado para o display hero — um uso por página.

### Don't:
- **Don't** usar gradiente em texto (`bg-clip-text` + gradiente) — o hero atual da landing faz isso no "Copa 2026" e deve ser corrigido (ver crítica).
- **Don't** repetir o template de grid de cards idênticos (ícone + título + texto, mesmo tamanho, em série) sem variação de hierarquia — a seção de features da landing hoje cai nesse padrão.
- **Don't** misturar `shadow-sm` com o `ring-1` do componente `Card` — escolher um vocabulário de elevação e aplicá-lo em todo lugar.
- **Don't** usar branco puro (`oklch(1 0 0)`) para novos tokens de superfície — o token `card` já é uma exceção aceita, não um precedente.
- **Don't** introduzir linguagem ou visual de upsell/premium em qualquer tela — o produto é de graça e deve parecer de graça sem esforço.
