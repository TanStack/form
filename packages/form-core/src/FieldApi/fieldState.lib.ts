import { createFormStateProxy } from '../FormApi/formState.lib'
import type { RootCounterContributionKey } from './RootFieldApi.lib'
import type { AnyInternalFieldApi } from './FieldApi.lib'
import type {
  AnyFieldMeta as AnyPublicFieldMeta,
  BaseFieldMeta,
  FieldState as PublicFieldState,
  SubfieldsMeta,
} from './FieldApi.public'
import type {
  ErrorVisibility,
  ErrorVisibilityFieldState,
  ValidationIssue,
} from '../validation.public'
import type { Atom, ReadonlyAtom } from '@tanstack/store'

export type ChildContributionKey =
  RootCounterContributionKey | 'dirty' | 'error'
type ChildContributionCounts = Record<ChildContributionKey, number>
export type ChildContributionStates = Record<ChildContributionKey, boolean>

export const childContributionKeys: Array<ChildContributionKey> = [
  'touched',
  'dirty',
  'error',
  'validating',
]

interface MetaExtension {
  _formValidatorErrors: Array<Array<ValidationIssue>>
  _formValidatorErrorSourceEvents: Array<string | null>
  _formGroupValidatorErrors: Map<object, FormGroupFieldErrorMeta>
  _fieldValidatorErrors: Array<Array<ValidationIssue>>
  _fieldValidatorErrorSourceEvents: Array<string | null>
  childContributionCounts: ChildContributionCounts
  _validationCount: number
  /**
   * @private
   * Used to rerender for ArrayField components
   */
  _arrayVersion: number
}

export interface FormGroupFieldErrorMeta {
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
}

export interface InternalBaseFieldMeta extends BaseFieldMeta, MetaExtension {}
export interface InternalFieldMeta extends AnyPublicFieldMeta, MetaExtension {}

const derivedMetaSourceKey = Symbol('tanstack-form-derived-meta-source')
const derivedMetaCanDisplayErrorsKey = Symbol(
  'tanstack-form-derived-meta-can-display-errors',
)

type DerivedMetaMarkers = {
  [derivedMetaCanDisplayErrorsKey]?: boolean
  [derivedMetaSourceKey]?: InternalBaseFieldMeta
}

export interface InternalFieldState extends PublicFieldState<any, any> {
  meta: InternalFieldMeta
}

export interface FieldAtoms {
  store?: ReadonlyAtom<InternalFieldState>
  meta?: Atom<InternalBaseFieldMeta>
}

export const defaultBaseFieldMeta: BaseFieldMeta = {
  isTouched: false,
  isDirty: false,
  isBlurred: false,
  isValidating: false,
}

