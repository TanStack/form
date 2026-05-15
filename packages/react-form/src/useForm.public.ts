import { useEffect, useRef } from 'react'
import { initializeForm } from './ReactFormApi.lib'
import type { InternalReactFormApi } from './ReactFormApi.lib'
import type { SubscribeProps } from './Subscribe'
import type { CrossVersionReactNode } from './types.lib'
import type {
  DeepKeys,
  DeepKeysWhereValueIncludes,
  DeepValue,
  FieldApi,
  FieldApiOptions,
  FormApi,
  FormOptions,
  FormState,
  FormValidator,
} from '@tanstack/form-core-v2'

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export type ReactFormSubscribeProps<TFormData, TSelected> = Omit<
  SubscribeProps<FormState<TFormData>, TSelected>,
  'source'
>

export interface ReactFormFieldProps<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends FieldApiOptions<TFormData, TFormValidators, TFieldName, TFieldValue> {
  children: (
    fieldApi: FieldApi<TFormData, TFormValidators, TFieldName, TFieldValue>,
  ) => CrossVersionReactNode
}

export interface ReactFormArrayFieldProps<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> extends FieldApiOptions<TFormData, TFormValidators, TFieldName, TFieldValue> {
  children: (
    fieldApi: FieldApi<TFormData, TFormValidators, TFieldName, TFieldValue>,
  ) => CrossVersionReactNode
}

export interface ReactTanStackFormComponents<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
> {
  /**
   * TODO docs
   */
  Field: <
    TFieldName extends DeepKeys<TFormData>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
  >(
    props: ReactFormFieldProps<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue
    >,
  ) => CrossVersionReactNode
  ArrayField: <
    TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
    TFieldValue extends DeepValue<TFormData, TFieldName>,
  >(
    props: ReactFormArrayFieldProps<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue
    >,
  ) => CrossVersionReactNode
  Subscribe: <TSelected>(
    props: ReactFormSubscribeProps<TFormData, TSelected>,
  ) => CrossVersionReactNode
}

export interface ReactFormApi<
  TFormData,
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
>
  extends
    FormApi<TFormData, TFormValidators>,
    ReactTanStackFormComponents<TFormData, TFormValidators> {}

/**
 * TODO docs
 */
export function useForm<
  TData,
  const TFormValidators extends ReadonlyArray<FormValidator<TData>>,
>(
  options: FormOptions<TData, TFormValidators>,
): ReactFormApi<TData, TFormValidators> {
  const formRef = useRef<InternalReactFormApi<TData, TFormValidators>>(null)

  if (!formRef.current) {
    formRef.current = initializeForm(options)
  }

  useEffect(() => formRef.current!._update(options))

  return formRef.current
}
