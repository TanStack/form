import { batch, createAtom, shallow } from '@tanstack/store'
import {
  getOrCreateFieldApi,
  nameToFieldNodeSegments,
  tryGetFieldApi,
} from './FieldApi.lib'
import {
  callUpdater,
  cancelPipelineCache,
  createPipelineCache,
  evaluate,
  getBy,
  getTargetField,
  isNotNil,
  resolveFieldUpdateOptions,
  setBy,
} from './utils.lib'
import { InternalRootFieldApi } from './RootFieldApi.lib'
import {
  clearIndexedErrorsFromSource,
  hasIndexedErrorFromSource,
  isAggregateError,
  isErrorResult,
  isValidationTriggerEnabled,
  normalizeValidationError,
  runFormValidatorPipeline,
  setIndexedError,
} from './validation.lib'
import type {
  CreateValidationErrorFn,
  FormApi,
  FormOptions,
  FormState,
  OnSubmitError,
} from './FormApi.public'

import type { DeepKeys } from './deep-keys.public'
import type { PipelineCache } from './utils.lib'

import type {
  FormValidatorPipelineResult,
  PipelineResult,
} from './validation.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  InternalBaseFieldMeta,
  InternalFieldMeta,
} from './FieldApi.lib'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
  ResolvedInternalFieldUpdateOptions,
} from './types.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { Updater } from './types.public'
import type {
  FormErrors,
  FormValidateResult,
  FormValidationError,
  FormValidators,
  ValidationAggregateError,
  ValidationErrorInput,
  ValidationIssue,
  ValidationTrigger,
} from './validation.public'

const SUBMIT_ERROR = Symbol('SUBMIT_ERROR')

function isSubmitError<TFormData>(
  value: unknown,
): value is FormValidationError<TFormData> {
  return isNotNil(value) && Boolean((value as any)[SUBMIT_ERROR])
}

const createValidationError: CreateValidationErrorFn<any> = <
  TError extends FormValidationError<any>,
>(
  error: TError,
): OnSubmitError<TError> => {
  let output: OnSubmitError<TError>
  if (typeof error === 'string') {
    // strings can't retain symbols, so we gotta normalize early
    output = { message: error } as any
  } else {
    output = error as any
  }
  const runtimeOutput = output as any
  runtimeOutput[SUBMIT_ERROR] = true

  return output
}

export interface BaseFormMeta {
  /**
   * @private
   * Number of root fields whose own or descendant meta currently contributes touched state.
   */
  touchedFieldCount: number
  /**
   * @private
   * A field has notified the root to be dirty
   */
  isDirty: boolean
  /**
   * @private
   * Dense 2-dimensional array of form-level errors where index corresponds to validatorIndex.
   * Each validator index contains an array of errors (normalized).
   */
  errors: Array<Array<ValidationIssue>>
  errorSourceEvents: Array<string | null>
  /**
   * @private
   * Dense array of field references per validator index that have errors.
   * Used to clear stale field errors when a validator no longer reports them.
   */
  fieldErrors: Array<Set<AnyInternalFieldApi>>
  /**
   * @private
   * Root fields whose own or descendant meta currently contributes errors.
   */
  errorFields: Set<AnyInternalFieldApi>
  /**
   * @private
   * Number of root fields whose own or descendant meta currently validates.
   */
  fieldValidationCount: number
  validationCount: number
  isSubmitting: boolean
  isSubmitSuccessful: boolean
}

function createInitialFormMeta(validatorCount: number): BaseFormMeta {
  return {
    touchedFieldCount: 0,
    isDirty: false,
    errors: Array.from({ length: validatorCount }, () => []),
    errorSourceEvents: Array.from({ length: validatorCount }, () => null),
    fieldErrors: Array.from({ length: validatorCount }, () => new Set()),
    errorFields: new Set(),
    fieldValidationCount: 0,
    validationCount: 0,
    isSubmitting: false,
    isSubmitSuccessful: false,
  }
}

// StandardSchema<Input, Output>
// defaultValues === Input

// <unknown, Output>
//      z.infer ^

// z.enum(['A', 'B']) = <'A' | 'B', 'A' | 'B'>
// defaultValues: { choice: null }
// -> defaultValues should implement the schema, but not be the same as its input

// z.enum(['A', 'B']).nullable().transform(v => v !== null)
// defaultValues: { choice: null }
// -> defaultValues and schema are inferred and then compared (v1)
// -> schema type should dictate it all -> defaultValues === z.input<typeof mySchema>

// Proposal:
//   - onSubmit should have access to the schema results
//   - validation pipeline: see RFC

// Async defaultValues =>
// initial: A === { name: '', foo: null }
// async: B === { name: 'Foo', foo: { bar: 'bar' } }

// form.update(B) => A !== B -> Queue async update
// v1: !form.isTouched -> Apply state
// v2?: Apply state -> Traverse fieldsMap values, if fieldApi is not touched, setFieldValue of the field path

