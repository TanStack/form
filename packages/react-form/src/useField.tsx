import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  Narrow,
} from '@tanstack/form-core'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData, ValidatorType> {
    Field: FieldComponent<TData, TFormData>
  }
}

export type UseField<TFormData> = <
  TField extends DeepKeys<TFormData>,
  ValidatorType,
>(
  opts?: { name: Narrow<TField> } & UseFieldOptions<
    DeepValue<TFormData, TField>,
    TFormData,
    ValidatorType
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData, ValidatorType>

export function useField<
  TData,
  TFormData,
  ValidatorType,
  TName extends unknown extends TFormData
    ? string
    : DeepKeys<TFormData> = unknown extends TFormData
    ? string
    : DeepKeys<TFormData>,
>(opts: UseFieldOptions<TData, TFormData, ValidatorType, TName>) {
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
      name: name as TName,
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
  TFormData,
  TField,
  ValidatorType,
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
> = {
  validator?: ValidatorType
  children: (
    fieldApi: FieldApi<
      TField,
      TFormData,
      FieldApiOptions<TField, TFormData, ValidatorType, TName>
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
  Omit<
    UseFieldOptions<TField, TFormData, ValidatorType, TName>,
    'name' | 'index' | 'validator'
  >

export type FieldComponent<TParentData, TFormData> = <
  // Type of the field
  TField,
  // Name of the field
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
  ValidatorType,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<
  TParentData,
  TFormData,
  TField,
  ValidatorType,
  TName
>) => any

export function Field<TData, TFormData, ValidatorType>({
  children,
  ...fieldOptions
}: {
  children: (fieldApi: FieldApi<TData, TFormData, ValidatorType>) => any
} & UseFieldOptions<TData, TFormData, ValidatorType>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{ formApi: fieldApi.form, parentFieldName: fieldApi.name }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
