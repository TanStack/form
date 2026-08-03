import { batch, createAtom, shallow } from '@tanstack/store'
import {
  cancelPipelineCache,
  concatenateFieldNames,
  createPipelineCache,
  evaluate,
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
import { hasFieldMetaErrors } from '../FieldApi/fieldState.lib'
import { parseStandardSchemaIssues } from '../standardSchema.lib'
import { createErrorMap } from '../validation.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
} from '../FieldApi/FieldApi.lib'
import type {
  FormGroupFieldErrorMeta,
  InternalBaseFieldMeta,
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
  readonly name: TGroupName
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
  _errorOwner = {}
  _fieldErrors: Array<Set<AnyInternalFieldApi> | undefined> = []
  _errors = createAtom<Array<FormGroupValidateResult<TGroupValue>>>([])
  _isSubmitting = createAtom(false)
  _isSubmitSuccessful = createAtom(false)
  _isValidating = createAtom(false)
  _submissionAttempts = createAtom(0)

  get state() {
    return this.atom.get()
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
    this.name = options.name
    this._pipelineCache = createPipelineCache()

    this.atom = createAtom(() => this._getStateSnapshot(), {
      compare: shallow,
    })
    this.form._registerFormGroup(this)
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
    this.form._registerFormGroup(this)

    const pipeline = this._options.validators
    if (!pipeline || pipeline.length === 0) return

    this._isValidating.set(true)

    const { didRun, asyncPromise } = runGroupMountValidatorPipeline({
      pipeline: pipeline as ReadonlyArray<FormGroupValidator<any>>,
      groupApi: this,
      onResult: (result) => this._processValidationResult(result, 'mount'),
    })

    if (!didRun) {
      this._isValidating.set(false)
      return
    }

    if (asyncPromise) {
      void asyncPromise.finally(() => {
        this._isValidating.set(false)
      })
      return
    }

    this._isValidating.set(false)
  }

  _getStateSnapshot(): FormGroupState<
    TGroupValue,
    ToFormGroupErrorTypes<TGroupValidators>
  > {
    const groupField = this.form._tryGetFieldApi(this.name)
    const groupMeta = groupField?.meta
    const groupErrors = (
      groupField
        ? this._getFieldErrorMeta(groupField._getBaseMeta()).errors.flat()
        : []
    ) as FormErrors<ToFormGroupErrorTypes<TGroupValidators>>
    const isInvalid = groupField
      ? hasFieldMetaErrors(groupField._getBaseMeta())
      : false
    const isTouched = groupMeta?.isTouched ?? false
    const isDirty = groupMeta?.isDirty ?? false
    const isValidating =
      this._isValidating.get() || (groupMeta?.isValidating ?? false)

    return {
      values: this.value,
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
      isValidating,
      submissionAttempts: this._submissionAttempts.get(),
    }
  }

  _getScopedFormStateOverrides(): FormStateOverrides {
    return {
      isTouched: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return meta
          ? meta.isTouched || meta.childContributionCounts.touched > 0
          : false
      },
      isDirty: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return meta
          ? meta.isDirty || meta.childContributionCounts.dirty > 0
          : false
      },
      isPristine: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return meta
          ? !meta.isDirty && meta.childContributionCounts.dirty === 0
          : true
      },
      isDefaultValue: () => {
        const field = this.form._tryGetFieldApi(this.name)
        const value = getBy(this.form._atoms.values.get(), this.name)
        if (field) return field._getIsDefaultValue(value)
        void this.form._atoms.defaultValuesVersion.get()
        return evaluate(getBy(this.form.defaultValues, this.name), value)
      },
      isValid: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return meta ? !hasFieldMetaErrors(meta) : true
      },
      isInvalid: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return meta ? hasFieldMetaErrors(meta) : false
      },
      canSubmit: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return !this._isSubmitting.get() && !(meta && hasFieldMetaErrors(meta))
      },
      isSubmitting: () => this._isSubmitting.get(),
      isSubmitSuccessful: () => this._isSubmitSuccessful.get(),
      isValidating: () => {
        const meta = this.form._tryGetFieldApi(this.name)?._getBaseMeta()
        return (
          this._isValidating.get() ||
          (meta
            ? meta.isValidating || meta.childContributionCounts.validating > 0
            : false)
        )
      },
      submissionAttempts: () => this._submissionAttempts.get(),
    }
  }

  _getPrefixedFieldName(fieldName: string): string {
    return concatenateFieldNames(this.name, fieldName)
  }

  _getFormFieldOptions<TOptions extends AnyFieldApiOptions>(
    options: TOptions,
  ): AnyFieldApiOptions {
    return transformFieldOptionsFieldNames(options, (fieldName) =>
      this._getPrefixedFieldName(fieldName),
    )
  }

  _setGroupFieldErrorMeta(
    meta: InternalBaseFieldMeta,
    groupErrors: FormGroupFieldErrorMeta,
  ): InternalBaseFieldMeta {
    const formGroupValidatorErrors = new Map(meta._formGroupValidatorErrors)

    if (hasIndexedErrors(groupErrors.errors)) {
      formGroupValidatorErrors.set(this._errorOwner, groupErrors)
    } else {
      formGroupValidatorErrors.delete(this._errorOwner)
    }

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
    return (
      meta._formGroupValidatorErrors.get(this._errorOwner) ?? {
        errors: [],
        errorSourceEvents: [],
      }
    )
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
    const groupField = this.form._getOrCreateFieldApi({ name: this.name })
    const oldFieldRefs = this._fieldErrors[validatorIndex]

    batch(() => {
      this._setFieldValidatorError(
        groupField,
        validatorIndex,
        parsedResult.self ?? [],
        sourceEvent,
      )

      const normalizedFieldErrors = Object.entries(
        parsedResult.subfields ?? {},
      ).map(
        ([fieldName, fieldErrors]) =>
          [this._getPrefixedFieldName(fieldName), fieldErrors] as const,
      )

      const { fieldRefs } = reconcileRoutedFieldErrors(
        validatorIndex,
        normalizedFieldErrors,
        oldFieldRefs,
        (fieldName) => this.form._getOrCreateFieldApi({ name: fieldName }),
        (field, index, errors) =>
          this._setFieldValidatorError(field, index, errors, sourceEvent),
        (field, index) => this._clearFieldValidatorError(field, index),
      )

      this._fieldErrors[validatorIndex] = fieldRefs
    })
  }

  _visitGroupFields(visitor: (field: AnyInternalFieldApi) => void) {
    const root = this.form._tryGetFieldApi(this.name)
    if (!root) return

    visitFieldSubtree(root, visitor)
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
    const groupField = this.form._tryGetFieldApi(this.name)
    const eventErrorCount = Math.max(
      validatorCount,
      this._fieldErrors.length,
      groupField
        ? this._getFieldErrorMeta(groupField._getBaseMeta()).errors.length
        : 0,
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
      if (groupField) {
        this._clearFieldEventErrors(groupField, eventErrorIndexes, sourceEvent)
      }

      const indexesToClearFromField: Array<number> = []
      for (const validatorIndex of eventErrorIndexes) {
        const fieldRefs = this._fieldErrors[validatorIndex]
        if (
          fieldRefs?.has(field) &&
          this._hasFieldEventError(field, validatorIndex, sourceEvent)
        ) {
          const nextFieldRefs = new Set(fieldRefs)
          nextFieldRefs.delete(field)
          this._fieldErrors[validatorIndex] = nextFieldRefs
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
    const groupField = this.form._tryGetFieldApi(this.name)
    if (groupField) fields.add(groupField)
    for (const fieldRefs of this._fieldErrors) {
      for (const field of fieldRefs ?? []) fields.add(field)
    }

    for (const field of fields) {
      field._setMeta((prev) => {
        if (!prev._formGroupValidatorErrors.has(this._errorOwner)) return prev
        const groupErrors = new Map(prev._formGroupValidatorErrors)
        groupErrors.delete(this._errorOwner)
        return {
          ...prev,
          _formGroupValidatorErrors: groupErrors,
        }
      })
      field._pruneIfUnused()
    }
    this._fieldErrors = []
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
      this._errors.set([])
      this._clearRoutedErrors()
      return fieldOutcome
    }

    this._isValidating.set(true)
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

      batch(() => {
        this._errors.set(groupErrors)
      })

      return {
        errors,
        hasException: results.thrownError !== null || fieldOutcome.hasException,
      }
    } finally {
      this._isValidating.set(false)
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
    cancelPipelineCache(this._pipelineCache)
    this._pipelineCache = createPipelineCache()
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
      this._errors.set([])
      this._isSubmitting.set(false)
      this._isSubmitSuccessful.set(false)
      this._isValidating.set(false)
      this._submissionAttempts.set(0)
      this._clearRoutedErrors()
    })
  }

  _cleanup() {
    this.form._unregisterFormGroup(this)
    cancelPipelineCache(this._pipelineCache)
    this._pipelineCache = createPipelineCache()
    this._schemaOutputs = []
    batch(() => {
      this._errors.set([])
      this._isSubmitting.set(false)
      this._isSubmitSuccessful.set(false)
      this._isValidating.set(false)
      this._clearRoutedErrors()
    })
  }
}
