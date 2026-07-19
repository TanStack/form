import { createMemo } from 'solid-js'
import type { FieldId } from '@/types/branded'
import { useFormDevtoolsStore } from '@/stores/formDevtoolsStore'

export type FieldDetailValuesState =
  | { status: 'disabled' }
  | { status: 'pending' }
  | {
      status: 'ready'
      value: unknown
      defaultValue: unknown
    }

export function useFieldDetailValues(fieldId: FieldId) {
  const { getFieldDetail, getFieldDetailSettings } =
    useFormDevtoolsStore().fieldDetails

  return createMemo((): FieldDetailValuesState => {
    if (!getFieldDetailSettings(fieldId).includeValues) {
      return { status: 'disabled' }
    }

    const detail = getFieldDetail(fieldId)

    if (!detail) {
      return { status: 'pending' }
    }

    return {
      status: 'ready',
      value: detail.state.value,
      defaultValue: detail.defaultValue,
    }
  })
}
