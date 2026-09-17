import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

if (typeof globalThis.process === 'undefined') {
  ;(globalThis as any).process = { env: {} }
}

// https://testing-library.com/docs/vue-testing-library/api#cleanup
afterEach(() => cleanup())
