import { FormApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, h, onMounted } from 'vue'
import { Field, useField } from './useField'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/vue-store'
import type { EmitsOptions, Ref, SetupContext, SlotsType } from 'vue'
import type { FieldComponent, UseField } from './useField'

interface VueFormApi<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
> {
  Field: FieldComponent<TFormData, TFormValidator>
  useField: UseField<TFormData, TFormValidator>
  useStore: <TSelected = NoInfer<FormState<TFormData>>>(
    selector?: (state: NoInfer<FormState<TFormData>>) => TSelected,
  ) => Readonly<Ref<TSelected>>
  Subscribe: <TSelected = NoInfer<FormState<TFormData>>>(
    props: {
      selector?: (state: NoInfer<FormState<TFormData>>) => TSelected
    },
    context: SetupContext<
      EmitsOptions,
      SlotsType<{ default: NoInfer<FormState<TFormData>> }>
    >,
  ) => any
}

export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(opts?: FormOptions<TFormData, TFormValidator>) {
  const formApi = (() => {
    const api = new FormApi<TFormData, TFormValidator>(opts)

    const extendedApi: typeof api & VueFormApi<TFormData, TFormValidator> =
      api as never
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
    )
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
        const selector = allProps.selector ?? ((state) => state)
        const data = useStore(api.store as never, selector as never)
        return () => context.slots.default!(data.value)
      },
      {
        name: 'Subscribe',
        inheritAttrs: false,
      },
    )

    return extendedApi
  })()

  onMounted(formApi.mount)

  // formApi.useStore((state) => state.isSubmitting)
  formApi.update(opts)

  return formApi
}
