import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'
import type { ReactFormApi } from './formApiTypes.public'

export type UseFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
>

export type UseSchemaFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <const TFormValidators extends FormValidators<any>, TSubmitReturn>(
  options: FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn
  >,
) => ReactFormApi<
  FormValidatorData<TFormValidators>,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
>

export type UseNullableSchemaFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
>
