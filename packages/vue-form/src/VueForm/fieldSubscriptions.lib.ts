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
  // Metadata can change without an array's structure changing. Keep it
  // reactive for metadata consumers without invalidating value-only slots.
  const meta = shallowRef(fieldApi.value.meta)

  watch(
    fieldApi,
    (field, _previous, onCleanup) => {
      meta.value = field.meta
      selected.value = selector(field)
      const subscription = field.atom.subscribe(() => {
        meta.value = field.meta
        const next = selector(field)
        if (!shallow(toRaw(selected.value), next)) selected.value = next
      })
      onCleanup(() => subscription.unsubscribe())
    },
    { immediate: true, flush: 'sync' },
  )

  return { selection: selected, meta }
}

export function createValueFieldSubscription(
  fieldApi: ShallowRef<AnyInternalFieldApi>,
) {
  return createFieldSelection(fieldApi, (field) => ({
    value: field.value,
    meta: field.meta,
  }))
}

export function createArrayFieldSubscription(
  fieldApi: ShallowRef<AnyInternalFieldApi>,
) {
  return createFieldSelection(fieldApi, (field) => ({
    length: field.value.length,
    version: (field.meta as InternalBaseFieldMeta)._arrayVersion,
  }))
}
