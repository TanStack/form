import type { AnyFormOptions, FormOptions } from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { ReactFormApi } from './useForm.public'

/**
 * This type mess takes care of react 17-19 cross compatability.
 */
export type CrossVersionReactNode = ReturnType<FunctionComponent<{}>>

export type ReactFormType<TOptions extends AnyFormOptions> =
  TOptions extends FormOptions<infer TFormData, infer TFormValidators>
    ? ReactFormApi<TFormData, TFormValidators>
    : never

// AppForm type helper plan
// const { appFormOptions } = createFormHook()
// AppFormOptions = FormOptions & { brand: FieldComponents }

// AppFormType<T extends AnyAppFormOptions>
