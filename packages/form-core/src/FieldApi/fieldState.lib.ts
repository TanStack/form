import { createFormStateProxy } from '../FormApi/formState.lib'
import type { FormMetaCountKey } from './RootFieldApi.lib'
import type {
  AnyFieldMeta as AnyPublicFieldMeta,
  BaseFieldMeta,
  FieldState as PublicFieldState,
  SubfieldsMeta,
} from './FieldApi.public'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { ValidationIssue } from '../validation/results/results.public'
import type { AnyInternalFieldApi } from './FieldApi.lib'
import type {
  ErrorVisibilityFieldState,
  ErrorVisibilityFn,
} from '../FormApi/errorVisibility.public'

export type SubfieldsMetaKey = FormMetaCountKey | 'dirty' | 'error'
type ChildMetaCounts = Record<SubfieldsMetaKey, number>
export type SubfieldsMetaFlags = Record<SubfieldsMetaKey, boolean>

export const subfieldsMetaKeys: Array<SubfieldsMetaKey> = [
  'touched',
  'dirty',
  'error',
  'validating',
]

interface MetaExtension {
  childMetaCounts: ChildMetaCounts
  _validationCount: number
  /**
   * @private
   * Used to rerender for ArrayField components
   */
  _arrayVersion: number
}

export interface InternalBaseFieldMeta extends BaseFieldMeta, MetaExtension {}
export interface InternalFieldMeta extends AnyPublicFieldMeta, MetaExtension {}

/**
 * @private
 * Used to track the prev meta for a field
 */
export interface DerivedMetaMarkers {
  source: InternalBaseFieldMeta | undefined
  canDisplayErrors: boolean | undefined
}

export interface InternalFieldState extends PublicFieldState<any, any> {
  meta: InternalFieldMeta
}

export interface FieldAtoms {
  store?: ReadonlyAtom<InternalFieldState>
  meta?: Atom<InternalBaseFieldMeta>
}

const emptyErrors: Array<ValidationIssue> = []

export const defaultBaseFieldMeta: BaseFieldMeta = {
  isTouched: false,
  isDirty: false,
  isBlurred: false,
  isValidating: false,
}

export const defaultInternalBaseFieldMeta: InternalBaseFieldMeta = {
  ...defaultBaseFieldMeta,
  childMetaCounts: {
    touched: 0,
    dirty: 0,
    error: 0,
    validating: 0,
  },
  _validationCount: 0,
  _arrayVersion: 0,
}

export const defaultFieldMeta: InternalFieldMeta = deriveFromBaseFieldMeta(
  defaultInternalBaseFieldMeta,
  undefined,
  undefined,
)

export function getFieldSnapshot(
  field: AnyInternalFieldApi,
): InternalFieldState {
  const value = field._getValue()
  return {
    value,
    meta: deriveFromBaseFieldMeta(
      field._getBaseMeta(),
      undefined,
      field,
      value,
    ),
  }
}

export function deriveFromBaseFieldMeta(
  baseMeta: InternalBaseFieldMeta,
  previousMeta: InternalFieldMeta | undefined,
  field: AnyInternalFieldApi | undefined,
  value?: any,
  markers?: DerivedMetaMarkers,
): InternalFieldMeta {
  const isDefaultValue = field ? field._getIsDefaultValue(value) : true
  const errorVisibility = getErrorVisibility(field)
  const canDisplayErrors = shouldDisplayErrors(
    errorVisibility,
    field,
    baseMeta,
    value,
    isDefaultValue,
  )
  const originalErrors = field?._errorStore.errors ?? emptyErrors
  const errors = canDisplayErrors ? originalErrors : []
  const isSelfTouched = baseMeta.isTouched
  const isSelfDirty = baseMeta.isDirty
  const isSelfValid = errors.length === 0
  const isOriginalSelfValid = originalErrors.length === 0
  const subfields: SubfieldsMeta = {
    isEveryValid: baseMeta.childMetaCounts.error === 0,
    isAnyInvalid: baseMeta.childMetaCounts.error > 0,
    isEveryPristine: baseMeta.childMetaCounts.dirty === 0,
    isSomeDirty: baseMeta.childMetaCounts.dirty > 0,
    isSomeTouched: baseMeta.childMetaCounts.touched > 0,
    isSomeValidating: baseMeta.childMetaCounts.validating > 0,
  }
  const isTouched = isSelfTouched || subfields.isSomeTouched
  const isDirty = isSelfDirty || subfields.isSomeDirty
  const isSelfValidating = baseMeta.isValidating
  const isValidating = isSelfValidating || subfields.isSomeValidating
  const isValid = isSelfValid && subfields.isEveryValid
  const isInvalid = !isValid
  const isOriginalValid = isOriginalSelfValid && subfields.isEveryValid

  if (
    previousMeta &&
    markers &&
    canReusePreviousMeta({
      baseMeta,
      canDisplayErrors,
      isDefaultValue,
      markers,
      originalErrors,
      previousMeta,
    })
  ) {
    return previousMeta
  }

  const result: InternalFieldMeta = {
    ...baseMeta,
    isTouched,
    isSelfTouched,
    isDirty,
    isSelfDirty,
    isInvalid,
    isSelfValid,
    isSelfValidating,
    isDefaultValue,
    isValidating,
    errors,
    original: {
      errors: originalErrors,
      isValid: isOriginalValid,
      isInvalid: !isOriginalValid,
    },
    isValid,
    subfields,
    isPristine: !isDirty,
  }

  if (markers) {
    markers.source = baseMeta
    markers.canDisplayErrors = canDisplayErrors
  }

  return result
}

