import { batch, createAtom, shallow } from '@tanstack/store'
import {
  cancelPipelineCache,
  concatenateFieldNames,
  createPipelineCache,
} from '../utils.lib'
import {
  clearIndexedErrorsFromSource,
  isAggregateError,
  isErrorResult,
  isValidationTriggerEnabled,
  normalizeValidationError,
  runValidatorPipeline,
  setIndexedError,
} from '../validation.lib'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type {
  AnyInternalFieldApi,
  InternalBaseFieldMeta,
} from '../FieldApi/FieldApi.lib'
import type { PipelineCache } from '../utils.lib'
import type {
  FormValidators,
  ValidationErrorInput,
  ValidationIssue,
  ValidationTrigger,
  ValidationTriggerOption,
} from '../validation.public'
import type { PipelineResult } from '../validation.lib'
import type { ReadonlyAtom } from '@tanstack/store'
import type {
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
  FormGroupValidateResult,
  FormGroupValidationError,
  FormGroupValidators,
} from './FormGroupApi.public'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type { InternalFormGroupRuntime } from './FormGroupApi.runtime'

export type AnyInternalFormGroupApi = InternalFormGroupApi
export type AnyFormGroupOptions = FormGroupOptions<any, any, any, any, any, any>
type FormGroupInternalMembers = Omit<
  InternalFormGroupApi,
  keyof FormGroupApi<any, any, any, any, any, any>
>

interface FormGroupValidatorPipelineArgs {
  pipeline: ReadonlyArray<FormGroupValidators<any, any, any>[number]>
  context: {
    event: ValidationTrigger
    formApi: InternalFormApi<any, any, any>
    groupApi: InternalFormGroupApi
    triggerFieldApi?: AnyInternalFieldApi
  }
  groupApi: InternalFormGroupApi
}

function runFormGroupValidatorPipeline({
  pipeline,
  context,
  groupApi,
}: FormGroupValidatorPipelineArgs) {
  return runValidatorPipeline<FormGroupValidateResult<any>>({
    pipeline,
    context,
    cache: groupApi._pipelineCache,
    hasFailedBefore: false,
    getContext: (ctx) => ({
      event: ctx.event,
      triggerFieldApi:
        'triggerFieldApi' in ctx ? ctx.triggerFieldApi : undefined,
      formApi: ctx.formApi,
      signal: ctx.signal,
      groupApi,
      value: groupApi._getValue(),
    }),
    scope: 'form',
  })
}

interface GroupSubmissionMeta {
  isSubmitting: boolean
  isSubmitSuccessful: boolean
  submissionAttempts: number
}

function createInitialSubmissionMeta(): GroupSubmissionMeta {
  return {
    isSubmitting: false,
    isSubmitSuccessful: false,
    submissionAttempts: 0,
  }
}

