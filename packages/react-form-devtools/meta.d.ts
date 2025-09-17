// meta.d.ts
interface ImportMetaEnv {
  readonly NODE_ENV: 'development' | 'production' | 'test'
  readonly SSR: boolean
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
