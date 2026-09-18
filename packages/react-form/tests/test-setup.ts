/// <reference types="vite/client" />
import { configure } from 'vitest-browser-react/pure'

configure({
  reactStrictMode: import.meta.env.VITEST_REACT_STRICT_MODE === 'true',
})
