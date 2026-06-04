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
  isAggregateError,
  isErrorResult,
  normalizeValidationError,
  runValidatorPipeline,
  setIndexedError,
} from '../validation.lib'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type { AnyInternalFieldApi } from '../FieldApi/FieldApi.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { PipelineCache } from '../utils.lib'
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
  FormValidators,
  ValidationIssue,
} from '../validation.public'
import type { ReadonlyAtom } from '@tanstack/store'

let groupId = 0
const GROUP_VALIDATOR_INDEX_STRIDE = 1000

function flattenGroupErrors<TGroupValue>(
  results: Array<FormGroupValidateResult<TGroupValue>>,
): Array<ValidationIssue> {
  return results.flatMap((result) => {
    const aggregate = isAggregateError(result)
    if (aggregate) {
      return aggregate.formError
        ? normalizeValidationError(aggregate.formError)
        : []
    }
    return isErrorResult(result) ? normalizeValidationError(result as any) : []
  })
}

export class InternalFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> implements FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators,
  TFormValidators,
  TSubmitReturn
> {
  readonly form: InternalFormApi<TFormData, TFormValidators, TSubmitReturn>
  readonly name: TGroupName
  options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >
  store: ReadonlyAtom<FormGroupState<TFormData, TGroupName, TGroupValue>>
  _pipelineCache: PipelineCache<FormGroupValidateResult<TGroupValue>>
  _schemaOutputs: Array<any> = []
  _sourceEvent: string
  _fieldErrorIndexStart: number
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
      TGroupValidators,
      TFormValidators,
      TSubmitReturn
    >,
  ) {
    this.options = options
    this.form = options.form as InternalFormApi<
      TFormData,
      TFormValidators,
      TSubmitReturn
    >
    this.name = options.name
    this._pipelineCache = createPipelineCache()
    const id = groupId++
    this._sourceEvent = `form-group:${id}:submit`
    this._fieldErrorIndexStart =
      (this.form.options.validators?.length ?? 0) +
      id * GROUP_VALIDATOR_INDEX_STRIDE

    this.store = createAtom(() => this._getStateSnapshot(), {
      compare: shallow,
    })
    this.form._registerFormGroup(this as never)
  }

  update = (
    options: FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormValidators,
      TSubmitReturn
    >,
  ) => {
    this.options = options
  }

  _getStateSnapshot = (): FormGroupState<
    TFormData,
    TGroupName,
    TGroupValue
  > => {
    const errors = flattenGroupErrors(this._errors.get())
    const groupField = this.form._tryGetFieldApi(this.name)
    const hasFieldErrors = this._hasDescendantFieldErrors(groupField)
    const isInvalid = errors.length > 0 || hasFieldErrors

    return {
      values: this.value,
      meta: groupField?.meta,
      errors,
      isValid: !isInvalid,
      isInvalid,
      canSubmit: !this._isSubmitting.get() && !isInvalid,
      isSubmitting: this._isSubmitting.get(),
      isSubmitSuccessful: this._isSubmitSuccessful.get(),
      isValidating: this._isValidating.get(),
      submissionAttempts: this._submissionAttempts.get(),
    }
  }

  _hasDescendantFieldErrors = (field: AnyInternalFieldApi | null): boolean => {
    if (!field) return false
    if (field.meta.original.errors.length > 0) return true
    return field._children.some((child) =>
      this._hasDescendantFieldErrors(child),
    )
  }

  _getPrefixedFieldName = (fieldName: string): string => {
    return concatenateFieldNames(this.name, fieldName)
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
    if (!aggregate) return

    const validatorIndex = this._fieldErrorIndexStart + result.validatorIndex
    const nextFieldRefs = new Set<AnyInternalFieldApi>()

    for (const [fieldName, fieldError] of Object.entries(
      aggregate.fieldErrors,
    )) {
      const fullName = this._getPrefixedFieldName(fieldName)
      const field = this.form._getOrCreateFieldApi({ name: fullName })
      nextFieldRefs.add(field)
      field._setMeta((prev) => {
        const nextErrors = setIndexedError(
          prev._formValidatorErrors,
          prev._formValidatorErrorSourceEvents,
          validatorIndex,
          normalizeValidationError(fieldError),
          sourceEvent,
        )

        if (!nextErrors) return prev

        return {
          ...prev,
          _formValidatorErrors: nextErrors.errors,
          _formValidatorErrorSourceEvents: nextErrors.errorSourceEvents,
        }
      })
    }

    this._clearStaleFieldErrors(validatorIndex, sourceEvent, nextFieldRefs)
    this.form._atoms.meta.errorFields.set((prev) => {
      const next = new Set(prev)
      for (const field of nextFieldRefs) next.add(field)
      return next
    })
  }

  _clearStaleFieldErrors = (
    validatorIndex: number,
    sourceEvent: string,
    nextFieldRefs: Set<AnyInternalFieldApi>,
  ) => {
    this._visitGroupFields((field) => {
      if (nextFieldRefs.has(field)) return
      this._clearFieldErrorAtIndex(field, validatorIndex, sourceEvent)
    })
  }

  _clearFieldErrorAtIndex = (
    field: AnyInternalFieldApi,
    validatorIndex: number,
    sourceEvent: string,
  ) => {
    let changed = false as boolean
    field._setMeta((prev) => {
      const cleared = clearIndexedErrorsFromSource(
        prev._formValidatorErrors,
        prev._formValidatorErrorSourceEvents,
        [validatorIndex],
        sourceEvent,
      )

      if (!cleared) return prev
      changed = true
      return {
        ...prev,
        _formValidatorErrors: cleared.errors,
        _formValidatorErrorSourceEvents: cleared.errorSourceEvents,
      }
    })

    if (changed) {
      this.form._atoms.meta.errorFields.set((prev) => {
        const next = new Set(prev)
        next.delete(field)
        return next
      })
      field._pruneIfUnused()
    }
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

  _clearRoutedErrors = () => {
    this._visitGroupFields((field) => {
      field._setMeta((prev) => {
        const indexes = prev._formValidatorErrorSourceEvents
          .map((source, index) => (source === this._sourceEvent ? index : -1))
          .filter((index) => index !== -1)
        if (indexes.length === 0) return prev

        const cleared = clearIndexedErrorsFromSource(
          prev._formValidatorErrors,
          prev._formValidatorErrorSourceEvents,
          indexes,
          this._sourceEvent,
        )

        if (!cleared) return prev
        return {
          ...prev,
          _formValidatorErrors: cleared.errors,
          _formValidatorErrorSourceEvents: cleared.errorSourceEvents,
        }
      })
      field._pruneIfUnused()
    })
  }

  validate = async (
    signal: ConfigurableValidationTrigger | 'submit' = 'submit',
    opts?: { triggerFieldApi?: AnyInternalFieldApi },
  ) => {
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
      const results = await runValidatorPipeline<
        FormGroupValidateResult<TGroupValue>
      >({
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
          this._processValidationResult(result, this._sourceEvent)
        },
      })

      const groupErrors = results.results
        .map(({ result }) => result)
        .filter(isErrorResult)
      const fieldErrors = await fieldErrorsPromise
      const errors = [...groupErrors, ...fieldErrors]

      batch(() => {
        this._errors.set(groupErrors)
        if (groupErrors.length === 0) {
          this._clearRoutedErrors()
        }
      })

      return errors
    } finally {
      this._isValidating.set(false)
    }
  }

  handleSubmit = async () => {
    this._submissionAttempts.set((attempts) => attempts + 1)
    this._isSubmitting.set(true)
    this._isSubmitSuccessful.set(false)

    try {
      const errors = await this.validate('submit')
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
    this.form._atoms.values.set((prev) =>
      setBy(prev, this.name, getBy(this.form.options.defaultValues, this.name)),
    )
    batch(() => {
      this._errors.set([])
      this._isSubmitting.set(false)
      this._isSubmitSuccessful.set(false)
      this._isValidating.set(false)
      this._submissionAttempts.set(0)
      this._clearRoutedErrors()
    })
  }

  _cleanup = () => {
    this.form._unregisterFormGroup(this as never)
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
