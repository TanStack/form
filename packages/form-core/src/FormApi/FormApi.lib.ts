import { batch, createAtom } from '@tanstack/store'
import {
  getDefaultValueCacheResult,
  getOrCreateFieldApi,
  hasFormGroupValidatorErrors,
  nameToFieldNodeSegments,
  shouldCacheDefaultValue,
  tryGetFieldApi,
} from '../FieldApi/FieldApi.lib'
import {
  callUpdater,
  cancelPipelineCache,
  createPipelineCache,
  evaluate,
  getBy,
  getTargetField,
  resolveFieldUpdateOptions,
  setBy,
  uuid,
} from '../utils.lib'
import { InternalRootFieldApi } from '../FieldApi/RootFieldApi.lib'
import {
  clearIndexedErrorsFromSource,
  hasIndexedErrorFromSource,
  hasIndexedErrors,
  isAggregateError,
  isErrorResult,
  isValidationTriggerEnabled,
  normalizeValidationError,
  reconcileRoutedFieldErrors,
  runFormMountValidatorPipeline,
  runFormValidatorPipeline,
  setIndexedError,
} from '../validation.lib'
import { runFormListenerPipeline } from '../listeners.lib'
import { runSubmissionProcess } from './handleSubmit.lib'
import { ArrayMethods } from './array-methods.lib'
import {
  compareFormStateSnapshots,
  getFormStateSnapshot,
} from './formState.lib'
import type {
  FormApi,
  FormApiOptions,
  FormOptions,
  FormResetOptions,
  FormState,
} from './FormApi.public'
import type { FormErrorMeta } from './formState.lib'
import type { DeepKeys } from '../deep-keys.public'
import type { PipelineCache } from '../utils.lib'
import type {
  FormValidatorPipelineResult,
  PipelineResult,
} from '../validation.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  DefaultValueCacheEntry,
  InternalBaseFieldMeta,
  InternalFieldMeta,
} from '../FieldApi/FieldApi.lib'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
  ResolvedInternalFieldUpdateOptions,
} from '../types.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { Updater } from '../types.public'
import type {
  FormValidateResult,
  FormValidationError,
  FormValidators,
  ToFormValidatorMetas,
  ToSubmitMeta,
  ValidationAggregateError,
  ValidationErrorInput,
  ValidationIssue,
  ValidationTrigger,
} from '../validation.public'
import type { FormListenerTriggers } from '../listeners.public'
import type { InternalFormGroupApi } from '../FormGroupApi/FormGroupApi.lib'

type AnyFormGroupApi = InternalFormGroupApi<any, any, any, any, any, any>

export interface FormMetaAtoms {
  isDirty: Atom<boolean>
  /**
   * @private
   * Number of root fields whose own or descendant meta currently contributes touched state.
   */
  touchedFieldCount: Atom<number>
  formErrors: Atom<FormErrorMeta>
  /**
   * @private
   * Dense array of field references per validator index that have errors.
   * Used to clear stale field errors when a validator no longer reports them.
   */
  fieldErrors: Atom<Array<Set<AnyInternalFieldApi>>>
  /**
   * @private
   * Root fields whose own or descendant meta currently contributes errors.
   */
  errorFields: Atom<Set<AnyInternalFieldApi>>
  /**
   * @private
   * Number of root fields whose own or descendant meta currently validates.
   */
  fieldValidationCount: Atom<number>
  validationCount: Atom<number>
  isSubmitting: Atom<boolean>
  isSubmitSuccessful: Atom<boolean>
  submissionAttempts: Atom<number>
}

export interface FormAtoms<in out TFormData> {
  values: Atom<TFormData>
  meta: FormMetaAtoms
  resetVersion: Atom<number>
  defaultValuesVersion: Atom<number>
}

function createInitialFormErrorMeta(validatorCount: number): FormErrorMeta {
  return {
    errors: Array.from({ length: validatorCount }, () => []),
    errorSourceEvents: Array.from({ length: validatorCount }, () => null),
  }
}

