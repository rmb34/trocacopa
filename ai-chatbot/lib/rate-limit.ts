// Rate limit em memória, por instância — best-effort no serverless (cada
// instância tem seu próprio contador). Suficiente para conter abuso de um
// único cliente sem infraestrutura extra; trocar por Redis se escalar.
type LimiterOptions = {
  limit: number
  windowMs: number
  now?: () => number
}

export function createRateLimiter({ limit, windowMs, now = Date.now }: LimiterOptions) {
  const windows = new Map<string, { start: number; count: number }>()

  return {
    // true = dentro do limite; false = excedeu a janela atual.
    consume(key: string): boolean {
      const t = now()

      // Janela cheia expirada de qualquer chave é lixo — limpa ao passar aqui
      // para o Map não acumular usuários que pararam de usar o app.
      for (const [k, w] of windows) {
        if (t - w.start > windowMs) windows.delete(k)
      }

      const current = windows.get(key)
      if (!current) {
        windows.set(key, { start: t, count: 1 })
        return true
      }
      if (current.count >= limit) return false
      current.count += 1
      return true
    },

    size() {
      return windows.size
    },
  }
}

// Limites por tipo de mutation: marcar figurinhas é rajada legítima (usuário
// preenchendo o álbum), perfil não tem motivo para alta frequência.
const stickerLimiter = createRateLimiter({ limit: 120, windowMs: 60_000 })
const profileLimiter = createRateLimiter({ limit: 10, windowMs: 60_000 })

export function assertStickerRateLimit(userId: string) {
  if (!stickerLimiter.consume(userId)) {
    throw new Error('Muitas alterações em sequência — aguarde um instante')
  }
}

export function assertProfileRateLimit(userId: string) {
  if (!profileLimiter.consume(userId)) {
    throw new Error('Muitas alterações em sequência — aguarde um instante')
  }
}
