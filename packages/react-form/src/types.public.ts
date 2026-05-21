import type { AnyFormOptions, FormOptions } from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { ReactFormApi } from './ReactForm/useForm.public'
import type { AppFormOptions } from './AppForm/appFormOptions.public'

/**
 * This type mess takes care of react 17-19 cross compatability.
 */
export type CrossVersionReactNode = ReturnType<FunctionComponent<{}>>

export type ReactFormType<
  TOptions extends AnyFormOptions | AppFormOptions<any, any, any, any, any>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TFormComponents,
    infer TFieldComponents
  >
    ? ReactFormApi<
        TFormData,
        TFormValidators,
        TSubmitReturn,
        TFormComponents,
        TFieldComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? ReactFormApi<
          TFormData,
          TFormValidators,
          TSubmitReturn,
          Record<never, never>,
          Record<never, never>
        >
      : never

// AppForm type helper plan
// const { appFormOptions } = createFormHook()
// AppFormOptions = FormOptions & { brand: FieldComponents }

// AppFormType<T extends AnyAppFormOptions>
