import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core'
import type { AnySolidFormComponentMap } from './componentMap.public'

declare const componentsSymbol: unique symbol

export interface AppFormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TComponents extends AnySolidFormComponentMap,
> extends FormOptions<TFormData, TFormValidators, TSubmitReturn> {
  [componentsSymbol]: TComponents
}

export interface AppFormOptionsApi<
  TComponents extends AnySolidFormComponentMap,
> {
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ): AppFormOptions<TFormData, TFormValidators, TSubmitReturn, TComponents>

  strictSchema: <
    const TFormValidators extends FormValidators<any>,
    TFormData extends FormValidatorData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => AppFormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >

  looseSchema: <
    const TFormValidators extends FormValidators<any>,
    const TFormData extends NullableSchemaData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => AppFormOptions<
    InferUnion<TFormData, FormValidatorData<TFormValidators>>,
    TFormValidators,
    TSubmitReturn,
    TComponents
  >
}
