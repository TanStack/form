import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachVueAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core'
import type { InternalVueFormApi } from '../VueForm/VueFormApi.lib'
import type { AnyVueFormComponentMap } from './componentMap.public'

export function createAppFormInitializer<
  TComponents extends AnyVueFormComponentMap,
>(
  createOptions: TComponents,
): (options: FormOptions<any, any, any>) => InternalVueFormApi {
  return (options) =>
    attachVueAppFormComponents(
      new InternalFormApi(options),
      createOptions.formComponents,
      createOptions.fieldComponents,
    ) as never
}
