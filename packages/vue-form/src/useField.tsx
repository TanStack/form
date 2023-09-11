import {
  FieldApi,
  type FieldApiOptions,
  type FormApi,
  RestrictTName,
} from '@tanstack/form-core'
import type { DeepKeys, DeepValue, Narrow } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue-demi'
import type { SlotsType, SetupContext, Ref } from 'vue-demi'
import { provideFormContext, useFormContext } from './formContext'
import type { UseFieldOptions } from './types'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FieldApi<_TData, TFormData, ValidatorType, TName, TData> {
    Field: FieldComponent<TFormData, TData>
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
>(
  opts: UseFieldOptions<_TData, TFormData, ValidatorType, TName, TData>,
): {
  api: FieldApi<_TData, TFormData, ValidatorType, TName, TData>
  state: Readonly<
    Ref<FieldApi<_TData, TFormData, ValidatorType, TName, TData>['state']>
  >
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
      // TODO: Fix typings to include `index` and `parentFieldName`, if present
      name: name as typeof opts.name,
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

type FieldComponentProps<
  TParentData,
  TFormData,
  _TData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
> = (TParentData extends any[]
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
>(
  fieldOptions: FieldComponentProps<
    TParentData,
    TFormData,
    _TData,
    ValidatorType,
    TName,
    TData
  >,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<_TData, TFormData, ValidatorType, TName, TData>
        state: FieldApi<_TData, TFormData, ValidatorType, TName, TData>['state']
      }
    }>
  >,
) => any

export const Field = defineComponent(
  <
    _TData,
    TFormData,
    ValidatorType,
    TName extends RestrictTName<TFormData> = RestrictTName<TFormData>,
    TData = unknown extends _TData ? DeepValue<TFormData, TName> : _TData,
  >(
    fieldOptions: UseFieldOptions<
      _TData,
      TFormData,
      ValidatorType,
      TName,
      TData
    >,
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