export const defaultInternalBaseFieldMeta: InternalBaseFieldMeta = {
  ...defaultBaseFieldMeta,
  childContributionCounts: {
    touched: 0,
    dirty: 0,
    error: 0,
    validating: 0,
  },
  _validationCount: 0,
  _fieldValidatorErrors: [],
  _fieldValidatorErrorSourceEvents: [],
  _formValidatorErrors: [],
  _formValidatorErrorSourceEvents: [],
  _formGroupValidatorErrors: new Map(),
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
  const originalErrors = getErrorsFromBaseMeta(baseMeta, previousMeta)
  const errors = canDisplayErrors ? originalErrors : []
  const isSelfTouched = baseMeta.isTouched
  const isSelfDirty = baseMeta.isDirty
  const isSelfValid = errors.length === 0
  const isOriginalSelfValid = originalErrors.length === 0
  const subfields: SubfieldsMeta = {
    isEveryValid: baseMeta.childContributionCounts.error === 0,
    isAnyInvalid: baseMeta.childContributionCounts.error > 0,
    isEveryPristine: baseMeta.childContributionCounts.dirty === 0,
    isSomeDirty: baseMeta.childContributionCounts.dirty > 0,
    isSomeTouched: baseMeta.childContributionCounts.touched > 0,
    isSomeValidating: baseMeta.childContributionCounts.validating > 0,
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
    canReusePreviousMeta({
      baseMeta,
      canDisplayErrors,
      isDefaultValue,
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
  return markDerivedMeta(result, baseMeta, canDisplayErrors)
}

function markDerivedMeta(
  meta: InternalFieldMeta,
  baseMeta: InternalBaseFieldMeta,
  canDisplayErrors: boolean,
): InternalFieldMeta {
  Object.defineProperties(meta, {
    [derivedMetaCanDisplayErrorsKey]: {
      value: canDisplayErrors,
    },
    [derivedMetaSourceKey]: {
      value: baseMeta,
    },
  })

  return meta
}

function getDerivedMetaSource(
  meta: (InternalFieldMeta & DerivedMetaMarkers) | undefined,
): InternalBaseFieldMeta | undefined {
  return meta?.[derivedMetaSourceKey]
}

function getDerivedMetaCanDisplayErrors(
  meta: (InternalFieldMeta & DerivedMetaMarkers) | undefined,
): boolean | undefined {
  return meta?.[derivedMetaCanDisplayErrorsKey]
}

function canReusePreviousMeta({
  baseMeta,
  canDisplayErrors,
  isDefaultValue,
  originalErrors,
  previousMeta,
}: {
  baseMeta: InternalBaseFieldMeta
  canDisplayErrors: boolean
  isDefaultValue: boolean
  originalErrors: Array<ValidationIssue>
  previousMeta: InternalFieldMeta
}): boolean {
  if (getDerivedMetaSource(previousMeta) !== baseMeta) return false
  if (getDerivedMetaCanDisplayErrors(previousMeta) !== canDisplayErrors) {
    return false
  }
  if (previousMeta.isDefaultValue !== isDefaultValue) return false
  if (previousMeta.original.errors !== originalErrors) return false

  return true
}

function getErrorVisibility(
  field: AnyInternalFieldApi | undefined,
): ErrorVisibility<any, any> | undefined {
  return field?._errorVisibility ?? field?.form._options.errorVisibility
}

function shouldDisplayErrors(
  errorVisibility: ErrorVisibility<any, any> | undefined,
  field: AnyInternalFieldApi | undefined,
  baseMeta: InternalBaseFieldMeta,
  value?: any,
  isDefaultValue = true,
): boolean {
  if (!field || !errorVisibility) return true
  const group = field.form._getNearestFormGroupForField(field.name)
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
  const isSomeTouched = meta.childContributionCounts.touched > 0
  const isSomeDirty = meta.childContributionCounts.dirty > 0
  const isSomeValidating = meta.childContributionCounts.validating > 0
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

export function getChildContributionStates(
  meta: InternalBaseFieldMeta,
): ChildContributionStates {
  return {
    touched: meta.isTouched || meta.childContributionCounts.touched > 0,
    dirty: meta.isDirty || meta.childContributionCounts.dirty > 0,
    validating:
      meta.isValidating || meta.childContributionCounts.validating > 0,
    error:
      getErrorsFromBaseMeta(meta).length > 0 ||
      meta.childContributionCounts.error > 0,
  }
}

function hasValidatorErrors(errors: Array<Array<ValidationIssue>>): boolean {
  return errors.some((validatorErrors) => validatorErrors.length > 0)
}

export function isPrunableMeta(meta: InternalBaseFieldMeta): boolean {
  if (meta.isTouched) return false
  if (meta.isDirty) return false
  if (meta.isBlurred) return false
  if (meta.isValidating) return false
  if (meta._validationCount !== 0) return false
  if (meta._arrayVersion !== 0) return false
  if (hasValidatorErrors(meta._fieldValidatorErrors)) return false
  if (hasFormGroupValidatorErrors(meta._formGroupValidatorErrors)) return false
  if (hasValidatorErrors(meta._formValidatorErrors)) return false

  return childContributionKeys.every(
    (key) => meta.childContributionCounts[key] === 0,
  )
}

function getErrorsFromBaseMeta(
  baseMeta: InternalBaseFieldMeta,
  previousMeta?: InternalFieldMeta,
): Array<ValidationIssue> {
  let result: Array<ValidationIssue>
  if (
    previousMeta?._fieldValidatorErrors === baseMeta._fieldValidatorErrors &&
    previousMeta._formGroupValidatorErrors ===
      baseMeta._formGroupValidatorErrors &&
    previousMeta._formValidatorErrors === baseMeta._formValidatorErrors
  ) {
    result = previousMeta.original.errors
  } else {
    result = baseMeta._fieldValidatorErrors
      .concat(
        Array.from(baseMeta._formGroupValidatorErrors.values()).flatMap(
          (groupErrors) => groupErrors.errors,
        ),
      )
      .concat(baseMeta._formValidatorErrors)
      // ValidationError is OneOrMany, TypeScript doesn't realize that
      // flat also takes care of that
      .flat()
  }
  return result
}

export function hasFormGroupValidatorErrors(
  groupErrors: Map<object, FormGroupFieldErrorMeta>,
): boolean {
  for (const { errors } of groupErrors.values()) {
    if (hasValidatorErrors(errors)) return true
  }
  return false
}

export function hasFieldMetaErrors(meta: InternalBaseFieldMeta): boolean {
  return (
    getErrorsFromBaseMeta(meta).length > 0 ||
    meta.childContributionCounts.error > 0
  )
}