function canReusePreviousMeta({
  baseMeta,
  canDisplayErrors,
  isDefaultValue,
  markers,
  originalErrors,
  previousMeta,
}: {
  baseMeta: InternalBaseFieldMeta
  canDisplayErrors: boolean
  isDefaultValue: boolean
  markers: DerivedMetaMarkers
  originalErrors: Array<ValidationIssue>
  previousMeta: InternalFieldMeta
}): boolean {
  if (markers.source !== baseMeta) return false
  if (markers.canDisplayErrors !== canDisplayErrors) return false
  if (previousMeta.isDefaultValue !== isDefaultValue) return false
  if (previousMeta.original.errors !== originalErrors) return false

  return true
}

function getErrorVisibility(
  field: AnyInternalFieldApi | undefined,
): ErrorVisibilityFn<any> | undefined {
  return field?._errorVisibility ?? field?.form._options.errorVisibility
}

function shouldDisplayErrors(
  errorVisibility: ErrorVisibilityFn<any> | undefined,
  field: AnyInternalFieldApi | undefined,
  baseMeta: InternalBaseFieldMeta,
  value?: any,
  isDefaultValue = true,
): boolean {
  if (!field || !errorVisibility) return true
  const group = field._getFormGroup()
  const stateOverrides = group?._getScopedFormStateOverrides()

  return errorVisibility({
    state: createFormStateProxy(field.form, stateOverrides),
    fieldState: createErrorVisibilityFieldState(
      value,
      baseMeta,
      isDefaultValue,
    ),
  })
}

function createErrorVisibilityFieldState(
  value: any,
  meta: InternalBaseFieldMeta,
  isDefaultValue: boolean,
): ErrorVisibilityFieldState {
  const isSomeTouched = meta.childMetaCounts.touched > 0
  const isSomeDirty = meta.childMetaCounts.dirty > 0
  const isSomeValidating = meta.childMetaCounts.validating > 0
  const isSelfTouched = meta.isTouched
  const isSelfDirty = meta.isDirty
  const isSelfValidating = meta.isValidating
  const isTouched = isSelfTouched || isSomeTouched
  const isDirty = isSelfDirty || isSomeDirty

  return {
    value,
    meta: {
      isTouched,
      isSelfTouched,
      isDirty,
      isSelfDirty,
      isPristine: !isDirty,
      isDefaultValue,
      isBlurred: meta.isBlurred,
      isValidating: isSelfValidating || isSomeValidating,
      isSelfValidating,
      subfields: {
        isEveryPristine: !isSomeDirty,
        isSomeDirty,
        isSomeTouched,
        isSomeValidating,
      },
    },
  }
}

export function getSubfieldsMetaFlags(
  meta: InternalBaseFieldMeta,
  hasOwnErrors = false,
): SubfieldsMetaFlags {
  return {
    touched: meta.isTouched || meta.childMetaCounts.touched > 0,
    dirty: meta.isDirty || meta.childMetaCounts.dirty > 0,
    validating: meta.isValidating || meta.childMetaCounts.validating > 0,
    error: hasOwnErrors || meta.childMetaCounts.error > 0,
  }
}

export function isPrunableMeta(meta: InternalBaseFieldMeta): boolean {
  if (meta.isTouched) return false
  if (meta.isDirty) return false
  if (meta.isBlurred) return false
  if (meta.isValidating) return false
  if (meta._validationCount !== 0) return false
  if (meta._arrayVersion !== 0) return false

  return subfieldsMetaKeys.every((key) => meta.childMetaCounts[key] === 0)
}

export function hasFieldMetaErrors(
  meta: InternalBaseFieldMeta,
  hasOwnErrors = false,
): boolean {
  return hasOwnErrors || meta.childMetaCounts.error > 0
}
