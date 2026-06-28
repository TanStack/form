import type {
  BroadcastFieldDetailState,
  BroadcastFieldDetailStateSnapshot,
} from '../../eventClientTypes'

export type FieldDetailViewMode = 'ui' | 'json'

export type FieldDetailStateSnapshot = BroadcastFieldDetailStateSnapshot

export type FieldDetailMetaSnapshot = FieldDetailStateSnapshot['meta']

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
