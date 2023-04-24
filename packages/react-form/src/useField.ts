import * as React from 'react'
//
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  FieldOptions,
  FormApi,
} from '@tanstack/form-core'
import { FieldApi } from '@tanstack/form-core'
import { useFormContext } from './formContext'

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: TField } & FieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>

export function createUseField<TFormData>(formApi: FormApi<TFormData>) {
  const useFormField: UseField<TFormData> = (opts) => {
    return useField({ ...opts, form: formApi } as any)
  }

  return useFormField
}

export function useField<TData, TFormData>(
  opts: FieldOptions<TData, TFormData> & {
    // selector: (state: FieldApi<TData, TFormData>) => TSelected
  },
): FieldApi<TData, TFormData> {
  // invariant( // TODO:
  //   opts.name,
  //   `useField: A field is required to use this hook. eg, useField('myField', options)`
  // )

  // Get the form API either manually or from context
  const formApi = useFormContext(opts.form)

  const [fieldApi] = React.useState<FieldApi<TData, TFormData>>(
    () => new FieldApi({ ...opts, form: formApi }),
  )

  // Keep options up to date as they are rendered
  fieldApi.update({ ...opts, form: formApi })

  useStore(fieldApi.store)

  // Instantiates field meta and removes it when unrendered
  React.useEffect(() => fieldApi.mount(), [fieldApi])

  return fieldApi
}
