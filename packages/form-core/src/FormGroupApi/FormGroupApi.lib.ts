import { batch, createAtom, shallow } from '@tanstack/store'
import {
  cancelPipelineCache,
  concatenateFieldNames,
  createPipelineCache,
  getBy,
  setBy,
} from '../utils.lib'
import {
  clearIndexedErrorsFromSource,
  hasIndexedErrorFromSource,
  hasIndexedErrors,
  isErrorResult,
  isValidationTriggerEnabled,
  parseValidationResult,
  reconcileRoutedFieldErrors,
  runGroupMountValidatorPipeline,
  runValidatorPipeline,
  setIndexedError,
} from '../validation.lib'
import { transformFieldOptionsFieldNames } from '../FieldApi/FieldApi.lib'
import { visitFieldSubtree } from '../FieldApi/fieldTraversal.lib'
import {
  deriveFromBaseFieldMeta,
  hasFieldMetaErrors,
} from '../FieldApi/fieldState.lib'
import { parseStandardSchemaIssues } from '../standardSchema.lib'
import { createErrorMap } from '../validation.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
} from '../FieldApi/FieldApi.lib'
import type {
  DerivedMetaMarkers,
  FormGroupFieldErrorMeta,
  InternalBaseFieldMeta,
  InternalFieldMeta,
} from '../FieldApi/fieldState.lib'
import type { FormStateOverrides } from '../FormApi/formState.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { PipelineCache } from '../utils.lib'
import type {
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
} from './FormGroupApi.public'
import type {
  ConfigurableValidationTrigger,
  FormErrorTypes,
  FormErrors,
  FormGroupValidateResult,
  FormGroupValidator,
  FormGroupValidators,
  ToFormGroupErrorTypes,
  ValidationIssue,
} from '../validation.public'
import type { ReadonlyAtom } from '@tanstack/store'

interface FormGroupValidationOutcome<TGroupValue> {
  errors: Array<FormGroupValidateResult<TGroupValue>>
  hasException: boolean
}

const emptyFormGroupFieldErrorMeta: FormGroupFieldErrorMeta = {
  errors: [],
  errorSourceEvents: [],
}

export type AnyInternalFormGroupApi = InternalFormGroupApi<
  any,
  any,
  any,
  any,
  any
>

export class InternalFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormErrorTypes extends FormErrorTypes,
> implements FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  ToFormGroupErrorTypes<TGroupValidators>,
  TFormErrorTypes
