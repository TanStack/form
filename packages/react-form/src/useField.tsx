import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  FieldOptions,
  Narrow,
} from '@tanstack/form-core'
import { FieldApi, FormApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData> {
    Field: FieldComponent<TFormData>
  }
}

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: Narrow<TField> } & FieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>

export function useField<
  TData,
  TFormData,
  TName extends unknown extends TFormData
    ? string
    : DeepKeys<TFormData> = unknown extends TFormData
    ? string
    : DeepKeys<TFormData>,
>(
  opts: FieldOptions<TData, TFormData, TName>,
): FieldApi<
  TData,
  TFormData,
  Omit<typeof opts, 'onMount'> & {
    form: FormApi<TFormData>
  }
> {
  // Get the form API either manually or from context
  const { formApi } = useFormContext()

  const [fieldApi] = useState(() => {
    const api = new FieldApi({
      ...opts,
      form: formApi,
      name: opts.name,
    } as never)

    api.Field = Field as never

    return api
  })

  /**
   * fieldApi.update should not have any side effects. Think of it like a `useRef`
   * that we need to keep updated every render with the most up-to-date information.
   */
  useIsomorphicLayoutEffect(() => {
    fieldApi.update({ ...opts, form: formApi } as never)
  })

  useStore(fieldApi.store)

  // Instantiates field meta and removes it when unrendered
  useIsomorphicLayoutEffect(() => fieldApi.mount(), [fieldApi])

  return fieldApi as never
}

interface FieldComponentProps<
  TFormData,
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
> extends Omit<FieldOptions<unknown, TFormData, TName>, 'name'> {
  name: TName
  children: (
    fieldApi: FieldApi<
      unknown,
      TFormData,
      FieldApiOptions<unknown, TFormData, TName>
    >,
  ) => any
}

export type FieldComponent<TFormData> = <
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<TFormData, TName>) => any

export function Field<TData, TFormData>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<TData, TFormData>) => any
} & FieldOptions<TData, TFormData>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{ formApi: fieldApi.form, parentFieldName: fieldApi.name }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
