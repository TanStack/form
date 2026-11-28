import { useSelector } from '@tanstack/vue-store'
import { onMounted, onUnmounted, shallowRef, watch, watchEffect } from 'vue'
import type { ShallowRef } from 'vue'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
} from '@tanstack/form-core/internals'

export interface InternalFieldProps {
  form: AnyInternalFormApi
  name: string
  [key: string]: unknown
}

export interface FieldBinding {
  fieldApi: ShallowRef<AnyInternalFieldApi>
  /**
   * The resolved field's name. Array mutations move existing field APIs to new
   * names, so a keyed item can resolve to the same field API under a new name.
   * `fieldApi` does not change in that case, so the name is tracked separately.
   */
  name: Readonly<ShallowRef<string>>
}

export function useField(options: () => InternalFieldProps): FieldBinding {
  const initialOptions = options()
  const resetVersion = useSelector(initialOptions.form._atoms.resetVersion)

  const createField = () => {
    const current = options()
    return current.form._getOrCreateFieldApi(
      {
        ...current,
        name: current.name,
      } as never,
      'field',
    )
  }

  const fieldApi = shallowRef(createField())
  const name = shallowRef<string>(fieldApi.value.name)

  watch(
    [() => options().form, () => options().name, resetVersion],
    () => {
      fieldApi.value = createField()
      name.value = fieldApi.value.name
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

  return { fieldApi, name }
}
