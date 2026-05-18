import { useEffect, useRef } from 'react'
import { initializeForm } from './ReactFormApi.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FieldValidators,
  FormApi,
  FormOptions,
  FormState,
  FormValidators,
} from '@tanstack/form-core-v2'
import type { InternalReactFormApi } from './ReactFormApi.lib'
import type { SubscribeProps } from './Subscribe.public'
import type { CrossVersionReactNode } from './types.lib'
import type {
  FormValidatorData,
  InferUnion,
  NullableSchemaData,
} from '@tanstack/form-core-v2/internals'

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export type ReactFormSubscribeProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TSelected,
> = Omit<
  SubscribeProps<
    FormState<TFormData, TFormValidators, TSubmitReturn>,
    TSelected
  >,
  'source'
>

export interface ReactFormFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: FieldApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
}

export interface ReactFormArrayFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: FieldApi<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
}

export interface ReactTanStackFormComponents<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> {
  /**
   * TODO docs
   */
  Field: <
    TFieldName extends DeepKeys<TFormData>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
    TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      TFieldValue
    >,
  >(
    props: ReactFormFieldProps<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
  ArrayField: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
    TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      TFieldValue
    >,
  >(
    props: ReactFormArrayFieldProps<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
  Subscribe: <TSelected>(
    props: ReactFormSubscribeProps<
      TFormData,
      TFormValidators,
      TSubmitReturn,
      TSelected
    >,
  ) => CrossVersionReactNode
}

export interface ReactFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>
  extends
    FormApi<TFormData, TFormValidators, TSubmitReturn>,
    ReactTanStackFormComponents<TFormData, TFormValidators, TSubmitReturn> {}

function useFormHook(options: FormOptions<any, any, any>) {
  const formRef = useRef<InternalReactFormApi>(null)

  if (!formRef.current) {
    formRef.current = initializeForm(options)
  }

  useEffect(() => formRef.current!._update(options))

  return formRef.current
}

export type UseFormHook = <
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<TFormData, TFormValidators, TSubmitReturn>

const useForm = useFormHook as UseFormHook

export type UseSchemaFormHook = <
  const TFormValidators extends FormValidators<any>,
  TFormData extends FormValidatorData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<TFormData, TFormValidators, TSubmitReturn>

const useSchemaForm = useFormHook as UseSchemaFormHook

export type UseNullableSchemaFormHook = <
  const TFormValidators extends FormValidators<any>,
  const TFormData extends NullableSchemaData<TFormValidators>,
  TSubmitReturn,
>(
  options: FormOptions<TFormData, TFormValidators, TSubmitReturn>,
) => ReactFormApi<
  InferUnion<TFormData, FormValidatorData<TFormValidators>>,
  TFormValidators,
  TSubmitReturn
>

// TODO add unit tests, chances are the InferUnion type is incomplete
const useNullableSchemaForm = useFormHook as UseNullableSchemaFormHook

export { useForm, useSchemaForm, useNullableSchemaForm }
