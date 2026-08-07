import { createFormCompositionContexts } from '@tanstack/vue-form'

export const { fieldProviderKey, injectField, formProviderKey, injectForm } =
  createFormCompositionContexts()
