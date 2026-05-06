import { useState } from 'react'
import { initializeForm } from './ReactFormApi.lib'
import type React from 'react'
import type { FunctionComponent } from 'react'
import type {
  FieldApi,
  FieldApiOptions,
  FormApi,
  FormOptions,
  FormValidator,
} from '@tanstack/form-core-v2'

// This type mess takes care of react 17-19 cross compatability.
type ReactNode = ReturnType<FunctionComponent<{}>>

export interface ReactFormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> extends FormApi<TData, TFormValidators> {
  /**
   * TODO docs
   */
  Field: <TFieldValue>(
    props: ReactFormFieldProps<TData, TFormValidators, TFieldValue>,
  ) => ReactNode
  ArrayField: <TFieldValue>(
    props: ReactFormArrayFieldProps<TData, TFormValidators, TFieldValue>,
  ) => ReactNode
}

/**
 * TODO docs
 */
export function useForm<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
>(
  options: FormOptions<TData, TFormValidators>,
): ReactFormApi<TData, TFormValidators> {
  const [form] = useState(() => initializeForm(options))

  return form
}

export interface ReactFormFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  children: (fieldApi: FieldApi<TData, TFormValidators>) => React.ReactNode
}

export interface ReactFormArrayFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
  TFieldValue,
> extends FieldApiOptions<TData, TFormValidators, TFieldValue> {
  children: (fieldApi: FieldApi<TData, TFormValidators>) => React.ReactNode
}
