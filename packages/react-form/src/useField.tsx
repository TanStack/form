import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  Narrow,
} from '@tanstack/form-core'
import { FieldApi, type FormApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<_TData, TFormData, Opts, TData> {
    Field: FieldComponent<TData, TFormData>
  }
}

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: Narrow<TField> } & UseFieldOptions<
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
  opts: UseFieldOptions<TData, TFormData, TName>,
): FieldApi<
  TData,
  TFormData,
  Omit<typeof opts, 'onMount'> & {
    form: FormApi<TFormData>
  }
> {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const [fieldApi] = useState(() => {
    const name = (
      typeof opts.index === 'number'
        ? [parentFieldName, opts.index, opts.name]
        : [parentFieldName, opts.name]
    )
      .filter((d) => d !== undefined)
      .join('.')

    const api = new FieldApi({
      ...opts,
      form: formApi,
      name: name,
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

  useStore(
    fieldApi.store,
    opts.mode === 'array'
      ? (state: any) => {
          return [state.meta, Object.keys(state.value || []).length]
        }
      : undefined,
  )
  // Instantiates field meta and removes it when unrendered
  useIsomorphicLayoutEffect(() => fieldApi.mount(), [fieldApi])

  return fieldApi as never
}

type FieldComponentProps<
  TParentData,
  TFormData,
  TField,
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
> = {
  children: (
    fieldApi: FieldApi<
      TField,
      TFormData,
      FieldApiOptions<TField, TFormData, TName>
    >,
  ) => any
} & (TParentData extends any[]
  ? {
      name?: TName
      index: number
    }
  : {
      name: TName
      index?: never
    }) &
  Omit<UseFieldOptions<TField, TFormData, TName>, 'name' | 'index'>

export type FieldComponent<TParentData, TFormData> = <
  // Type of the field
  TField,
  // Name of the field
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<TParentData, TFormData, TField, TName>) => any

export function Field<TData, TFormData>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<TData, TFormData>) => any
} & UseFieldOptions<TData, TFormData>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{ formApi: fieldApi.form, parentFieldName: fieldApi.name }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
