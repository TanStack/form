import type {
  AnyFormOptions,
  FormOptions,
  FormValidators,
  ToFormErrorTypes,
} from '@tanstack/form-core'
import type { AppFormOptions } from './AppForm/appFormOptions.public'
import type {
  AnySolidFormComponentMap,
  DefaultSolidFormComponentMap,
} from './AppForm/componentMap.public'
import type { SolidFormApi } from './formApiTypes.public'

type SolidFormTypeErrorTypes<
  TFormValidators extends FormValidators<any>,
  TSubmitReturn,
> = unknown extends TSubmitReturn
  ? any
  : ToFormErrorTypes<TFormValidators, TSubmitReturn>

export type SolidFormType<
  TOptions extends
    AnyFormOptions | AppFormOptions<any, any, any, AnySolidFormComponentMap>,
> =
  TOptions extends AppFormOptions<
    infer TFormData,
    infer TFormValidators,
    infer TSubmitReturn,
    infer TComponents
  >
    ? SolidFormApi<
        TFormData,
        SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
        TComponents
      >
    : TOptions extends FormOptions<
          infer TFormData,
          infer TFormValidators,
          infer TSubmitReturn
        >
      ? SolidFormApi<
          TFormData,
          SolidFormTypeErrorTypes<TFormValidators, TSubmitReturn>,
          DefaultSolidFormComponentMap
        >
      : never
