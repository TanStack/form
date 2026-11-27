import { batch, createAtom } from '@tanstack/store'
import { ValidatorInstance } from '../pipeline/validation/ValidatorInstance.lib'
import { ValidationRunTracker } from '../pipeline/runTracker.lib'
import { concatenateFieldNames, getBy, setBy } from '../utils.lib'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import { startGroupValidation } from '../pipeline/validation/ownerValidation.lib'
import { transformFieldOptionsFieldNames } from '../FieldApi/fieldOptions.lib'
import {
  OnSubmitErrorSource,
  removeSourceErrors,
} from '../validation/errorStorage.lib'
import {
  applyRoutedValidationResult,
  pruneErrorTargets,
} from '../validation/routedErrors.lib'
import { visitFieldSubtree } from '../FieldApi/fieldTraversal.lib'
import { createGroupSubmissionHandler } from '../submissionHandler.lib'
import {
  createFormGroupStateAtom,
  getFormGroupStateOverrides,
} from './formGroupState.lib'
import type {
  FormValidationResult,
  FormattedValidationError,
} from '../validation/results/results.public'
import type { ValidationErrorSource } from '../validation/errorStorage.lib'
import type { ClientValidationRun } from '../pipeline/validation/clientValidation.lib'
import type { GroupValidationOptions } from '../pipeline/validation/ownerValidation.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
} from '../FieldApi/FieldApi.lib'
import type { DeepKeys, DeepValue } from '../deep-keys.public'
import type {
  ClientValidationTrigger,
  FormGroupValidators,
} from '../pipeline/validation/validation.public'
import type {
  ScopedErrorTypes,
  ToFormGroupErrorTypes,
} from '../validation/state.public'
import type {
  FormGroupApi,
  FormGroupOptions,
  FormGroupState,
} from './FormGroupApi.public'
import type { FormApi } from '../FormApi/FormApi.public'
import type { InternalFormApi } from '../FormApi/FormApi.lib'
import type { ValidatorInstances } from '../pipeline/validation/ValidatorInstance.lib'
import type { ReadonlyAtom } from '@tanstack/store'
import type { FormStateOverrides } from '../FormApi/formState.lib'
import type { PipelineResult } from '../pipeline/state.lib'
import type { ValidatorEvents } from '../pipeline/events.public'
import type { FormGroupSubmissionHandler } from '../submissionHandler.lib'
import type { SubmissionAttempt } from '../submissionAttempt.lib'

export type AnyInternalFormGroupApi = InternalFormGroupApi<
  any,
  any,
  any,
  any,
  any,
  any
>
export type InternalGroupValidatorInstance = ValidatorInstance<'group'>

export class InternalFormGroupApi<
  TFormData,
  TGroupName extends DeepKeys<TFormData>,
  TGroupValue extends DeepValue<TFormData, TGroupName>,
  const TGroupValidators extends FormGroupValidators<TGroupValue>,
  TFormError extends ScopedErrorTypes,
  TSubmitReturn,
> implements FormGroupApi<
  TFormData,
  TGroupName,
  TGroupValue,
  ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>,
  TFormError
