import { InternalFormApi } from '@tanstack/form-core/internals'
import { attachPreactAppFormComponents } from './Components.lib'
import type { FormOptions } from '@tanstack/form-core'
import type { InternalPreactFormApi } from '../PreactForm/PreactFormApi.lib'
import type { AnyPreactFormComponentMap } from './componentMap.public'

export function createAppFormInitializer<
  TComponents extends AnyPreactFormComponentMap,
>(
  createOptions: TComponents,
): (options: FormOptions<any, any, any>) => InternalPreactFormApi {
  return (options) => {
    const form = new InternalFormApi(options)
    const extendedForm = attachPreactAppFormComponents(
      form,
      createOptions.formComponents,
      createOptions.fieldComponents,
    )

    return extendedForm as never
  }
}