// form.isTouched: if fieldApi is being touched, make check. If isTouched on form is false, set it to true
// form.isPristine: same process
// form.isValidating: if fieldApi or formApi is validating, increment counter. Boolean is counter > 0
// form.isDefaultValue: ??? --> probably keep old system, but benchmark it

/**
    form state:

    isFieldsTouched <> isTouched  ---- is there a **mounted** field that is touched?
    isFieldsValidating            ---- is there a mounted field that is validating?
    isDirty                       ---- NOT is there a moutned field that is dirty -> field state for value is derived from form
                                  ---- has a field handled a change since last reset?
    isFieldsValid                 ---- is there a field with errors (depends on our errorMap implementation)



    field-level errors

    axiom: field meta travels with the field, such as swapValues etc. etc.

    from a UX perspective, field-level errors are set as a name -> 'foo[0]' is wrong

    (BUT if you swap the field, the 'false value' probably moved with it)


    fieldMetaAtom: Map<FieldApi, Meta> -> fieldMetaAtom.values().some(v => )

    rootNodeInfo:

    -> Should errors move with the field, or should they remain at the name
 */

export type AnyInternalFormApi = InternalFormApi<any, any, any>

function hasFieldEventErrors(
  field: AnyInternalFieldApi,
  eventErrorIndexes: Array<number>,
  sourceEvent: string,
): boolean {
  for (const i of eventErrorIndexes) {
    if (hasFieldEventError(field, i, sourceEvent)) {
      return true
    }
  }

  return false
}

function hasFieldEventError(
  field: AnyInternalFieldApi,
  index: number,
  sourceEvent: string,
): boolean {
  const { _formValidatorErrors, _formValidatorErrorSourceEvents } =
    field._getBaseMeta()

  return hasIndexedErrorFromSource(
    _formValidatorErrors,
    _formValidatorErrorSourceEvents,
    index,
    sourceEvent,
  )
}

function hasValidatorErrors(errors: Array<Array<ValidationIssue>>): boolean {
  return errors.some((validatorErrors) => validatorErrors.length > 0)
}

function hasFieldErrors(field: AnyInternalFieldApi): boolean {
  const meta = field._getBaseMeta()

  return (
    hasValidatorErrors(meta._fieldValidatorErrors) ||
    hasValidatorErrors(meta._formValidatorErrors) ||
    meta.childContributionCounts.error > 0
  )
}

function reconcileErrorFields(
  errorFields: Set<AnyInternalFieldApi>,
  fields: Iterable<AnyInternalFieldApi>,
): Set<AnyInternalFieldApi> {
  const nextErrorFields = new Set(errorFields)

  for (const field of fields) {
    if (hasFieldErrors(field)) {
      nextErrorFields.add(field)
    } else {
      nextErrorFields.delete(field)
    }
  }

  return nextErrorFields
}

// This scales with the amount of top-level fields, with the setter operation
// scaling with the amount of touched fields.

// It assumes that by the time async defaultValues come in, not many fields have been touched.
// If they were, they're likely in the same section.
function applyDefaultValuesPreservingTouchedFields<TFormData>(
  currentValues: TFormData,
  defaultValues: TFormData,
  form: AnyInternalFormApi,
): TFormData {
  let nextValues = defaultValues

  for (const field of form._fieldRootNode._children) {
    if (field.meta.isTouched) {
      nextValues = setBy(
        nextValues,
        field.name,
        getBy(currentValues, field.name),
      )
    }
  }

  return nextValues
}

export class InternalFormApi<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> implements FormApi<TFormData, TFormValidators, TSubmitReturn> {
  valuesAtom: Atom<TFormData>
  store: ReadonlyAtom<FormState<TFormData, TFormValidators, any>>
  _formMetaAtom: Atom<BaseFormMeta>
  _submissionAttemptsAtom: Atom<number>
  _resetVersionAtom: Atom<number>
  _fieldRootNode: InternalRootFieldApi
  _options: FormOptions<TFormData, TFormValidators, any>
  _lastUpdateDefaultValues: TFormData
  _pipelineCache: PipelineCache<any>
  _schemaOutputs: Array<any> = []

  get state(): FormState<TFormData, TFormValidators, any> {
    return this.store.get()
  }
  get options(): FormOptions<TFormData, TFormValidators, any> {
    return this._options
  }

