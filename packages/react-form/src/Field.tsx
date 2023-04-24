import * as React from 'react'
import type {
  DeepKeys,
  DeepValue,
  FieldApi,
  FieldOptions,
  FormApi,
} from '@tanstack/form-core'
import { useField } from './useField'

//

export type FieldComponent<TFormData> = <TField extends DeepKeys<TFormData>>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<DeepValue<TFormData, TField>, TFormData>) => any
  name: TField
} & Omit<FieldOptions<DeepValue<TFormData, TField>, TFormData>, 'name'>) => any

export function createFieldComponent<TFormData>(formApi: FormApi<TFormData>) {
  const ConnectedField: FieldComponent<TFormData> = (props) => (
    <Field {...(props as any)} form={formApi} />
  )
  return ConnectedField
}

export function Field<TData, TFormData>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<TData, TFormData>) => any
} & FieldOptions<TData, TFormData>) {
  const fieldApi = useField(fieldOptions as any)
  return typeof children === 'function'
    ? React.createElement(children, fieldApi as any)
    : children
}
