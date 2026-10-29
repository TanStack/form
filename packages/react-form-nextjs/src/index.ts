import { createTanStackFormServerPlugin } from '@tanstack/form-core'

export function next() {
  return createTanStackFormServerPlugin({
    submittedDataType: new FormData(),
  })
}
