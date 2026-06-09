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
  isAggregateError,
  isErrorResult,
  isValidationTriggerEnabled,
  normalizeValidationError,
  runGroupMountValidatorPipeline,
  runValidatorPipeline,
  setIndexedError,
} from '../validation.lib'
import { hasFieldMetaErrors } from '../FieldApi/FieldApi.lib'
import type { FormApi } from '../FormApi/FormApi.public'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  FormGroupFieldErrorMeta,
  InternalBaseFieldMeta,
} from '../FieldApi/FieldApi.lib'
import type { FormStateOverrides } from '../FormApi/formState.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { PipelineCache } from '../utils.lib'
import type { PipelineResult } from '../validation.lib'
import type {
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
} from './FormGroupApi.public'
import type {
  ConfigurableValidationTrigger,
  FormGroupValidateResult,
  FormGroupValidator,
  FormGroupValidators,
  FormValidatorMetas,
  ToFormGroupValidatorMetas,
  ValidationIssue,
} from '../validation.public'
import type { ReadonlyAtom } from '@tanstack/store'

export class InternalFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TFormData>,
  TFormValidatorMetas extends FormValidatorMetas,
  TSubmitReturn,
> implements FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  ToFormGroupValidatorMetas<TGroupValidators>,
  TFormValidatorMetas,
  TSubmitReturn
