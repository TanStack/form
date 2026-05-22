import type { ReactAppFormApi } from './ReactAppFormApi.public'
import type {
  FormOptions,
  FormValidatorData,
  FormValidators,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2'
import type { FunctionComponent } from 'react'

export type UseAppFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
>

export type UseSchemaAppFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <const TFormValidators extends FormValidators<any>, TSubmitReturn>(
  options: FormOptions<
    FormValidatorData<TFormValidators>,
    TFormValidators,
    TSubmitReturn
  >,
) => ReactAppFormApi<
  FormValidatorData<TFormValidators>,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
>

export type UseNullableSchemaAppFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactAppFormApi<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn,
  TFormComponents,
  TFieldComponents
>
