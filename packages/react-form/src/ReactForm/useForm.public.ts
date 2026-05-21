import { initializeForm, useInternalForm } from './ReactFormApi.lib'
import type {
  FormApi,
  FormOptions,
  FormValidators,
} from '@tanstack/form-core-v2'
import type {
  FormValidatorData,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2/internals'
import type { ReactTanStackFormComponents } from './Components.public'
import type { FunctionComponent } from 'react'

export type ReactFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = FormApi<TFormData, TFormValidators, TSubmitReturn> &
  ReactTanStackFormComponents<
    TFormData,
    TFormValidators,
    TSubmitReturn,
    TFieldComponents
  > &
  TFormComponents

export type UseFormHook<
  TFormComponents extends Record<string, FunctionComponent<any>>,
  TFieldComponents extends Record<string, FunctionComponent<any>>,
> = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
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

function useFormHook(options: FormOptions<any, any, any>) {
  const form = useInternalForm(options, initializeForm)
  return form
}

const useSchemaForm = useFormHook as unknown as UseSchemaFormHook<
  Record<never, never>,
  Record<never, never>
>

const useForm = useFormHook as never as UseFormHook<
  Record<never, never>,
  Record<never, never>
>

// TODO add unit tests, chances are the InferUnion type is incomplete
const useNullableSchemaForm = useFormHook as never as UseNullableSchemaFormHook<
  Record<never, never>,
  Record<never, never>
>

export { useForm, useSchemaForm, useNullableSchemaForm }
