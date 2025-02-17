import { FormApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, h, onMounted } from 'vue'
import { Field, useField } from './useField'
import type { FormOptions, FormState } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/vue-store'
import type {
  ComponentOptionsMixin,
  CreateComponentPublicInstanceWithMixins,
  EmitsOptions,
  EmitsToProps,
  PublicProps,
  Ref,
  SlotsType,
} from 'vue'
import type { FieldComponent, UseField } from './useField'

type SubscribeComponent<
  TFormData,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
> =
  // This complex type comes from Vue's return type for `DefineSetupFnComponent` but with our own types sprinkled in
  // This allows us to pre-bind some generics while keeping the props type unbound generics for props-based inferencing
  new <
    TSelected = NoInfer<
      FormState<
        TFormData,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >
    >,
  >(
    props: {
      selector?: (
        state: NoInfer<
          FormState<
            TFormData,
            TFormOnMountReturn,
            TFormOnChangeReturn,
            TFormOnChangeAsyncReturn,
            TFormOnBlurReturn,
            TFormOnBlurAsyncReturn,
            TFormOnSubmitReturn,
            TFormOnSubmitAsyncReturn,
            TFormOnServerReturn
          >
        >,
      ) => TSelected
    } & EmitsToProps<EmitsOptions> &
      PublicProps,
  ) => CreateComponentPublicInstanceWithMixins<
    {
      selector?: (
        state: NoInfer<
          FormState<
            TFormData,
            TFormOnMountReturn,
            TFormOnChangeReturn,
            TFormOnChangeAsyncReturn,
            TFormOnBlurReturn,
            TFormOnBlurAsyncReturn,
            TFormOnSubmitReturn,
            TFormOnSubmitAsyncReturn,
            TFormOnServerReturn
          >
        >,
      ) => TSelected
    },
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
      default: NoInfer<
        FormState<
          TFormData,
          TFormOnMountReturn,
          TFormOnChangeReturn,
          TFormOnChangeAsyncReturn,
          TFormOnBlurReturn,
          TFormOnBlurAsyncReturn,
          TFormOnSubmitReturn,
          TFormOnSubmitAsyncReturn,
          TFormOnServerReturn
        >
      >
    }>
  >

export interface VueFormApi<
  TFormData,
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
    TFormData,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
  useField: UseField<
    TFormData,
    TFormOnMountReturn,
    TFormOnChangeReturn,
    TFormOnChangeAsyncReturn,
    TFormOnBlurReturn,
    TFormOnBlurAsyncReturn,
    TFormOnSubmitReturn,
    TFormOnSubmitAsyncReturn,
    TFormOnServerReturn
  >
  useStore: <
    TSelected = NoInfer<
      FormState<
        TFormData,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      >
    >,
  >(
    selector?: (
      state: NoInfer<
        FormState<
          TFormData,
          TFormOnMountReturn,
          TFormOnChangeReturn,
          TFormOnChangeAsyncReturn,
          TFormOnBlurReturn,
          TFormOnBlurAsyncReturn,
          TFormOnSubmitReturn,
          TFormOnSubmitAsyncReturn,
          TFormOnServerReturn
        >
      >,
    ) => TSelected,
  ) => Readonly<Ref<TSelected>>
  Subscribe: SubscribeComponent<
    TFormData,
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

export function useForm<
  TFormData,
  TFormOnMountReturn = undefined,
  TFormOnChangeReturn = undefined,
  TFormOnChangeAsyncReturn = undefined,
  TFormOnBlurReturn = undefined,
  TFormOnBlurAsyncReturn = undefined,
  TFormOnSubmitReturn = undefined,
  TFormOnSubmitAsyncReturn = undefined,
  TFormOnServerReturn = undefined,
>(
  opts?: FormOptions<
    TFormData,
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
  const formApi = (() => {
    const api = new FormApi<
      TFormData,
      TFormOnMountReturn,
      TFormOnChangeReturn,
      TFormOnChangeAsyncReturn,
      TFormOnBlurReturn,
      TFormOnBlurAsyncReturn,
      TFormOnSubmitReturn,
      TFormOnSubmitAsyncReturn,
      TFormOnServerReturn
    >(opts)

    const extendedApi: typeof api &
      VueFormApi<
        TFormData,
        TFormOnMountReturn,
        TFormOnChangeReturn,
        TFormOnChangeAsyncReturn,
        TFormOnBlurReturn,
        TFormOnBlurAsyncReturn,
        TFormOnSubmitReturn,
        TFormOnSubmitAsyncReturn,
        TFormOnServerReturn
      > = api as never
    extendedApi.Field = defineComponent(
      (props, context) => {
        return () =>
          h(
            Field as never,
            { ...props, ...context.attrs, form: api },
            context.slots,
          )
      },
      {
        name: 'APIField',
        inheritAttrs: false,
      },
    ) as never
    extendedApi.useField = (props) => {
      const field = useField({ ...props, form: api })
      return field
    }
    extendedApi.useStore = (selector) => {
      return useStore(api.store as never, selector as never) as never
    }
    extendedApi.Subscribe = defineComponent(
      (props, context) => {
        const allProps = { ...props, ...context.attrs }
        const selector = allProps.selector ?? ((state: never) => state)
        const data = useStore(api.store as never, selector as never)
        return () => context.slots.default!(data.value)
      },
      {
        name: 'Subscribe',
        inheritAttrs: false,
      },
    ) as never

    return extendedApi
  })()

  onMounted(formApi.mount)

  // formApi.useStore((state) => state.isSubmitting)
  formApi.update(opts)

  return formApi
}
