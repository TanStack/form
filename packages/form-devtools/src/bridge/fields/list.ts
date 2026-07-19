import { visitAllFormFields } from '@tanstack/form-core/internals'
import { formDevtoolsEventClient } from '../../eventClient.lib'
import { compareFieldPaths } from '../utils'
import { createDelayedActivationController } from './delayedActivation'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
} from '@tanstack/form-core/internals'
import type {
  DevtoolsMountedFieldPatch,
  DevtoolsMountedFieldScaffold,
  DevtoolsMountedFieldSummaryPatch,
} from '../../eventClientTypes'
import type { FieldId, FormId } from '../../types/branded'
import type { MountedFormsController } from '../forms/mountedForms'
import type { FieldIdentityController } from './identity'
import {
  diffBaselinePatches,
  toDevtoolsMountedFieldSummaryPatch,
} from '@/fieldSummaryMeta'

export const FIELD_LIST_LONG_VALIDATION_DELAY_MS = 300

interface FieldListController {
  dispose: () => void
  fieldMounted: (field: AnyInternalFieldApi) => void
  fieldMoved: (field: AnyInternalFieldApi, previousPath: string) => void
  fieldUpdated: (field: AnyInternalFieldApi) => void
  fieldSubtreeRemoved: (
    form: AnyInternalFormApi,
    fields: Array<AnyInternalFieldApi>,
  ) => void
  fieldUnmounted: (field: AnyInternalFieldApi, previousPath: string) => void
  formMounted: (form: AnyInternalFormApi) => void
  formUnmounted: (formInstanceId: FormId) => void
  getFieldRowsSnapshot: (
    form: AnyInternalFormApi,
  ) => Array<DevtoolsMountedFieldScaffold>
}

type PendingStructure = 'upsert' | 'remove'

interface PendingFieldChange {
  fieldId: FieldId
  field: AnyInternalFieldApi
  structure?: PendingStructure
  summary: boolean
}

interface PendingFormChanges {
  form: AnyInternalFormApi
  fields: Map<FieldId, PendingFieldChange>
}

interface FieldRowsSnapshotOptions {
  getSummary?: (
    field: AnyInternalFieldApi,
  ) => DevtoolsMountedFieldSummaryPatch | undefined
  onSummary?: (
    field: AnyInternalFieldApi,
    summary: DevtoolsMountedFieldSummaryPatch | undefined,
  ) => void
}

function isFormGroupField(field: AnyInternalFieldApi): boolean {
  const group = field.form._getNearestFormGroupForField(field.name)
  return group !== null && String(group.name) === field.name
}

export function getFieldRowsSnapshot(
  form: AnyInternalFormApi,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
  {
    getSummary = (field) =>
      toDevtoolsMountedFieldSummaryPatch(field.state.meta),
    onSummary,
  }: FieldRowsSnapshotOptions = {},
): Array<DevtoolsMountedFieldScaffold> {
  const fields: Array<DevtoolsMountedFieldScaffold> = []

  visitAllFormFields(form._fieldRootNode, (field) => {
    if (field._isKilled || isFormGroupField(field)) return

    const summary = getSummary(field)
    onSummary?.(field, summary)

    fields.push({
      fieldId: identity.getFieldId(field),
      path: field.name,
      ...(field._isMounted ? {} : { isMounted: false }),
      ...(summary ? { summary } : {}),
    })
  })

  return fields.sort((left, right) => compareFieldPaths(left.path, right.path))
}

