import React, { useState } from 'react'
import { useStore } from '@tanstack/react-store'
import type {
  DeepKeys,
  DeepValue,
  FieldOptions,
  Narrow,
} from '@tanstack/form-core'
import { FieldApi, functionalUpdate } from '@tanstack/form-core'
import { useFormContext, formContext } from './formContext'
import { useIsomorphicLayoutEffect } from './utils/useIsomorphicLayoutEffect'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData> {
    Field: FieldComponent<TData, TFormData>
  }
}

export type UseField<TFormData> = <TField extends DeepKeys<TFormData>>(
  opts?: { name: Narrow<TField> } & UseFieldOptions<
    DeepValue<TFormData, TField>,
    TFormData
  >,
) => FieldApi<DeepValue<TFormData, TField>, TFormData>

export function useField<TData, TFormData>(
  opts: UseFieldOptions<TData, TFormData>,
): FieldApi<TData, TFormData> {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const [fieldApi] = useState<FieldApi<TData, TFormData>>(() => {
    const name = (
      typeof opts.index === 'number'
        ? [parentFieldName, opts.index, opts.name]
        : [parentFieldName, opts.name]
    )
      .filter((d) => d !== undefined)
      .join('.')

    const api = new FieldApi({ ...opts, form: formApi, name: name as any })

    api.Field = Field as any

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
    fieldApi.store as any,
    opts.mode === 'array'
      ? (state: any) => {
          return [state.meta, Object.keys(state.value || []).length]
        }
      : undefined,
  )

  // Instantiates field meta and removes it when unrendered
  useIsomorphicLayoutEffect(() => fieldApi.mount(), [fieldApi])

  return fieldApi
}

// export type FieldValue<TFormData, TField> = TFormData extends any[]
//   ? TField extends `[${infer TIndex extends number | 'i'}].${infer TRest}`
//     ? DeepValue<TFormData[TIndex extends 'i' ? number : TIndex], TRest>
//     : TField extends `[${infer TIndex extends number | 'i'}]`
//     ? TFormData[TIndex extends 'i' ? number : TIndex]
//     : never
//   : TField extends `${infer TPrefix}[${infer TIndex extends
//       | number
//       | 'i'}].${infer TRest}`
//   ? DeepValue<
//       DeepValue<TFormData, TPrefix>[TIndex extends 'i' ? number : TIndex],
//       TRest
//     >
//   : TField extends `${infer TPrefix}[${infer TIndex extends number | 'i'}]`
//   ? DeepValue<TFormData, TPrefix>[TIndex extends 'i' ? number : TIndex]
//   : DeepValue<TFormData, TField>

export type FieldValue<TFormData, TField> = TFormData extends any[]
  ? unknown extends TField
    ? TFormData[number]
    : DeepValue<TFormData[number], TField>
  : DeepValue<TFormData, TField>

// type Test1 = FieldValue<{ foo: { bar: string }[] }, 'foo'>
// //   ^?
// type Test2 = FieldValue<{ foo: { bar: string }[] }, 'foo[i]'>
// //   ^?
// type Test3 = FieldValue<{ foo: { bar: string }[] }, 'foo[2].bar'>
// //   ^?

export type FieldComponent<TParentData, TFormData> = <TField>({
  children,
  ...fieldOptions
}: {
  children: (
    fieldApi: FieldApi<FieldValue<TParentData, TField>, TFormData>,
  ) => any
} & Omit<
  UseFieldOptions<FieldValue<TParentData, TField>, TFormData>,
  'name' | 'index'
> &
  (TParentData extends any[]
    ? {
        name?: TField extends undefined ? TField : DeepKeys<TParentData>
        index: number
      }
    : {
        name: TField extends undefined ? TField : DeepKeys<TParentData>
        index?: never
      })) => any

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
