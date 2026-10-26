import type { TanStackFormServerPlugin } from '@tanstack/form-core'

export function next(): TanStackFormServerPlugin<FormData, FormData> {
  return {
    getFormData: (formData) => formData,
  }
}
