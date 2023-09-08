import { FieldApi } from '@tanstack/form-core';
import type {
  FieldState,
  DeepKeys,
  DeepValue,
  FieldOptions,
  Narrow
} from '@tanstack/form-core';
import { useStore } from '@tanstack/vue-store'
import {
  defineComponent,
  onMounted,
  onUnmounted,
  watch
} from 'vue-demi';
import type {
  SlotsType,
  SetupContext,
  Ref
} from 'vue-demi';
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
): {
  api: FieldApi<TData, TFormData>
  state: Readonly<Ref<FieldApi<TData, TFormData>['state']>>
} {
  // Get the form API either manually or from context
  const { formApi, parentFieldName } = useFormContext()

  const fieldApi = (() => {
    const name = (
      typeof opts.index === 'number'
        ? [parentFieldName, opts.index, opts.name]
        : [parentFieldName, opts.name]
    )
      .filter((d) => d !== undefined)
      .join('.')

    const api = new FieldApi({ ...opts, form: formApi, name: name as never })

    api.Field = Field as never

    return api
  })()

  const fieldState = useStore(fieldApi.store, (state) => state)

  let cleanup!: () => void
  onMounted(() => {
    cleanup = fieldApi.mount()
  })

  onUnmounted(() => {
    cleanup()
  })

  watch(
    () => opts,
    () => {
      // Keep options up to date as they are rendered
      fieldApi.update({ ...opts, form: formApi } as never)
    },
  )

  return { api: fieldApi, state: fieldState } as never
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
  fieldOptions: Omit<
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
  context: SetupContext<{}, SlotsType<{
    default: {
      field: FieldApi<FieldValue<TParentData, TField>, TFormData>
      state: FieldState<any>
    }
  }>>,
) => any

export const Field = defineComponent(
  <TData, TFormData>(
    fieldOptions: UseFieldOptions<TData, TFormData>,
    context: SetupContext,
  ) => {
    const fieldApi = useField({ ...fieldOptions, ...context.attrs })

    provideFormContext({
      formApi: fieldApi.api.form,
      parentFieldName: fieldApi.api.name,
    } as never)

    return () => context.slots.default!({
      field: fieldApi.api,
      state: fieldApi.state.value
    })
  },
  { name: 'Field', inheritAttrs: false },
)
