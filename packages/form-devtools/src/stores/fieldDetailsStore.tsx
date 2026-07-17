import { createEffect, createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { FieldId } from '@/types/branded'

export type FieldErrorPayloadMode = 'full' | 'messages' | 'validity'

export interface FieldDetailSettings {
  includeDefaultValue: boolean
  errorPayloadMode: FieldErrorPayloadMode
  debounceMs: number
}

export const defaultFieldDetailSettings = Object.freeze({
  includeDefaultValue: true,
  errorPayloadMode: 'full',
  debounceMs: 0,
}) satisfies FieldDetailSettings

export const [fieldDetailSettingsById, setFieldDetailSettingsById] =
  createSignal<Map<FieldId, FieldDetailSettings>>(new Map(), { equals: false })

export function getFieldDetailSettings(
  fieldId: FieldId,
): FieldDetailSettings {
  return fieldDetailSettingsById().get(fieldId) ?? defaultFieldDetailSettings
}

function normalizeDebounceMs(debounceMs: number): number {
  return Number.isFinite(debounceMs) && debounceMs > 0 ? debounceMs : 0
}

function areFieldDetailSettingsEqual(
  left: FieldDetailSettings,
  right: FieldDetailSettings,
): boolean {
  return (
    left.includeDefaultValue === right.includeDefaultValue &&
    left.errorPayloadMode === right.errorPayloadMode &&
    left.debounceMs === right.debounceMs
  )
}

export function updateFieldDetailSettings(
  fieldId: FieldId,
  patch: Partial<FieldDetailSettings>,
): void {
  const current = getFieldDetailSettings(fieldId)
  const next: FieldDetailSettings = {
    includeDefaultValue:
      patch.includeDefaultValue ?? current.includeDefaultValue,
    errorPayloadMode: patch.errorPayloadMode ?? current.errorPayloadMode,
    debounceMs:
      patch.debounceMs === undefined
        ? current.debounceMs
        : normalizeDebounceMs(patch.debounceMs),
  }

  if (areFieldDetailSettingsEqual(current, next)) return

  const nextSettingsById = new Map(fieldDetailSettingsById())
  if (areFieldDetailSettingsEqual(next, defaultFieldDetailSettings)) {
    nextSettingsById.delete(fieldId)
  } else {
    nextSettingsById.set(fieldId, next)
  }
  setFieldDetailSettingsById(nextSettingsById)
}

export function resetFieldDetailSettings(fieldId: FieldId): void {
  const current = fieldDetailSettingsById()
  if (!current.has(fieldId)) return

  const next = new Map(current)
  next.delete(fieldId)
  setFieldDetailSettingsById(next)
}

const fieldDetailsCache = {
  fieldDetailSettingsById,
  getFieldDetailSettings,
  updateFieldDetailSettings,
  resetFieldDetailSettings,
}

export function createFieldDetailsStore(
  displayedFieldIds: Accessor<ReadonlyArray<FieldId>>,
) {
  createEffect(() => {
    const retainedFieldIds = new Set(displayedFieldIds())
    const current = fieldDetailSettingsById()
    let next: Map<FieldId, FieldDetailSettings> | undefined

    for (const fieldId of current.keys()) {
      if (retainedFieldIds.has(fieldId)) continue
      next ??= new Map(current)
      next.delete(fieldId)
    }

    if (next) setFieldDetailSettingsById(next)
  })

  return { ...fieldDetailsCache }
}
