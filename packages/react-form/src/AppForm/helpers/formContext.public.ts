import type { AnyFormOptions, FormOptionsApi } from '@tanstack/form-core'
import type { FunctionComponent, ReactNode } from 'react'
import type { ReactFormType } from '../../ReactForm/formType.public'

export interface FormContextData<
  TOptions extends AnyFormOptions | FormOptionsApi<unknown>,
> {
  Provider: FunctionComponent<{
    form: ReactFormType<TOptions>
    children?: ReactNode
  }>
  useFormContext: () => ReactFormType<TOptions>
}

export interface FormContextHelper {
  create<TOptions extends AnyFormOptions | FormOptionsApi<unknown>>(
    options: TOptions,
  ): FormContextData<TOptions>
}
