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
  const fieldTreeVersion = useSelector(
    initialOptions.form._atoms.fieldTreeVersion,
  )

  const adoptField = (field: AnyInternalFieldApi) => {
    if (fieldComponents !== null) Object.assign(field, fieldComponents)
    return field
  }

  const createField = () => {
    const current = options()
    return adoptField(
      current.form._getOrCreateFieldApi(
        {
          ...current,
          name: current.name,
        } as never,
        'field',
      ),
    )
  }

  const fieldApi = shallowRef(createField())

  watch(
    [() => options().form, () => options().name, resetVersion],
    () => {
      fieldApi.value = createField()
    },
    { flush: 'sync' },
  )

  // Array mutations kill or move field APIs while the components rendering
  // them stay mounted under the same name. Follow the field API the form now
  // uses for this name instead of holding on to a killed one.
  watch(
    fieldTreeVersion,
    () => {
      const current = options().form._tryGetFieldApi(options().name)
      if (current && current !== fieldApi.value) {
        fieldApi.value = adoptField(current)
      }
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
