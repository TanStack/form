import { shallow } from '@tanstack/vue-store'
import { shallowRef, toRaw, watch } from 'vue'
import type { ShallowRef } from 'vue'
import type {
  AnyInternalFieldApi,
  InternalBaseFieldMeta,
} from '@tanstack/form-core/internals'

function createFieldSelection<TSelected>(
  fieldApi: ShallowRef<AnyInternalFieldApi>,
  selector: (field: AnyInternalFieldApi) => TSelected,
) {
  const selected = shallowRef(selector(fieldApi.value)) as ShallowRef<TSelected>

  watch(
    fieldApi,
    (field, _previous, onCleanup) => {
      selected.value = selector(field)
      const subscription = field.atom.subscribe(() => {
        const next = selector(field)
        if (!shallow(toRaw(selected.value), next)) selected.value = next
      })
      onCleanup(() => subscription.unsubscribe())
    },
    { immediate: true, flush: 'sync' },
  )

  return selected
}

export function createValueFieldSubscription(
  fieldApi: ShallowRef<AnyInternalFieldApi>,
) {
  return createFieldSelection(fieldApi, (field) => ({
    value: field.value,
    meta: field.meta,
  }))
}

/**
 * Wraps a field API so reads made during a component render are tracked by
 * Vue. Injected field components are separate component instances, so they
 * do not rerender when only the parent `Field` subscription changes.
 *
 * Methods from the prototype chain are bound to the underlying field API so
 * they never run with the proxy as `this`. Own properties, including the
 * attached field components, are returned unchanged.
 */
export function trackFieldApi<TField extends object>(
  field: TField,
  selection: ShallowRef<unknown>,
): TField {
  const boundMethods = new Map<PropertyKey, unknown>()

  return new Proxy(field, {
    get(target, key) {
      void selection.value
      const value = Reflect.get(target, key, target)
      if (typeof value !== 'function' || Object.hasOwn(target, key)) {
        return value
      }
      if (!boundMethods.has(key)) boundMethods.set(key, value.bind(target))
      return boundMethods.get(key)
    },
    set(target, key, value) {
      return Reflect.set(target, key, value, target)
    },
  })
}

export function createArrayFieldSubscription(
  fieldApi: ShallowRef<AnyInternalFieldApi>,
) {
  return createFieldSelection(fieldApi, (field) => ({
    length: field.value.length,
    version: (field.meta as InternalBaseFieldMeta)._arrayVersion,
  }))
}