> {
  readonly form: FormApi<TFormData, TFormErrorTypes> &
    InternalFormApi<any, any, any>
  /** The trie node occupied by this form group. */
  _groupField: AnyInternalFieldApi
  _options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormErrorTypes
  >
  atom: ReadonlyAtom<
    FormGroupState<TGroupValue, ToFormGroupErrorTypes<TGroupValidators>>
  >
  _pipelineCache: PipelineCache<FormGroupValidateResult<TGroupValue>>
  _schemaOutputs: Array<any> = []
  /** Tracks the trie nodes receiving routed errors from each validator. */
  _routedErrorFields: Array<Set<AnyInternalFieldApi> | undefined> = []
  _isSubmitting = createAtom(false)
  _isSubmitSuccessful = createAtom(false)
  _submissionAttempts = createAtom(0)
  /** Invalidates group state when reset or remount replaces its trie node. */
  _groupFieldVersion = createAtom(0)

  get state() {
    return this.atom.get()
  }

  get name(): TGroupName {
    return this._groupField.name as TGroupName
  }

  get value(): TGroupValue {
    return getBy(this.form.state.values, this.name) as TGroupValue
  }

  constructor(
    options: FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormErrorTypes
    >,
  ) {
    this._options = options
    this.form = options.form as never
    this._groupField = this.form._getOrCreateFieldApi({ name: options.name })
    this._groupField._setFormGroup(this)
    this._pipelineCache = createPipelineCache()

    const groupMetaMarkers: DerivedMetaMarkers = {
      source: undefined,
      canDisplayErrors: undefined,
    }

    this.atom = createAtom<
      FormGroupState<TGroupValue, ToFormGroupErrorTypes<TGroupValidators>>
    >(
      (prev) => {
        void this._groupFieldVersion.get()

        const groupField = this._groupField
        const groupBaseMeta = groupField._getBaseMeta()
        const groupValue = this.value
        const previousGroupMeta = prev?.meta as InternalFieldMeta | undefined
        const groupMeta = deriveFromBaseFieldMeta(
          groupBaseMeta,
          previousGroupMeta,
          groupField,
          groupValue,
          groupMetaMarkers,
        )
        const groupErrorMeta = groupBaseMeta._formGroupValidatorErrors
        let groupErrors: FormErrors<ToFormGroupErrorTypes<TGroupValidators>>

        if (
          prev &&
          previousGroupMeta?._formGroupValidatorErrors === groupErrorMeta
        ) {
          groupErrors = prev.errors
        } else if (groupErrorMeta) {
          groupErrors = groupErrorMeta.errors.flat() as never
        } else {
          groupErrors = []
        }

        const isInvalid = hasFieldMetaErrors(groupBaseMeta)
        const isTouched = groupMeta.isTouched
        const isDirty = groupMeta.isDirty

        return {
          values: groupValue,
          meta: groupMeta,
          errors: groupErrors,
          isTouched,
          isDirty,
          isPristine: !isDirty,
          isValid: !isInvalid,
          isInvalid,
          canSubmit: !this._isSubmitting.get() && !isInvalid,
          isSubmitting: this._isSubmitting.get(),
          isSubmitSuccessful: this._isSubmitSuccessful.get(),
          isValidating: groupMeta.isValidating,
          submissionAttempts: this._submissionAttempts.get(),
        }
      },
      { compare: shallow },
    )
  }

  /** Attaches this group to the trie node at the given path. */
  _attachToFieldTrie(name: string): void {
    const groupField = this.form._getOrCreateFieldApi({ name })

    if (groupField !== this._groupField) {
      this._groupField = groupField
      this._groupFieldVersion.set((version) => version + 1)
    }

    groupField._setFormGroup(this)
  }

  /** Marks the backing trie node as validating until the returned callback runs. */
  _startValidation(): () => void {
    const groupField = this._groupField
    const pipelineCache = this._pipelineCache
    let isComplete = false

    groupField._setValidationCount((count) => count + 1)

    return () => {
      if (isComplete) return
      isComplete = true

      // Reset and cleanup replace the cache after clearing the node count, so
      // an old completion must not decrement a newer validation run.
      if (this._pipelineCache !== pipelineCache) return

      groupField._setValidationCount((count) => Math.max(0, count - 1))
    }
  }

  /** Cancels group validation and clears it from the backing trie node. */
  _cancelValidation(): void {
    const groupField = this._groupField

    cancelPipelineCache(this._pipelineCache)
    this._pipelineCache = createPipelineCache()
    groupField._setValidationCount(() => 0)
  }

  update = (
    options: FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormErrorTypes
    >,
  ) => {
    this._options = options
  }

  mount = (): void => {
    this._attachToFieldTrie(this.name)

    const pipeline = this._options.validators
    if (!pipeline || pipeline.length === 0) return

    const finishValidation = this._startValidation()

    const { didRun, asyncPromise } = runGroupMountValidatorPipeline({
      pipeline: pipeline as ReadonlyArray<FormGroupValidator<any>>,
      groupApi: this,
      onResult: (result) => this._processValidationResult(result, 'mount'),
    })

    if (!didRun) {
      finishValidation()
      return
    }

    if (asyncPromise) {
      void asyncPromise.finally(finishValidation)
      return
    }

    finishValidation()
  }

  _getScopedFormStateOverrides(): FormStateOverrides {
    return {
      isTouched: () => {
        const meta = this._groupField._getBaseMeta()
        return meta.isTouched || meta.childContributionCounts.touched > 0
      },
      isDirty: () => {
        const meta = this._groupField._getBaseMeta()
        return meta.isDirty || meta.childContributionCounts.dirty > 0
      },
      isPristine: () => {
        const meta = this._groupField._getBaseMeta()
        return !meta.isDirty && meta.childContributionCounts.dirty === 0
      },
      isDefaultValue: () => {
        const value = getBy(this.form._atoms.values.get(), this.name)
        return this._groupField._getIsDefaultValue(value)
      },
      isValid: () => {
        return !hasFieldMetaErrors(this._groupField._getBaseMeta())
      },
      isInvalid: () => {
        return hasFieldMetaErrors(this._groupField._getBaseMeta())
      },
      canSubmit: () => {
        return (
          !this._isSubmitting.get() &&
          !hasFieldMetaErrors(this._groupField._getBaseMeta())
        )
      },
      isSubmitting: () => this._isSubmitting.get(),
      isSubmitSuccessful: () => this._isSubmitSuccessful.get(),
      isValidating: () => {
        const meta = this._groupField._getBaseMeta()
        return meta.isValidating || meta.childContributionCounts.validating > 0
      },
      submissionAttempts: () => this._submissionAttempts.get(),
    }
  }

  _getPrefixedFieldName(fieldName: string): string {
    return concatenateFieldNames(this.name, fieldName)
  }

  _getFormFieldOptions<TOptions extends AnyFieldApiOptions>(
    options: TOptions,
    mergeOptions: (props: TOptions, overrides: Partial<TOptions>) => TOptions,
  ): AnyFieldApiOptions {
    return transformFieldOptionsFieldNames(
      options,
      (fieldName) => this._getPrefixedFieldName(fieldName),
      mergeOptions,
    )
  }

  _setGroupFieldErrorMeta(
    meta: InternalBaseFieldMeta,
    groupErrors: FormGroupFieldErrorMeta,
  ): InternalBaseFieldMeta {
    const formGroupValidatorErrors = hasIndexedErrors(groupErrors.errors)
      ? groupErrors
      : null

    if (meta._formGroupValidatorErrors === formGroupValidatorErrors) return meta

    return {
      ...meta,
      _formGroupValidatorErrors: formGroupValidatorErrors,
    }
  }

  _setFieldValidatorError(
    field: AnyInternalFieldApi,
    validatorIndex: number,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const previousGroupErrors = this._getFieldErrorMeta(prev)
      const nextErrors = setIndexedError(
        previousGroupErrors.errors,
        previousGroupErrors.errorSourceEvents,
        validatorIndex,
        errors,
        sourceEvent,
      )

      if (!nextErrors) return prev

      return this._setGroupFieldErrorMeta(prev, nextErrors)
    })
  }

  _getFieldErrorMeta(meta: InternalBaseFieldMeta): FormGroupFieldErrorMeta {
    return meta._formGroupValidatorErrors ?? emptyFormGroupFieldErrorMeta
  }

  _clearFieldValidatorError(
    field: AnyInternalFieldApi,
    validatorIndex: number,
  ) {
    this._setFieldValidatorError(field, validatorIndex, [], '')
    field._pruneIfUnused()
  }

  _processValidationResult(
    result: {
      validatorIndex: number
      result: FormGroupValidateResult<TGroupValue>
      schemaResult: any | null
      hasSchemaResult?: boolean
    },
    sourceEvent: string,
  ) {
    if (result.hasSchemaResult) {
      this._schemaOutputs[result.validatorIndex] = result.schemaResult
    }

    const parsedResult = parseValidationResult(result.result)
    const validatorIndex = result.validatorIndex
    const groupField = this._groupField
    const oldFieldRefs = this._routedErrorFields[validatorIndex]
    const resolvedFieldErrors = this.form._resolveRoutedFieldErrors(
      Object.entries(parsedResult.subfields ?? {}),
      groupField,
    )
    const groupFieldErrors = resolvedFieldErrors.get(groupField) ?? []
    resolvedFieldErrors.delete(groupField)

    batch(() => {
      this._setFieldValidatorError(
        groupField,
        validatorIndex,
        (parsedResult.self ?? []).concat(groupFieldErrors),
        sourceEvent,
      )

      const { fieldRefs } = reconcileRoutedFieldErrors(
        validatorIndex,
        resolvedFieldErrors,
        oldFieldRefs,
        (field, index, errors) =>
          this._setFieldValidatorError(field, index, errors, sourceEvent),
        (field, index) => this._clearFieldValidatorError(field, index),
      )

      this._routedErrorFields[validatorIndex] = fieldRefs
    })
  }

  _visitGroupFields(visitor: (field: AnyInternalFieldApi) => void) {
    visitFieldSubtree(this._groupField, visitor)
  }

  async _runFieldValidations(
    signal: ConfigurableValidationTrigger | 'submit',
  ): Promise<FormGroupValidationOutcome<TGroupValue>> {
    const fieldValidationPromises: Array<
      ReturnType<AnyInternalFieldApi['_runFieldValidation']>
    > = []

    this._visitGroupFields((field) => {
      fieldValidationPromises.push(field._runFieldValidation(signal))
    })

    const results = await Promise.all(fieldValidationPromises)

    return {
      errors: results.flatMap((result) =>
        result.results
          .map(({ result: fieldResult }) => fieldResult)
          .filter(isErrorResult),
      ),
      hasException: results.some((result) => result.thrownError !== null),
    }
  }

  _hasFieldEventError(
    field: AnyInternalFieldApi,
    validatorIndex: number,
    sourceEvent: string,
  ): boolean {
    const meta = field._getBaseMeta()
    const groupErrors = this._getFieldErrorMeta(meta)
    return hasIndexedErrorFromSource(
      groupErrors.errors,
      groupErrors.errorSourceEvents,
      validatorIndex,
      sourceEvent,
    )
  }

  _clearFieldEventErrors(
    field: AnyInternalFieldApi,
    validatorIndexes: Array<number>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const previousGroupErrors = this._getFieldErrorMeta(prev)
      const clearedErrors = clearIndexedErrorsFromSource(
        previousGroupErrors.errors,
        previousGroupErrors.errorSourceEvents,
        validatorIndexes,
        sourceEvent,
      )

      if (!clearedErrors) return prev

      return this._setGroupFieldErrorMeta(prev, clearedErrors)
    })
    field._pruneIfUnused()
  }

  _clearEventErrors(
    field: AnyInternalFieldApi,
    sourceEvent: string,
    event: ConfigurableValidationTrigger,
  ) {
    const validatorCount = this._options.validators?.length ?? 0
    const groupField = this._groupField
    const eventErrorCount = Math.max(
      validatorCount,
      this._routedErrorFields.length,
      this._getFieldErrorMeta(groupField._getBaseMeta()).errors.length,
      this._getFieldErrorMeta(field._getBaseMeta()).errors.length,
    )
    const eventErrorIndexes: Array<number> = []

    for (let i = 0; i < validatorCount; i++) {
      const validator = this._options.validators?.[i]
      const runsOnEvent = validator?.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          scope: 'group',
          event,
          formApi: this.form,
          groupApi: this,
          triggerFieldApi: field,
        }),
      )

      if (validator && !runsOnEvent) {
        eventErrorIndexes.push(i)
      }
    }

    for (let i = validatorCount; i < eventErrorCount; i++) {
      eventErrorIndexes.push(i)
    }

    if (eventErrorIndexes.length === 0) return

    batch(() => {
      this._clearFieldEventErrors(groupField, eventErrorIndexes, sourceEvent)

      const indexesToClearFromField: Array<number> = []
      for (const validatorIndex of eventErrorIndexes) {
        const fieldRefs = this._routedErrorFields[validatorIndex]
        if (
          fieldRefs?.has(field) &&
          this._hasFieldEventError(field, validatorIndex, sourceEvent)
        ) {
          const nextFieldRefs = new Set(fieldRefs)
          nextFieldRefs.delete(field)
          this._routedErrorFields[validatorIndex] = nextFieldRefs
          indexesToClearFromField.push(validatorIndex)
        }
      }

      if (indexesToClearFromField.length > 0) {
        this._clearFieldEventErrors(field, indexesToClearFromField, sourceEvent)
      }
    })
  }

  _clearRoutedErrors() {
    const fields = new Set<AnyInternalFieldApi>()
    fields.add(this._groupField)
    for (const fieldRefs of this._routedErrorFields) {
      for (const field of fieldRefs ?? []) fields.add(field)
    }

    for (const field of fields) {
      field._setMeta((prev) => {
        if (!prev._formGroupValidatorErrors) return prev
        return {
          ...prev,
          _formGroupValidatorErrors: null,
        }
      })
      field._pruneIfUnused()
    }
    this._routedErrorFields = []
  }

  _validate = async (
    signal: ConfigurableValidationTrigger | 'submit',
    opts?: { triggerFieldApi?: AnyInternalFieldApi },
  ): Promise<FormGroupValidationOutcome<TGroupValue>> => {
    if (signal !== 'submit' && opts?.triggerFieldApi) {
      this._clearEventErrors(opts.triggerFieldApi, 'submit', signal)
      if (signal === 'blur') {
        this._clearEventErrors(opts.triggerFieldApi, 'mount', signal)
      }
    }

    const pipeline = this._options.validators
    if (!pipeline || pipeline.length === 0) {
      const fieldOutcome = await this._runFieldValidations(signal)
      this._clearRoutedErrors()
      return fieldOutcome
    }

    const finishValidation = this._startValidation()
    try {
      const fieldOutcomePromise = this._runFieldValidations(signal)
      const results = await runValidatorPipeline<
        FormGroupValidateResult<TGroupValue>
      >({
        pipeline: pipeline as ReadonlyArray<FormGroupValidator<any>>,
        cache: this._pipelineCache,
        context: {
          scope: 'group',
          event: signal,
          formApi: this.form,
          groupApi: this,
          triggerFieldApi: opts?.triggerFieldApi,
        },
        hasFailedBefore: false,
        scope: 'form',
        getContext: (ctx) => ({
          event: signal,
          formApi: this.form,
          groupApi: this,
          triggerFieldApi: opts?.triggerFieldApi,
          signal: ctx.signal,
          value: this.value,
          createErrorMap,
          parseIssues: (issues) =>
            parseStandardSchemaIssues(issues, this.value, 'form'),
        }),
        onResult: (result) => {
          this._processValidationResult(result, signal)
        },
      })

      const groupErrors: Array<FormGroupValidateResult<TGroupValue>> =
        results.results
          .map(
            ({ result }: { result: FormGroupValidateResult<TGroupValue> }) =>
              result,
          )
          .filter(isErrorResult)
      const fieldOutcome = await fieldOutcomePromise
      const errors: Array<FormGroupValidateResult<TGroupValue>> = [
        ...groupErrors,
        ...fieldOutcome.errors,
      ]

      return {
        errors,
        hasException: results.thrownError !== null || fieldOutcome.hasException,
      }
    } finally {
      finishValidation()
    }
  }

  validate = async (
    signal: ConfigurableValidationTrigger | 'submit',
    opts?: { triggerFieldApi?: AnyInternalFieldApi },
  ): Promise<Array<FormGroupValidateResult<TGroupValue>>> => {
    return (await this._validate(signal, opts)).errors
  }

  handleSubmit = async (): Promise<
    Array<FormGroupValidateResult<TGroupValue>>
  > => {
    this._submissionAttempts.set((attempts) => attempts + 1)
    this._isSubmitting.set(true)
    this._isSubmitSuccessful.set(false)

    try {
      const validationOutcome = await this._validate('submit')
      const value = this.value
      const invalidContext = {
        value,
        formApi: this.form,
        groupApi: this,
      } as never

      if (
        validationOutcome.errors.length > 0 ||
        validationOutcome.hasException ||
        this.state.isInvalid
      ) {
        await this._options.onSubmitInvalid?.(invalidContext)
        return validationOutcome.errors
      }

      const submitContext = {
        value,
        formApi: this.form,
        groupApi: this,
        schemaOutputs: this._schemaOutputs,
      } as never

      try {
        await this._options.onSubmit?.(submitContext)
      } catch (error) {
        await this._options.onSubmitInvalid?.(invalidContext)
        throw error
      }

      this._isSubmitSuccessful.set(true)
      return []
    } finally {
      this._isSubmitting.set(false)
    }
  }

  reset = () => {
    this._cancelValidation()
    this._schemaOutputs = []
    this.form._atoms.values.set((prev: TFormData) =>
      setBy(prev, this.name, getBy(this.form.defaultValues, this.name)),
    )
    batch(() => {
      this._visitGroupFields((field) => {
        field._setMeta((prev) => {
          if (!prev.isTouched && !prev.isDirty && !prev.isBlurred) return prev
          return {
            ...prev,
            isTouched: false,
            isDirty: false,
            isBlurred: false,
          }
        })
      })
      this._isSubmitting.set(false)
      this._isSubmitSuccessful.set(false)
      this._submissionAttempts.set(0)
      this._clearRoutedErrors()
    })
  }

  _cleanup() {
    this._cancelValidation()
    this._schemaOutputs = []
    batch(() => {
      this._isSubmitting.set(false)
      this._isSubmitSuccessful.set(false)
      this._clearRoutedErrors()
    })
    this._groupField._setFormGroup(null)
  }
}
