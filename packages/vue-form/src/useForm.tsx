import { FormApi } from '@tanstack/form-core'
import { useStore } from '@tanstack/vue-store'
import { defineComponent, h, onMounted } from 'vue'
import { Field, useField } from './useField'
import type { FormOptions, FormState, Validator } from '@tanstack/form-core'
import type { NoInfer } from '@tanstack/vue-store'
import type { EmitsOptions, Ref, SetupContext, SlotsType } from 'vue'
import type { FieldComponent, UseField } from './useField'

declare module '@tanstack/form-core' {
  // eslint-disable-next-line no-shadow
  interface FormApi<TFormData, TFormValidator> {
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
}

export function useForm<
  TFormData,
  TFormValidator extends Validator<TFormData, unknown> | undefined = undefined,
>(
  opts?: FormOptions<TFormData, TFormValidator>,
): FormApi<TFormData, TFormValidator> {
  const formApi = (() => {
    const api = new FormApi<TFormData, TFormValidator>(opts)

    api.Field = defineComponent(
      (props, context) => {
        return () => h(Field as never, { ...props, ...context.attrs, form: api }, context.slots)
      },
      {
        name: 'APIField',
        inheritAttrs: false,
      },
    )
    api.useField = (props) => useField({ ...props, form: api })
    api.useStore = (selector) => {
      return useStore(api.store as never, selector as never) as never
    }
    api.Subscribe = defineComponent(
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

    return api
  })()

  onMounted(formApi.mount)

  // formApi.useStore((state) => state.isSubmitting)
  formApi.update(opts)

  return formApi as never
}
