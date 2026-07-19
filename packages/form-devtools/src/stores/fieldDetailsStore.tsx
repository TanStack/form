import { batch, createEffect, createRoot, createSignal } from 'solid-js'
import type { Accessor } from 'solid-js'
import type {
  DevtoolsFieldDetail,
  FieldDetailSettings,
  FieldDetailSubscriptionDescriptor,
} from '@/eventClientTypes'
import type { FieldId, FormId } from '@/types/branded'
import { formDevtoolsEventClient } from '@/eventClient.lib'

export type {
  FieldDetailSettings,
  FieldErrorPayloadMode,
} from '@/eventClientTypes'

export const defaultFieldDetailSettings = Object.freeze({
  includeValues: true,
  errorPayloadMode: 'full',
  debounceMs: 0,
}) satisfies FieldDetailSettings

export const [fieldDetailSettingsById, setFieldDetailSettingsById] =
  createSignal<Map<FieldId, FieldDetailSettings>>(new Map(), { equals: false })

export const [fieldDetailsById, setFieldDetailsById] = createSignal<
  Map<FieldId, DevtoolsFieldDetail>
>(new Map(), { equals: false })

export function getFieldDetailSettings(fieldId: FieldId): FieldDetailSettings {
  return fieldDetailSettingsById().get(fieldId) ?? defaultFieldDetailSettings
}

export function getFieldDetail(
  fieldId: FieldId,
): DevtoolsFieldDetail | undefined {
  return fieldDetailsById().get(fieldId)
}

function normalizeDebounceMs(debounceMs: number): number {
  return Number.isFinite(debounceMs) && debounceMs > 0 ? debounceMs : 0
}

export function areFieldDetailSettingsEqual(
  left: FieldDetailSettings,
  right: FieldDetailSettings,
): boolean {
  return (
    left.includeValues === right.includeValues &&
    left.errorPayloadMode === right.errorPayloadMode &&
    left.debounceMs === right.debounceMs
  )
}

function deleteFieldDetail(fieldId: FieldId): void {
  const current = fieldDetailsById()
  if (!current.has(fieldId)) return

  const next = new Map(current)
  next.delete(fieldId)
  setFieldDetailsById(next)
}

