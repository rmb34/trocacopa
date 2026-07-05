import { describe, it, expect } from 'vitest'
import { createRateLimiter } from '@/lib/rate-limit'

const WINDOW_MS = 60_000

describe('rate limiter', () => {
  it('permite requisições dentro do limite na janela', () => {
    let now = 0
    const limiter = createRateLimiter({ limit: 3, windowMs: WINDOW_MS, now: () => now })

    expect(limiter.consume('user-1')).toBe(true)
    expect(limiter.consume('user-1')).toBe(true)
    expect(limiter.consume('user-1')).toBe(true)
  })

  it('bloqueia a requisição que excede o limite na janela', () => {
    let now = 0
    const limiter = createRateLimiter({ limit: 2, windowMs: WINDOW_MS, now: () => now })

    limiter.consume('user-1')
    limiter.consume('user-1')
    expect(limiter.consume('user-1')).toBe(false)
  })

  it('libera novamente após a janela expirar', () => {
    let now = 0
    const limiter = createRateLimiter({ limit: 1, windowMs: WINDOW_MS, now: () => now })

    expect(limiter.consume('user-1')).toBe(true)
    expect(limiter.consume('user-1')).toBe(false)

    now += WINDOW_MS + 1
    expect(limiter.consume('user-1')).toBe(true)
  })

  it('isola contadores por chave — um usuário não consome o limite de outro', () => {
    let now = 0
    const limiter = createRateLimiter({ limit: 1, windowMs: WINDOW_MS, now: () => now })

    expect(limiter.consume('user-1')).toBe(true)
    expect(limiter.consume('user-2')).toBe(true)
    expect(limiter.consume('user-1')).toBe(false)
  })

  it('descarta janelas antigas para não crescer indefinidamente', () => {
    let now = 0
    const limiter = createRateLimiter({ limit: 1, windowMs: WINDOW_MS, now: () => now })

    for (let i = 0; i < 100; i++) {
      limiter.consume(`user-${i}`)
    }
    now += WINDOW_MS + 1
    limiter.consume('user-novo')

    expect(limiter.size()).toBe(1)
  })
})
