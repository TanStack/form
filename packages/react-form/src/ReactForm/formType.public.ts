import type { AnyFormOptions, FormOptions } from '@tanstack/form-core-v2'
import type { AppFormOptions } from '../AppForm/appFormOptions.public'
import type { ReactFormApi } from './formApiTypes.public'

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
