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
    ValidatorType,
    FormValidator,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  > {
    Field: FieldComponent<TData, FormValidator>
  }
}

export type UseField<TParentData> = <
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
>(
  opts?: { name: Narrow<TName> } & UseFieldOptions<
    TParentData,
    TName,
    ValidatorType,
    FormValidator
  >,
) => FieldApi<
  TParentData,
  TName,
  ValidatorType,
  FormValidator,
  DeepValue<TParentData, TName>
>

export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
>(
  opts: UseFieldOptions<TParentData, TName, ValidatorType, FormValidator>,
): FieldApi<
  TParentData,
  TName,
  ValidatorType,
  FormValidator
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
      // TODO: Fix typings to include `index` and `parentFieldName`, if present
      name: name as typeof opts.name,
    })

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
      ? (state) => {
          return [state.meta, Object.keys(state.value || []).length]
        }
      : undefined,
  )
  // Instantiates field meta and removes it when unrendered
  useIsomorphicLayoutEffect(() => fieldApi.mount(), [fieldApi])

  return fieldApi
}

type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = {
  children: (
    fieldApi: FieldApi<TParentData, TName, ValidatorType, FormValidator, TData>,
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
  Omit<
    UseFieldOptions<TParentData, TName, ValidatorType, FormValidator>,
    'name' | 'index'
  >

export type FieldComponent<TParentData, FormValidator> = <
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<
  TParentData,
  TName,
  ValidatorType,
  FormValidator,
  TData
>) => any

export function Field<
  TParentData,
  TName extends DeepKeys<TParentData>,
  ValidatorType,
  FormValidator,
>({
  children,
  ...fieldOptions
}: {
  children: (
    fieldApi: FieldApi<TParentData, TName, ValidatorType, FormValidator>,
  ) => any
} & UseFieldOptions<TParentData, TName, ValidatorType, FormValidator>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{
        formApi: fieldApi.form as never,
        parentFieldName: fieldApi.name,
      }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
