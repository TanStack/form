import type { FieldState } from '@tanstack/form-core'

type AnyFieldState = FieldState<any, any, any, any, any>

export interface BroadcastFormIdentity {
  id: string
  instanceId: string
}

export interface BroadcastFormRegistered extends BroadcastFormIdentity {}

export interface BroadcastFormUnregistered extends BroadcastFormIdentity {}

export interface BroadcastMountedFieldSummary extends BroadcastFormIdentity {
  path: string
  isTouched: boolean
  isDirty: boolean
  isDefaultValue: boolean
  isBlurred: boolean
  isValid: boolean
  errorCount: number
  visibleErrorCount: number
  hiddenErrorCount: number
  isArray: boolean
  arrayLength?: number
}

export interface BroadcastFieldListState extends BroadcastFormIdentity {
  fields: Array<BroadcastMountedFieldSummary>
}

export type BroadcastFieldDetailStatus = 'valid' | 'invalid' | 'validating'

export type BroadcastFieldDependencyKind = 'listener' | 'validator'

export interface BroadcastFieldDependencyLink {
  path: string
  kind: BroadcastFieldDependencyKind
  itemIndex: number
  configuredPath?: string
}

export interface BroadcastFieldDependencies {
  watches: Array<BroadcastFieldDependencyLink>
  watchedBy: Array<BroadcastFieldDependencyLink>
}

export type BroadcastFieldDetailStateSnapshot = Omit<AnyFieldState, 'value'> &
  Partial<Pick<AnyFieldState, 'value'>>

export interface BroadcastFieldDetailState extends BroadcastFormIdentity {
  path: string
  status: BroadcastFieldDetailStatus
  state: BroadcastFieldDetailStateSnapshot
  defaultValue?: unknown
  isChangedFromDefault: boolean
  isArray: boolean
  arrayLength?: number
  dependencies: BroadcastFieldDependencies
}

export interface BroadcastFieldDetailSubscribeRequest extends BroadcastFormIdentity {
  path: string
  includeRawValues?: boolean
  includeArrayFields?: boolean
}

export interface BroadcastFieldDetailUnsubscribeRequest extends BroadcastFormIdentity {
  path: string
}

export type FormEventMap = {
  'field-detail-state': BroadcastFieldDetailState
  'field-list-state': BroadcastFieldListState
  'form-registered': BroadcastFormRegistered
  'form-unregistered': BroadcastFormUnregistered
  'subscribe-form-registry': Record<string, never>
  'subscribe-field-list': BroadcastFormIdentity
  'unsubscribe-field-list': BroadcastFormIdentity
  'subscribe-field-detail': BroadcastFieldDetailSubscribeRequest
  'unsubscribe-field-detail': BroadcastFieldDetailUnsubscribeRequest
}
