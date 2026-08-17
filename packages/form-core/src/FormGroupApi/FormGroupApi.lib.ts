import { batch, createAtom, shallow } from '@tanstack/store'
import { concatenateFieldNames, getBy, setBy } from '../utils.lib'
import {
  clearValidationSourceErrorsFromEvent,
  getValidationSourceErrors,
  isErrorResult,
  isValidationTriggerEnabled,
  parseValidationResult,
  reconcileRoutedFieldErrors,
  runGroupMountValidatorPipeline,
  runValidatorPipeline,
  setValidationSourceError,
} from '../validation'
import { transformFieldOptionsFieldNames } from '../FieldApi/FieldApi.lib'
import { visitFieldSubtree } from '../FieldApi/fieldTraversal.lib'
import {
  deriveFromBaseFieldMeta,
  hasFieldMetaErrors,
} from '../FieldApi/fieldState.lib'
import { parseStandardSchemaIssues } from '../standardSchema.lib'
import { createErrorMap } from '../validation.public'
import { reconcileValidatorInstances } from '../ValidatorInstance.lib'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import type { FormApi } from '../FormApi/FormApi.public'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
} from '../FieldApi/FieldApi.lib'
import type {
  DerivedMetaMarkers,
  InternalBaseFieldMeta,
  InternalFieldMeta,
} from '../FieldApi/fieldState.lib'
import type { FormStateOverrides } from '../FormApi/formState.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
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
import type {
  InternalValidatorInstance,
  InternalValidatorInstances,
} from '../ValidatorInstance.lib'

interface FormGroupValidationOutcome<TGroupValue> {
  errors: Array<FormGroupValidateResult<TGroupValue>>
  hasException: boolean
}

export type AnyInternalFormGroupApi = InternalFormGroupApi<
  any,
  any,
  any,
  any,
  any
