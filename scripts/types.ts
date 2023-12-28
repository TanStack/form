export type Commit = {
  commit: CommitOrTree
  tree: CommitOrTree
  author: AuthorOrCommitter
  committer: AuthorOrCommitter
  subject: string
  body: string
  parsed: Parsed
}

export type CommitOrTree = {
  long: string
  short: string
}

export type AuthorOrCommitter = {
  name: string
  email: string
  date: string
}

export type Parsed = {
  type: string
  scope?: string | null
  subject: string
  merge?: null
  header: string
  body?: null
  footer?: null
  notes?: null[] | null
  references?: null[] | null
  mentions?: null[] | null
  revert?: null
  raw: string
}

export type Package = {
  name: string
  packageDir: string
  srcDir: string
  builds: Build[]
}

export type Build = {
  jsName: string
  entryFile: string
  external?: (d: string) => any
  globals?: Record<string, string>
  esm?: boolean
  cjs?: boolean
  umd?: boolean
  externals?: any[]
}

export type BranchConfig = {
  prerelease: boolean
  ghRelease: boolean
}
