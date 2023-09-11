import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  FieldApiOptions,
  RestrictTName,
} from '@tanstack/form-core'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import useIsomorphicLayoutEffect from 'use-isomorphic-layout-effect'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<_TData, TFormData, ValidatorType, TName, TData> {
    Field: FieldComponent<TData, TFormData>
  }
}

export type UseField<TFormData> = <
  _TData extends DeepKeys<TFormData>,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
>(
  opts?: UseFieldOptions<_TData, TFormData, ValidatorType, TName, TData>,
) => FieldApi<_TData, TFormData, ValidatorType, TName, TData>

export function useField<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
>(opts: UseFieldOptions<_TData, TFormData, ValidatorType, TName, TData>) {
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
  TFormData,
  _TData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
> = {
  children: (
    fieldApi: FieldApi<_TData, TFormData, ValidatorType, TName, TData>,
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
    UseFieldOptions<_TData, TFormData, ValidatorType, TName, TData>,
    'name' | 'index'
  >

export type FieldComponent<TParentData, TFormData> = <
  // Type of the field
  _TData,
  ValidatorType,
  // Name of the field
  TName extends RestrictTName<TFormData>,
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
>({
  children,
  ...fieldOptions
}: FieldComponentProps<
  TParentData,
  TFormData,
  _TData,
  ValidatorType,
  TName,
  TData
>) => any

export function Field<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
>({
  children,
  ...fieldOptions
}: {
  children: (
    fieldApi: FieldApi<_TData, TFormData, ValidatorType, TName, TData>,
  ) => any
} & UseFieldOptions<_TData, TFormData, ValidatorType, TName, TData>) {
  const fieldApi = useField(fieldOptions as any)

  return (
    <formContext.Provider
      value={{ formApi: fieldApi.form, parentFieldName: fieldApi.name }}
      children={functionalUpdate(children, fieldApi as any)}
    />
  )
}
