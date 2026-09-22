import type { AnyFieldApi, AnyFieldMeta } from '@tanstack/form-core'
import type { AnyInternalFieldApi } from '@tanstack/form-core/internals'
import type { ShallowRef } from 'vue'

/**
 * The public field shared by slots and injected components. State getters
 * track the existing subscription in the component that reads them, while
 * handlers follow the current core field after a reset or name change.
 */
export function createFieldView(
  fieldApi: ShallowRef<AnyInternalFieldApi>,
  selection: ShallowRef<unknown>,
  meta: ShallowRef<AnyFieldMeta>,
): AnyFieldApi {
  return {
    get form() {
      return fieldApi.value.form
    },
    get name() {
      return fieldApi.value.name
    },
    get atom() {
      return fieldApi.value.atom
    },
    get value() {
      void selection.value
      return fieldApi.value.value
    },
    get meta() {
      return meta.value
    },
    get errors() {
      return meta.value.errors
    },
    handleChange: (value, options) =>
      fieldApi.value.handleChange(value, options),
    handleBlur: () => fieldApi.value.handleBlur(),
    reset: () => fieldApi.value.reset(),
    swapValues: (indexA, indexB) => fieldApi.value.swapValues(indexA, indexB),
    moveValue: (fromIndex, toIndex, options) =>
      fieldApi.value.moveValue(fromIndex, toIndex, options),
    pushValue: (value, options) => fieldApi.value.pushValue(value, options),
    insertValue: (index, value, options) =>
      fieldApi.value.insertValue(index, value, options),
    clearValues: (options) => fieldApi.value.clearValues(options),
    removeValue: (index, options) => fieldApi.value.removeValue(index, options),
    filterValues: (predicate, options) =>
      fieldApi.value.filterValues(predicate, options),
  }
}
