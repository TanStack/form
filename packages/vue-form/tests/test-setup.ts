import '@testing-library/jest-dom/vitest'
import { cleanup } from '@testing-library/vue'
import { afterEach } from 'vitest'

// https://testing-library.com/docs/vue-testing-library/api#cleanup
afterEach(() => cleanup())