export class InternalFormGroupApi
  implements
    FormGroupApi<any, any, any, any, any, any>,
    InternalFormGroupRuntime
{
  form: InternalFormApi<any, any, any>
  _options: AnyFormGroupOptions
  _field: AnyInternalFieldApi
  _pipelineCache: PipelineCache<any>
  _schemaOutputs: Array<unknown> = []
  _submissionMeta = createAtom(createInitialSubmissionMeta())
  _errorFields: Array<Set<AnyInternalFieldApi>> = []
  _registrationCount = 0
  _handleSubmitPromise: Promise<Array<FormGroupValidationError<any>>> | null =
    null
  store: ReadonlyAtom<FormGroupState<any, any, any, any, any>>

  constructor(
    form: InternalFormApi<any, any, any>,
    options: AnyFormGroupOptions,
  ) {
    this.form = form
    this._options = options
    this._field = form._getOrCreateFieldApi({
      name: options.name,
      listeners: options.listeners,
    })
    this._pipelineCache = createPipelineCache()
    this.store = createAtom(
      () => {
        const fieldState = this._ensureField().store.get()
        const submission = this._submissionMeta.get()
        return {
          values: fieldState.value,
          meta: fieldState.meta,
          errors: fieldState.meta.errors,
          isValid: fieldState.meta.isValid,
          isInvalid: fieldState.meta.isInvalid,
          canSubmit:
            !submission.isSubmitting && fieldState.meta.original.isValid,
          isSubmitting: submission.isSubmitting,
          isSubmitSuccessful: submission.isSubmitSuccessful,
          submissionAttempts: submission.submissionAttempts,
        }
      },
      { compare: shallow },
    )
  }

  get name(): any {
    return this._ensureField().name
  }

  get options(): AnyFormGroupOptions {
    return this._options
  }

  _getValue(): any {
    return this._ensureField().value
  }

  get state() {
    return this.store.get()
  }

  get meta() {
    return this.state.meta
  }

  get errors() {
    return this.state.errors
  }

  get _submissionAttempts(): number {
    return this._submissionMeta.get().submissionAttempts
  }

  get _isSubmitting(): boolean {
    return this._submissionMeta.get().isSubmitting
  }

  get _isSubmitSuccessful(): boolean {
    return this._submissionMeta.get().isSubmitSuccessful
  }

  _ensureField(): AnyInternalFieldApi {
    if (this._field._isKilled) {
      this._field = this.form._getOrCreateFieldApi({
        name: this._options.name,
        listeners: this._options.listeners,
      })
      if (this._registrationCount > 0) {
        this._field._registerFormGroup(this)
        this._field._register()
      }
    }
    return this._field
  }

  _update(options: AnyFormGroupOptions): void {
    this._options = options
    this._ensureField()._update({ listeners: options.listeners })
  }

  _register(): () => void {
    if (this._registrationCount === 0) {
      this._field = this.form._getOrCreateFieldApi({
        name: this._options.name,
        listeners: this._options.listeners,
      })
      const field = this._field
      field._registerFormGroup(this)
      field._register()
    }
    this._registrationCount++
    return () => this._unregister()
  }

  _unregister(): void {
    this._registrationCount = Math.max(0, this._registrationCount - 1)
    if (this._registrationCount === 0 && !this._field._isKilled) {
      this._field._unregisterFormGroup(this)
      this._field._unregister()
    }
  }

  _reset(): void {
    cancelPipelineCache(this._pipelineCache)
    this._pipelineCache = createPipelineCache()
    this._schemaOutputs = []
    this._clearErrors()
    this._submissionMeta.set(createInitialSubmissionMeta())
    this._handleSubmitPromise = null
  }

  _fullFieldName(relativeName: string): string {
    return concatenateFieldNames(this.name, relativeName)
  }

  getFieldValue = (fieldName: string): any => {
    return this.form.getFieldValue(this._fullFieldName(fieldName))
  }

  setFieldValue = (fieldName: string, value: any, options?: any): void => {
    this.form.setFieldValue(this._fullFieldName(fieldName), value, options)
  }

  pushFieldValue = (
    arrayFieldName: string,
    value: any,
    options?: any,
  ): void => {
    this.form.pushFieldValue(
      this._fullFieldName(arrayFieldName),
      value,
      options,
    )
  }

  insertFieldValue = (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: any,
  ): void => {
    this.form.insertFieldValue(
      this._fullFieldName(arrayFieldName),
      index,
      value,
      options,
    )
  }

  removeFieldValue = (
    arrayFieldName: string,
    index: number,
    options?: any,
  ): void => {
    this.form.removeFieldValue(
      this._fullFieldName(arrayFieldName),
      index,
      options,
    )
  }

  swapFieldValues = (
    arrayFieldName: string,
    indexA: number,
    indexB: number,
    options?: any,
  ): void => {
    this.form.swapFieldValues(
      this._fullFieldName(arrayFieldName),
      indexA,
      indexB,
      options,
    )
  }

  clearFieldValues = (arrayFieldName: string, options?: any): void => {
    this.form.clearFieldValues(this._fullFieldName(arrayFieldName), options)
  }

  filterFieldValues = (
    arrayFieldName: string,
    predicate: (value: any, index: number, array: any) => boolean,
    options?: any,
  ): void => {
    this.form.filterFieldValues(
      this._fullFieldName(arrayFieldName),
      predicate,
      options,
    )
  }

  resetField = (fieldName: string): void => {
    this.form.resetField(this._fullFieldName(fieldName))
  }

  _setOwnedErrors(
    field: AnyInternalFieldApi,
    validatorIndex: number,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const nextErrors = setIndexedError(
        prev._formGroupErrors,
        prev._formGroupErrorSourceEvents,
        validatorIndex,
        errors,
        sourceEvent,
      )
      if (!nextErrors) return prev

      return {
        ...prev,
        _formGroupErrors: nextErrors.errors,
        _formGroupErrorSourceEvents: nextErrors.errorSourceEvents,
      } satisfies InternalBaseFieldMeta
    })
    field._pruneIfUnused()
  }

  _replaceErrors(
    validatorIndex: number,
    nextErrors: Map<AnyInternalFieldApi, Array<ValidationIssue>>,
    sourceEvent: string,
  ) {
    const oldFields = this._errorFields[validatorIndex] ?? new Set()

    batch(() => {
      for (const oldField of oldFields) {
        if (!nextErrors.has(oldField) && !oldField._isKilled) {
          this._setOwnedErrors(oldField, validatorIndex, [], '')
        }
      }

      for (const [field, errors] of nextErrors) {
        this._setOwnedErrors(field, validatorIndex, errors, sourceEvent)
      }
    })
    this._errorFields[validatorIndex] = new Set(nextErrors.keys())
  }

  _clearErrors(): void {
    batch(() => {
      this._errorFields.forEach((fields, validatorIndex) => {
        for (const field of fields) {
          if (!field._isKilled) {
            this._setOwnedErrors(field, validatorIndex, [], '')
          }
        }
      })
    })
    this._errorFields = []
  }

  _clearEventErrors(
    event: Exclude<ValidationTrigger, 'submit'>,
    triggerFieldApi: AnyInternalFieldApi,
    sourceEvent: string,
  ): void {
    const validators = this._options.validators
    if (!validators || validators.length === 0) return

    const indexesToClear: Array<number> = []
    for (let i = 0; i < validators.length; i++) {
      const runsOnEvent = validators[i]!.triggers.some(
        (trigger: ValidationTriggerOption<any, any>) =>
          isValidationTriggerEnabled(trigger, {
            event,
            formApi: this.form,
            triggerFieldApi,
          }),
      )
      if (!runsOnEvent) indexesToClear.push(i)
    }
    if (indexesToClear.length === 0) return

    const fieldsToClear = new Set([this._ensureField(), triggerFieldApi])
    batch(() => {
      for (const field of fieldsToClear) {
        field._setMeta((prev) => {
          const clearedErrors = clearIndexedErrorsFromSource(
            prev._formGroupErrors,
            prev._formGroupErrorSourceEvents,
            indexesToClear,
            sourceEvent,
          )
          if (!clearedErrors) return prev

          return {
            ...prev,
            _formGroupErrors: clearedErrors.errors,
            _formGroupErrorSourceEvents: clearedErrors.errorSourceEvents,
          } satisfies InternalBaseFieldMeta
        })
        field._pruneIfUnused()
      }
    })
  }

  _processValidationResults(
    results: Array<PipelineResult<FormGroupValidateResult<any>>>,
    sourceEvent: string,
  ): void {
    for (const result of results) {
      const routed = new Map<AnyInternalFieldApi, Array<ValidationIssue>>()
      const add = (
        field: AnyInternalFieldApi,
        errors: Array<ValidationIssue>,
      ) => {
        routed.set(field, (routed.get(field) ?? []).concat(errors))
      }

      if (result.hasSchemaResult) {
        this._schemaOutputs[result.validatorIndex] = result.schemaResult
      }

      const aggregate = isAggregateError(result.result)
      if (!aggregate) {
        if (isErrorResult(result.result)) {
          add(
            this._ensureField(),
            normalizeValidationError(result.result as ValidationErrorInput),
          )
        }
      } else {
        if (aggregate.formError) {
          add(
            this._ensureField(),
            normalizeValidationError(aggregate.formError),
          )
        }

        for (const [relativeName, error] of Object.entries(
          aggregate.fieldErrors,
        )) {
          const fullName = this._fullFieldName(relativeName)
          const resolvedName = this.form._resolveErrorFieldPath(fullName)
          const field = this.form._getOrCreateFieldApi({ name: resolvedName })
          add(field, normalizeValidationError(error))
        }
      }

      this._replaceErrors(result.validatorIndex, routed, sourceEvent)
    }
  }

  async _validate(
    event: Exclude<ValidationTrigger, 'submit'>,
    triggerFieldApi?: AnyInternalFieldApi,
  ): Promise<Array<FormGroupValidationError<any>>> {
    const validators = this._options.validators
    if (!validators || validators.length === 0) {
      this._clearErrors()
      return []
    }

    const field = this._ensureField()
    field._setValidationCount((count) => count + 1)
    try {
      const result = await runFormGroupValidatorPipeline({
        pipeline: validators,
        groupApi: this,
        context: {
          event,
          formApi: this.form,
          groupApi: this,
          triggerFieldApi,
        },
      })
      this._processValidationResults(result.results, event)
      return result.results
        .map(({ result: validationResult }) => validationResult)
        .filter(isErrorResult)
    } finally {
      field._setValidationCount((count) => Math.max(0, count - 1))
    }
  }

  _touchSubtreeAndCollectValidators(): Array<AnyInternalFieldApi> {
    const validators: Array<AnyInternalFieldApi> = []
    const stack = [this._ensureField()]

    while (stack.length > 0) {
      const field = stack.pop()!
      field._notifyEvent(
        {
          causeValidation: false,
          markAsBlurred: false,
          markAsDirty: false,
          markAsTouched: true,
          doPropagate: false,
        },
        'submit',
      )
      stack.push(...field._children)
      if (field._validators && field._validators.length > 0) {
        validators.push(field)
      }
    }
    return validators
  }

  async _runSubmit(): Promise<Array<FormGroupValidationError<any>>> {
    const submitResetVersion = this.form._atoms.resetVersion.get()
    const hasResetDuringSubmit = () =>
      this.form._atoms.resetVersion.get() !== submitResetVersion

    this._submissionMeta.set((prev) => ({
      ...prev,
      submissionAttempts: prev.submissionAttempts + 1,
      isSubmitting: true,
    }))

    const fieldErrors: Array<FormGroupValidationError<any>> = []
    let failed = false
    const fields = this._touchSubtreeAndCollectValidators()
    const fieldResults = await Promise.all(
      fields.map((field) =>
        field._runFieldValidation('submit', { onResult: false }),
      ),
    )
    if (hasResetDuringSubmit()) return []

    batch(() => {
      fieldResults.forEach((result, index) => {
        if (result.thrownError !== null) failed = true
        for (const validationResult of result.results) {
          if (isErrorResult(validationResult.result)) {
            failed = true
            fieldErrors.push(validationResult.result)
          }
          fields[index]!._processValidationResult(validationResult, 'submit')
        }
      })
    })

    const groupErrors: Array<FormGroupValidationError<any>> = []
    const validators = this._options.validators
    if (validators && validators.length > 0) {
      const field = this._ensureField()
      field._setValidationCount((count) => count + 1)
      try {
        const result = await runFormGroupValidatorPipeline({
          pipeline: validators,
          groupApi: this,
          context: {
            event: 'submit',
            formApi: this.form,
            groupApi: this,
            triggerFieldApi: undefined,
          },
        })
        if (hasResetDuringSubmit()) return []
        if (result.thrownError !== null || result.hasErrors) failed = true
        this._processValidationResults(result.results, 'submit')
        groupErrors.push(
          ...result.results
            .map(({ result: validationResult }) => validationResult)
            .filter(isErrorResult),
        )
      } finally {
        field._setValidationCount((count) => Math.max(0, count - 1))
      }
    } else {
      this._clearErrors()
    }

    const errors = fieldErrors.concat(groupErrors)
    const callbackContext = {
      value: this._getValue(),
      groupApi: this as never,
      formApi: this.form as never,
      schemaOutputs: this._schemaOutputs.slice(),
    }

    if (failed) {
      await this._options.onGroupSubmitInvalid?.({
        ...callbackContext,
        errors,
      })
    } else {
      try {
        await this._options.onGroupSubmit?.(callbackContext)
      } catch (error) {
        console.error(error)
        failed = true
      }
    }
    if (hasResetDuringSubmit()) return []

    this._submissionMeta.set((prev) => ({
      ...prev,
      isSubmitting: false,
      isSubmitSuccessful: !failed,
    }))
    return errors
  }

  handleSubmit = (): Promise<Array<FormGroupValidationError<any>>> => {
    if (this._handleSubmitPromise) return this._handleSubmitPromise
    const promise = this._runSubmit().finally(() => {
      if (this._handleSubmitPromise === promise) {
        this._handleSubmitPromise = null
      }
    })
    this._handleSubmitPromise = promise
    return promise
  }
}

export function createFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  TGroupValidators extends FormGroupValidators<
    TFormData,
    TGroupName,
    TGroupValue
  >,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
>(
  form: InternalFormApi<TFormData, TFormValidators, TSubmitReturn>,
  options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormValidators,
    TSubmitReturn
  >,
): FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  TGroupValidators,
  TFormValidators,
  TSubmitReturn
> &
  FormGroupInternalMembers {
  if (!form._formGroups) {
    form._formGroups = new Map()
  }
  const formGroups = form._formGroups

  const existing = formGroups.get(options.name)

  if (existing) {
    const group = existing as InternalFormGroupApi
    group._update(options as AnyFormGroupOptions)
    return group as never
  }

  const group = new InternalFormGroupApi(form, options as AnyFormGroupOptions)
  formGroups.set(options.name, group)
  return group as never
}
