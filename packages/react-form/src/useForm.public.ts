import { useState } from 'react'
import { initializeForm } from './ReactFormApi.lib'
import type React from 'react'
import type { FunctionComponent } from 'react'
import type {
  FieldApi,
  FieldApiOptions,
  FormApi,
  FormOptions,
} from '@tanstack/form-core-v2'

export interface ReactFormApi<TData> extends FormApi<TData, any> {
  /**
   * TODO docs
   */
  Field: FunctionComponent<ReactFormFieldProps<TData>>
  ArrayField: FunctionComponent<ReactFormArrayFieldProps<TData>>
}

/**
 * TODO docs
 */
export function useForm<TData>(
  options: FormOptions<TData, any>,
): ReactFormApi<TData> {
  const [form] = useState(() => initializeForm(options))

  return form
}

export interface ReactFormFieldProps<TData> extends FieldApiOptions<any, any> {
  /**
   * TODO props
   */
  name: string

  children: (fieldApi: FieldApi<TData, any>) => React.ReactNode
}

export interface ReactFormArrayFieldProps<TData> extends FieldApiOptions<
  any,
  any
> {
  /**
   * TODO props
   */
  name: string
  children: (fieldApi: FieldApi<TData, Array<any>>) => React.ReactNode
}
