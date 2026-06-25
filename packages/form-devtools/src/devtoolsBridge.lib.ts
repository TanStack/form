import type { FormDevtoolsBridge } from '@tanstack/form-core/internals'

export function createFormDevtoolsBridge(): FormDevtoolsBridge {
  return {
    mountForm: () => () => {},
  }
}
