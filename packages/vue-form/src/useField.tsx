import {
  DeepKeys,
  DeepValue,
  FieldApi,
  FieldOptions,
  functionalUpdate,
  Narrow,
} from '@tanstack/form-core'
import { SetupContext, watchEffect, defineComponent, computed } from 'vue-demi'
import { provideFormContext, useFormContext } from './formContext'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData> {
    Field: FieldComponent<TData, TFormData>
  }
}

export interface UseFieldOptions<TData, TFormData>
  extends FieldOptions<TData, TFormData> {
  mode?: 'value' | 'array'
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

  const fieldApi = computed(() => {
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

  // Keep options up to date as they are rendered
  fieldApi.value.update({ ...opts, form: formApi } as never)

  // useStore(
  //   fieldApi.store as any,
  //   opts.mode === 'array'
  //     ? (state: any) => {
  //         return [state.meta, Object.keys(state.value || []).length]
  //       }
  //     : undefined,
  // )

  watchEffect((onCleanup) => {
    const cleanup = fieldApi.value.mount()
    onCleanup(() => cleanup())
  })

  return fieldApi.value
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

export type FieldComponent<TParentData, TFormData> = <TField>(
  fieldOptions: {
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
        }),
  context: SetupContext,
) => any

export const Field = defineComponent(
  <TData, TFormData>(
    fieldOptions: UseFieldOptions<TData, TFormData>,
    context: SetupContext,
  ) => {
    const fieldApi = useField({ ...fieldOptions, ...context.attrs })

    provideFormContext({
      formApi: fieldApi.form,
      parentFieldName: fieldApi.name,
    } as never)

    return () => context.slots.default!(fieldApi)
  },
  { name: 'Field', inheritAttrs: false },
)