function createInitialFormMetaAtoms(validatorCount: number): FormMetaAtoms {
  return {
    isDirty: createAtom(false),
    touchedFieldCount: createAtom(0),
    formErrors: createAtom(createInitialFormErrorMeta(validatorCount)),
    fieldErrors: createAtom(
      Array.from(
        { length: validatorCount },
        () => new Set<AnyInternalFieldApi>(),
      ),
    ),
    errorFields: createAtom(new Set<AnyInternalFieldApi>()),
    fieldValidationCount: createAtom(0),
    validationCount: createAtom(0),
    isSubmitting: createAtom(false),
    isSubmitSuccessful: createAtom(false),
    submissionAttempts: createAtom(0),
  }
}

export type AnyInternalFormApi = InternalFormApi<any, any, any>

type InternalFormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> = FormOptions<TFormData, TFormValidators, TSubmitReturn> & {
  formId: string
}

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

function hasFieldErrors(field: AnyInternalFieldApi): boolean {
  const meta = field._getBaseMeta()

  return (
    hasIndexedErrors(meta._fieldValidatorErrors) ||
    hasFormGroupValidatorErrors(meta._formGroupValidatorErrors) ||
    hasIndexedErrors(meta._formValidatorErrors) ||
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
> implements FormApi<
  TFormData,
  ToFormValidatorMetas<TFormValidators>,
  ToSubmitMeta<TSubmitReturn>
> {
  atom: ReadonlyAtom<
    FormState<
      TFormData,
      ToFormValidatorMetas<TFormValidators>,
      ToSubmitMeta<TSubmitReturn>
    >
  >
  _atoms: FormAtoms<TFormData>
  _fieldRootNode: InternalRootFieldApi
  _defaultValueCache: DefaultValueCacheEntry | null = null
  _options: InternalFormOptions<TFormData, TFormValidators, any>
  _lastUpdateDefaultValues: TFormData
  _pipelineCache: PipelineCache<any>
  _schemaOutputs: Array<any> = []
  _formGroups = new Set<InternalFormGroupApi<any, any, any, any, any, any>>()

  get state(): FormState<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    ToSubmitMeta<TSubmitReturn>
  > {
    return this.atom.get()
  }

  get options(): FormApiOptions<
    TFormData,
    ToFormValidatorMetas<TFormValidators>,
    ToSubmitMeta<TSubmitReturn>
  > & { formId: string } {
    return this._options as never
  }
  get formId(): string {
    return this._options.formId
  }

  _setDefaultValueCache(
    values: unknown,
    defaultValues: unknown,
    isDefaultValue: boolean,
  ): boolean {
    if (!shouldCacheDefaultValue(values, defaultValues)) {
      this._defaultValueCache = null
      return isDefaultValue
    }

    this._defaultValueCache = {
      name: '',
      value: values,
      defaultValue: defaultValues,
      isDefaultValue,
    }
    return isDefaultValue
  }

  _getCachedIsDefaultValue(
    values: unknown = this._atoms.values.get(),
    defaultValues: unknown = this.options.defaultValues,
  ): boolean | undefined {
    return getDefaultValueCacheResult(
      this._defaultValueCache,
      '',
      values,
      defaultValues,
    )
  }

  _getIsDefaultValue(): boolean {
    void this._atoms.defaultValuesVersion.get()
    const values = this._atoms.values.get()
    const defaultValues = this.options.defaultValues
    const cached = this._getCachedIsDefaultValue(values, defaultValues)
    if (cached !== undefined) return cached

    return this._setDefaultValueCache(
      values,
      defaultValues,
      evaluate(defaultValues, values),
    )
  }

  constructor(options: FormOptions<TFormData, TFormValidators, any>) {
    this._options = { ...options, formId: options.formId ?? uuid() }
    this._lastUpdateDefaultValues = options.defaultValues
    this._pipelineCache = createPipelineCache()
    const validatorCount = this._options.validators?.length ?? 0
    this._atoms = {
      values: createAtom(options.defaultValues),
      meta: createInitialFormMetaAtoms(validatorCount),
      resetVersion: createAtom(0),
      defaultValuesVersion: createAtom(0),
    }
    this._fieldRootNode = new InternalRootFieldApi(this)

    this.atom = createAtom(() => getFormStateSnapshot(this), {
      compare: compareFormStateSnapshots,
    })

    this._runMountValidation()
  }

  mount = () => {
    this._notifyFormListener('mount', null)

    return () => {}
  }

  _registerFormGroup(group: AnyFormGroupApi): void {
    this._formGroups.add(group)
  }

  _unregisterFormGroup(group: AnyFormGroupApi): void {
    this._formGroups.delete(group)
  }

  _getNearestFormGroupForField(fieldName: string): AnyFormGroupApi | null {
    let nearest: AnyFormGroupApi | null = null
    for (const group of this._formGroups) {
      const groupName = String(group.name)
      const isContained =
        fieldName === groupName ||
        fieldName.startsWith(`${groupName}.`) ||
        fieldName.startsWith(`${groupName}[`)

      if (!isContained) continue

      if (!nearest || groupName.length > String(nearest.name).length) {
        nearest = group
      }
    }
    return nearest
  }

  reset = (values?: TFormData, opts?: FormResetOptions) => {
    const shouldUpdateDefaultValues =
      values !== undefined && opts?.updateDefaultValues !== false

    if (shouldUpdateDefaultValues) {
      this._options = { ...this.options, defaultValues: values } as never
    }

    cancelPipelineCache(this._pipelineCache)
    this._pipelineCache = createPipelineCache()
    this._schemaOutputs = []
    this._defaultValueCache = null

    batch(() => {
      this._atoms.resetVersion.set((version) => version + 1)
      if (shouldUpdateDefaultValues) {
        this._atoms.defaultValuesVersion.set((version) => version + 1)
      }
      this._fieldRootNode._children.forEach((child) =>
        child._kill({ listenerEvent: 'reset' }),
      )
      const validatorCount = this.options.validators?.length ?? 0
      this._atoms.meta.isDirty.set(false)
      this._atoms.meta.touchedFieldCount.set(0)
      this._atoms.meta.formErrors.set(
        createInitialFormErrorMeta(validatorCount),
      )
      this._atoms.meta.fieldErrors.set(
        Array.from(
          { length: validatorCount },
          () => new Set<AnyInternalFieldApi>(),
        ),
      )
      this._atoms.meta.errorFields.set(new Set<AnyInternalFieldApi>())
      this._atoms.meta.fieldValidationCount.set(0)
      this._atoms.meta.validationCount.set(0)
      this._atoms.meta.isSubmitting.set(false)
      this._atoms.meta.isSubmitSuccessful.set(false)
      this._atoms.meta.submissionAttempts.set(0)
      this._atoms.values.set(values ?? this._options.defaultValues)
    })

    this._notifyFormListener('reset', null)
  }

  _update(options: FormOptions<TFormData, TFormValidators, any>) {
    const oldOptions = this.options
    const didDefaultValuesChange = !evaluate(
      options.defaultValues,
      this._lastUpdateDefaultValues,
    )

    this._lastUpdateDefaultValues = options.defaultValues
    this._defaultValueCache = null
    this._options = {
      ...options,
      defaultValues: didDefaultValuesChange
        ? options.defaultValues
        : oldOptions.defaultValues,
      formId: options.formId ?? oldOptions.formId,
    }

    if (
      (options.validators?.length ?? 0) !== (oldOptions.validators?.length ?? 0)
    ) {
      console.warn(
        'TanStack Form: The length of the validator array should not change after initialization',
      )
    }

    if (didDefaultValuesChange) {
      batch(() => {
        this._atoms.defaultValuesVersion.set((version) => version + 1)
        if (this._atoms.meta.touchedFieldCount.get() === 0) {
          this._atoms.values.set(options.defaultValues)
        } else {
          this._atoms.values.set((prev) =>
            applyDefaultValuesPreservingTouchedFields(
              prev,
              options.defaultValues,
              this,
            ),
          )
        }
      })
    }

    // TODO plans
    // form.update(B) => A !== B -> Queue async update
    // v1: !form.isTouched -> Apply state
    // v2? If only 'a' was touched, 'b' could still receive async updates
  }

  getFieldValue = (fieldName: string): any => {
    return getBy(this._atoms.values.get(), fieldName)
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
      this._atoms.values.set((prev) => setBy(prev, fieldName, updater))

      this._notifyFieldChange(field, updateOptions)
    })
  }

  resetField = <TFieldName extends DeepKeys<TFormData>>(
    fieldName: TFieldName,
    opts?: FieldApiOverrideOptions,
  ) => {
    const field = opts?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)
    this._atoms.values.set((prev) =>
      setBy(prev, fieldName, getBy(this.options.defaultValues, fieldName)),
    )

    field?._children.forEach((child) => child._kill({ listenerEvent: 'reset' }))
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
    return ArrayMethods.pushValue({
      form: this,
      arrayFieldName,
      value,
      options,
    })
  }

  insertFieldValue = (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: InternalFieldUpdateOptions,
  ): void => {
    return ArrayMethods.insertValue({
      form: this,
      arrayFieldName,
      index,
      value,
      options,
    })
  }

  removeFieldValue = (
    arrayFieldName: string,
    index: number,
    options?: InternalFieldUpdateOptions,
  ): void => {
    return ArrayMethods.removeValue({
      form: this,
      arrayFieldName,
      index,
      options,
    })
  }

  swapFieldValues = (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
    options?: InternalFieldUpdateOptions,
  ) => {
    return ArrayMethods.swapValues({
      form: this,
      arrayFieldName,
      indexA,
      indexB,
      options,
    })
  }

  moveFieldValue = (
    arrayFieldName: string,
    fromIndex: number,
    toIndex: number,
    options?: InternalFieldUpdateOptions,
  ) => {
    return ArrayMethods.moveValue({
      form: this,
      arrayFieldName,
      fromIndex,
      toIndex,
      options,
    })
  }

  clearFieldValues = (
    arrayFieldName: string,
    options?: InternalFieldUpdateOptions,
  ): void => {
    return ArrayMethods.clearValues({ form: this, arrayFieldName, options })
  }

  filterFieldValues = (
    arrayFieldName: string,
    predicate: (value: any, index: number, array: any) => boolean,
    options?: InternalFieldUpdateOptions & { thisArg?: any },
  ): void => {
    return ArrayMethods.filterValues({
      form: this,
      arrayFieldName,
      predicate,
      options,
    })
  }

  _notifyFieldChange(
    field: AnyInternalFieldApi | null,
    options: ResolvedInternalFieldUpdateOptions,
  ) {
    this._clearEventErrors(field, 'submit', 'change')
    this._clearEventErrors(field, 'mount', 'change')

    const { markAsDirty } = options
    if (markAsDirty && !this._atoms.meta.isDirty.get()) {
      this._atoms.meta.isDirty.set(true)
    }

    field?._notifyEvent(options, 'change')
    this._notifyFormListener('change', field)
  }

  _notifyFormListener(
    trigger: FormListenerTriggers,
    triggerFieldApi: AnyInternalFieldApi | null,
  ) {
    if (!this.options.listeners) return
    if (this.options.listeners.length === 0) return

    runFormListenerPipeline({
      pipeline: this.options.listeners,
      context: {
        event: trigger,
        formApi: this,
        triggerFieldApi: triggerFieldApi ?? undefined,
      },
    })
  }

  _clearEventErrors(
    field: AnyInternalFieldApi | null,
    sourceEvent: string,
    event: Exclude<ValidationTrigger, 'submit'>,
  ) {
    const validatorCount = this.options.validators?.length ?? 0
    const formErrors = this._atoms.meta.formErrors.get()
    const fieldErrors = this._atoms.meta.fieldErrors.get()
    const fieldFormErrorCount =
      field?._getBaseMeta()._formValidatorErrors.length ?? 0
    const eventErrorCount = Math.max(
      formErrors.errors.length,
      fieldErrors.length,
      fieldFormErrorCount,
    )
    const eventErrorIndexes: Array<number> = []

    for (let i = 0; i < validatorCount; i++) {
      const validator = this.options.validators?.[i]
      const runsOnEvent = validator?.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          event,
          formApi: this as never,
          triggerFieldApi: field ?? undefined,
        }),
      )

      if (validator && !runsOnEvent) {
        eventErrorIndexes.push(i)
      }
    }

    for (let i = validatorCount; i < eventErrorCount; i++) {
      eventErrorIndexes.push(i)
    }

    batch(() => {
      this._atoms.meta.formErrors.set((prev) => {
        const clearedErrors = clearIndexedErrorsFromSource(
          prev.errors,
          prev.errorSourceEvents,
          eventErrorIndexes,
          sourceEvent,
        )
        if (!clearedErrors) {
          return prev
        }

        return clearedErrors
      })

      if (field) {
        this._atoms.meta.fieldErrors.set((prev) => {
          const fieldErrors = [...prev]
          let hasChanged = false

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

          return hasChanged ? fieldErrors : prev
        })
      }

      if (field && hasFieldEventErrors(field, eventErrorIndexes, sourceEvent)) {
        this._clearFieldEventErrors(field, eventErrorIndexes, sourceEvent)
      }
    })
  }

  _tryGetFieldApi(
    nameOrSegments: string | Array<string>,
  ): AnyInternalFieldApi | null {
    return tryGetFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(nameOrSegments),
    )
  }

  _getOrCreateFieldApi(
    options: Omit<AnyFieldApiOptions, 'form'>,
  ): AnyInternalFieldApi {
    const { name, ...restOpts } = options

    const fieldOptions = Object.keys(restOpts).length > 0 ? restOpts : undefined

    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(name),
      this,
      fieldOptions,
    )
  }

  _resolveErrorFieldPath(fieldName: string): string {
    let current: AnyInternalFieldApi | InternalRootFieldApi =
      this._fieldRootNode
    let boundary: AnyInternalFieldApi | null = null

    for (const segment of nameToFieldNodeSegments(fieldName)) {
      const child: AnyInternalFieldApi | undefined = current._getChild(segment)
      if (!child) break

      if (child._errorBoundary) {
        boundary = child
      }
      current = child
    }

    return boundary?.name ?? fieldName
  }

  _setFormValidatorError(
    validatorIndex: number,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    this._atoms.meta.formErrors.set((prev) => {
      const nextErrors = setIndexedError(
        prev.errors,
        prev.errorSourceEvents,
        validatorIndex,
        errors,
        sourceEvent,
      )

      if (!nextErrors) return prev

      return {
        ...prev,
        errors: nextErrors.errors,
        errorSourceEvents: nextErrors.errorSourceEvents,
      }
    })
  }

  _setFieldValidatorError(
    field: AnyInternalFieldApi,
    validatorIndex: number,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const nextErrors = setIndexedError(
        prev._formValidatorErrors,
        prev._formValidatorErrorSourceEvents,
        validatorIndex,
        errors,
        sourceEvent,
      )

      if (!nextErrors) return prev

      return {
        ...prev,
        _formValidatorErrors: nextErrors.errors,
        _formValidatorErrorSourceEvents: nextErrors.errorSourceEvents,
      } satisfies InternalBaseFieldMeta
    })
  }

  _clearFieldValidatorError(
    field: AnyInternalFieldApi,
    validatorIndex: number,
  ) {
    if (field._getBaseMeta()._formValidatorErrors.length <= validatorIndex) {
      field._pruneIfUnused()
      return
    }

    this._setFieldValidatorError(field, validatorIndex, [], '')
    field._pruneIfUnused()
  }

  _clearFieldEventErrors(
    field: AnyInternalFieldApi,
    eventErrorIndexes: Array<number>,
    sourceEvent: string,
  ) {
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

  _processValidationResult(
    result: PipelineResult<FormValidateResult<TFormData>>,
    sourceEvent: string,
  ) {
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
      this._setFormValidatorError(
        result.validatorIndex,
        isErrorResult(result.result)
          ? normalizeValidationError(result.result as ValidationErrorInput)
          : [],
        sourceEvent,
      )

      // Clear field-level errors from potential previous { fields: {} } errors
      const oldFieldRefs =
        this._atoms.meta.fieldErrors.get()[result.validatorIndex]

      if (oldFieldRefs && oldFieldRefs.size > 0) {
        for (const field of oldFieldRefs) {
          this._clearFieldValidatorError(field, result.validatorIndex)
        }

        this._atoms.meta.fieldErrors.set((prev) => {
          const fieldErrors = [...prev]
          fieldErrors[result.validatorIndex] = new Set()
          return fieldErrors
        })
        this._atoms.meta.errorFields.set((prev) =>
          reconcileErrorFields(prev, oldFieldRefs),
        )
      }
    })
  }

  /**
   * Process a ValidationAggregateError by setting form-level and field-level errors.
   */
  _processAggregateError(
    aggregateError: {
      formError: ValidationErrorInput | null
      fieldErrors: ValidationAggregateError<any>['fields']
    },
    validatorIndex: number,
    sourceEvent: string,
  ) {
    const resolvedFieldErrors = new Map<string, Array<ValidationIssue>>()

    for (const [fieldName, fieldError] of Object.entries(
      aggregateError.fieldErrors,
    )) {
      const resolvedName = this._resolveErrorFieldPath(fieldName)
      const errors = normalizeValidationError(fieldError)
      resolvedFieldErrors.set(
        resolvedName,
        (resolvedFieldErrors.get(resolvedName) ?? []).concat(errors),
      )
    }

    batch(() => {
      // Handle form-level errors
      this._setFormValidatorError(
        validatorIndex,
        aggregateError.formError
          ? normalizeValidationError(aggregateError.formError)
          : [],
        sourceEvent,
      )

      // Handle field-level errors
      const fieldErrors = [...this._atoms.meta.fieldErrors.get()]
      const oldFieldRefs = fieldErrors[validatorIndex]
      const { fieldRefs, affectedFields, didFieldRefsChange } =
        reconcileRoutedFieldErrors(
          validatorIndex,
          resolvedFieldErrors,
          oldFieldRefs,
          (fieldName) => this._getOrCreateFieldApi({ name: fieldName }),
          (field, index, errors) =>
            this._setFieldValidatorError(field, index, errors, sourceEvent),
          (field, index) => this._clearFieldValidatorError(field, index),
        )

      if (didFieldRefsChange) {
        fieldErrors[validatorIndex] = fieldRefs
        this._atoms.meta.fieldErrors.set(fieldErrors)
      }

      if (affectedFields.size > 0) {
        this._atoms.meta.errorFields.set((prev) =>
          reconcileErrorFields(prev, affectedFields),
        )
      }
    })
  }

  _runMountValidation(): void {
    const pipeline = this.options.validators
    if (!pipeline || pipeline.length === 0) return

    this._setValidationCount((count) => count + 1)

    const { didRun, asyncPromise } = runFormMountValidatorPipeline({
      pipeline,
      formApi: this,
      onResult: (result) => this._processValidationResult(result, 'mount'),
    })

    if (!didRun) {
      this._setValidationCount((count) => Math.max(0, count - 1))
      return
    }

    if (asyncPromise) {
      void asyncPromise.finally(() => {
        this._setValidationCount((count) => Math.max(0, count - 1))
      })
      return
    }

    this._setValidationCount((count) => Math.max(0, count - 1))
  }

  async _runFormValidation(
    signal: ValidationTrigger,
    opts?: FieldApiOverrideOptions & {
      onResult?: boolean
      hasFailedBefore?: boolean
    },
  ): Promise<FormValidatorPipelineResult> {
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

  _setValidationCount(updater: Updater<number>): void {
    this._atoms.meta.validationCount.set((prev) => callUpdater(updater, prev))
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

  _handleSubmitPromise: Promise<any> | null = null

  handleSubmit = (): Promise<Array<FormValidationError<TFormData>>> => {
    if (this._handleSubmitPromise) return this._handleSubmitPromise

    this._notifyFormListener('submit', null)

    const handleSubmitPromise = runSubmissionProcess(this).finally(() => {
      if (this._handleSubmitPromise === handleSubmitPromise) {
        this._handleSubmitPromise = null
      }
    })

    this._handleSubmitPromise = handleSubmitPromise

    return handleSubmitPromise
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
