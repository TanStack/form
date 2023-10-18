declare module 'git-log-parser' {
  import {
    SpawnOptions,
    SpawnOptionsWithoutStdio,
    SpawnOptionsWithStdioTuple,
  } from 'child_process'

  interface Config {
    commit: {
      long: 'H'
      short: 'h'
    }
    tree: {
      long: 'T'
      short: 't'
    }
    author: {
      name: 'an'
      email: 'ae'
      date: {
        key: 'ai'
        type: Date
      }
    }
    committer: {
      name: 'cn'
      email: 'ce'
      date: {
        key: 'ci'
        type: Date
      }
    }
    subject: 's'
    body: 'b'
  }

  export function parse(
    config: object,
    options?:
      | SpawnOptionsWithoutStdio
      | SpawnOptionsWithStdioTuple
      | SpawnOptions,
  ): NodeJS.ReadableStream

  export const fields: Config
}
