import type { FieldId, FormId } from './types/branded'

export interface DevtoolsMountedForm {
  label: string
  instanceId: FormId
}

export type DevtoolsMountedFieldSummary = Record<string, never>

export interface DevtoolsMountedFieldRow {
  path: string
  fieldId: FieldId
  leaf: string
  summary?: DevtoolsMountedFieldSummary
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
    fields: Array<DevtoolsMountedFieldRow>
  }
}
