import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  Narrow,
  ResolveData,
} from '@tanstack/form-core'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<
    TData,
    TParentData,
    TName extends DeepKeys<TParentData>,
    TResolvedData extends ResolveData<TData, TParentData, TName> = ResolveData<
      TData,
      TParentData,
      TName
    >,
  > {
    Field: FieldComponent<TData>
  }
}

export type UseField<TParentData> = <TName extends DeepKeys<TParentData>>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    DeepValue<TParentData, TName>,
    TParentData,
    TName
  >,
) => FieldApi<DeepValue<TParentData, TName>, TParentData, TName>

export function useField<
  TData,
  TParentData,
  TName extends DeepKeys<TParentData>,
>(
  opts: UseFieldOptions<TData, TParentData, TName>,
): FieldApi<
  TData,
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
  TData,
  TParentData,
  TName extends DeepKeys<TParentData>,
  TResolvedData extends ResolveData<TData, TParentData, TName>,
> = {
  children: (
    fieldApi: FieldApi<TData, TParentData, TName, TResolvedData>,
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
  Omit<UseFieldOptions<TData, TParentData, TName>, 'name' | 'index'>

export type FieldComponent<TParentData> = <
  TData,
  TName extends DeepKeys<TParentData>,
  TResolvedData extends ResolveData<TData, TParentData, TName> = ResolveData<
    TData,
    TParentData,
    TName
  >,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<TData, TParentData, TName, TResolvedData>) => any

export function Field<TData, TParentData, TName extends DeepKeys<TParentData>>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<TData, TParentData, TName>) => any
} & UseFieldOptions<TData, TParentData, TName>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{ formApi: fieldApi.form, parentFieldName: fieldApi.name }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
