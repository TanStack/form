import {
  FieldApi,
  type FieldApiOptions,
  type FormApi,
} from '@tanstack/form-core'
import type { DeepKeys, DeepValue, Narrow } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue-demi'
import type { SlotsType, SetupContext, Ref } from 'vue-demi'
import { provideFormContext, useFormContext } from './formContext'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<TData, TFormData, ValidatorType> {
    Field: FieldComponent<TFormData, TData>
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
>(
  opts: UseFieldOptions<TData, TFormData, ValidatorType, TName>,
): {
  api: FieldApi<TData, TFormData, ValidatorType>
  state: Readonly<Ref<FieldApi<TData, TFormData, ValidatorType>['state']>>
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

    const api = new FieldApi({
      ...opts,
      form: formApi,
      name: name as TName,
    })

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

  return { api: fieldApi, state: fieldState }
}

export type FieldValue<TFormData, TField> = TFormData extends any[]
  ? unknown extends TField
    ? TFormData[number]
    : DeepValue<TFormData[number], TField>
  : DeepValue<TFormData, TField>

type FieldComponentProps<
  TParentData,
  TFormData,
  TField,
  ValidatorType,
  TName extends unknown extends TFormData ? string : DeepKeys<TFormData>,
> = {
  validator?: ValidatorType
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
>(
  fieldOptions: FieldComponentProps<
    TParentData,
    TFormData,
    TField,
    ValidatorType,
    TName
  >,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<
          TField,
          TFormData,
          FieldApiOptions<TField, TFormData, ValidatorType, TName>
        >
        state: FieldApi<
          TField,
          TFormData,
          FieldApiOptions<TField, TFormData, ValidatorType, TName>
        >['state']
      }
    }>
  >,
) => any

export const Field = defineComponent(
  <TData, TFormData, ValidatorType>(
    fieldOptions: UseFieldOptions<TData, TFormData, ValidatorType>,
    context: SetupContext,
  ) => {
    const fieldApi = useField({ ...fieldOptions, ...context.attrs })

    provideFormContext({
      formApi: fieldApi.api.form,
      parentFieldName: fieldApi.api.name,
    } as never)

    return () =>
      context.slots.default!({
        field: fieldApi.api,
        state: fieldApi.state.value,
      })
  },
  { name: 'Field', inheritAttrs: false },
)
