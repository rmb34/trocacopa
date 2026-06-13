# Payment — Stripe Integration

## Visão Geral

Implementação de pagamento único via Stripe para TrocaCopa. Usuários pagam R$ 19,90 uma única vez para obter acesso ao álbum completo. O sistema suporta dois métodos de pagamento: Pix e cartão de crédito. Nenhuma assinatura recorrente — acesso vitalício.

## Funcionalidade Implementada

### Fluxo de Pagamento

1. **Usuário autenticado** acessa `/comprar`
2. **Página exibe**: preço (R$ 19,90), lista de features, e botão "Comprar agora"
3. **Clique no botão**: requisição POST para `/api/checkout`
4. **Servidor valida**:
   - Usuário está autenticado (via better-auth)
   - Não tem compra paga anterior
5. **Stripe cria sessão** de checkout com:
   - Modo de pagamento único (não recorrente)
   - Métodos: Card e Pix
   - Metadata com userId para rastreamento
   - URLs de sucesso e cancelamento
6. **Usuário é redirecionado** para Stripe Checkout
7. **Após pagamento bem-sucedido**: Stripe envia webhook para `/api/webhooks/stripe`
8. **Webhook processa**:
   - Valida assinatura da requisição
   - Busca evento `checkout.session.completed`
   - Insere/atualiza registro em `purchase` com status `'paid'`
9. **Usuário retorna ao dashboard** com `?pagamento=sucesso`

### Tabela `purchase`

```sql
CREATE TABLE purchase (
  id SERIAL PRIMARY KEY,
  userId TEXT NOT NULL UNIQUE REFERENCES user(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'pending',  -- 'pending' | 'paid'
  stripeSessionId TEXT,
  paidAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Permissões e Regras

- Apenas usuários autenticados podem acessar `/comprar` e `/api/checkout`
- Um usuário só pode ter um registro em `purchase` (unique userId)
- Se já pagou (`status = 'paid'`), checkout redireciona direto para `/dashboard`
- Webhook só marca como pago se `payment_status === 'paid'`

### Parâmetros Dinâmicos (via .env)

```
STRIPE_SECRET_KEY=sk_live_... ou sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
PRICE_CENTS=1990  (default: 19,90 BRL)
BETTER_AUTH_URL=https://seu-dominio.com  (usado para URLs de sucesso/cancelamento)
```

## Arquitetura

| Arquivo | Descrição |
|---------|-----------|
| `app/actions/purchase.ts` | Server action: `getPurchaseStatus(userId)` → retorna 'none' \| 'pending' \| 'paid' |
| `app/api/checkout/route.ts` | POST: cria sessão Stripe, valida auth e status anterior |
| `app/api/webhooks/stripe/route.ts` | POST: processa eventos Stripe, marca como pago |
| `app/comprar/page.tsx` | Client component: UI da página de compra |
| `package.json` | Adiciona `stripe@^22.2.1` |

### Decisões Técnicas

1. **Servidor action vs. API route para checkout**: Usamos API route porque Stripe retorna uma URL para redirecionamento, e é mais direto fazer em um route que em um server action
2. **Webhook signature validation**: Obrigatório via `stripe.webhooks.constructEvent()` — garante que a requisição veio do Stripe
3. **onConflictDoUpdate**: Permite reprocessar webhooks sem duplicar registros (idempotência)
4. **Métodos de pagamento**: Card + Pix (Brasil é mercado prioritário para Pix em checkout)

## Fluxo Principal

```
┌─ Usuário autenticado
│
├─ Acessa /comprar
│  └─ Vê: preço + features + botão Comprar
│
├─ Clica "Comprar agora"
│  └─ POST /api/checkout
│     ├─ Valida autenticação
│     ├─ Verifica se já pagou
│     └─ Cria sessão Stripe (Card + Pix)
│
├─ Redirecionado para Stripe Checkout
│  └─ Preenche dados e paga
│
├─ Stripe envia webhook
│  └─ POST /api/webhooks/stripe
│     ├─ Valida assinatura
│     ├─ Processa checkout.session.completed
│     └─ Marca purchase.status = 'paid'
│
└─ Usuário retorna a /dashboard?pagamento=sucesso
   └─ Dashboard pode verificar getPurchaseStatus() para mostrar status
```

## Testes Automatizados

### Unitários

| Teste | O que verifica |
|-------|---|
| `getPurchaseStatus(userId_nunca_pagou)` | Retorna 'none' |
| `getPurchaseStatus(userId_pagou)` | Retorna 'paid' |

### Integração

| Cenário | Verificar |
|---------|-----------|
| Usuário não autenticado POST /api/checkout | Retorna 401 |
| Usuário já pagou POST /api/checkout | Retorna redirect URL para /dashboard |
| Usuário novo POST /api/checkout | Retorna URL de checkout Stripe válida |
| Webhook com signature inválida | Retorna 400 |
| Webhook checkout.session.completed válido | Marca purchase como paid, retorna 200 |

## Riscos e Pendências

1. **Falta validação de domínio**: Se `BETTER_AUTH_URL` não for definido, usa `http://localhost:3000`. Em produção, isto deve estar sempre configurado.
2. **Sem tratamento de erro de BD no webhook**: Se o insert falhar, o webhook não retorna erro — apenas não marca como pago. Considerar logging e retry.
3. **Sem retry de webhook**: Se webhook falhar por erro temporário (BD offline), Stripe não retenta automaticamente. Implementar logicamente (tabela de eventos não processados).
4. **Preço hardcoded no frontend**: A page `/comprar/page.tsx` exibe "R$ 19,90" em texto. Se mudasse para `PRICE_CENTS`, precisaria de server component ou API call para ler env.
5. **Sem suporte a cupons/descontos**: Versão inicial não inclui lógica de códigos promocionais.
