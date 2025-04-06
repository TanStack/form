import { FormApi, shallow } from '@tanstack/form-core'
import {
  defineComponent,
  h,
  onMounted,
  onScopeDispose,
  shallowRef,
  watchEffect,
} from 'vue'
import { Field, useField } from './useField'
import type { FieldComponent, UseField } from './useField'
import type {
  DefineSetupFnComponent,
  EmitsOptions,
  EmitsToProps,
  FunctionalComponent,
  PublicProps,
  Ref,
  SlotsType,
  VNode,
} from 'vue'
import type {
  FormAsyncValidateOrFn,
  FormOptions,
  FormState,
  FormValidateOrFn,
} from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/vue-store'

type SubscribeComponent<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
> =
  // This complex type comes from Vue's return type for `DefineSetupFnComponent` but with our own types sprinkled in
  // This allows us to pre-bind some generics while keeping the props type unbound generics for props-based inferencing
  new <
    TSelected = NoInfer<
      FormState<
        TParentData,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnServer
      >
    >,
  >(
    props: {
      selector?: (
        state: NoInfer<
          FormState<
            TParentData,
            TFormOnMount,
            TFormOnChange,
            TFormOnChangeAsync,
            TFormOnBlur,
            TFormOnBlurAsync,
            TFormOnSubmit,
            TFormOnSubmitAsync,
            TFormOnServer
          >
        >,
      ) => TSelected
    } & EmitsToProps<EmitsOptions> &
      PublicProps,
  ) => InstanceType<
    DefineSetupFnComponent<
      {
        selector?: (
          state: NoInfer<
            FormState<
              TParentData,
              TFormOnMount,
              TFormOnChange,
              TFormOnChangeAsync,
              TFormOnBlur,
              TFormOnBlurAsync,
              TFormOnSubmit,
              TFormOnSubmitAsync,
              TFormOnServer
            >
          >,
        ) => TSelected
      },
      [],
      SlotsType<{
        default?: (
          slotProps: NoInfer<
            FormState<
              TParentData,
              TFormOnMount,
              TFormOnChange,
              TFormOnChangeAsync,
              TFormOnBlur,
              TFormOnBlurAsync,
              TFormOnSubmit,
              TFormOnSubmitAsync,
              TFormOnServer
            >
          >,
        ) => VNode[]
      }>
    >
  >

export interface VueFormApi<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TSubmitMeta,
> {
  Field: FieldComponent<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TSubmitMeta
  >
  useField: UseField<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TSubmitMeta
  >
  useStore: <
    TSelected = NoInfer<
      FormState<
        TParentData,
        TFormOnMount,
        TFormOnChange,
        TFormOnChangeAsync,
        TFormOnBlur,
        TFormOnBlurAsync,
        TFormOnSubmit,
        TFormOnSubmitAsync,
        TFormOnServer
      >
    >,
  >(
    selector?: (
      state: NoInfer<
        FormState<
          TParentData,
          TFormOnMount,
          TFormOnChange,
          TFormOnChangeAsync,
          TFormOnBlur,
          TFormOnBlurAsync,
          TFormOnSubmit,
          TFormOnSubmitAsync,
          TFormOnServer
        >
      >,
    ) => TSelected,
  ) => Readonly<Ref<TSelected>>
  Subscribe: SubscribeComponent<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer
  >
}

export function useForm<
  TParentData,
  TFormOnMount extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChange extends undefined | FormValidateOrFn<TParentData>,
  TFormOnChangeAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnBlur extends undefined | FormValidateOrFn<TParentData>,
  TFormOnBlurAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnSubmit extends undefined | FormValidateOrFn<TParentData>,
  TFormOnSubmitAsync extends undefined | FormAsyncValidateOrFn<TParentData>,
  TFormOnServer extends undefined | FormAsyncValidateOrFn<TParentData>,
  TSubmitMeta,
>(
  opts?: () => FormOptions<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TSubmitMeta
  >,
) {
  let api: FormApi<
    TParentData,
    TFormOnMount,
    TFormOnChange,
    TFormOnChangeAsync,
    TFormOnBlur,
    TFormOnBlurAsync,
    TFormOnSubmit,
    TFormOnSubmitAsync,
    TFormOnServer,
    TSubmitMeta
  > &
    VueFormApi<
      TParentData,
      TFormOnMount,
      TFormOnChange,
      TFormOnChangeAsync,
      TFormOnBlur,
      TFormOnBlurAsync,
      TFormOnSubmit,
      TFormOnSubmitAsync,
      TFormOnServer,
      TSubmitMeta
    >

  watchEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!api) api = new FormApi(opts?.()) as never
    else api.update(opts?.())
  })

  const APIField: FunctionalComponent = (_, { attrs, slots }) =>
    h(Field as never, { ...attrs, form: api }, slots)

  api!.Field = APIField as never

  api!.useField = (props) => {
    return useField(() => ({ ...props(), form: api })) as never
  }
  api!.useStore = (selector = (v) => v as never) => {
    const state = shallowRef(selector(api!.store.state))
    const cleanup = api!.store.subscribe(() => {
      const newValue = selector(api!.store.state)
      if (shallow(newValue, state.value)) {
        state.value = newValue
      }
    })
    onScopeDispose(cleanup)

    return state as never
  }
  api!.Subscribe = defineComponent(
    (props, { slots }) => {
      const state = shallowRef(props.selector(api!.store.state))
      const cleanup = api!.store.subscribe(() => {
        const newValue = props.selector(api!.store.state)
        if (shallow(newValue, state.value)) {
          state.value = newValue
        }
      })
      onScopeDispose(cleanup)

      return () => slots.default!(state.value)
    },
    {
      name: 'Subscribe',
      inheritAttrs: false,
      props: {
        selector: {
          type: Function,
          default: (v) => v,
        },
      },
    },
  ) as never

  let cleanup = () => {}
  onMounted(() => {
    cleanup = api!.mount()
  })
  onScopeDispose(cleanup)

  return api!
}
