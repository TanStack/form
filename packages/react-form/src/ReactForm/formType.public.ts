import type {
  AnyFormOptions,
  FormOptions,
  ToFormValidatorMetas,
} from '@tanstack/form-core-v2'
import type { AppFormOptions } from '../AppForm/appFormOptions.public'
import type {
  AnyReactFormComponentMap,
  DefaultReactFormComponentMap,
} from '../AppForm/componentMap.public'
import type { ReactFormApi } from './formApiTypes.public'

export type ReactFormType<
  TOptions extends
    | AnyFormOptions
    | AppFormOptions<any, any, any, AnyReactFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? ReactFormApi<
        TFormData,
        ToFormValidatorMetas<TFormValidators>,
        TSubmitReturn,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? ReactFormApi<
          TFormData,
          ToFormValidatorMetas<TFormValidators>,
          TSubmitReturn,
          DefaultReactFormComponentMap
        >
      : never
