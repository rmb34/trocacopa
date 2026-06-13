TrocaCopa
Gerenciador de álbum de figurinhas para a Copa do Mundo 2026. Controle o que você tem, o que falta e encontre colecionadores para trocar — tudo no celular, com suporte offline via PWA.

Funcionalidades
Álbum digital — 993 figurinhas: 48 seleções × 20 + FWC (19) + Coca-Cola (14), grupos A–L + Especial
Controle de repetidas — lista agrupada por seleção com contagem de extras
Trocas inteligentes — cruza sua coleção com a de outros colecionadores e mostra matches mútuos com botão de contato via WhatsApp
Perfil público — link compartilhável /u/[slug] com progresso, lista de faltas e repetidas
Acesso único — compra única via Stripe (Pix + cartão), sem assinatura
PWA — instalável no celular, funciona offline
Stack
Camada	Tecnologia
Framework	Next.js 15 (App Router)
UI	React 19, Tailwind CSS v4, shadcn/ui
Auth	better-auth
ORM	Drizzle ORM + drizzle-kit
Banco	PostgreSQL (Neon)
Pagamento	Stripe Checkout (Pix + cartão)
PWA	@ducanh2912/next-pwa
Deploy	Vercel
Testes	Vitest
Estrutura de rotas
/                   Landing pública
/sign-in            Login
/sign-up            Cadastro
/comprar            Página de compra (gate para usuários não pagos)
/dashboard          Painel do colecionador
/album              Álbum completo com filtros por grupo
/repetidas          Lista de figurinhas repetidas
/trocas             Match de trocas com outros colecionadores
/perfil             Edição de perfil
/u/[slug]           Perfil público (sem autenticação)
/api/checkout       POST — cria sessão Stripe
/api/webhooks/stripe POST — recebe eventos Stripe
Variáveis de ambiente
Crie um .env.local na raiz com as variáveis abaixo. Nunca commite este arquivo.

# Banco de dados (Neon)
DATABASE_URL=postgresql://...

# Autenticação (better-auth)
BETTER_AUTH_SECRET=<string aleatória longa>
BETTER_AUTH_URL=https://seu-dominio.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRICE_CENTS=1990
Para desenvolvimento local, use sk_test_... no Stripe e configure o webhook com o Stripe CLI.

Desenvolvimento local
# 1. Instalar dependências
pnpm install

# 2. Configurar variáveis de ambiente
cp .env.example .env.local  # edite com seus valores reais

# 3. Aplicar schema no banco
pnpm drizzle-kit push

# 4. Iniciar servidor de desenvolvimento
pnpm dev
O servidor sobe em http://localhost:3000.

Testes
# Rodar todos os testes
pnpm test

# Modo watch
pnpm test:watch
Os testes cobrem integridade do catálogo (993 figurinhas, 50 seleções, grupos A–L + Especial), todas as funções de estatística e isolamento multi-tenant.

Migrations de banco
O projeto usa drizzle-kit push para sincronizar o schema diretamente com o banco. Não há arquivos de migration versionados — o schema em lib/db/schema.ts é a fonte da verdade.

DATABASE_URL=<sua-url> pnpm drizzle-kit push
Deploy (Vercel)
O projeto está configurado para deploy automático no Vercel.

vercel --prod
Variáveis obrigatórias no Vercel Dashboard:

DATABASE_URL
BETTER_AUTH_SECRET
BETTER_AUTH_URL
STRIPE_SECRET_KEY
STRIPE_WEBHOOK_SECRET
PRICE_CENTS
Configurar webhook do Stripe após o primeiro deploy:

Stripe Dashboard → Developers → Webhooks → Add endpoint
URL: https://seu-dominio.vercel.app/api/webhooks/stripe
Evento: checkout.session.completed
Copiar o Signing secret → adicionar como STRIPE_WEBHOOK_SECRET no Vercel
Schema do banco
user            — tabela do better-auth
session         — sessões (better-auth)
account         — provedores OAuth (better-auth)
verification    — verificação de e-mail (better-auth)
profile         — perfil público do colecionador (1:1 com user)
sticker_entry   — figurinhas do usuário (userId, stickerCode, count)
purchase        — registro de compra Stripe (userId único, status)
A tabela sticker_entry tem unique constraint em (userId, stickerCode), necessária para o upsert otimista do álbum.

Licença
Privado. Não afiliado à FIFA ou a fabricantes de álbuns
