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
  TFormValidators extends ReadonlyArray<FormValidator<TFormData>>,
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
  Subscribe: <TSelected, TFormValidators extends FormValidators<TFormData>>(
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

/**
 * TODO docs
 */
export function useForm<
  TData,
  const TFormValidators extends FormValidators<TData>,
  TSubmitReturn,
>(
  options: FormOptions<TData, TFormValidators, TSubmitReturn>,
): ReactFormApi<TData, TFormValidators, TSubmitReturn> {
  const formRef = useRef<InternalReactFormApi>(null)

  if (!formRef.current) {
    formRef.current = initializeForm(options)
  }

  useEffect(() => formRef.current!._update(options))

  return formRef.current
}
