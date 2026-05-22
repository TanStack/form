import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'

declare const fieldComponentsSymbol: unique symbol
declare const formComponentsSymbol: unique symbol

export interface AppFormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> extends FormOptions<TFormData, TFormValidators, TSubmitReturn> {
  [fieldComponentsSymbol]: TFieldComponents
  [formComponentsSymbol]: TFormComponents
}

export interface AppFormOptionsApi<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> {
  <
    TFormData,
    const TFormValidators extends FormValidators<TFormData>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ): AppFormOptions<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFormComponents,
    TFieldComponents
  >

  schema: <
    const TFormValidators extends FormValidators<any>,
    TFormData extends FormValidatorData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => AppFormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn,
    TFormComponents,
    TFieldComponents
  >

  nullableSchema: <
    const TFormValidators extends FormValidators<any>,
    const TFormData extends NullableSchemaData<TFormValidators>,
    TSubmitReturn,
  >(
    options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
  ) => AppFormOptions<
    InferUnion<TFormData, FormValidatorData<TFormValidators>>,
    TFormValidators,
    TSubmitReturn,
    TFormComponents,
    TFieldComponents
  >
}
