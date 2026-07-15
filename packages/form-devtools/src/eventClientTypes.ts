import type { FieldId, FormId } from './types/branded'

export interface DevtoolsMountedForm {
  label: string
  instanceId: FormId
}

export type DevtoolsMountedFieldValidity = 'valid' | 'invalidHidden' | 'invalid'

export interface DevtoolsMountedFieldSummary {
  isDirty: boolean
  isTouched: boolean
  isBlurred: boolean
  isLongValidating: boolean
  isDefaultValue: boolean
  hasSelfErrors: boolean
  validity: DevtoolsMountedFieldValidity
}

export type DevtoolsMountedFieldSummaryPatch =
  Partial<DevtoolsMountedFieldSummary>

export interface DevtoolsMountedFieldScaffold {
  fieldId: FieldId
  path: string
  isMounted?: boolean
  summary?: DevtoolsMountedFieldSummaryPatch
}

export interface DevtoolsMountedFieldPatch {
  fieldId: FieldId
  path?: string
  isMounted?: boolean
  setSummary?: DevtoolsMountedFieldSummaryPatch
  clearSummary?: Array<keyof DevtoolsMountedFieldSummary>
}

export type FormDevtoolsEventMap = {
  'mounted-forms-changed': {
    forms: Array<DevtoolsMountedForm>
  }
  'request-mounted-forms': Record<string, never>
  'field-list-subscribe': {
    formInstanceId: FormId
  }
  'field-list-unsubscribe': {
    formInstanceId: FormId
  }
  'field-list-snapshot': {
    formInstanceId: FormId
    fields: Array<DevtoolsMountedFieldScaffold>
  }
  'field-list-patch': {
    formInstanceId: FormId
    upsert?: Array<DevtoolsMountedFieldPatch>
    remove?: Array<FieldId>
  }
}
