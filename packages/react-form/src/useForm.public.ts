import { useEffect, useRef } from 'react'
import { initializeForm } from './ReactFormApi.lib'
import type { InternalReactFormApi } from './ReactFormApi.lib'
import type { SubscribeProps } from './Subscribe.public'
import type { CrossVersionReactNode } from './types.lib'
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
  FormValidator,
  FormValidators,
} from '@tanstack/form-core-v2'

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export type ReactFormSubscribeProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSelected,
> = Omit<
  SubscribeProps<FormState<TFormData, TFormValidators>, TSelected>,
  'source'
>

export interface ReactFormFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: FieldApi<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
}

export interface ReactFormArrayFieldProps<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TFieldName extends DeepKeysWhereValueIncludes<TFormData, Array<any>>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> extends FieldApiOptions<
  TFormData,
  TFormValidators,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  children: (
    fieldApi: FieldApi<
      TFormData,
      TFormValidators,
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
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
    TFieldValidators extends FieldValidators<
      TFormData,
      TFieldName,
      TFieldValue
    >,
  >(
    props: ReactFormFieldProps<
      TFormData,
      TFormValidators,
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
      TFieldName,
      TFieldValue,
      TFieldValidators
    >,
  ) => CrossVersionReactNode
  Subscribe: <TSelected, TFormValidators extends FormValidators<TFormData>>(
    props: ReactFormSubscribeProps<TFormData, TFormValidators, TSelected>,
  ) => CrossVersionReactNode
}

export interface ReactFormApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
>
  extends
    FormApi<TFormData, TFormValidators>,
    ReactTanStackFormComponents<TFormData, TFormValidators> {}

/**
 * TODO docs
 */
export function useForm<
  TData,
  const TFormValidators extends FormValidators<TData>,
>(
  options: FormOptions<TData, TFormValidators>,
): ReactFormApi<TData, TFormValidators> {
  const formRef = useRef<InternalReactFormApi>(null)

  if (!formRef.current) {
    formRef.current = initializeForm(options)
  }

  useEffect(() => formRef.current!._update(options))

  return formRef.current
}
