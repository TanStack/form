import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type { DeepKeys, DeepValue, Narrow } from '@tanstack/form-core'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TData>
  }
}

export type UseField<TParentData> = <TName extends DeepKeys<TParentData>>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<TParentData, TName>,
) => FieldApi<TParentData, TName, DeepValue<TParentData, TName>>

export function useField<TParentData, TName extends DeepKeys<TParentData>>(
  opts: UseFieldOptions<TParentData, TName>,
): FieldApi<
  TParentData,
  TName
  // Omit<typeof opts, 'onMount'> & {
  //   form: FormApi<TParentData>
  // }
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
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
> = {
  children: (fieldApi: FieldApi<TParentData, TName, TData>) => any
} & (TParentData extends any[]
  ? {
      name?: TName
      index: number
    }
  : {
      name: TName
      index?: never
    }) &
  Omit<UseFieldOptions<TParentData, TName>, 'name' | 'index'>

export type FieldComponent<TParentData> = <
  TName extends DeepKeys<TParentData>,
  TData = DeepValue<TParentData, TName>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<TParentData, TName, TData>) => any

export function Field<TParentData, TName extends DeepKeys<TParentData>>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<TParentData, TName>) => any
} & UseFieldOptions<TParentData, TName>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{ formApi: fieldApi.form, parentFieldName: fieldApi.name }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
