# TrocaCopa

Gerenciador de álbum de figurinhas para a Copa do Mundo FIFA 2026. Controle o que você tem, o que falta e encontre colecionadores para trocar — tudo no celular, com suporte offline via PWA.

## Funcionalidades

- **Álbum digital** — 993 figurinhas: 48 seleções × 20 + FWC (19) + Coca-Cola (14), grupos A–L + Especial
- **Bandeiras reais** — bandeiras via flagcdn.com para todas as 48 seleções
- **Controle de repetidas** — lista agrupada por seleção com contagem de extras e link de compartilhamento
- **Trocas inteligentes** — cruza sua coleção com outros colecionadores e mostra matches mútuos com contato via WhatsApp
- **Perfil público** — link compartilhável `/u/[slug]` com progresso, faltas e repetidas
- **100% grátis** — todas as funcionalidades liberadas, sem pagamento ou assinatura
- **PWA** — instalável no celular, funciona offline

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | Next.js 15 (App Router) |
| UI | React 19, Tailwind CSS v4, shadcn/ui |
| Auth | better-auth |
| ORM | Drizzle ORM + drizzle-kit |
| Banco | PostgreSQL (Neon) |
| PWA | @ducanh2912/next-pwa |
| Deploy | Vercel |
| Testes | Vitest |

## Paleta de cores

Inspirada no álbum oficial Panini Copa 2026:
- **Primário** — azul FIFA (`#003DA5`) como cor principal de botões e UI
- **Accent** — dourado Copa (`#C8A84B`) para destaques e repetidas
- Dark mode com fundo azul marinho profundo

## Estrutura de rotas

```
/                    Landing pública
/sign-in             Login
/sign-up             Cadastro
/dashboard           Painel do colecionador
/album               Álbum completo com filtros por grupo
/repetidas           Lista de figurinhas repetidas
/trocas              Match de trocas com outros colecionadores
/perfil              Edição de perfil
/u/[slug]            Perfil público (sem autenticação)
```

## Variáveis de ambiente

Crie um `.env.local` na raiz com as variáveis abaixo. Nunca commite este arquivo.

```env
# Banco de dados (Neon)
DATABASE_URL=postgresql://...

# Autenticação (better-auth)
BETTER_AUTH_SECRET=<string aleatória longa>
BETTER_AUTH_URL=https://seu-dominio.vercel.app
```

## Desenvolvimento local

```bash
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local  # edite com seus valores reais

# 3. Aplicar schema no banco
pnpm drizzle-kit push

# 4. Iniciar servidor de desenvolvimento
pnpm dev
```

O servidor sobe em [http://localhost:3000](http://localhost:3000).

## Testes

```bash
# Rodar todos os testes
pnpm test

# Modo watch
pnpm test:watch
```

Os testes cobrem integridade do catálogo (993 figurinhas, 50 seleções, grupos A–L + Especial), todas as funções de estatística e isolamento multi-tenant.

## Migrations de banco

O projeto usa `drizzle-kit push` para sincronizar o schema diretamente com o banco. Não há arquivos de migration versionados — o schema em `lib/db/schema.ts` é a fonte da verdade.

```bash
DATABASE_URL=<sua-url> pnpm drizzle-kit push
```

## Deploy (Vercel)

```bash
vercel --prod
```

**Variáveis obrigatórias no Vercel Dashboard:**

| Variável | Descrição |
|----------|-----------|
| `DATABASE_URL` | URL de conexão Neon |
| `BETTER_AUTH_SECRET` | String aleatória longa (32+ chars) |
| `BETTER_AUTH_URL` | URL pública do app (ex: `https://trocacopa.vercel.app`) |

## Schema do banco

```
user            — tabela do better-auth
session         — sessões (better-auth)
account         — provedores OAuth (better-auth)
verification    — verificação de e-mail (better-auth)
profile         — perfil público do colecionador (1:1 com user)
sticker_entry   — figurinhas do usuário (userId, stickerCode, count)
```

A tabela `sticker_entry` tem unique constraint em `(userId, stickerCode)`, necessária para o upsert otimista do álbum.

## Catálogo

Arquivo: `lib/catalog.ts`

Cada seleção tem:
- `code` — identificador único (ex: `BRA`, `MEX`)
- `name` — nome em português
- `group` — grupo `A`–`L` ou `Especial`
- `flag` — emoji da bandeira (usado em textos compartilhados)
- `flagCode` — código ISO 3166-1 alpha-2 para flagcdn.com (ex: `br`, `mx`)
- `stickerCount` — número de figurinhas

## Licença

Privado. Não afiliado à FIFA, Panini ou Coca-Cola.