export function createFieldListController({
  identity,
  mountedForms,
}: {
  identity: FieldIdentityController
  mountedForms: MountedFormsController
}): FieldListController {
  const subscribedFormIds = new Set<FormId>()
  const sparseSummaryByField = new WeakMap<
    AnyInternalFieldApi,
    DevtoolsMountedFieldSummaryPatch
  >()
  const mountedStateByField = new WeakMap<AnyInternalFieldApi, boolean>()
  const pendingChanges = new Map<FormId, PendingFormChanges>()
  let flushScheduled = false
  let disposed = false

  const isFieldListSubscribed = (field: AnyInternalFieldApi): boolean => {
    if (!mountedForms.isMounted(field.form)) return false
    return subscribedFormIds.has(mountedForms.getFormInstanceId(field.form))
  }

  const longValidation = createDelayedActivationController({
    delayMs: FIELD_LIST_LONG_VALIDATION_DELAY_MS,
    canActivate: (field: AnyInternalFieldApi) =>
      !disposed &&
      field._isMounted &&
      !field._isKilled &&
      field.state.meta.isValidating &&
      isFieldListSubscribed(field),
    onChange: (field: AnyInternalFieldApi) => queueFieldChange(field),
  })

  const observeLongValidation = (field: AnyInternalFieldApi): void => {
    if (!field._isMounted || field._isKilled || !isFieldListSubscribed(field)) {
      longValidation.remove(field)
      return
    }

    longValidation.observe(field, field.state.meta.isValidating)
  }

  const getProjectedSummary = (
    field: AnyInternalFieldApi,
  ): DevtoolsMountedFieldSummaryPatch | undefined =>
    toDevtoolsMountedFieldSummaryPatch(field.state.meta, {
      isLongValidating: longValidation.isActive(field),
    })

  const getObservedSummary = (
    field: AnyInternalFieldApi,
  ): DevtoolsMountedFieldSummaryPatch | undefined => {
    observeLongValidation(field)
    return getProjectedSummary(field)
  }

  const cacheSummary = (
    field: AnyInternalFieldApi,
    summary: DevtoolsMountedFieldSummaryPatch | undefined,
  ): void => {
    if (summary) sparseSummaryByField.set(field, summary)
    else sparseSummaryByField.delete(field)
  }

  const createSnapshot = (
    form: AnyInternalFormApi,
  ): Array<DevtoolsMountedFieldScaffold> =>
    getFieldRowsSnapshot(form, identity, {
      getSummary: getObservedSummary,
      onSummary: (field, summary) => {
        cacheSummary(field, summary)
        mountedStateByField.set(field, field._isMounted)
      },
    })

  const emitSnapshot = (
    formInstanceId: FormId,
    form: AnyInternalFormApi | null | undefined = mountedForms.getMountedForm(
      formInstanceId,
    ),
  ): void => {
    pendingChanges.delete(formInstanceId)
    formDevtoolsEventClient.emit('field-list-snapshot', {
      formInstanceId,
      fields: form ? createSnapshot(form) : [],
    })
  }

  const emitSubscribedSnapshot = (form: AnyInternalFormApi): void => {
    if (!mountedForms.isMounted(form)) return

    const formInstanceId = mountedForms.getFormInstanceId(form)
    if (!subscribedFormIds.has(formInstanceId)) return

    emitSnapshot(formInstanceId, form)
  }

  const flushPendingChanges = (): void => {
    flushScheduled = false
    if (disposed) return

    const batches = Array.from(pendingChanges.entries())
    pendingChanges.clear()

    for (const [formInstanceId, batch] of batches) {
      if (
        !subscribedFormIds.has(formInstanceId) ||
        !mountedForms.isMounted(batch.form)
      ) {
        continue
      }

      const upsert: Array<DevtoolsMountedFieldPatch> = []
      const remove: Array<FieldId> = []

      for (const change of batch.fields.values()) {
        const wasIncluded = mountedStateByField.has(change.field)
        const previousMounted = mountedStateByField.get(change.field)
        const shouldRemove =
          change.structure === 'remove' ||
          change.field._isKilled ||
          isFormGroupField(change.field)

        if (shouldRemove) {
          sparseSummaryByField.delete(change.field)
          mountedStateByField.delete(change.field)
          if (wasIncluded) remove.push(change.fieldId)
          continue
        }

        const previousSummary = sparseSummaryByField.get(change.field)
        const currentSummary = getProjectedSummary(change.field)
        const summaryDifference = change.summary
          ? diffBaselinePatches(previousSummary, currentSummary)
          : {}

        cacheSummary(change.field, currentSummary)
        mountedStateByField.set(change.field, change.field._isMounted)

        const patch: DevtoolsMountedFieldPatch = {
          fieldId: change.fieldId,
          ...(change.structure === 'upsert' || !wasIncluded
            ? {
                path: change.field.name,
                ...(previousMounted !== change.field._isMounted &&
                (previousMounted !== undefined || !change.field._isMounted)
                  ? { isMounted: change.field._isMounted }
                  : {}),
              }
            : {}),
          ...(summaryDifference.set
            ? { setSummary: summaryDifference.set }
            : {}),
          ...(summaryDifference.clear
            ? { clearSummary: summaryDifference.clear }
            : {}),
        }

        if (
          patch.path !== undefined ||
          patch.isMounted !== undefined ||
          patch.setSummary !== undefined ||
          patch.clearSummary !== undefined
        ) {
          upsert.push(patch)
        }
      }

      if (upsert.length === 0 && remove.length === 0) continue

      formDevtoolsEventClient.emit('field-list-patch', {
        formInstanceId,
        ...(upsert.length > 0 ? { upsert } : {}),
        ...(remove.length > 0 ? { remove } : {}),
      })
    }
  }

  const scheduleFlush = (): void => {
    if (flushScheduled) return
    flushScheduled = true
    queueMicrotask(flushPendingChanges)
  }

  function queueFieldChange(
    field: AnyInternalFieldApi,
    structure?: PendingStructure,
    summary = true,
  ): void {
    const form = field.form
    if (!mountedForms.isMounted(form)) return

    const formInstanceId = mountedForms.getFormInstanceId(form)
    if (!subscribedFormIds.has(formInstanceId)) return

    const fieldId =
      structure === 'remove'
        ? identity.getExistingFieldId(field)
        : identity.getFieldId(field)
    if (!fieldId) return

    let formChanges = pendingChanges.get(formInstanceId)
    if (!formChanges) {
      formChanges = { form, fields: new Map() }
      pendingChanges.set(formInstanceId, formChanges)
    }

    const previous = formChanges.fields.get(fieldId)
    formChanges.fields.set(fieldId, {
      fieldId,
      field,
      structure: structure ?? previous?.structure,
      summary: summary || previous?.summary === true,
    })
    scheduleFlush()
  }

  const removeLongValidationForForm = (formInstanceId: FormId): void => {
    const form = mountedForms.getMountedForm(formInstanceId)
    if (!form) return

    longValidation.removeWhere((field) => field.form === form)
  }

  const cleanupSubscribeListener = formDevtoolsEventClient.on(
    'field-list-subscribe',
    (event) => {
      const { formInstanceId } = event.payload
      subscribedFormIds.add(formInstanceId)
      emitSnapshot(formInstanceId)
    },
  )
  const cleanupUnsubscribeListener = formDevtoolsEventClient.on(
    'field-list-unsubscribe',
    (event) => {
      const { formInstanceId } = event.payload
      removeLongValidationForForm(formInstanceId)
      subscribedFormIds.delete(formInstanceId)
      pendingChanges.delete(formInstanceId)
    },
  )

  return {
    dispose: () => {
      disposed = true
      pendingChanges.clear()
      longValidation.dispose()
      cleanupSubscribeListener()
      cleanupUnsubscribeListener()
    },
    fieldMounted: (field) => {
      observeLongValidation(field)
      queueFieldChange(field, 'upsert')
    },
    fieldMoved: (field, _previousPath) => {
      observeLongValidation(field)
      queueFieldChange(field, 'upsert')
    },
    fieldUpdated: (field) => {
      if (field._isKilled) {
        longValidation.remove(field)
        return
      }
      observeLongValidation(field)
      queueFieldChange(field)
    },
    fieldSubtreeRemoved: (_form, fields) => {
      for (const field of fields) {
        longValidation.remove(field)
        queueFieldChange(field, 'remove', false)
      }
    },
    fieldUnmounted: (field, _previousPath) => {
      longValidation.remove(field)
      queueFieldChange(field, 'upsert', false)
    },
    formMounted: emitSubscribedSnapshot,
    formUnmounted: (formInstanceId) => {
      removeLongValidationForForm(formInstanceId)
      pendingChanges.delete(formInstanceId)
      emitSnapshot(formInstanceId, null)
      subscribedFormIds.delete(formInstanceId)
    },
    getFieldRowsSnapshot: createSnapshot,
  }
}
