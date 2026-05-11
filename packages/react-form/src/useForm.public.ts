import { useEffect, useRef, useState } from 'react'
import { initializeForm, InternalReactFormApi } from './ReactFormApi.lib'
import type { SubscribeProps } from './Subscribe'
import type { CrossVersionReactNode } from './types.lib'
import type {
  FieldApi,
  FieldApiOptions,
  FormApi,
  FormOptions,
  FormState,
  FormValidator,
} from '@tanstack/form-core-v2'
import {
  AnyInternalFormApi,
  InternalFormApi,
} from '@tanstack/form-core-v2/internals'

/**
 * Subscribe to `form.store` (full form state). The selector receives the full
 * {@link FormState}.
 */
export type ReactFormSubscribeProps<TFormData, TSelected> = Omit<
  SubscribeProps<FormState<TFormData>, TSelected>,
  'source'
>

export interface ReactFormFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  children: (
    fieldApi: FieldApi<TData, TFormValidators>,
  ) => CrossVersionReactNode
}

export interface ReactFormArrayFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  children: (
    fieldApi: FieldApi<TData, TFormValidators>,
  ) => CrossVersionReactNode
}

export interface ReactTanStackFormComponents<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> {
  /**
   * TODO docs
   */
  Field: <TFieldValue>(
    props: ReactFormFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) => CrossVersionReactNode
  ArrayField: <TFieldValue>(
    props: ReactFormArrayFieldProps<TFormData, TFormValidators, TFieldValue>,
  ) => CrossVersionReactNode
  Subscribe: <TSelected>(
    props: ReactFormSubscribeProps<TFormData, TSelected>,
  ) => CrossVersionReactNode
}

export interface ReactFormApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
>
  extends
    FormApi<TFormData, TFormValidators>,
    ReactTanStackFormComponents<TFormData, TFormValidators> {}

/**
 * TODO docs
 */
export function useForm<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
>(
  options: FormOptions<TData, TFormValidators>,
): ReactFormApi<TData, TFormValidators> {
  const form = useRef<InternalReactFormApi<TData, TFormValidators>>(null)

  if (!form.current) {
    form.current = initializeForm(options)
  }

  useEffect(() => form.current!._update(options))

  return form.current!
}
