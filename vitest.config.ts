import { defineConfig } from 'vitest/config'
import path from 'path'

export default defineConfig({
  test: {
    environment: 'node',
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts', 'app/actions/**/*.ts'],
      exclude: ['lib/db/**', 'lib/auth*.ts', 'lib/auth-client.ts'],
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    },
  },
})
