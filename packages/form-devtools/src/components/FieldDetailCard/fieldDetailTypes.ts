import type {
  BroadcastFieldDetailState,
  BroadcastFieldDetailStateSnapshot,
  BroadcastFieldDetailStatus,
} from '../../eventClientTypes'

export type FieldDetailStatus = BroadcastFieldDetailStatus

export type FieldDetailViewMode = 'ui' | 'json'

export type FieldDetailStateSnapshot = BroadcastFieldDetailStateSnapshot

export type FieldDetailMetaSnapshot = FieldDetailStateSnapshot['meta']

export type FieldDetailOriginalMetaSnapshot =
  FieldDetailMetaSnapshot['original']

export type FieldDetailErrorSummary = FieldDetailMetaSnapshot['errors'][number]

export interface FieldDetailFormGroupContext {
  name: string
}

export interface FieldDetailSnapshot extends BroadcastFieldDetailState {
  formGroup?: FieldDetailFormGroupContext
  formGroupName?: string
}

export type FieldDetailCardItem = FieldDetailSnapshot

export interface FieldDetailCardChromeProps {
  isPrimary: boolean
  isSelected: boolean
}
