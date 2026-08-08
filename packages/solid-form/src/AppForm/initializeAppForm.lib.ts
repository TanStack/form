import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachSolidAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core'
import type { InternalSolidFormApi } from '../SolidFormApi.lib'
import type { AnySolidFormComponentMap } from './componentMap.public'

export function createAppFormInitializer<
  TComponents extends AnySolidFormComponentMap,
>(
  createOptions: TComponents,
): (options: FormOptions<any, any, any>) => InternalSolidFormApi {
  return (options) => {
    const form = new InternalFormApi(options)
    return attachSolidAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    ) as never
  }
}