  constructor(options: FormOptions<TFormData, TFormValidators, any>) {
    this._options = options
    this._lastUpdateDefaultValues = options.defaultValues
    this.valuesAtom = createAtom(options.defaultValues)
    this._pipelineCache = createPipelineCache()
    const validatorCount = this._options.validators?.length ?? 0
    this._formMetaAtom = createAtom(createInitialFormMeta(validatorCount))
    this._submissionAttemptsAtom = createAtom(0)
    this._resetVersionAtom = createAtom(0)
    this._fieldRootNode = new InternalRootFieldApi(this)

    this.store = createAtom(
      () => {
        const values = this.valuesAtom.get()
        const baseFormMeta = this._formMetaAtom.get()
        const submissionAttempts = this._submissionAttemptsAtom.get()

        const isDirty = baseFormMeta.isDirty
        const isPristine = !isDirty
        const isTouched = baseFormMeta.touchedFieldCount > 0
        const isValidating =
          baseFormMeta.validationCount > 0 ||
          baseFormMeta.fieldValidationCount > 0
        // TODO weakmap cache? Otherwise this always makes a new reference
        // Field already does it for its meta, use it as reference
        const formErrors = baseFormMeta.errors.flat()
        // TODO mount errors
        const hasMountError = false as boolean
        const hasErrors =
          hasMountError ||
          formErrors.length > 0 ||
          baseFormMeta.errorFields.size > 0
        const canSubmit = !baseFormMeta.isSubmitting && !hasErrors

        return {
          values,
          isTouched,
          isDirty,
          isPristine,
          formErrors: formErrors as FormErrors<TFormValidators, any>,
          canSubmit,
          isSubmitting: baseFormMeta.isSubmitting,
          isValidating,
          submissionAttempts,
        } satisfies FormState<TFormData, TFormValidators, any>
      },
      { compare: shallow },
    )
  }

  mount = () => {
    return () => {}
  }

  // keepDefaultValues is a bad name, reconsider || preserveDefaultValues?
  // Once decided, fix `FormApi.public.ts` to also have it
  // TODO
  reset = (values?: TFormData, opts?: { preserveDefaultValues?: boolean }) => {
    if (values && !opts?.preserveDefaultValues) {
      this._options = { ...this.options, defaultValues: values }
    }

    cancelPipelineCache(this._pipelineCache)
    this._pipelineCache = createPipelineCache()
    this._schemaOutputs = []

    batch(() => {
      this._resetVersionAtom.set((version) => version + 1)
      this._fieldRootNode._children.forEach((child) => child._kill())
      this._formMetaAtom.set(
        createInitialFormMeta(this.options.validators?.length ?? 0),
      )
      this._submissionAttemptsAtom.set(0)
      this.valuesAtom.set(values ?? this._options.defaultValues)
    })
  }

  _update = (options: FormOptions<TFormData, TFormValidators, any>) => {
    const oldOptions = this.options
    const didDefaultValuesChange = !evaluate(
      options.defaultValues,
      this._lastUpdateDefaultValues,
    )

    this._lastUpdateDefaultValues = options.defaultValues
    this._options = options

    if (
      (options.validators?.length ?? 0) !== (oldOptions.validators?.length ?? 0)
    ) {
      console.warn(
        'TanStack Form: The length of the validator array should not change after initialization',
      )
    }

    if (didDefaultValuesChange) {
      if (!this.state.isTouched) {
        this.valuesAtom.set(options.defaultValues)
      } else {
        this.valuesAtom.set((prev) =>
          applyDefaultValuesPreservingTouchedFields(
            prev,
            options.defaultValues,
            this,
          ),
        )
      }
    }

    // TODO plans
    // form.update(B) => A !== B -> Queue async update
    // v1: !form.isTouched -> Apply state
    // v2? If only 'a' was touched, 'b' could still receive async updates
  }

  getFieldValue = (fieldName: string): any => {
    return getBy(this.state.values, fieldName)
  }

  getFieldMeta = (fieldName: string): InternalFieldMeta | undefined => {
    return this._tryGetFieldApi(fieldName)?.meta
  }

  setFieldValue = (
    fieldName: string,
    updater: Updater<any>,
    options?: InternalFieldUpdateOptions,
  ) => {
    const updateOptions = resolveFieldUpdateOptions(options, 'change')

    const field = getTargetField(this, fieldName, updateOptions)
    updateOptions.fieldApiOverride = field

    batch(() => {
      this.valuesAtom.set((prev) => setBy(prev, fieldName, updater))

      this._notifyFieldChange(field, updateOptions, 'change')
    })
  }

  resetField = <TFieldName extends DeepKeys<TFormData>>(
    fieldName: TFieldName,
    opts?: FieldApiOverrideOptions,
  ) => {
    const field = opts?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)
    this.valuesAtom.set((prev) =>
      setBy(prev, fieldName, getBy(this.options.defaultValues, fieldName)),
    )

