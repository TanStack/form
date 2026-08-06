import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachSvelteAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core'
import type { InternalSvelteFormApi } from '../createForm.svelte.js'
import type { AnySvelteFormComponentMap } from './componentMap.public'

export function createAppFormInitializer<
  TComponents extends AnySvelteFormComponentMap,
>(
  createOptions: TComponents,
): (options: FormOptions<any, any, any>) => InternalSvelteFormApi {
  return (options) =>
    attachSvelteAppFormComponents(
      new InternalFormApi(options),
      createOptions.formComponents,
      createOptions.fieldComponents,
    ) as never
}
