import * as React from 'react'
import {
  functionalUpdate,
  type DeepKeys,
  type DeepValue,
  type FieldApi,
  type FieldOptions,
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

export function createFieldComponent<TFormData>() {
  const ConnectedField: FieldComponent<TFormData> = (props) => (
    <Field {...(props as any)} />
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
  return functionalUpdate(children, fieldApi as any)
}
