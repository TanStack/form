import type { AnyFormOptions, FormOptionsApi } from '@tanstack/form-core'
import type { FunctionComponent, ReactNode } from 'react'
import type { ReactFormType } from '../ReactForm/formType.public'

export interface FormContextHelper {
  create<TOptions extends AnyFormOptions | FormOptionsApi<unknown>>(
    options: TOptions,
  ): {
    Provider: FunctionComponent<{
      form: ReactFormType<TOptions>
      children?: ReactNode
    }>
    useFormContext: () => ReactFormType<TOptions>
  }
}
