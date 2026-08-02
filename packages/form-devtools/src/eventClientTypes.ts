import type { FieldId, FormId } from './types/branded'

export interface DevtoolsMountedForm {
  label: string
  instanceId: FormId
}

export interface FormDevtoolsBridgeStatusRequest {
  requestId: string
}

export interface FormDevtoolsBridgeStatusResponse {
  requestId: string
  bridgeInstanceId: string
  mountedFormCount: number
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

/**
 * A sparse field summary. Properties are omitted when their values match the
 * corresponding defaults in `defaultDevtoolsMountedFieldSummary`.
 */
export type DevtoolsMountedFieldSummaryPatch =
  Partial<DevtoolsMountedFieldSummary>

export interface DevtoolsMountedFieldScaffold {
  fieldId: FieldId
  path: string
  /** Omitted for a mounted field; `false` means the field is currently unmounted. */
  isMounted?: boolean
  /** Omitted when every summary property has its default value. */
  summary?: DevtoolsMountedFieldSummaryPatch
}

export interface DevtoolsMountedFieldPatch {
  fieldId: FieldId
  /** Omitted when this patch does not add the field or change its path. */
  path?: string
  /** Omitted when this patch does not change whether the field is mounted. */
  isMounted?: boolean
  /** Omitted when this patch does not set any sparse summary properties. */
  setSummary?: DevtoolsMountedFieldSummaryPatch
  /** Omitted when no summary properties need to be restored to their defaults. */
  clearSummary?: Array<keyof DevtoolsMountedFieldSummary>
}

export type FieldErrorPayloadMode = 'full' | 'messages'

export interface FieldDetailSettings {
  includeValues: boolean
  errorPayloadMode: FieldErrorPayloadMode
  debounceMs: number
}

export interface FieldDetailSubscriptionDescriptor {
  formInstanceId: FormId
  fieldId: FieldId
  settings: FieldDetailSettings
}

export interface FieldActionRequest {
  formInstanceId: FormId
  fieldId: FieldId
}

export type DevtoolsFieldValidatorType = 'schema' | 'callback'

export type DevtoolsFieldErrorSource =
  | {
      scope: 'field' | 'form'
      validatorIndex: number
      validatorType: DevtoolsFieldValidatorType
    }
  | {
      scope: 'formGroup'
      formGroupPath: string
      validatorIndex: number
      validatorType: DevtoolsFieldValidatorType
    }
  | {
      scope: 'onSubmit'
      validatorType: 'callback'
    }

export interface DevtoolsFieldError {
  error: { message: string }
  source: DevtoolsFieldErrorSource
  sourceEvent: string
}

export interface FieldErrorDebugReportRequest {
  requestId: string
  formInstanceId: FormId
  fieldId: FieldId
  error: DevtoolsFieldError
}

type FieldErrorSuspicion<
  TKind extends string,
  TEvidence extends Record<string, any> = Record<string, never>,
> = {
  kind: TKind
  evidence: TEvidence
}

export type SchemaErrorUnmountedFieldSuspicion = FieldErrorSuspicion<
  'schema-error-on-unmounted-field',
  {
    fieldPath: string
    mountedAncestorPath: string
  }
>

export type ServerErrorUnmountedFieldSuspicion = FieldErrorSuspicion<
  'server-error-on-unmounted-field',
  {
    fieldPath: string
  }
>

export type ErrorsHiddenSuspicion = FieldErrorSuspicion<
  'errors-hidden',
  {
    fieldPath: string
  }
>

export type FieldErrorDebugSuspicion =
  | ErrorsHiddenSuspicion
  | ServerErrorUnmountedFieldSuspicion
  | SchemaErrorUnmountedFieldSuspicion

export interface FieldErrorDebugReport {
  requestId: string
  suspicions: Array<FieldErrorDebugSuspicion>
}

export interface FieldDebugReportRequest {
  requestId: string
  formInstanceId: FormId
  fieldId: FieldId
}

type FieldSuspicion<
  TKind extends string,
  TEvidence extends Record<string, any> = Record<string, never>,
> = {
  kind: TKind
  evidence: TEvidence
}

export type SchemaErrorsUnmountedDescendantsSuspicion = FieldSuspicion<
  'schema-errors-on-unmounted-descendants',
  {
    fieldPath: string
    unmountedDescendantPaths: Array<string>
  }
>

export type ValidatorWithoutTriggersLocation =
  | {
      scope: 'field' | 'form'
      validatorIndex: number
    }
  | {
      scope: 'formGroup'
      formGroupPath: string
      validatorIndex: number
    }

export type ValidatorsWithoutTriggersSuspicion = FieldSuspicion<
  'validators-without-triggers',
  {
    fieldPath: string
    validators: Array<ValidatorWithoutTriggersLocation>
  }
>

export type FieldDebugSuspicion =
  SchemaErrorsUnmountedDescendantsSuspicion | ValidatorsWithoutTriggersSuspicion

export interface FieldDebugReport {
  requestId: string
  suspicions: Array<FieldDebugSuspicion>
}

interface DevtoolsFieldDetailSubfieldsMeta {
  isEveryValid: boolean
  isAnyInvalid: boolean
  isEveryPristine: boolean
  isSomeDirty: boolean
  isSomeTouched: boolean
  isSomeValidating: boolean
}

export interface DevtoolsFieldDetailMeta {
  isTouched: boolean
  isDirty: boolean
  isPristine: boolean
  isDefaultValue: boolean
  isBlurred: boolean
  isValidating: boolean
  isSelfTouched: boolean
  isSelfDirty: boolean
  isSelfValidating: boolean
  isSelfValid: boolean
  isValid: boolean
  isInvalid: boolean
  subfields: DevtoolsFieldDetailSubfieldsMeta
  errors: Array<DevtoolsFieldError>
  original: {
    errors: Array<DevtoolsFieldError>
    isValid: boolean
    isInvalid: boolean
  }
}

export type DevtoolsFieldRelationKind = 'listener' | 'validator'

export interface DevtoolsFieldRelationCause {
  kind: DevtoolsFieldRelationKind
  /** Zero-based index in the corresponding listeners or validators array. */
  itemIndex: number
  /** Omitted when the configured watch path still matches the field's path. */
  configuredPath?: string
}

export interface DevtoolsFieldRelation {
  fieldId: FieldId
  causes: Array<DevtoolsFieldRelationCause>
}

export interface DevtoolsFieldRelations {
  /** Number of immediate, live children in the form's field trie. */
  directChildCount: number
  /** Source fields watched by this field's listeners or validators. */
  listensTo: Array<DevtoolsFieldRelation>
  /** Fields whose listeners or validators watch this field. */
  listenedToBy: Array<DevtoolsFieldRelation>
}

export interface DevtoolsFieldDetail extends FieldDetailSubscriptionDescriptor {
  state: {
    /**
     * Omitted when `settings.includeValues` is `false`. When included, this is
     * the field's actual value and may itself be `null` or `undefined`; use a
     * property-presence check to distinguish that from omission.
     */
    value?: unknown
    meta: DevtoolsFieldDetailMeta
  }
  relations: DevtoolsFieldRelations
  /**
   * Omitted when `settings.includeValues` is `false`. When included, this is
   * the value resolved from the form's `defaultValues` at the field path and
   * may itself be `null` or `undefined`; use a property-presence check to
   * distinguish that from omission.
   */
  defaultValue?: unknown
}

export type FormDevtoolsEventMap = {
  'bridge-status-request': FormDevtoolsBridgeStatusRequest
  'bridge-status-response': FormDevtoolsBridgeStatusResponse
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
    /** Omitted when the batch contains no field additions or updates. */
    upsert?: Array<DevtoolsMountedFieldPatch>
    /** Omitted when the batch contains no field removals. */
    remove?: Array<FieldId>
  }
  'field-detail-subscribe': FieldDetailSubscriptionDescriptor
  'field-detail-unsubscribe': FieldDetailSubscriptionDescriptor
  'field-detail-changed': DevtoolsFieldDetail
  'field-handle-change-request': FieldActionRequest
  'field-handle-blur-request': FieldActionRequest
  'field-reset-request': FieldActionRequest
  'field-error-debug-report-request': FieldErrorDebugReportRequest
  'field-error-debug-report': FieldErrorDebugReport
  'field-debug-report-request': FieldDebugReportRequest
  'field-debug-report': FieldDebugReport
}
