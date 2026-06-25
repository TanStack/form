export interface BroadcastFormId {
  id: string
}

export interface BroadcastFormInstanceId {
  instanceId: string
}

export interface BroadcastFormIdentity
  extends BroadcastFormId, BroadcastFormInstanceId {}

export interface BroadcastFormRegistered extends BroadcastFormIdentity {}

export interface BroadcastFormUnregistered extends BroadcastFormIdentity {}

export type FormEventMap = {
  'form-registered': BroadcastFormRegistered
  'form-unregistered': BroadcastFormUnregistered
  'subscribe-form-registry': Record<string, never>
}