    field?._children.forEach((child) => child._kill())
  }

  // TODO type safety: DeepKeys that extend undefined?
  deleteField = (fieldName: string, opts?: FieldApiOverrideOptions) => {
    const field = opts?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)

    field?._kill()
  }

  pushFieldValue = (
    arrayFieldName: string,
    value: any,
    options?: InternalFieldUpdateOptions,
  ): void => {
    if (this._isInvalidArrayMethod('pushFieldValue', arrayFieldName)) {
      return
    }

    this.setFieldValue(
      arrayFieldName,
      (prev: Array<any>) => {
        return [...prev, value]
      },
      options,
    )
  }

  insertFieldValue = (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: InternalFieldUpdateOptions,
  ): void => {
    if (
      this._isInvalidArrayMethod('insertFieldValue', arrayFieldName, {
        bounds: [index],
        allowEndIndex: true,
      })
    ) {
      return
    }

    const updateOptions = resolveFieldUpdateOptions(options, 'change')
    const arrayField = getTargetField(this, arrayFieldName, updateOptions)
    updateOptions.fieldApiOverride = arrayField

    batch(() => {
      this.setFieldValue(
        arrayFieldName,
        (prev: Array<any>) => {
          const array = prev.slice()
          array.splice(index, 0, value)
          return array
        },
        updateOptions,
      )

      if (!arrayField) return

      // Shift existing children to the right of the insertion index
      for (const child of arrayField._children) {
        if (typeof child._segment === 'string') continue
        if (child._segment >= index) {
          child._moveTo(child._segment + 1)
        }
      }
    })
  }

  removeFieldValue = (
    arrayFieldName: string,
    index: number,
    options?: InternalFieldUpdateOptions,
  ): void => {
    if (
      this._isInvalidArrayMethod('removeFieldValue', arrayFieldName, {
        bounds: [index],
        allowEndIndex: false,
      })
    ) {
      return
    }

    const updateOptions = resolveFieldUpdateOptions(options, 'change')
    const arrayField = getTargetField(this, arrayFieldName, updateOptions)
    updateOptions.fieldApiOverride = arrayField

    batch(() => {
      this.setFieldValue(
        arrayFieldName,
        (prev: Array<any>) => {
          const array = prev.slice()
          array.splice(index, 1)
          return array
        },
        updateOptions,
      )

      if (!arrayField) return

      const childToRemove = tryGetFieldApi(arrayField, [index])
      childToRemove?._kill()

      for (const child of arrayField._children) {
        if (typeof child._segment === 'string') continue
        if (child._segment > index) {
          child._moveTo(child._segment - 1)
        }
      }
    })
  }

  swapFieldValues = (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
    options?: InternalFieldUpdateOptions,
  ) => {
    if (
      this._isInvalidArrayMethod('swapFieldValues', arrayFieldName, {
        bounds: [indexA, indexB],
        allowEndIndex: false,
      })
    ) {
      return
    }

    if (indexA === indexB) {
      return
    }

    const updateOptions = resolveFieldUpdateOptions(options, 'change')
    const arrayField = getTargetField(this, arrayFieldName, updateOptions)
    updateOptions.fieldApiOverride = arrayField

    batch(() => {
      this.setFieldValue(
        arrayFieldName,
        (prev: Array<any>) => {
          const a = prev[indexA]
          const b = prev[indexB]
          const array = prev.slice()
          array[indexA] = b
          array[indexB] = a
          return array
        },
        updateOptions,
      )

      if (!arrayField) return

      // Since the length wasn't changed, we need to notify manually
      arrayField._setMeta((prev) => ({
        ...prev,
        _arrayVersion: prev._arrayVersion + 1,
      }))

      const fieldA = tryGetFieldApi(arrayField, [indexA])

      const fieldB = tryGetFieldApi(arrayField, [indexB])

      // Fields aren't necessarily mounted, so we should assume
      // that the indeces will represent actual values in the array.
      // If not, then the user will most likely not iterate over them
      // during rendering, so we don't need to worry about them.
      fieldA?._moveTo(indexB)
      fieldB?._moveTo(indexA)
    })
  }

  clearFieldValues = (
    arrayFieldName: string,
    options?: InternalFieldUpdateOptions,
  ) => {
    if (this._isInvalidArrayMethod('clearFieldValues', arrayFieldName)) {
      return
    }

    const updateOptions = resolveFieldUpdateOptions(options, 'change')
    const arrayField = getTargetField(this, arrayFieldName, updateOptions)
    updateOptions.fieldApiOverride = arrayField

    batch(() => {
      this.setFieldValue(arrayFieldName, [], updateOptions)

      if (!arrayField) return

      arrayField._setMeta((prev) => ({
        ...prev,
        _arrayVersion: prev._arrayVersion + 1,
      }))

      // Kill all child fields since the array is now empty
      // _kill() will remove each child from the parent's children
      for (const child of arrayField._children) {
        child._kill()
      }
    })
  }

  filterFieldValues = (
    arrayFieldName: string,
    predicate: (value: any, index: number, array: any) => boolean,
    options?: InternalFieldUpdateOptions & { thisArg?: any },
  ) => {
    if (this._isInvalidArrayMethod('filterFieldValues', arrayFieldName)) {
      return
    }

    const updateOptions = resolveFieldUpdateOptions(options, 'change')
    const arrayNode = getTargetField(this, arrayFieldName, updateOptions)
    updateOptions.fieldApiOverride = arrayNode

    const oldArray: Array<any> = this.getFieldValue(arrayFieldName)

    let length = 0
    const thisArg = options?.thisArg
    const filtered = oldArray.filter((value, index, array) => {
      const keep = predicate.call(thisArg, value, index, array)
      if (!arrayNode) return keep

      const childAtIndex = arrayNode._getChild(index)
      if (keep) {
        childAtIndex?._moveTo(length)
        length++
      } else {
        childAtIndex?._kill()
      }
      return keep
    })

    if (oldArray.length === filtered.length) {
      // Setting filtered array would be a no-op, but either way the user
      // tried to set a value
      this._notifyFieldChange(arrayNode, updateOptions, 'change')
    } else {
      this.setFieldValue(arrayFieldName, filtered, updateOptions)
    }
  }

  _notifyFieldChange = (
    field: AnyInternalFieldApi | null,
    options: ResolvedInternalFieldUpdateOptions,
    event: 'change' | 'blur' | 'submit',
  ) => {
    if (event === 'change') {
      this._clearEventErrors(field, 'submit')
    }

    const { markAsDirty } = options
    if (markAsDirty && !this._formMetaAtom.get().isDirty) {
      this._formMetaAtom.set((prev) => ({ ...prev, isDirty: true }))
    }

    field?._notifyEvent(options, event)
  }

  _clearEventErrors = (
    field: AnyInternalFieldApi | null,
    sourceEvent: string,
  ) => {
    const validatorCount = this.options.validators?.length ?? 0
    const formMeta = this._formMetaAtom.get()
    const fieldFormErrorCount =
      field?._getBaseMeta()._formValidatorErrors.length ?? 0
    const eventErrorCount = Math.max(
      formMeta.errors.length,
      formMeta.fieldErrors.length,
      fieldFormErrorCount,
    )
    const eventErrorIndexes: Array<number> = []

    for (let i = 0; i < validatorCount; i++) {
      const validator = this.options.validators?.[i]
      const runsOnChange = validator?.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          event: 'change',
          formApi: this as never,
          triggerFieldApi: field ?? undefined,
        }),
      )

      if (validator && !runsOnChange) {
        eventErrorIndexes.push(i)
      }
    }

    for (let i = validatorCount; i < eventErrorCount; i++) {
      eventErrorIndexes.push(i)
    }

    batch(() => {
      this._formMetaAtom.set((prev) => {
        const clearedErrors = clearIndexedErrorsFromSource(
          prev.errors,
          prev.errorSourceEvents,
          eventErrorIndexes,
          sourceEvent,
        )
        const fieldErrors = [...prev.fieldErrors]
        let hasChanged = clearedErrors !== null

        if (field) {
          for (const i of eventErrorIndexes) {
            const fieldRefs = fieldErrors[i]
            if (
              fieldRefs?.has(field) &&
              hasFieldEventError(field, i, sourceEvent)
            ) {
              const nextFieldRefs = new Set(fieldRefs)
              nextFieldRefs.delete(field)
              fieldErrors[i] = nextFieldRefs
              hasChanged = true
            }
          }
        }

        if (!hasChanged) {
          return prev
        }

        return { ...prev, ...(clearedErrors ?? {}), fieldErrors }
      })

      if (field && hasFieldEventErrors(field, eventErrorIndexes, sourceEvent)) {
        this._clearFieldEventErrors(field, eventErrorIndexes, sourceEvent)
      }
    })
  }

  _isInvalidArrayMethod = (
    methodName: string,
    arrayFieldName: string,
    args: {
      bounds: Array<number>
      allowEndIndex: boolean
    } = { bounds: [], allowEndIndex: false },
  ): boolean => {
    const { bounds, allowEndIndex } = args

    const array = this.getFieldValue(arrayFieldName)
    if (!Array.isArray(array)) {
      console.warn(
        `<form>.${methodName}: This method can only be used on array fields, but '${arrayFieldName}' is: `,
        array,
      )
      return true
    }
    const maxIndex = allowEndIndex ? array.length : array.length - 1
    for (const index of bounds) {
      if (index < 0 || index > maxIndex) {
        console.warn(
          `<form>.${methodName}: ${index} is out of bounds for '${arrayFieldName}', expected 0 - ${maxIndex}.`,
        )
        return true
      }
    }
    return false
  }

  _tryGetFieldApi = (
    nameOrSegments: string | Array<string>,
  ): AnyInternalFieldApi | null => {
    return tryGetFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
    )
  }

  _getOrCreateFieldApi = (
    options: Omit<AnyFieldApiOptions, 'form'>,
  ): AnyInternalFieldApi => {
    const { name, ...restOpts } = options

    const fieldOptions = Object.keys(restOpts).length > 0 ? restOpts : undefined

    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(name),
      this,
      fieldOptions,
    )
  }

  _clearFieldValidatorError = (
    field: AnyInternalFieldApi,
    validatorIndex: number,
  ) => {
    field._setMeta((prev) => {
      if (prev._formValidatorErrors.length <= validatorIndex) {
        return prev
      }

      const clearedErrors = setIndexedError(
        prev._formValidatorErrors,
        prev._formValidatorErrorSourceEvents,
        validatorIndex,
        [],
        '',
      )

      if (!clearedErrors) return prev

      return {
        ...prev,
        _formValidatorErrors: clearedErrors.errors,
        _formValidatorErrorSourceEvents: clearedErrors.errorSourceEvents,
      }
    })
    field._pruneIfUnused()
  }

  _clearFieldEventErrors = (
    field: AnyInternalFieldApi,
    eventErrorIndexes: Array<number>,
    sourceEvent: string,
  ) => {
    field._setMeta((prev) => {
      const clearedErrors = clearIndexedErrorsFromSource(
        prev._formValidatorErrors,
        prev._formValidatorErrorSourceEvents,
        eventErrorIndexes,
        sourceEvent,
      )

      if (!clearedErrors) return prev

      return {
        ...prev,
        _formValidatorErrors: clearedErrors.errors,
        _formValidatorErrorSourceEvents: clearedErrors.errorSourceEvents,
      }
    })
    field._pruneIfUnused()
  }

  _processValidationResult = (
    result: PipelineResult<FormValidateResult<TFormData>>,
    sourceEvent: string,
  ) => {
    if (result.hasSchemaResult) {
      this._schemaOutputs[result.validatorIndex] = result.schemaResult
    }

    const aggregateError = isAggregateError(result.result)

    if (aggregateError) {
      this._processAggregateError(
        aggregateError,
        result.validatorIndex,
        sourceEvent,
      )
      return
    }

    batch(() => {
      this._formMetaAtom.set((prev) => {
        const nextError = isErrorResult(result.result)
          ? normalizeValidationError(result.result as ValidationErrorInput)
          : []
        const nextErrors = setIndexedError(
          prev.errors,
          prev.errorSourceEvents,
          result.validatorIndex,
          nextError,
          sourceEvent,
        )

        if (!nextErrors) return prev

        return {
          ...prev,
          errors: nextErrors.errors,
          errorSourceEvents: nextErrors.errorSourceEvents,
        }
      })

      // Clear field-level errors from potential previous { fields: {} } errors
      this._formMetaAtom.set((prev) => {
        const fieldErrors = [...prev.fieldErrors]
        const oldFieldRefs = fieldErrors[result.validatorIndex]
        let errorFields = prev.errorFields

        if (oldFieldRefs) {
          for (const field of oldFieldRefs) {
            this._clearFieldValidatorError(field, result.validatorIndex)
          }
          fieldErrors[result.validatorIndex] = new Set()
          errorFields = reconcileErrorFields(errorFields, oldFieldRefs)
        }

        return { ...prev, fieldErrors, errorFields }
      })
    })
  }

  /**
   * Process a ValidationAggregateError by setting form-level and field-level errors.
   */
  _processAggregateError = (
    aggregateError: {
      formError: ValidationErrorInput | null
      fieldErrors: ValidationAggregateError<any>['fields']
    },
    validatorIndex: number,
    sourceEvent: string,
  ) => {
    batch(() => {
      // Handle form-level errors
      this._formMetaAtom.set((prev) => {
        const nextError = aggregateError.formError
          ? normalizeValidationError(aggregateError.formError)
          : []
        const nextErrors = setIndexedError(
          prev.errors,
          prev.errorSourceEvents,
          validatorIndex,
          nextError,
          sourceEvent,
        )

        if (!nextErrors) return prev

        return {
          ...prev,
          errors: nextErrors.errors,
          errorSourceEvents: nextErrors.errorSourceEvents,
        }
      })

      // Handle field-level errors
      this._formMetaAtom.set((prev) => {
        const fieldErrors = [...prev.fieldErrors]
        const newFieldRefs = new Set<AnyInternalFieldApi>()
        const oldFieldRefs = fieldErrors[validatorIndex]

        const staleFieldRefs = oldFieldRefs ? new Set(oldFieldRefs) : undefined
        const affectedFields = new Set<AnyInternalFieldApi>()

        // Set new field errors and build the new reference set
        for (const [fieldName, fieldError] of Object.entries(
          aggregateError.fieldErrors,
        )) {
          const field = this._getOrCreateFieldApi({ name: fieldName })
          field._setMeta((prev) => {
            const newError = normalizeValidationError(fieldError)
            const nextErrors = setIndexedError(
              prev._formValidatorErrors,
              prev._formValidatorErrorSourceEvents,
              validatorIndex,
              newError,
              sourceEvent,
            )

            if (!nextErrors) return prev

            return {
              ...prev,
              _formValidatorErrors: nextErrors.errors,
              _formValidatorErrorSourceEvents: nextErrors.errorSourceEvents,
            } satisfies InternalBaseFieldMeta
          })
          newFieldRefs.add(field)
          affectedFields.add(field)
          staleFieldRefs?.delete(field)
        }

        // Clear errors for fields that are no longer in the new result
        if (staleFieldRefs) {
          for (const field of staleFieldRefs) {
            this._clearFieldValidatorError(field, validatorIndex)
            affectedFields.add(field)
          }
        }

        fieldErrors[validatorIndex] = newFieldRefs
        const errorFields = reconcileErrorFields(
          prev.errorFields,
          affectedFields,
        )

        return { ...prev, fieldErrors, errorFields }
      })
    })
  }

  _runFormValidation = async (
    signal: ValidationTrigger,
    opts?: FieldApiOverrideOptions & {
      onResult?: boolean
      hasFailedBefore?: boolean
    },
  ): Promise<FormValidatorPipelineResult> => {
    const pipeline = this.options.validators
    if (!pipeline)
      return {
        results: [],
        hasErrors: false,
        thrownError: null,
      }
    if (pipeline.length === 0)
      return {
        results: [],
        hasErrors: false,
        thrownError: null,
      }

    this._setValidationCount((count) => count + 1)
    try {
      return await runFormValidatorPipeline({
        context: {
          event: signal,
          // TypeScript doesn't instantly complain, but instead decides to wait a while.
          // Just leave it as never.
          formApi: this as never,
          triggerFieldApi: opts?.fieldApiOverride ?? undefined,
        },
        hasFailedBefore: opts?.hasFailedBefore ?? false,
        pipeline,
        onResult:
          opts?.onResult !== false
            ? (result) => this._processValidationResult(result, signal)
            : undefined,
      })
    } finally {
      this._setValidationCount((count) => Math.max(0, count - 1))
    }
  }

  _setValidationCount = (updater: Updater<number>): void => {
    this._formMetaAtom.set((prev) => {
      const validationCount = callUpdater(updater, prev.validationCount)

      if (prev.validationCount === validationCount) {
        return prev
      }

      return { ...prev, validationCount }
    })
  }

  validate = async (
    signal: ValidationTrigger,
    opts?: FieldApiOverrideOptions & {
      onResult?: boolean
      hasFailedBefore?: boolean
    },
  ) => {
    const pipelineResults = await this._runFormValidation(signal, opts)
    return pipelineResults.results
      .map(({ result }) => result)
      .filter(isErrorResult)
  }

  handleSubmit = async (): Promise<Array<FormValidationError<TFormData>>> => {
    const submitResetVersion = this._resetVersionAtom.get()
    const hasResettedFormDuringSubmit = () =>
      this._resetVersionAtom.get() !== submitResetVersion

    batch(() => {
      this._submissionAttemptsAtom.set((prev) => prev + 1)
      this._formMetaAtom.set((prev) => ({
        ...prev,
        isSubmitting: true,
      }))
    })

    const submissionData = {
      hasFailed: false,
      submitError:
        null satisfies FormValidateResult<TFormData> as FormValidateResult<TFormData>,
    }

    const fields =
      this._fieldRootNode._touchAllFieldsAndCollectSubmitValidators()

    const fieldValidatorResults = await Promise.all(
      fields.map((field) =>
        field._runFieldValidation('submit', { onResult: false }),
      ),
    )

    if (hasResettedFormDuringSubmit()) {
      return []
    }

    const fieldResults: Array<ValidationErrorInput> = []

    batch(() => {
      for (let i = 0; i < fieldValidatorResults.length; i++) {
        const field = fields[i]!
        const pipelineResult = fieldValidatorResults[i]!

        if (pipelineResult.thrownError !== null) {
          submissionData.hasFailed = true
        }

        for (const result of pipelineResult.results) {
          if (isErrorResult(result.result)) {
            submissionData.hasFailed = true
            fieldResults.push(result.result)
          }
          field._processValidationResult(result, 'submit')
        }
      }
    })

    // TODO maybe some users don't want form validation to run if field validation failed.
    // Configurable option with opt-out wouldn't hurt.
    // Also keep in mind this would apply to handleChange too.
    const formPipelineResult = await this._runFormValidation('submit', {
      hasFailedBefore: submissionData.hasFailed,
    })

    if (hasResettedFormDuringSubmit()) {
      return []
    }

    if (
      formPipelineResult.thrownError !== null ||
      formPipelineResult.hasErrors
    ) {
      submissionData.hasFailed = true
    }

    const errorResults = formPipelineResult.results
      .map(({ result }) => result)
      .filter(isErrorResult)
      .concat(fieldResults)

    const cleanup = () => {
      if (hasResettedFormDuringSubmit()) {
        return
      }

      this._formMetaAtom.set((prev) => {
        return {
          ...prev,
          isSubmitting: false,
          isSubmitSuccessful: submissionData.hasFailed,
        }
      })
    }

    if (submissionData.hasFailed) {
      cleanup()
      return errorResults
    }

    const schemaOutputs: any = Array.from(
      { length: this.options.validators?.length ?? 0 },
      (_, i) => {
        return this._schemaOutputs[i]
      },
    )

    try {
      const maybeError = await this.options.onSubmit?.({
        formApi: this as never,
        schemaOutputs,
        value: this.state.values,
        createValidationError,
      })

      if (hasResettedFormDuringSubmit()) {
        return []
      }

      // TODO we need to implement onMount / onSubmit errors being cleared on change
      // An array of [0 .. validators.length] can cover the latest validator error's cause
      // maybe? It could be that field level errors shouldn't be cleared so eagerly, only on itself.

      // Anyways, point is that onSubmit will be [validators.length], so we can always assume it's onSubmit

      if (isSubmitError<TFormData>(maybeError)) {
        this._processValidationResult(
          {
            validatorIndex: this.options.validators?.length ?? 0,
            result: maybeError,
            schemaResult: null,
          },
          'submit',
        )
        submissionData.submitError = maybeError
      }
    } catch (e) {
      if (hasResettedFormDuringSubmit()) {
        return []
      }

      console.error(e)
      submissionData.hasFailed = true
    }

    batch(() => {
      if (isErrorResult(submissionData.submitError)) {
        submissionData.hasFailed = true
        errorResults.push(submissionData.submitError)

        this._processValidationResult(
          {
            validatorIndex: this.options.validators?.length ?? 0,
            result: submissionData.submitError,
            schemaResult: null,
          },
          'submit',
        )
      }
      // Cleanup regardless of error result or not
      cleanup()
    })

    return errorResults
  }
}

