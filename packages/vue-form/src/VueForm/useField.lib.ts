import { useSelector } from '@tanstack/vue-store'
import { onMounted, onUnmounted, shallowRef, watch, watchEffect } from 'vue'
import type { Component, ShallowRef } from 'vue'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
} from '@tanstack/form-core/internals'

export interface InternalFieldProps {
  form: AnyInternalFormApi
  name: string
  [key: string]: unknown
}

export function useField(
  options: () => InternalFieldProps,
  fieldComponents: Record<string, Component> | null,
): ShallowRef<AnyInternalFieldApi> {
  const initialOptions = options()
  const resetVersion = useSelector(initialOptions.form._atoms.resetVersion)

  const createField = () => {
    const current = options()
    const field = current.form._getOrCreateFieldApi(
      {
        ...current,
        name: current.name,
      } as never,
      'field',
    )
    if (fieldComponents !== null) Object.assign(field, fieldComponents)
    return field
  }

  const fieldApi = shallowRef(createField())

  watch(
    [() => options().form, () => options().name, resetVersion],
    () => {
      fieldApi.value = createField()
    },
    { flush: 'sync' },
  )

  watchEffect(() => {
    fieldApi.value._update(options() as never, 'field')
  })

  let mounted = false
  let unregister: (() => void) | undefined
  watch(
    fieldApi,
    (field) => {
      if (!mounted) return
      unregister?.()
      unregister = field._register()
    },
    { flush: 'sync' },
  )
  onMounted(() => {
    mounted = true
    unregister = fieldApi.value._register()
  })
  onUnmounted(() => unregister?.())

  return fieldApi
}
