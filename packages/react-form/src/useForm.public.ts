import { useState } from 'react'
import { initializeForm } from './ReactFormApi.lib'
import type React from 'react'
import type { FunctionComponent } from 'react'
import type { FieldApi, FormApi, FormOptions } from '@tanstack/form-core-v2'

export interface FieldProps<TData> {
  name: string
  children: (fieldApi: FieldApi<TData>) => React.ReactNode
}

export interface ReactFormApi<TData> extends FormApi<TData> {
  /**
   * TODO docs
   */
  Field: FunctionComponent<FieldProps<TData>>
}

/**
 * TODO docs
 */
export function useForm<TData>(
  options: FormOptions<TData>,
): ReactFormApi<TData> {
  const [form] = useState(() => initializeForm(options))

  return form
}

export interface ReactFormFieldProps<TData> {
  /**
   * TODO props
   */
  name: string
  // validators

  children: (fieldApi: FieldApi<TData>) => React.ReactNode
}