/**
 * Error cleanup
 *
 * DONT HAVE YET - mount
 * -> in v1, it refers to Component mount
 * -> in v2, we can check if `mount.run` is a promise. If not, then we can use that as immediate error feedback
 * otherwise, delay processing with .then() -> "init" rather than mount
 *
 * change
 * blur
 * submit
 *
 * -> when are these cleared?
 *
 * Submission and onMount errors clear after change/blur
 * -> Form-level errors should clear when any field changes / blurs
 *   -> { form: x, fields: {} } -> split into form-level and field-level
 * -> Field-level errors should ONLY clear if that specific field changes / blurs
 *
 *
 * Linked Fields
 * -> a field has a Set<other fields> that need to be notified
 * -> if a field B has a field-level error from onSubmit, and it listens to field A,
 * then changing field A should trigger field B validation, but it should NOT clear field B errors.
 *
 *
 * Field mounts
 *  -> is there `listeners.listenToblabla`
 *  -> if so, for each, `form.getOrCreateFieldApi(name)
 *  -> const unsubscribe = otherField.attachListener(this)
 *
 *  -> field._update() brings in different names
 *  -> Map<oldName, unsubscribe> -> unsubscribe
 *
 *  -> repeat process of subscribing
 *
 *  prune condition needs to be extended: listeners need to be size 0
 *
 *  -> {
 *     run: () => {},
 *     triggers: ['change', 'blur', 'submit', 'mount', 'unmount'], // not the same as submit
 *     // runOnSubmit doesn't exist
 *     listenToFields: ['otherField']
 *   }
 *
 *
 * const form  = useForm({ defaultValues, validators: [
 *   { run: () => 'Form-level' } // This only runs on submit. If field changes/blurs and this error is still there, clear it
 *   { run: () => ({ form: 'Form-level', fields: { 'name', 'Too short' }})} // If field changes/blurs, remove form-level. If `name` changes, then remove name.
 * ]})
 *
 */

