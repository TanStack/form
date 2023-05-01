import * as React from 'react'
//
import { useStore } from '@tanstack/react-store'
import type { DeepKeys, DeepValue, FieldOptions } from '@tanstack/form-core'
import { FieldApi } from '@tanstack/form-core'
import { useFormContext } from './formContext'
import type { FormFactory } from './createFormFactory'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldOptions<TData, TFormData> {
    formFactory?: FormFactory<TFormData>
  }
}

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: TField } & FieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>

export function createUseField<TFormData>(): UseField<TFormData> {
  return (opts) => {
    return useField(opts as any)
  }
}

export function useField<TData, TFormData>(
  opts: FieldOptions<TData, TFormData> & {
    // selector: (state: FieldApi<TData, TFormData>) => TSelected
  },
): FieldApi<TData, TFormData> {
  // Get the form API either manually or from context
  const formApi = useFormContext()

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
