import type {
  BroadcastFieldDetailState,
  BroadcastFormIdentity,
  BroadcastMountedFieldSummary,
} from '../eventClientTypes'

export type DevtoolsMountedFieldSummary = BroadcastMountedFieldSummary & {
  fieldId: string
}

export type DevtoolsFieldDetailState = BroadcastFieldDetailState

export type DevtoolsFormState = BroadcastFormIdentity & {
  mountedFields: Array<DevtoolsMountedFieldSummary>
  fieldDetails: Array<DevtoolsFieldDetailState>
}

export function getDevtoolsFormKey(
  form: Pick<DevtoolsFormState, 'id' | 'instanceId'>,
): string {
  return `${encodeURIComponent(form.id)}::${encodeURIComponent(
    form.instanceId,
  )}`
}

export function parseDevtoolsFormKey(formKey: string): {
  id: string
  instanceId: string
} {
  const [id, instanceId] = formKey.split('::')

  if (id === undefined || instanceId === undefined) {
    throw new Error(`Invalid devtools form key: ${formKey}`)
  }

  return {
    id: decodeURIComponent(id),
    instanceId: decodeURIComponent(instanceId),
  }
}
