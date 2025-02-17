import { FieldApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue'
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core'
import type { Ref, SetupContext, SlotsType } from 'vue'
import type { UseFieldOptions } from './types'

export interface VueFieldApi<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TParentMetaExtension = never,
> {
  Field: FieldComponent<TParentData, TFormValidator, TParentMetaExtension>
}

export type UseField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TParentMetaExtension = never,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: Omit<
    UseFieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
    'form'
  >,
) => {
  api: FieldApi<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  > &
    VueFieldApi<TParentData, TFormValidator, TParentMetaExtension>
  state: Readonly<
    Ref<
      FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData,
        TParentMetaExtension
      >['state']
    >
  >
}

export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentMetaExtension = never,
>(
  opts: UseFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData,
    TParentMetaExtension
  >,
) {
  const fieldApi = (() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name,
    })

    const extendedApi: typeof api &
      VueFieldApi<TParentData, TFormValidator, TParentMetaExtension> =
      api as never

    extendedApi.Field = Field as never

    return extendedApi
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
      fieldApi.update({ ...opts, form: opts.form } as never)
    },
  )

  return { api: fieldApi, state: fieldState } as const
}

type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TParentMetaExtension = never,
> = UseFieldOptions<
  TParentData,
  TName,
  TFieldValidator,
  TFormValidator,
  TData,
  TParentMetaExtension
>

export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TParentMetaExtension = never,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  fieldOptions: Omit<
    FieldComponentProps<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
    'form'
  >,
  context: SetupContext<
    {},
    SlotsType<{
      default: {
        field: FieldApi<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
          TData,
          TParentMetaExtension
        >
        state: FieldApi<
          TParentData,
          TName,
          TFieldValidator,
          TFormValidator,
          TData,
          TParentMetaExtension
        >['state']
      }
    }>
  >,
) => any

export const Field = defineComponent(
  <
    TParentData,
    TName extends DeepKeys<TParentData>,
    TFieldValidator extends
      | Validator<DeepValue<TParentData, TName>, unknown>
      | undefined = undefined,
    TFormValidator extends
      | Validator<TParentData, unknown>
      | undefined = undefined,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
    TParentMetaExtension = never,
  >(
    fieldOptions: UseFieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData,
      TParentMetaExtension
    >,
    context: SetupContext,
  ) => {
    const fieldApi = useField({ ...fieldOptions, ...context.attrs })

    return () =>
      context.slots.default!({
        field: fieldApi.api,
        state: fieldApi.state.value,
      })
  },
  { name: 'Field', inheritAttrs: false },
)
