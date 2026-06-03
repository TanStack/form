import { InternalFormApi } from '@tanstack/form-core-v2/internals'
import { attachReactAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core-v2'
import type { InternalReactFormApi } from '../ReactForm/ReactFormApi.lib'
import type { AnyReactFormComponentMap } from './componentMap.public'

export function createAppFormInitializer<
  TComponents extends AnyReactFormComponentMap,
>(
  createOptions: TComponents,
): (options: FormOptions<any, any, any>) => InternalReactFormApi {
  return (options) => {
    const form = new InternalFormApi(options)
    const extendedForm = attachReactAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    )

    return extendedForm as never
  }
}
