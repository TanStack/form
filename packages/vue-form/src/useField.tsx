import { FieldApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue'
import type { DeepKeys, DeepValue, Validator } from '@tanstack/form-core'
import type {
  ComponentOptionsMixin,
  CreateComponentPublicInstanceWithMixins,
  EmitsOptions,
  EmitsToProps,
  PublicProps,
  Ref,
  SetupContext,
  SlotsType,
} from 'vue'
import type { UseFieldOptions } from './types'

export type FieldComponent<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  // This complex type comes from Vue's return type for `DefineSetupFnComponent` but with our own types sprinkled in
  // This allows us to pre-bind some generics while keeping the props type unbound generics for props-based inferencing
> = new <
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  props: Omit<
    FieldComponentProps<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
    'form'
  > &
    EmitsToProps<EmitsOptions> &
    PublicProps,
) => CreateComponentPublicInstanceWithMixins<
  Omit<
    FieldComponentProps<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
    >,
    'form'
  >,
  {},
  {},
  {},
  {},
  ComponentOptionsMixin,
  ComponentOptionsMixin,
  EmitsOptions,
  PublicProps,
  {},
  false,
  {},
  SlotsType<{
    default: {
      field: FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >
      state: FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
      >['state']
    }
  }>
>

export interface VueFieldApi<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> {
  Field: FieldComponent<TParentData, TFormValidator>
}

export type UseField<
  TParentData,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
>(
  opts: Omit<
    UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>,
    'form'
  >,
) => {
  api: FieldApi<TParentData, TName, TFieldValidator, TFormValidator, TData> &
    VueFieldApi<TParentData, TFormValidator>
  state: Readonly<
    Ref<
      FieldApi<
        TParentData,
        TName,
        TFieldValidator,
        TFormValidator,
        TData
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
>(
  opts: UseFieldOptions<
    TParentData,
    TName,
    TFieldValidator,
    TFormValidator,
    TData
  >,
) {
  const fieldApi = (() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name,
    })

    const extendedApi: typeof api & VueFieldApi<TParentData, TFormValidator> =
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

export type FieldComponentProps<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TFieldValidator extends
    | Validator<DeepValue<TParentData, TName>, unknown>
    | undefined = undefined,
  TFormValidator extends
    | Validator<TParentData, unknown>
    | undefined = undefined,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
> = UseFieldOptions<TParentData, TName, TFieldValidator, TFormValidator, TData>

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
  >(
    fieldOptions: UseFieldOptions<
      TParentData,
      TName,
      TFieldValidator,
      TFormValidator,
      TData
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
