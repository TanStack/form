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

export interface ReactFormApi<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> extends FormApi<TData, TFormValidators> {
  /**
   * TODO docs
   */
  Field: FunctionComponent<ReactFormFieldProps<TData, TFormValidators>>
  ArrayField: FunctionComponent<
    ReactFormArrayFieldProps<TData, TFormValidators>
  >
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
> extends FieldApiOptions<TData, any> {
  children: (fieldApi: FieldApi<TData, TFormValidators>) => React.ReactNode
}

export interface ReactFormArrayFieldProps<
  TData,
  TFormValidators extends Array<FormValidator<TData>>,
> extends FieldApiOptions<TData, any> {
  children: (fieldApi: FieldApi<TData, TFormValidators>) => React.ReactNode
}