>
export type InternalGroupValidatorInstance = InternalValidatorInstance<
  FormGroupValidator<any>,
  AnyInternalFormGroupApi,
  AnyInternalFieldApi
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
  /** Stable runtime instances correlated with `_options.validators` by slot. */
  _validatorInstances: InternalValidatorInstances<
    TGroupValidators[number],
    AnyInternalFormGroupApi,
    AnyInternalFieldApi
  >
  atom: ReadonlyAtom<
    FormGroupState<TGroupValue, ToFormGroupErrorTypes<TGroupValidators>>
  >
  _isSubmitting = createAtom(false)
  _isSubmitSuccessful = createAtom(false)
  _submissionAttempts = createAtom(0)
  /** Callbacks that remove validation-count increments made by this group. */
  _validationCountCleanups = new Set<() => void>()
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
    this.form = options.form as never
    const resolvedOptions = resolveDefaultOptions(
      options,
      this.form._defaultOptions?.formGroup,
    )

    this._options = resolvedOptions
    this._groupField = this.form._getOrCreateFieldApi(
      { name: resolvedOptions.name },
      'internal',
    )
    this._groupField._setFormGroup(this)
    this._validatorInstances = reconcileValidatorInstances<
      TGroupValidators[number],
      AnyInternalFormGroupApi,
      AnyInternalFieldApi
    >({
      definitions: this._options.validators,
      instances: null,
      owner: this,
      scope: 'group',
    })

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
        const groupErrorMeta = groupBaseMeta._validationSourceErrors
        let groupErrors: FormErrors<ToFormGroupErrorTypes<TGroupValidators>>

        if (
          prev &&
          previousGroupMeta?._validationSourceErrors === groupErrorMeta
        ) {
          groupErrors = prev.errors
        } else if (groupErrorMeta) {
          groupErrors = getValidationSourceErrors(
            groupErrorMeta,
            this._validatorInstances,
          ) as never
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
    const groupField = this.form._getOrCreateFieldApi({ name }, 'internal')

    if (groupField !== this._groupField) {
      this._groupField = groupField
      this._groupFieldVersion.set((version) => version + 1)
    }

    groupField._setFormGroup(this)
  }

  /** Adds a group-owned validation contribution to a field. */
  _startValidation(field = this._groupField): () => void {
    let isComplete = false

    field._setValidationCount((count) => count + 1)

    const finishValidation = () => {
      if (isComplete) return
      isComplete = true
      this._validationCountCleanups.delete(finishValidation)
      field._setValidationCount((count) => Math.max(0, count - 1))
    }

    this._validationCountCleanups.add(finishValidation)

    return finishValidation
  }

  /** Cancels group validation and clears its field-meta contributions. */
  _cancelValidation(): void {
    this._validatorInstances?.forEach((instance) => instance.cancelExecution())
    for (const finishValidation of Array.from(this._validationCountCleanups)) {
      finishValidation()
    }
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
    const previousValidators = this._options.validators
    this._options = resolveDefaultOptions(
      options,
      this.form._defaultOptions?.formGroup,
    )
    this._validatorInstances = reconcileValidatorInstances<
      TGroupValidators[number],
      AnyInternalFormGroupApi,
      AnyInternalFieldApi
    >({
      definitions: this._options.validators,
      previousDefinitions: previousValidators ?? null,
      instances: this._validatorInstances,
      owner: this,
      scope: 'group',
      onBeforeDispose: (validatorInstance) =>
        this._removeValidatorInstance(validatorInstance),
    })
  }

  mount = (): void => {
    this._attachToFieldTrie(this.name)

    const pipeline = this._validatorInstances?.filter(
      (validatorInstance) => !validatorInstance.didRunOnMount,
    )
    if (!pipeline || pipeline.length === 0) return

    pipeline.forEach((validatorInstance) =>
      validatorInstance.markMountValidationRan(),
    )

    const finishValidation = this._startValidation()

    const { didRun, asyncPromise } = runGroupMountValidatorPipeline({
      pipeline,
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

  _setFieldValidatorError(
    field: AnyInternalFieldApi,
    validatorInstance: InternalGroupValidatorInstance,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const nextErrors = setValidationSourceError(
        prev._validationSourceErrors,
        validatorInstance,
        errors,
        sourceEvent,
      )

      if (!nextErrors) return prev

      return {
        ...prev,
        _validationSourceErrors: nextErrors.errorMap,
      }
    })
  }

  _clearFieldValidatorError(
    field: AnyInternalFieldApi,
    validatorInstance: InternalGroupValidatorInstance,
  ) {
    this._setFieldValidatorError(field, validatorInstance, [], '')
    validatorInstance.deleteErrorTarget(field)
    field._pruneIfUnused()
  }

  /** Removes all group-owned field errors associated with a disposed validator. */
  _removeValidatorInstance(
    validatorInstance: InternalGroupValidatorInstance,
  ): void {
    const fields = Array.from(validatorInstance.errorTargets ?? [])
    batch(() => {
      for (const field of fields) {
        this._clearFieldValidatorError(field, validatorInstance)
      }
    })
  }

  _processValidationResult(
    result: {
      validatorInstance: InternalGroupValidatorInstance
      result: FormGroupValidateResult<TGroupValue>
      schemaResult: any | null
      hasSchemaResult?: boolean
    },
    sourceEvent: string,
  ) {
    const parsedResult = parseValidationResult(result.result)
    const groupField = this._groupField
    const oldFieldRefs = result.validatorInstance.errorTargets
      ? new Set(result.validatorInstance.errorTargets)
      : undefined
    oldFieldRefs?.delete(groupField)
    const resolvedFieldErrors = this.form._resolveRoutedFieldErrors(
      Object.entries(parsedResult.subfields ?? {}),
      groupField,
    )
    const groupFieldErrors = resolvedFieldErrors.get(groupField) ?? []
    resolvedFieldErrors.delete(groupField)

    batch(() => {
      this._setFieldValidatorError(
        groupField,
        result.validatorInstance,
        (parsedResult.self ?? []).concat(groupFieldErrors),
        sourceEvent,
      )

      const { fieldRefs } = reconcileRoutedFieldErrors(
        result.validatorInstance,
        resolvedFieldErrors,
        oldFieldRefs,
        (field, instance, errors) =>
          this._setFieldValidatorError(
            field,
            instance as InternalGroupValidatorInstance,
            errors,
            sourceEvent,
          ),
        (field, instance) =>
          this._clearFieldValidatorError(
            field,
            instance as InternalGroupValidatorInstance,
          ),
      )

      if ((parsedResult.self?.length ?? 0) + groupFieldErrors.length > 0) {
        fieldRefs.add(groupField)
      }
      result.validatorInstance.errorTargets =
        fieldRefs.size > 0 ? fieldRefs : null
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
      fieldValidationPromises.push(
        field._runFieldValidation(signal, {
          _startValidation: () => this._startValidation(field),
        }),
      )
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
    validatorInstance: InternalGroupValidatorInstance,
    sourceEvent: string,
  ): boolean {
    return (
      field._getBaseMeta()._validationSourceErrors?.get(validatorInstance)
        ?.sourceEvent === sourceEvent
    )
  }

  _clearFieldEventErrors(
    field: AnyInternalFieldApi,
    validatorInstances: Array<InternalGroupValidatorInstance>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const clearedErrors = clearValidationSourceErrorsFromEvent(
        prev._validationSourceErrors,
        validatorInstances,
        sourceEvent,
      )

      if (!clearedErrors) return prev

      return {
        ...prev,
        _validationSourceErrors: clearedErrors.errorMap,
      }
    })
    field._pruneIfUnused()
  }

  _clearEventErrors(
    field: AnyInternalFieldApi,
    sourceEvent: string,
    event: ConfigurableValidationTrigger,
  ) {
    const groupField = this._groupField
    const validatorInstancesToClear: Array<InternalGroupValidatorInstance> = []

    for (const validatorInstance of this._validatorInstances ?? []) {
      const runsOnEvent = validatorInstance.definition.triggers.some(
        (trigger) =>
          isValidationTriggerEnabled(trigger, {
            scope: 'group',
            event,
            formApi: this.form,
            groupApi: this,
            triggerFieldApi: field,
          }),
      )

      if (!runsOnEvent) {
        validatorInstancesToClear.push(validatorInstance)
      }
    }

    if (validatorInstancesToClear.length === 0) return

    batch(() => {
      const groupInstances = validatorInstancesToClear.filter(
        (validatorInstance) =>
          this._hasFieldEventError(groupField, validatorInstance, sourceEvent),
      )
      this._clearFieldEventErrors(groupField, groupInstances, sourceEvent)
      groupInstances.forEach((validatorInstance) =>
        validatorInstance.deleteErrorTarget(groupField),
      )

      const instancesToClearFromField: Array<InternalGroupValidatorInstance> =
        []
      for (const validatorInstance of validatorInstancesToClear) {
        if (
          validatorInstance.errorTargets?.has(field) &&
          this._hasFieldEventError(field, validatorInstance, sourceEvent)
        ) {
          validatorInstance.deleteErrorTarget(field)
          instancesToClearFromField.push(validatorInstance)
        }
      }

      if (instancesToClearFromField.length > 0) {
        this._clearFieldEventErrors(
          field,
          instancesToClearFromField,
          sourceEvent,
        )
      }
    })
  }

  _clearRoutedErrors() {
    const validatorInstances = this._validatorInstances ?? []
    if (validatorInstances.length === 0) return

    const fields = new Set<AnyInternalFieldApi>()
    fields.add(this._groupField)
    for (const validatorInstance of validatorInstances) {
      for (const field of validatorInstance.errorTargets ?? []) {
        fields.add(field)
      }
      validatorInstance.errorTargets = null
    }

    for (const field of fields) {
      field._setMeta((prev) => {
        const previousErrors = prev._validationSourceErrors
        if (!previousErrors) return prev

        let nextErrors: typeof previousErrors | null = null
        for (const validatorInstance of validatorInstances) {
          if (!previousErrors.has(validatorInstance)) continue

          nextErrors ??= new Map(previousErrors)
          nextErrors.delete(validatorInstance)
        }
        if (!nextErrors) return prev

        return {
          ...prev,
          _validationSourceErrors: nextErrors.size > 0 ? nextErrors : null,
        }
      })
      field._pruneIfUnused()
    }
  }

  _removeRoutedErrorFields(fieldsToRemove: ReadonlySet<AnyInternalFieldApi>) {
    for (const validatorInstance of this._validatorInstances ?? []) {
      for (const field of fieldsToRemove) {
        validatorInstance.deleteErrorTarget(field)
      }
    }
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

    const pipeline = this._validatorInstances
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
        pipeline,
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
        schemaOutputs: Array.from(
          this._validatorInstances ?? [],
          (validatorInstance) => validatorInstance.schemaOutput,
        ),
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
    this._validatorInstances?.forEach((instance) => instance.resetRuntime())
  }

  _cleanup() {
    this._cancelValidation()
    batch(() => {
      this._isSubmitting.set(false)
      this._isSubmitSuccessful.set(false)
      this._clearRoutedErrors()
    })
    this._validatorInstances?.forEach((instance) => {
      instance.resetRuntime()
      instance.resetMountValidation()
    })
    this._groupField._setFormGroup(null)
  }
}
