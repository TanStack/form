import { FieldApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, onMounted, onUnmounted, watch } from 'vue'
import type { DeepKeys, DeepValue } from '@tanstack/form-core'
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
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
  // This complex type comes from Vue's return type for `DefineSetupFnComponent` but with our own types sprinkled in
  // This allows us to pre-bind some generics while keeping the props type unbound generics for props-based inferencing
> = new <
  TName extends DeepKeys<TParentData> = DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
>(
  props: Omit<
    FieldComponentProps<
      TParentData,
      TName,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
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
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
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
        TData,
        TOnMountReturn,
        TOnChangeReturn,
        TOnChangeAsyncReturn,
        TOnBlurReturn,
        TOnBlurAsyncReturn,
        TOnSubmitReturn,
        TOnSubmitAsyncReturn,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >
      state: FieldApi<
        TParentData,
        TName,
        TData,
        TOnMountReturn,
        TOnChangeReturn,
        TOnChangeAsyncReturn,
        TOnBlurReturn,
        TOnBlurAsyncReturn,
        TOnSubmitReturn,
        TOnSubmitAsyncReturn,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >['state']
    }
  }>
>

export interface VueFieldApi<
  TParentData,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> {
  Field: FieldComponent<
    TParentData,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
}

export type UseField<
  TParentData,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> = <
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
>(
  opts: Omit<
    UseFieldOptions<
      TParentData,
      TName,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    >,
    'form'
  >,
) => {
  api: FieldApi<
    TParentData,
    TName,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  > &
    VueFieldApi<
      TParentData,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    >
  state: Readonly<
    Ref<
      FieldApi<
        TParentData,
        TName,
        TData,
        TOnMountReturn,
        TOnChangeReturn,
        TOnChangeAsyncReturn,
        TOnBlurReturn,
        TOnBlurAsyncReturn,
        TOnSubmitReturn,
        TOnSubmitAsyncReturn,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >['state']
    >
  >
}

export function useField<
  TParentData,
  TName extends DeepKeys<TParentData>,
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
>(
  opts: UseFieldOptions<
    TParentData,
    TName,
    TData,
    TOnMountReturn,
    TOnChangeReturn,
    TOnChangeAsyncReturn,
    TOnBlurReturn,
    TOnBlurAsyncReturn,
    TOnSubmitReturn,
    TOnSubmitAsyncReturn,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >,
) {
  const fieldApi = (() => {
    const api = new FieldApi({
      ...opts,
      form: opts.form,
      name: opts.name,
    })

    const extendedApi: typeof api &
      VueFieldApi<
        TParentData,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      > = api as never

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
  TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
  TOnMountReturn = undefined,
  TOnChangeReturn = undefined,
  TOnChangeAsyncReturn = undefined,
  TOnBlurReturn = undefined,
  TOnBlurAsyncReturn = undefined,
  TOnSubmitReturn = undefined,
  TOnSubmitAsyncReturn = undefined,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> = UseFieldOptions<
  TParentData,
  TName,
  TData,
  TOnMountReturn,
  TOnChangeReturn,
  TOnChangeAsyncReturn,
  TOnBlurReturn,
  TOnBlurAsyncReturn,
  TOnSubmitReturn,
  TOnSubmitAsyncReturn,
  TFormOnMountReturn,
  TFormOnChangeReturn,
  TFormOnChangeAsyncReturn,
  TFormOnBlurReturn,
  TFormOnBlurAsyncReturn,
  TFormOnSubmitReturn,
  TFormOnSubmitAsyncReturn,
  TFormOnServerReturn
>

export const Field = defineComponent(
  <
    TParentData,
    TName extends DeepKeys<TParentData>,
    TData extends DeepValue<TParentData, TName> = DeepValue<TParentData, TName>,
    TOnMountReturn = undefined,
    TOnChangeReturn = undefined,
    TOnChangeAsyncReturn = undefined,
    TOnBlurReturn = undefined,
    TOnBlurAsyncReturn = undefined,
    TOnSubmitReturn = undefined,
    TOnSubmitAsyncReturn = undefined,
    TFormOnMountReturn = undefined,
    TFormOnChangeReturn = undefined,
    TFormOnChangeAsyncReturn = undefined,
    TFormOnBlurReturn = undefined,
    TFormOnBlurAsyncReturn = undefined,
    TFormOnSubmitReturn = undefined,
    TFormOnSubmitAsyncReturn = undefined,
    TFormOnServerReturn = undefined,
  >(
    fieldOptions: UseFieldOptions<
      TParentData,
      TName,
      TData,
      TOnMountReturn,
      TOnChangeReturn,
      TOnChangeAsyncReturn,
      TOnBlurReturn,
      TOnBlurAsyncReturn,
      TOnSubmitReturn,
      TOnSubmitAsyncReturn,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
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
