import { formDevtoolsEventClient } from '../../eventClient.lib'
import { compareFieldPaths } from '../utils'
import type {
  AnyInternalFieldApi,
  AnyInternalFormApi,
} from '@tanstack/form-core/internals'
import type { DevtoolsMountedFieldRow } from '../../eventClientTypes'
import type { FormId } from '../../types/branded'
import type { MountedFormsController } from '../forms/mountedForms'
import type { FieldIdentityController } from './identity'

interface FieldListController {
  dispose: () => void
  fieldMounted: (field: AnyInternalFieldApi) => void
  fieldMoved: (field: AnyInternalFieldApi, previousPath: string) => void
  fieldSubtreeRemoved: (form: AnyInternalFormApi) => void
  fieldUnmounted: (field: AnyInternalFieldApi, previousPath: string) => void
  formMounted: (form: AnyInternalFormApi) => void
  formUnmounted: (formInstanceId: FormId) => void
  getMountedFieldRowsSnapshot: (
    form: AnyInternalFormApi,
  ) => Array<DevtoolsMountedFieldRow>
}

export function getMountedFieldRowsSnapshot(
  form: AnyInternalFormApi,
  identity: Pick<FieldIdentityController, 'getFieldId'>,
): Array<DevtoolsMountedFieldRow> {
  const fields: Array<DevtoolsMountedFieldRow> = []
  const stack = [...form._fieldRootNode._children]

  while (stack.length > 0) {
    const field = stack.pop()!
    if (field._isKilled) continue

    stack.push(...field._children)

    if (!field._isMounted) continue

    fields.push({
      path: field.name,
      fieldId: identity.getFieldId(field),
    })
  }

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

  const createSnapshot = (
    form: AnyInternalFormApi,
  ): Array<DevtoolsMountedFieldRow> =>
    getMountedFieldRowsSnapshot(form, identity)

  const emitSnapshot = (
    formInstanceId: FormId,
    form: AnyInternalFormApi | null | undefined = mountedForms.getMountedForm(
      formInstanceId,
    ),
  ): void => {
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
      subscribedFormIds.delete(event.payload.formInstanceId)
    },
  )

  return {
    dispose: () => {
      cleanupSubscribeListener()
      cleanupUnsubscribeListener()
    },
    fieldMounted: (field) => emitSubscribedSnapshot(field.form),
    fieldMoved: (field, _previousPath) => emitSubscribedSnapshot(field.form),
    fieldSubtreeRemoved: emitSubscribedSnapshot,
    fieldUnmounted: (field, _previousPath) =>
      emitSubscribedSnapshot(field.form),
    formMounted: emitSubscribedSnapshot,
    formUnmounted: (formInstanceId) => {
      emitSnapshot(formInstanceId, null)
      subscribedFormIds.delete(formInstanceId)
    },
    getMountedFieldRowsSnapshot: createSnapshot,
  }
}