> {
  readonly form: FormApi<TFormData, TFormError> & InternalFormApi<any>
  /** The trie node occupied by this form group. */
  _groupField: AnyInternalFieldApi
  _options: FormGroupOptions<
    TFormData,
    TGroupName,
    TGroupValue,
    TGroupValidators,
    TFormError,
    TSubmitReturn
  >
  /** Stable runtime instances correlated with `_options.validators` by slot. */
  _validatorInstances: ValidatorInstances<'group'> = null
  atom: ReadonlyAtom<
    FormGroupState<
      TGroupValue,
      ToFormGroupErrorTypes<TGroupValidators, TSubmitReturn>
    >
  >
  readonly _onSubmitSource = new OnSubmitErrorSource()

  get _isSubmitting() {
    return this._submissionHandler.atoms.isSubmitting
  }
  get _isSubmitSuccessful() {
    return this._submissionHandler.atoms.isSubmitSuccessful
  }
  get _submissionAttempts() {
    return this._submissionHandler.atoms.submissionAttempts
  }
  private readonly _validationRuns = new ValidationRunTracker()
  private readonly _submissionHandler: FormGroupSubmissionHandler<TGroupValue>

  _resetSubmissions(): void {
    this._submissionHandler.invalidate()
    pruneErrorTargets(removeSourceErrors(this._onSubmitSource))
  }
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
      TFormError,
      TSubmitReturn
    >,
  ) {
    this.form = options.form as never
    const resolvedOptions = resolveDefaultOptions(
      options,
      this.form._defaultOptions?.formGroup,
    )

    this._options = resolvedOptions
    this._submissionHandler = createGroupSubmissionHandler(this)
    this._groupField = this.form._getOrCreateFieldApi(
      { name: resolvedOptions.name },
      'internal',
    )
    this._groupField._setFormGroup(this)
    this._updateInstances()

    this.atom = createFormGroupStateAtom(this)
  }

  /** Attaches this group to the trie node at the given path. */
  _attachToFieldTrie(name: string): void {
    const groupField = this.form._getOrCreateFieldApi({ name }, 'internal')

    if (groupField !== this._groupField) {
      this._groupField._cancelValidation()
      this._groupField = groupField
      this._groupFieldVersion.set((version) => version + 1)
    }

    groupField._setFormGroup(this)
    if (this._submissionAttempts.get() > 0) {
      groupField._setMeta((meta) =>
        meta.isTouched ? meta : { ...meta, isTouched: true },
      )
    }
  }

  /** Cancels this group's validation runs. */
  _cancelOwnedValidation(): void {
    this._validationRuns.cancelAll()
  }

  update = (
    options: FormGroupOptions<
      TFormData,
      TGroupName,
      TGroupValue,
      TGroupValidators,
      TFormError,
      TSubmitReturn
    >,
  ) => {
    batch(() => {
      const previousOptions = this._options
      this._options = resolveDefaultOptions(
        options,
        this.form._defaultOptions?.formGroup,
      )
      this._updateInstances(previousOptions)
    })
  }

  _updateInstances(
    previousOptions?: Pick<
      FormGroupOptions<
        TFormData,
        TGroupName,
        TGroupValue,
        TGroupValidators,
        TFormError,
        TSubmitReturn
      >,
      'validators'
    >,
  ): void {
    if (
      (this._options.validators?.length ?? 0) <
      (this._validatorInstances?.length ?? 0)
    ) {
      this._groupField._cancelValidation()
    }
    this._validatorInstances = ValidatorInstance.update({
      definitions: this._options.validators,
      previousDefinitions:
        previousOptions && (previousOptions.validators ?? null),
      instances: this._validatorInstances,
      owner: this,
      scope: 'group',
      onBeforeDispose: (validatorInstance) =>
        this._removeValidatorInstance(validatorInstance),
    })
  }

  mount = (): void => {
    this._attachToFieldTrie(this.name)
    this._runGroupValidation('mount', { catchErrors: true })
  }

  _getScopedFormStateOverrides(): FormStateOverrides {
    return getFormGroupStateOverrides(this)
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

  _removeValidatorInstance(
    validatorInstance: InternalGroupValidatorInstance,
  ): void {
    pruneErrorTargets(removeSourceErrors(validatorInstance))
  }

  _processValidationResult(
    result: PipelineResult<InternalGroupValidatorInstance>,
    sourceEvent: ValidatorEvents,
  ): void {
    this._applyValidationResult({
      source: result.instance,
      result: result.value.result,
      sourceEvent,
    })
  }

  _applyValidationResult({
    source,
    result,
    sourceEvent,
    submission,
  }: {
    source: ValidationErrorSource
    result: FormValidationResult<TGroupValue>
    sourceEvent: ValidatorEvents
    submission?: SubmissionAttempt
  }): void {
    applyRoutedValidationResult({
      routingRoot: this._groupField,
      value: this.value,
      source,
      result,
      sourceEvent,
      submission,
    })
  }

  _visitGroupFields(visitor: (field: AnyInternalFieldApi) => void) {
    visitFieldSubtree(this._groupField, visitor)
  }

  _runGroupValidation(
    event: ClientValidationTrigger | 'mount',
    opts: GroupValidationOptions,
  ): ClientValidationRun<InternalGroupValidatorInstance> | undefined {
    return startGroupValidation(this, this._validationRuns, event, opts)
  }

  _clearRoutedErrors(): void {
    batch(() => {
      for (const source of this._validatorInstances ?? [])
        pruneErrorTargets(removeSourceErrors(source))
    })
  }

  validate = async (
    signal: ClientValidationTrigger,
    opts?: { triggerFieldApi?: AnyInternalFieldApi },
  ): Promise<Array<FormattedValidationError<TGroupValue>>> => {
    const run = this._runGroupValidation(signal, {
      ...opts,
      catchErrors: false,
    })
    await run?.pending
    return run?.collector.getErrors<TGroupValue>() ?? []
  }

  handleSubmit = (): Promise<Array<FormattedValidationError<TGroupValue>>> => {
    return this._submissionHandler.handleSubmit()
  }

  _setSubmissionAttempts(attempts: number): void {
    this._submissionHandler.setSubmissionAttempts(attempts)
  }

  reset = () => {
    // TODO(workplan): Cancel older work, restore group values/meta, then dispatch
    // reset listeners. Integrate with form/field reset and owner reconstruction;
    // group reset notification policy remains deferred.
    batch(() => {
      this._resetSubmissions()
      this._groupField._cancelValidation()
      const previousValue = this.value
      this.form._atoms.values.set((prev: TFormData) =>
        setBy(prev, this.name, getBy(this.form.defaultValues, this.name)),
      )
      if (!Object.is(previousValue, this.value)) {
        this.form._cancelFieldValidation(this.name)
      }
      batch(() => {
        this._visitGroupFields((field) => {
          field._cancelValidation()
          field._validatorInstances?.forEach((instance) =>
            instance.resetRuntime(),
          )
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
        this._setSubmissionAttempts(0)
        this._clearRoutedErrors()
      })
      this._validatorInstances?.forEach((instance) => instance.resetRuntime())
    })
  }

  _cleanup() {
    batch(() => {
      this._resetSubmissions()
      this._groupField._cancelValidation()
      this._clearRoutedErrors()
      this._validatorInstances?.forEach((instance) => {
        instance.resetRuntime()
      })
      this._groupField._setFormGroup(null)
    })
  }
}