export function updateFieldDetailSettings(
  fieldId: FieldId,
  patch: Partial<FieldDetailSettings>,
): void {
  const current = getFieldDetailSettings(fieldId)
  const next: FieldDetailSettings = {
    includeValues: patch.includeValues ?? current.includeValues,
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

  batch(() => {
    setFieldDetailSettingsById(nextSettingsById)
    deleteFieldDetail(fieldId)
  })
}

export function resetFieldDetailSettings(fieldId: FieldId): void {
  const current = fieldDetailSettingsById()
  if (!current.has(fieldId)) return

  const next = new Map(current)
  next.delete(fieldId)
  batch(() => {
    setFieldDetailSettingsById(next)
    deleteFieldDetail(fieldId)
  })
}

function getDescriptorKey({
  formInstanceId,
  fieldId,
  settings,
}: FieldDetailSubscriptionDescriptor): string {
  return [
    formInstanceId,
    fieldId,
    String(settings.includeValues),
    settings.errorPayloadMode,
    String(settings.debounceMs),
  ].join('\0')
}

function areDescriptorsEqual(
  left: FieldDetailSubscriptionDescriptor,
  right: FieldDetailSubscriptionDescriptor,
): boolean {
  return (
    left.formInstanceId === right.formInstanceId &&
    left.fieldId === right.fieldId &&
    areFieldDetailSettingsEqual(left.settings, right.settings)
  )
}

interface RetainedDescriptor {
  descriptor: FieldDetailSubscriptionDescriptor
  consumers: number
}

const retainedDescriptors = new Map<string, RetainedDescriptor>()

function hasRetainedField(formInstanceId: FormId, fieldId: FieldId): boolean {
  for (const { descriptor } of retainedDescriptors.values()) {
    if (
      descriptor.formInstanceId === formInstanceId &&
      descriptor.fieldId === fieldId
    ) {
      return true
    }
  }
  return false
}

function retainDescriptor(
  descriptor: FieldDetailSubscriptionDescriptor,
): () => void {
  const key = getDescriptorKey(descriptor)
  const retained = retainedDescriptors.get(key)

  if (retained) {
    retained.consumers++
  } else {
    retainedDescriptors.set(key, { descriptor, consumers: 1 })
    formDevtoolsEventClient.emit('field-detail-subscribe', descriptor)
  }

  let isRetained = true
  return () => {
    if (!isRetained) return
    isRetained = false

    const current = retainedDescriptors.get(key)
    if (!current) return
    current.consumers--
    if (current.consumers > 0) return

    retainedDescriptors.delete(key)
    formDevtoolsEventClient.emit('field-detail-unsubscribe', descriptor)
    if (!hasRetainedField(descriptor.formInstanceId, descriptor.fieldId)) {
      deleteFieldDetail(descriptor.fieldId)
    }
  }
}

export function applyFieldDetail(detail: DevtoolsFieldDetail): void {
  const descriptor: FieldDetailSubscriptionDescriptor = detail
  const retained = retainedDescriptors.get(getDescriptorKey(descriptor))
  if (!retained || !areDescriptorsEqual(retained.descriptor, descriptor)) {
    return
  }

  const next = new Map(fieldDetailsById())
  next.set(detail.fieldId, detail)
  setFieldDetailsById(next)
}

let fieldDetailEventConsumers = 0
let cleanupFieldDetailEvents: (() => void) | undefined

function retainFieldDetailEvents(): () => void {
  if (fieldDetailEventConsumers === 0) {
    cleanupFieldDetailEvents = formDevtoolsEventClient.on(
      'field-detail-changed',
      (event) => applyFieldDetail(event.payload),
    )
  }

  fieldDetailEventConsumers++
  let isRetained = true
  return () => {
    if (!isRetained) return
    isRetained = false
    fieldDetailEventConsumers--

    if (fieldDetailEventConsumers === 0) {
      cleanupFieldDetailEvents?.()
      cleanupFieldDetailEvents = undefined
    }
  }
}

const fieldDetailsCache = {
  fieldDetailSettingsById,
  fieldDetailsById,
  getFieldDetailSettings,
  getFieldDetail,
  updateFieldDetailSettings,
  resetFieldDetailSettings,
  applyDetail: applyFieldDetail,
}

export function mountFieldDetailEvents(
  subscribedFormId: Accessor<FormId | null>,
  displayedFieldIds: Accessor<ReadonlyArray<FieldId>>,
): () => void {
  return createRoot((dispose) => {
    const releaseEvents = retainFieldDetailEvents()
    let active = new Map<string, () => void>()

    createEffect(() => {
      const formInstanceId = subscribedFormId()
      const desired = new Map<string, FieldDetailSubscriptionDescriptor>()

      if (formInstanceId) {
        for (const fieldId of new Set(displayedFieldIds())) {
          const descriptor: FieldDetailSubscriptionDescriptor = {
            formInstanceId,
            fieldId,
            settings: getFieldDetailSettings(fieldId),
          }
          desired.set(getDescriptorKey(descriptor), descriptor)
        }
      }

      const nextActive = new Map<string, () => void>()

      // Retain replacements before releasing stale descriptors. With multiple
      // panel roots, this prevents a late old-settings unsubscribe from
      // removing the newly configured bridge subscription.
      for (const [key, descriptor] of desired) {
        nextActive.set(key, active.get(key) ?? retainDescriptor(descriptor))
      }

      for (const [key, release] of active) {
        if (!nextActive.has(key)) release()
      }

      active = nextActive
    })

    return () => {
      for (const release of active.values()) release()
      releaseEvents()
      dispose()
    }
  })
}

export function createFieldDetailsStore(
  subscribedFormId: Accessor<FormId | null>,
  displayedFieldIds: Accessor<ReadonlyArray<FieldId>>,
) {
  createEffect(() => {
    const retainedFieldIds = new Set(displayedFieldIds())
    const currentSettings = fieldDetailSettingsById()
    const currentDetails = fieldDetailsById()
    let nextSettings: Map<FieldId, FieldDetailSettings> | undefined
    let nextDetails: Map<FieldId, DevtoolsFieldDetail> | undefined

    for (const fieldId of currentSettings.keys()) {
      if (retainedFieldIds.has(fieldId)) continue
      nextSettings ??= new Map(currentSettings)
      nextSettings.delete(fieldId)
    }

    for (const fieldId of currentDetails.keys()) {
      if (retainedFieldIds.has(fieldId)) continue
      nextDetails ??= new Map(currentDetails)
      nextDetails.delete(fieldId)
    }

    batch(() => {
      if (nextSettings) setFieldDetailSettingsById(nextSettings)
      if (nextDetails) setFieldDetailsById(nextDetails)
    })
  })

  return {
    ...fieldDetailsCache,
    mountEvents: () =>
      mountFieldDetailEvents(subscribedFormId, displayedFieldIds),
  }
}