> {
  readonly form: FormApi<TFormData, TFormValidatorMetas, TSubmitReturn> &
    InternalFormApi<any, any, any>
  readonly name: TGroupName
  options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    FormGroupValidators<TGroupValue>,
    TFormValidatorMetas,
    TSubmitReturn
  >
  store: ReadonlyAtom<
    FormGroupState<
      TFormData,
      TGroupName,
      TGroupValue,
      ToFormGroupValidatorMetas<TGroupValidators>
    >
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
    return this.store.get()
  }

  get value(): TGroupValue {
    return getBy(this.form.state.values, this.name) as TGroupValue
  }

  constructor(
    options: FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      FormGroupValidators<TGroupValue>,
      TFormValidatorMetas,
      TSubmitReturn
    >,
  ) {
    this.options = options
    this.form = options.form as unknown as FormApi<
      TFormData,
      TFormValidatorMetas,
      TSubmitReturn
    > &
      InternalFormApi<any, any, any>
    this.name = options.name
    this._pipelineCache = createPipelineCache()

    this.store = createAtom(() => this._getStateSnapshot(), {
      compare: shallow,
    })
    this.form._registerFormGroup(this)
  }

  update = (
    options: FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      FormGroupValidators<TGroupValue>,
      TFormValidatorMetas,
      TSubmitReturn
    >,
  ) => {
    this.options = options
  }

  mount = (): void => {
    const pipeline = this.options.validators
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

  _getStateSnapshot = (): FormGroupState<
    TFormData,
    TGroupName,
    TGroupValue,
    ToFormGroupValidatorMetas<TGroupValidators>
  > => {
    const groupField = this.form._tryGetFieldApi(this.name)
    const groupMeta = groupField?.meta
    const groupErrors = groupField
      ? this._getFieldErrorMeta(groupField._getBaseMeta()).errors.flat()
      : []
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

  _getScopedFormStateOverrides = (): FormStateOverrides => {
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

  _getPrefixedFieldName = (fieldName: string): string => {
    return concatenateFieldNames(this.name, fieldName)
  }

  _getFormFieldOptions = <TOptions extends AnyFieldApiOptions>(
    options: TOptions,
  ): AnyFieldApiOptions => {
    return {
      ...options,
      name: this._getPrefixedFieldName(options.name),
      validators: this._prefixWatchedFields(options.validators),
      listeners: this._prefixWatchedFields(options.listeners),
    }
  }

  _prefixWatchedFields = <
    TItem extends { watchFields?: Array<string> } | undefined,
  >(
    items: ReadonlyArray<TItem> | undefined,
  ): Array<TItem> | undefined => {
    if (!items) return undefined

    return items.map((item) => {
      if (!item?.watchFields) return item

      return {
        ...item,
        watchFields: item.watchFields.map(this._getPrefixedFieldName),
      }
    })
  }

  _setFieldValidatorError = (
    field: AnyInternalFieldApi,
    validatorIndex: number,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) => {
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
      const groupErrors = new Map(prev._formGroupValidatorErrors)
      if (
        nextErrors.errors.some((validatorErrors) => validatorErrors.length > 0)
      ) {
        groupErrors.set(this._errorOwner, nextErrors)
      } else {
        groupErrors.delete(this._errorOwner)
      }
      return {
        ...prev,
        _formGroupValidatorErrors: groupErrors,
      }
    })
  }

  _getFieldErrorMeta = (
    meta: InternalBaseFieldMeta,
  ): FormGroupFieldErrorMeta => {
    return (
      meta._formGroupValidatorErrors.get(this._errorOwner) ?? {
        errors: [],
        errorSourceEvents: [],
      }
    )
  }

  _clearFieldValidatorError = (
    field: AnyInternalFieldApi,
    validatorIndex: number,
  ) => {
    this._setFieldValidatorError(field, validatorIndex, [], '')
    field._pruneIfUnused()
  }

  _processValidationResult = (
    result: {
      validatorIndex: number
      result: FormGroupValidateResult<TGroupValue>
      schemaResult: any | null
      hasSchemaResult?: boolean
    },
    sourceEvent: string,
  ) => {
    if (result.hasSchemaResult) {
      this._schemaOutputs[result.validatorIndex] = result.schemaResult
    }

    const aggregate = isAggregateError(result.result)
    const validatorIndex = result.validatorIndex
    const groupField = this.form._getOrCreateFieldApi({ name: this.name })
    const oldFieldRefs = this._fieldErrors[validatorIndex]
    const staleFieldRefs = oldFieldRefs ? new Set(oldFieldRefs) : undefined
    const newFieldRefs = new Set<AnyInternalFieldApi>()

    batch(() => {
      this._setFieldValidatorError(
        groupField,
        validatorIndex,
        aggregate
          ? normalizeValidationError(aggregate.formError)
          : isErrorResult(result.result)
            ? normalizeValidationError(result.result as never)
            : [],
        sourceEvent,
      )

      if (aggregate) {
        for (const [fieldName, fieldError] of Object.entries(
          aggregate.fieldErrors,
        )) {
          const field = this.form._getOrCreateFieldApi({
            name: this._getPrefixedFieldName(fieldName),
          })
          this._setFieldValidatorError(
            field,
            validatorIndex,
            normalizeValidationError(fieldError),
            sourceEvent,
          )
          newFieldRefs.add(field)
          staleFieldRefs?.delete(field)
        }
      }

      if (staleFieldRefs) {
        for (const field of staleFieldRefs) {
          this._clearFieldValidatorError(field, validatorIndex)
        }
      }

      this._fieldErrors[validatorIndex] = newFieldRefs
    })
  }

  _visitGroupFields = (visitor: (field: AnyInternalFieldApi) => void) => {
    const root = this.form._tryGetFieldApi(this.name)
    if (!root) return

    const visit = (field: AnyInternalFieldApi) => {
      visitor(field)
      field._children.forEach(visit)
    }
    visit(root)
  }

  _runFieldValidations = async (
    signal: ConfigurableValidationTrigger | 'submit',
  ): Promise<Array<FormGroupValidateResult<TGroupValue>>> => {
    const fieldValidationPromises: Array<
      Promise<Array<FormGroupValidateResult<TGroupValue>>>
    > = []

    this._visitGroupFields((field) => {
      fieldValidationPromises.push(
        field
          ._runFieldValidation(signal)
          .then(
            (result) =>
              result.results
                .map(({ result: fieldResult }) => fieldResult)
                .filter(isErrorResult) as Array<
                FormGroupValidateResult<TGroupValue>
              >,
          ),
      )
    })

    return (await Promise.all(fieldValidationPromises)).flat()
  }

  _hasFieldEventError = (
    field: AnyInternalFieldApi,
    validatorIndex: number,
    sourceEvent: string,
  ): boolean => {
    const meta = field._getBaseMeta()
    const groupErrors = this._getFieldErrorMeta(meta)
    return hasIndexedErrorFromSource(
      groupErrors.errors,
      groupErrors.errorSourceEvents,
      validatorIndex,
      sourceEvent,
    )
  }

  _clearFieldEventErrors = (
    field: AnyInternalFieldApi,
    validatorIndexes: Array<number>,
    sourceEvent: string,
  ) => {
    field._setMeta((prev) => {
      const previousGroupErrors = this._getFieldErrorMeta(prev)
      const clearedErrors = clearIndexedErrorsFromSource(
        previousGroupErrors.errors,
        previousGroupErrors.errorSourceEvents,
        validatorIndexes,
        sourceEvent,
      )

      if (!clearedErrors) return prev
      const groupErrors = new Map(prev._formGroupValidatorErrors)
      if (
        clearedErrors.errors.some(
          (validatorErrors) => validatorErrors.length > 0,
        )
      ) {
        groupErrors.set(this._errorOwner, clearedErrors)
      } else {
        groupErrors.delete(this._errorOwner)
      }
      return {
        ...prev,
        _formGroupValidatorErrors: groupErrors,
      }
    })
    field._pruneIfUnused()
  }

  _clearEventErrors = (
    field: AnyInternalFieldApi,
    sourceEvent: string,
    event: ConfigurableValidationTrigger,
  ) => {
    const validatorCount = this.options.validators?.length ?? 0
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
      const validator = this.options.validators?.[i]
      const runsOnEvent = validator?.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          event,
          formApi: this.form,
          fieldApi: field,
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

  _clearRoutedErrors = () => {
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

  validate = async (
    signal: ConfigurableValidationTrigger | 'submit' = 'submit',
    opts?: { triggerFieldApi?: AnyInternalFieldApi },
  ): Promise<Array<FormGroupValidateResult<TGroupValue>>> => {
    if (signal !== 'submit' && opts?.triggerFieldApi) {
      this._clearEventErrors(opts.triggerFieldApi, 'submit', signal)
      if (signal === 'blur') {
        this._clearEventErrors(opts.triggerFieldApi, 'mount', signal)
      }
    }

    const pipeline = this.options.validators
    if (!pipeline || pipeline.length === 0) {
      const fieldErrors = await this._runFieldValidations(signal)
      this._errors.set([])
      this._clearRoutedErrors()
      return fieldErrors
    }

    this._isValidating.set(true)
    try {
      const fieldErrorsPromise = this._runFieldValidations(signal)
      const results: {
        results: Array<PipelineResult<FormGroupValidateResult<TGroupValue>>>
      } = await runValidatorPipeline<FormGroupValidateResult<TGroupValue>>({
        pipeline: pipeline as ReadonlyArray<FormGroupValidator<any>>,
        cache: this._pipelineCache,
        context: {
          event: signal,
          formApi: this.form,
          fieldApi: opts?.triggerFieldApi ?? ({ value: this.value } as never),
        },
        hasFailedBefore: false,
        scope: 'form',
        getContext: (ctx) => ({
          event: ctx.event,
          formApi: this.form,
          groupApi: this,
          triggerFieldApi: opts?.triggerFieldApi,
          signal: ctx.signal,
          value: this.value,
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
      const fieldErrors = await fieldErrorsPromise
      const errors: Array<FormGroupValidateResult<TGroupValue>> = [
        ...groupErrors,
        ...fieldErrors,
      ]

      batch(() => {
        this._errors.set(groupErrors)
      })

      return errors
    } finally {
      this._isValidating.set(false)
    }
  }

  handleSubmit = async (): Promise<
    Array<FormGroupValidateResult<TGroupValue>>
  > => {
    this._submissionAttempts.set((attempts) => attempts + 1)
    this._isSubmitting.set(true)
    this._isSubmitSuccessful.set(false)

    try {
      const errors: Array<FormGroupValidateResult<TGroupValue>> =
        await this.validate('submit')
      const context = {
        value: this.value,
        formApi: this.form,
        groupApi: this,
        schemaOutputs: this._schemaOutputs,
      } as never

      if (errors.length > 0 || this.state.isInvalid) {
        await this.options.onSubmitInvalid?.(Object.assign(context, { errors }))
        return errors
      }

      await this.options.onSubmit?.(context)
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
      setBy(prev, this.name, getBy(this.form.options.defaultValues, this.name)),
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

  _cleanup = () => {
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