/**
 * TODO do testing with basic react example, see what feels good DX wise:
 *
 * Field A level error, field B level error, field A listens to field B for validation
 * -> should Field A clear onSubmit/onMount errors when field B triggered validation?
 */

/*
  // TODO: Talk about user-land listeners moving after a shift or other array operation

  // CURRENT
  <form.Field name={`name[${idx}]`} validators={{
      onChangeListenTo: [`foo[${idx - 1}]`]
  }}/>

  <form.Field name="foo.bar.foobar" validators={{
    onChangeListenTo: ['foo'] // What if 'foo.bar' updates?
  }}

  // UPDATE LISTENERS DURING:
  // - TrieMoveOperation (swapValue, et al)
  // - on*ListenTo value changes

  class TrieNode {
    listenNodes: Set<TrieNode>;
  }

  class FormApi {
    onTrieMoveOperation() {
      // onListenToChanges will auto-run if the user is intentionally listening to the moved value
      //  because of the reactivity mechanism of the framework
      //  so we don't need to traverse the whole tree, only the moved operations
    }

    onListenToChanges(listenTrieNode, prevName, newName) {
      const prevTrieNode = this.getTrie(prevName);
      cost newTrieNode = this.getTrie(newName);
      // Node was moved but is referentially the same, no changes in internal listeners needed
      if (prevTrieNode === newTrieNode) return;
      listenTrieNode.listenNodes.remove(prevTrie);
      listenTrieNode.listenNodes.add(newTrieNode);
    }

    triggerNodeListeners(changedTrieNode) {
      // Traverse upwards from current trie node to inform
      changedTrieNode.traverseUp((currNode) => {
        if (currNode.contains(changedTrieNode)) {
          return; // Prevent accidental dependencies on itself/parents
        }
        currNode.listenNodes.triggerChange();
      })
    }
  }

  // TrieMoveOperation:
  // - Nodes that are being changed
  //    -> Child nodes might have stale

  // 'summary' -> 'users[1]' node
  // REFERENTIALLY

  // TrieMoveOperation
  // moved 'users[1]' -> 'users[0]'



  // on node change:
  // 1. Am I in the list?
  // 2. If so, send updates to each node
*/

//      node
//      /   \
//    nodeA  nodeB
//     /  \
//   nodeC nodeD
