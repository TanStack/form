import { shallow, useSelector } from '@tanstack/vue-store'
import { InternalFormGroupApi } from '@tanstack/form-core/internals'
import {
  defineComponent,
  h,
  onMounted,
  onUnmounted,
  provide,
  watchEffect,
} from 'vue'
import { Subscribe } from '../Subscribe.public'
import {
  createArrayFieldSubscription,
  createValueFieldSubscription,
} from './fieldSubscriptions.lib'
import { useField } from './useField.lib'
import type { Component, InjectionKey, Slots } from 'vue'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  AnyInternalFormApi,
  InternalFormGroupApi as InternalFormGroupApiType,
} from '@tanstack/form-core/internals'
import type { InternalVueFormApi } from './VueFormApi.lib'

export function attachVueFormComponents(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, Component> | null,
  fieldContext?: InjectionKey<AnyInternalFieldApi>,
): InternalVueFormApi {
  const resultForm = form as InternalVueFormApi
  resultForm.Field = createFieldComponent(
    form,
    fieldComponents,
    false,
    fieldContext,
  ) as never
  resultForm.ArrayField = createFieldComponent(
    form,
    fieldComponents,
    true,
    fieldContext,
  ) as never
  resultForm.Subscribe = createSubscribeComponent(form) as never
  resultForm.FormGroup = createFormGroupComponent(resultForm) as never
  return resultForm
}

function createFieldComponent(
  form: AnyInternalFormApi,
  fieldComponents: Record<string, Component> | null,
  array: boolean,
  fieldContext?: InjectionKey<AnyInternalFieldApi>,
) {
  return defineComponent(
    (_props, context) => {
      const options = () => ({ ...context.attrs, form }) as never
      const fieldApi = useField(options, fieldComponents)
      const selection = array
        ? createArrayFieldSubscription(fieldApi)
        : createValueFieldSubscription(fieldApi)

      if (fieldContext) {
        // Field APIs are stable for a mounted name. Supplying the current API
        // mirrors Vue v1 composition components while the parent subscription
        // handles state-driven renders.
        provide(fieldContext, fieldApi.value)
      }

      return () => {
        void selection.value
        return context.slots.default?.({ field: fieldApi.value })
      }
    },
    {
      name: array ? 'TanStackForm.ArrayField' : 'TanStackForm.Field',
      inheritAttrs: false,
    },
  )
}

function createSubscribeComponent(form: AnyInternalFormApi) {
  return defineComponent(
    (_props, context) => () =>
      h(
        Subscribe as never,
        { ...context.attrs, source: form.atom } as never,
        context.slots,
      ),
    {
      name: 'TanStackForm.Subscribe',
      inheritAttrs: false,
    },
  )
}

function createFormGroupComponent(form: InternalVueFormApi) {
  return defineComponent(
    (_props, context) => {
      const options = () => ({ ...context.attrs, form })
      const group = attachVueFormGroupComponents(
        new InternalFormGroupApi(options() as never),
        form,
      )

      watchEffect(() => group.update(options() as never))

      let mounted = false
      onMounted(() => {
        mounted = true
        group.mount()
      })
      onUnmounted(() => {
        if (mounted) group._cleanup()
      })

      const state = useSelector(group.atom, (value) => value, {
        compare: shallow,
      })

      return () => {
        void state.value
        return context.slots.default?.({ group })
      }
    },
    {
      name: 'TanStackForm.FormGroup',
      inheritAttrs: false,
    },
  )
}

function forwardToField(
  component: Component,
  group: InternalFormGroupApiType<any, any, any, any, any>,
) {
  return defineComponent(
    (_props, context) => () => {
      const options = { ...context.attrs } as unknown as AnyFieldApiOptions
      return h(
        component,
        group._getFormFieldOptions(options, (base, overrides) => ({
          ...base,
          ...overrides,
        })) as never,
        context.slots,
      )
    },
    { inheritAttrs: false },
  )
}

function attachVueFormGroupComponents(
  group: InternalFormGroupApiType<any, any, any, any, any>,
  form: InternalVueFormApi,
) {
  type GroupWithComponents = InternalFormGroupApiType<
    any,
    any,
    any,
    any,
    any
  > & {
    Field: Component
    ArrayField: Component
    Subscribe: Component
  }

  const resultGroup = group as GroupWithComponents
  resultGroup.Field = forwardToField(form.Field as never, group)
  resultGroup.ArrayField = forwardToField(form.ArrayField as never, group)
  resultGroup.Subscribe = defineComponent(
    (_props, context) => () =>
      h(
        Subscribe as never,
        { ...context.attrs, source: group.atom } as never,
        context.slots as Slots,
      ),
    { name: 'TanStackForm.FormGroup.Subscribe', inheritAttrs: false },
  )
  return resultGroup
}
