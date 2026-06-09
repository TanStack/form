import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2'
import type { AnyReactFormComponentMap } from './componentMap.public'

declare const componentsSymbol: unique symbol

export interface AppFormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TComponents extends AnyReactFormComponentMap,
> extends FormOptions<TFormData, TFormValidators, TSubmitReturn> {
  [componentsSymbol]: TComponents
}

export interface AppFormOptionsApi<
  TComponents extends AnyReactFormComponentMap,
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
    // Not quite sure why, but using FormValidatorData directly in the generic breaks things.
    // Probably something recursive going on that resolves it to `never`?
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
