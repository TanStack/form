import '@testing-library/jest-dom/vitest'
import { afterEach } from 'vitest'
import { cleanup, configure } from '@testing-library/react'
// https://testing-library.com/docs/react-testing-library/api#cleanup
afterEach(() => cleanup())

configure({
  reactStrictMode: process.env.VITEST_REACT_STRICT_MODE === 'true',
})
