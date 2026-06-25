import type { BroadcastFormIdentity } from '../eventClientTypes'

export type DevtoolsFormState = BroadcastFormIdentity

export function getDevtoolsFormKey(
  form: Pick<DevtoolsFormState, 'id' | 'instanceId'>,
): string {
  return JSON.stringify([form.id, form.instanceId])
}
