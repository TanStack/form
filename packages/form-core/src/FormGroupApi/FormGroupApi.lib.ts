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
  replaceSourceErrors,
} from '../validation/errorStorage.lib'
import {
  getValidationErrors,
  parseValidationResult,
} from '../validation/results/errors.lib'
import {
  collectFieldSubtree,
  visitFieldSubtree,
} from '../FieldApi/fieldTraversal.lib'
import {
  createFormGroupStateAtom,
  getFormGroupStateOverrides,
} from './formGroupState.lib'
import { handleFormGroupSubmit } from './handleSubmit.lib'
import type { FormGroupValidationOutcome } from './handleSubmit.lib'
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
  InternalFieldValidatorInstance,
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
  _isSubmitting = createAtom(false)
  _isSubmitSuccessful = createAtom(false)
  _submissionAttempts = createAtom(0)
  private readonly _validationRuns = new ValidationRunTracker()
  private readonly _submissions = new Set<
    SubmissionAttempt<FormattedValidationError<TGroupValue>>
  >()

  _resetSubmissions(): void {
    const submissions = Array.from(this._submissions)
    this._submissions.clear()
    for (const submission of submissions) submission.invalidate()
    this._isSubmitting.set(false)
    this._isSubmitSuccessful.set(false)
    this.form._pruneErrorTargets(removeSourceErrors(this._onSubmitSource))
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
  }

  /** Cancels this group's runs and the exact field runs it started. */
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
    this.form._pruneErrorTargets(removeSourceErrors(validatorInstance))
  }

  _processValidationResult(
    result: PipelineResult<InternalGroupValidatorInstance>,
    sourceEvent: ValidatorEvents,
  ): void {
    this._applyValidationResult(
      result.instance,
      result.value.result,
      sourceEvent,
    )
  }

  _applyValidationResult(
    source: ValidationErrorSource,
    result: FormValidationResult<TGroupValue>,
    sourceEvent: ValidatorEvents,
  ): void {
    const parsed = parseValidationResult(result)
    const resolved = this.form._resolveRoutedFieldErrors(
      Object.entries(parsed.subfields ?? {}),
      this._groupField,
    )
    this.form._pruneErrorTargets(
      replaceSourceErrors(source, sourceEvent, [
        [this._groupField, parsed.self ?? []],
        ...resolved,
      ]),
    )
  }

  _visitGroupFields(visitor: (field: AnyInternalFieldApi) => void) {
    visitFieldSubtree(this._groupField, visitor)
  }

  async _runFieldValidations(
    event: ClientValidationTrigger,
    isCancelled: () => boolean,
    submission?: SubmissionAttempt,
  ): Promise<Array<FormattedValidationError<TGroupValue>>> {
    const pending: Array<
      Promise<ClientValidationRun<InternalFieldValidatorInstance> | undefined>
    > = []
    const fields = submission
      ? submission.fields.keys()
      : collectFieldSubtree(this._groupField)
    for (const field of fields) {
      if (isCancelled()) break
      // An async boundary records synchronous start failures without preventing
      // the other fields from starting or escaping sibling settlement.
      pending.push(
        (async () => {
          const run = field._runFieldValidation(event, {
            catchErrors: false,
            onRegister: this._validationRuns.register,
            submission,
          })
          await run?.pending
          return run
        })(),
      )
    }
    const outcomes = await Promise.allSettled(pending)
    return outcomes.flatMap((outcome) => {
      if (outcome.status === 'rejected') throw outcome.reason
      return (
        outcome.value?.collector
          .getResults()
          .flatMap(({ value }) =>
            getValidationErrors<TGroupValue>(value.result),
          ) ?? []
      )
    })
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
        this.form._pruneErrorTargets(removeSourceErrors(source))
    })
  }

  _validate = async (
    event: ClientValidationTrigger,
    opts?: {
      triggerFieldApi?: AnyInternalFieldApi
      submission?: SubmissionAttempt
    },
  ): Promise<FormGroupValidationOutcome<TGroupValue>> => {
    const operation = { cancelled: false }
    const release = opts?.submission
      ? () => {}
      : this._validationRuns.register({
          cancel: () => {
            operation.cancelled = true
          },
        })
    try {
      const fieldOutcome = this._runFieldValidations(
        event,
        () => operation.cancelled || opts?.submission?.isActive() === false,
        opts?.submission,
      )
      const groupOutcome = (async () => {
        if (operation.cancelled || opts?.submission?.isActive() === false)
          return null
        const run = this._runGroupValidation(event, {
          ...opts,
          catchErrors: false,
          upstreamInvalid:
            event === 'submit'
              ? // The field outcome propagates its own exception after all siblings
                // settle. Block dependent validators without cancelling group work.
                fieldOutcome.then(
                  (errors) => errors.length > 0,
                  () => true,
                )
              : undefined,
        })
        await run?.pending
        return run
      })()
      const [fields, group] = await Promise.allSettled([
        fieldOutcome,
        groupOutcome,
      ])
      if (opts?.submission?.isActive() === false)
        return { errors: [], run: null }
      if (fields.status === 'rejected') throw fields.reason
      if (group.status === 'rejected') throw group.reason
      return {
        errors: [
          ...(group.value?.collector
            .getResults()
            .flatMap(({ value }) =>
              getValidationErrors<TGroupValue>(value.result),
            ) ?? []),
          ...fields.value,
        ],
        run: group.value ?? null,
      }
    } finally {
      release()
    }
  }

  validate = async (
    signal: ClientValidationTrigger,
    opts?: { triggerFieldApi?: AnyInternalFieldApi },
  ): Promise<Array<FormattedValidationError<TGroupValue>>> => {
    return (await this._validate(signal, opts)).errors
  }

  handleSubmit = (): Promise<Array<FormattedValidationError<TGroupValue>>> => {
    return handleFormGroupSubmit(this, this._submissions)
  }

  reset = () => {
    // TODO(workplan): Cancel older work, restore group values/meta, then dispatch
    // reset listeners. Integrate with form/field reset and owner reconstruction;
    // group reset notification policy remains deferred.
    batch(() => {
      this._resetSubmissions()
      this._groupField._cancelValidation()
      const previousValues = new Map<AnyInternalFieldApi, unknown>()
      this._visitGroupFields((field) => previousValues.set(field, field.value))
      this.form._atoms.values.set((prev: TFormData) =>
        setBy(prev, this.name, getBy(this.form.defaultValues, this.name)),
      )
      if (!Object.is(previousValues.get(this._groupField), this.value)) {
        this.form._cancelFieldValidation(this.name)
      }
      batch(() => {
        this._visitGroupFields((field) => {
          if (!Object.is(previousValues.get(field), field.value)) {
            field._cancelValidation()
          }
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
    })
  }

  _cleanup() {
    batch(() => {
      this._resetSubmissions()
      this._groupField._cancelValidation()
      batch(() => {
        this._isSubmitting.set(false)
        this._isSubmitSuccessful.set(false)
        this._clearRoutedErrors()
      })
      this._validatorInstances?.forEach((instance) => {
        instance.resetRuntime()
      })
      this._groupField._setFormGroup(null)
    })
  }
}
