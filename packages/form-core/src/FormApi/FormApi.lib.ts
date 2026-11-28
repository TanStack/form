import { batch } from '@tanstack/store'
import {
  callUpdater,
  evaluate,
  getBy,
  getTargetField,
  isNotNil,
  nameToFieldNodeSegments,
  resolveFieldUpdateOptions,
  setBy,
  uuid,
} from '../utils.lib'
import { devtools } from '../devtoolsBridge.lib'
import {
  collectFieldSubtree,
  getOrCreateFieldApi,
  tryGetFieldApi,
  visitAllFormFields,
  visitFieldAndAncestors,
} from '../FieldApi/fieldTraversal.lib'
import {
  InternalFieldApi,
  getDefaultValueCacheResult,
  shouldCacheDefaultValue,
} from '../FieldApi/FieldApi.lib'
import { ValidationRunTracker } from '../pipeline/runTracker.lib'
import { ListenerInstance } from '../pipeline/listeners/ListenerInstance.lib'
import { ValidatorInstance } from '../pipeline/validation/ValidatorInstance.lib'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import { startFormValidation } from '../pipeline/validation/ownerValidation.lib'
import {
  removeSourceErrors,
  validationSourceScopes,
} from '../validation/errorStorage.lib'
import {
  applyRoutedValidationResult,
  pruneErrorTargets,
} from '../validation/routedErrors.lib'
import { resetFieldMeta } from '../FieldApi/fieldState.lib'
import { runFormListenerPipeline } from '../pipeline/listeners/listeners.lib'
import { updateFormOptions } from './formOptions.lib'
import { initializeForm } from './initializeForm.lib'
import { ArrayMethods } from './array-methods.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type { InternalRootFieldApi } from '../FieldApi/RootFieldApi.lib'
import type { FieldWatchRegistry } from '../FieldApi/linked-fields.lib'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  DefaultValueCacheEntry,
  FieldOptionsScope,
} from '../FieldApi/FieldApi.lib'
import type {
  ClientSideEvents,
  ValidatorEvents,
} from '../pipeline/events.public'
import type { FormListenerTriggers } from '../pipeline/listeners/formListeners.public'
import type { FormOptionsOfType, InternalFormOptions } from './formOptions.lib'
import type { FormApi, FormResetOptions, FormState } from './FormApi.public'
import type { ScopedErrorTypes } from '../validation/state.public'
import type { DefaultOptions } from '../defaultOptions.public'
import type { ValidatorInstances } from '../pipeline/validation/ValidatorInstance.lib'
import type { ListenerInstances } from '../pipeline/listeners/ListenerInstance.lib'
import type { ServerFormState } from './formServerState.public'
import type { FormValidationResult } from '../validation/results/results.public'
import type { ClientValidationRun } from '../pipeline/validation/clientValidation.lib'
import type { FormValidationOptions } from '../pipeline/validation/ownerValidation.lib'
import type { InternalFieldMeta } from '../FieldApi/fieldState.lib'
import type { Updater } from '../types.public'
import type {
  FieldApiOverrideOptions,
  InternalFieldUpdateOptions,
  ResolvedInternalFieldUpdateOptions,
} from '../types.lib'
import type { DeepKeys } from '../deep-keys.public'
import type {
  OnSubmitErrorSource,
  ValidationErrorSource,
} from '../validation/errorStorage.lib'
import type { FormSubmissionHandler } from '../submissionHandler.lib'
import type { SubmissionAttempt } from '../submissionAttempt.lib'

export interface FormMetaAtoms {
  isDirty: Atom<boolean>
  /**
   * @private
   * Number of root fields that are touched or have a touched descendant.
   */
  touchedFieldCount: Atom<number>
  /**
   * @private
   * Root fields that have errors on themselves or their descendants.
   */
  errorFields: Atom<Set<AnyInternalFieldApi>>
  /**
   * @private
   * Number of root fields that are validating or have a validating descendant.
   */
  fieldValidationCount: Atom<number>
  validationCount: Atom<number>
  isSubmitting: ReadonlyAtom<boolean>
  isSubmitSuccessful: ReadonlyAtom<boolean>
  submissionAttempts: ReadonlyAtom<number>
}

export interface FormAtoms<in out TFormData> {
  values: Atom<TFormData>
  meta: FormMetaAtoms
  resetVersion: Atom<number>
  defaultValuesVersion: Atom<number>
}

export type AnyInternalFormApi = InternalFormApi<any>
export type InternalFormValidatorInstance = ValidatorInstance<'form'>

function notifyDevtoolsFieldValueUpdate(
  field: AnyInternalFieldApi | null | undefined,
): void {
  const updateField = devtools().updateField
  if (!field || !updateField) return

  visitFieldAndAncestors(field, (current) => updateField(current))
}

export class InternalFormApi<TFormData> implements FormApi<
  TFormData,
  ScopedErrorTypes<any, any>
> {
  readonly _watchingListenerFields: FieldWatchRegistry = new Map()
  readonly _watchingValidatorFields: FieldWatchRegistry = new Map()
  /**
   * Devtools use this to show what version of the library is being used.
   */
  static majorVersion = 2

  // Allows adapters to control which InternalFieldApi subclass creates fields.
  get _FieldApi(): typeof InternalFieldApi {
    return InternalFieldApi
  }
  atom: ReadonlyAtom<FormState<TFormData, ScopedErrorTypes<any, any>>>
  _atoms: FormAtoms<TFormData>
  _fieldRootNode: InternalRootFieldApi
  _defaultValueCache: DefaultValueCacheEntry | null = null
  readonly _defaultOptions: DefaultOptions | undefined
  _options: InternalFormOptions<TFormData>
  /** Stable runtime instances correlated with `_options.validators` by slot. */
  _validatorInstances: ValidatorInstances<'form'> = null
  /** Stable source for errors returned directly by the form's `onSubmit`. */
  _onSubmitSource: OnSubmitErrorSource
  _lastUpdateDefaultValues: TFormData
  /** Stable runtime instances correlated with `_options.listeners` by slot. */
  _listenerInstances: ListenerInstances<'form'> = null
  _lastServerState: ServerFormState<TFormData> | null = null
  _validationRuns = new ValidationRunTracker()
  _submissionHandler: FormSubmissionHandler<TFormData>

  _resetSubmissions(): void {
    this._submissionHandler.invalidate()
    visitAllFormFields(this._fieldRootNode, (field) =>
      field._formGroup?._resetSubmissions(),
    )
  }

  _setSubmissionAttempts(attempts: number): void {
    this._submissionHandler.setSubmissionAttempts(attempts)
  }

  get state(): FormState<TFormData, any> {
    return this.atom.get()
  }

  get defaultValues(): TFormData {
    return this._options.defaultValues
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
    defaultValues: unknown = this.defaultValues,
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
    const defaultValues = this.defaultValues
    const cached = this._getCachedIsDefaultValue(values, defaultValues)
    if (cached !== undefined) return cached

    return this._setDefaultValueCache(
      values,
      defaultValues,
      evaluate(defaultValues, values),
    )
  }

  constructor(
    options: FormOptionsOfType<TFormData>,
    defaultOptions?: DefaultOptions,
  ) {
    this._defaultOptions = defaultOptions
    const resolvedOptions = resolveDefaultOptions(options, defaultOptions?.form)

    this._options = {
      ...resolvedOptions,
      formId: resolvedOptions.formId ?? uuid(),
    }
    this._lastUpdateDefaultValues = resolvedOptions.defaultValues
    this._lastServerState = this._options.serverState ?? null
    this._updateInstances()

    const initial = initializeForm(this, this._validationRuns)

    this._atoms = initial.atoms
    this._submissionHandler = initial.submissionHandler
    this._fieldRootNode = initial.fieldRootNode
    this._onSubmitSource = initial.onSubmitSource
    this.atom = initial.atom
    initial.complete()
  }

  mount = () => {
    this._notifyFormListener('mount', null)
    devtools().mountForm?.(this)

    let didCleanup = false

    return () => {
      if (didCleanup) return
      didCleanup = true
      batch(() => this._resetSubmissions())
      devtools().unmountForm?.(this)
    }
  }

  _clearFormValidationSource(sourceEvent: ValidatorEvents): void {
    batch(() => {
      for (const source of this._validatorInstances ?? []) {
        if (source.lastAppliedEvent === sourceEvent)
          pruneErrorTargets(removeSourceErrors(source))
      }
    })
  }

  reset = (values?: TFormData, opts?: FormResetOptions) => {
    const shouldUpdateDefaultValues =
      values !== undefined && opts?.updateDefaultValues !== false

    if (shouldUpdateDefaultValues) {
      this._options = { ...this._options, defaultValues: values }
    }

    batch(() => {
      this._resetSubmissions()
      this._submissionHandler.setSubmissionAttempts(0)
      visitAllFormFields(this._fieldRootNode, (field) =>
        field._formGroup?._setSubmissionAttempts(0),
      )
      this._cancelValidation()
      this._listenerInstances?.forEach((instance) => instance.resetRuntime())
      this._validatorInstances?.forEach((instance) => instance.resetRuntime())
      this._onSubmitSource.resetRuntime()
      this._defaultValueCache = null
      this._atoms.resetVersion.set((version) => version + 1)
      if (shouldUpdateDefaultValues) {
        this._atoms.defaultValuesVersion.set((version) => version + 1)
      }
      this._fieldRootNode._children.forEach((child) =>
        child._kill({ listenerEvent: 'reset' }),
      )
      this._atoms.meta.isDirty.set(false)
      this._atoms.meta.touchedFieldCount.set(0)
      this._fieldRootNode._clearErrors()
      this._atoms.meta.errorFields.set(new Set<AnyInternalFieldApi>())
      this._atoms.meta.fieldValidationCount.set(0)
      this._atoms.meta.validationCount.set(0)
      this._atoms.values.set(values ?? this._options.defaultValues)
    })

    this._notifyFormListener('reset', null)
  }

  _update(options: FormOptionsOfType<TFormData>) {
    updateFormOptions(this, options)
  }

  _updateInstances(
    previousOptions?: Pick<
      InternalFormOptions<TFormData>,
      'validators' | 'listeners'
    >,
  ): void {
    const previousListeners = previousOptions?.listeners ?? null
    const previousValidators =
      previousOptions === undefined
        ? undefined
        : (previousOptions.validators ?? null)

    this._listenerInstances = ListenerInstance.update({
      scope: 'form',
      definitions: this._options.listeners,
      previousDefinitions: previousListeners,
      instances: this._listenerInstances,
    })

    this._validatorInstances = ValidatorInstance.update({
      scope: 'form',
      definitions: this._options.validators,
      previousDefinitions: previousValidators,
      instances: this._validatorInstances,
      owner: this,
      onBeforeDispose: (instance) => {
        const affectedTargets = removeSourceErrors(instance)
        pruneErrorTargets(affectedTargets)
      },
    })
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
    this._setFieldValue({ fieldName, updater, options })
  }

  _setFieldValue({
    fieldName,
    updater,
    options,
    updateFieldStructure,
  }: {
    fieldName: string
    updater: Updater<any>
    options?: InternalFieldUpdateOptions
    updateFieldStructure?: () => void
  }): void {
    const updateOptions = resolveFieldUpdateOptions(options, 'change')

    const field = getTargetField(this, fieldName, updateOptions)
    updateOptions.fieldApiOverride = field

    batch(() => {
      const previousValue = this.getFieldValue(fieldName)
      const nextValue = callUpdater(updater, previousValue)
      const replacedSameLengthArray =
        Array.isArray(previousValue) &&
        Array.isArray(nextValue) &&
        previousValue !== nextValue &&
        previousValue.length === nextValue.length

      this._atoms.values.set((prev) => setBy(prev, fieldName, () => nextValue))
      // Same-value writes shouldn't cancel validation
      if (!Object.is(previousValue, nextValue)) {
        this._cancelFieldValidation(fieldName)
      }

      if (replacedSameLengthArray) {
        field._setMeta((prev) => ({
          ...prev,
          _arrayVersion: prev._arrayVersion + 1,
        }))
      }

      // Array mutations must finish removing and moving fields before user code runs.
      updateFieldStructure?.()
      this._notifyFieldChange(field, updateOptions)
    })

    notifyDevtoolsFieldValueUpdate(field)
  }

  resetField = <TFieldName extends DeepKeys<TFormData>>(
    fieldName: TFieldName,
    opts?: FieldApiOverrideOptions,
  ) => {
    const field = opts?.fieldApiOverride ?? this._tryGetFieldApi(fieldName)
    const fields = field ? collectFieldSubtree(field) : []

    batch(() => {
      this._atoms.values.set((prev) =>
        setBy(prev, fieldName, getBy(this.defaultValues, fieldName)),
      )
      this._cancelFieldValidation(fieldName)

      for (let index = fields.length - 1; index >= 0; index--) {
        const current = fields[index]!

        current._resetValidation()
        current._defaultValueCache = null
        current._listenerInstances?.forEach((instance) =>
          instance.resetRuntime(),
        )
        current._validatorInstances?.forEach((instance) =>
          instance.resetRuntime(),
        )
        const groupSubmissionAttempts =
          current._formGroup?._submissionAttempts.get() ?? 0

        current._setMeta((meta) =>
          resetFieldMeta(meta, groupSubmissionAttempts > 0),
        )
      }
    })

    for (const current of fields) {
      current._notifyListener({ trigger: 'reset', seenFields: new WeakSet() })
    }

    notifyDevtoolsFieldValueUpdate(field)
  }

  _cancelValidation(): void {
    batch(() => this._validationRuns.cancelAll())
  }

  /** Cancels owners whose values changed during a bulk update. */
  _cancelChangedValidation(previousValues: TFormData): void {
    if (Object.is(previousValues, this._atoms.values.get())) return
    batch(() => {
      this._cancelValidation()
      visitAllFormFields(this._fieldRootNode, (field) => {
        if (Object.is(getBy(previousValues, field.name), field.value)) return
        field._cancelValidation()
      })
    })
  }

  /** Cancels owners along a written value's path without creating nodes. */
  _cancelFieldValidation(fieldName: string): void {
    batch(() => {
      this._cancelValidation()
      let current: AnyInternalFieldApi | InternalRootFieldApi =
        this._fieldRootNode
      for (const segment of nameToFieldNodeSegments(fieldName)) {
        const child: AnyInternalFieldApi | undefined =
          current._getChild(segment)
        if (!child) return
        child._cancelValidation()
        current = child
      }
      // We could technically end up in a situation where
      // * subfields have an async field validator
      // * the parent receives a `setFieldValue`
      // It currently doesn't cancel subfield pending validation

      // It'd potentially set errors for outdated field values.

      // Cancelling every subfield means a full walk. Could be in the thousands of child entries for simple
      // array operations. I don't think that's worth it under the current architecture.
      // Wait for a real world example. Parent invalidation might be worth a look.

      // for (const child of current._children) {
      //   visitFieldSubtree(child, (field) => field._cancelValidation())
      // }
    })
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

  replaceFieldValue = (
    arrayFieldName: string,
    index: number,
    value: any,
    options?: InternalFieldUpdateOptions,
  ): void => {
    return ArrayMethods.replaceValue({
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
    field: AnyInternalFieldApi,
    options: ResolvedInternalFieldUpdateOptions,
  ) {
    const { markAsDirty } = options
    if (markAsDirty && !this._atoms.meta.isDirty.get()) {
      this._atoms.meta.isDirty.set(true)
    }

    field._handleEvent(options, 'change')
  }

  _notifyFormListener(
    trigger: FormListenerTriggers,
    triggerFieldApi: AnyInternalFieldApi | null,
  ) {
    if (!this._listenerInstances) return

    runFormListenerPipeline({
      pipeline: this._listenerInstances,
      context: {
        event: trigger,
        formApi: this,
        triggerFieldApi: triggerFieldApi ?? undefined,
      },
    })
  }

  _clearStaleErrors(
    field: AnyInternalFieldApi | null,
    causeValidation: boolean,
    canClearSource?: (source: ValidationErrorSource) => boolean,
  ): void {
    const group = field?._getFormGroup()
    const canClear = (source: ValidationErrorSource) => {
      if (canClearSource) return canClearSource(source)
      if (!causeValidation || source.scope === validationSourceScopes.onSubmit)
        return true
      // Active owners clear unselected sources after evaluating their predicates.
      if (source.scope === validationSourceScopes.field) return false
      return source.scope === validationSourceScopes.group
        ? source.owner !== group
        : isNotNil(group)
    }
    batch(() => {
      if (field)
        visitFieldAndAncestors(field, (target) => {
          target._errorStore.clearStaleErrors(canClear)
        })
      this._fieldRootNode._errorStore.clearStaleErrors(canClear)
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
    scope: FieldOptionsScope = 'field',
  ): AnyInternalFieldApi {
    const { name, ...restOpts } = options

    const fieldOptions = Object.keys(restOpts).length > 0 ? restOpts : undefined

    return getOrCreateFieldApi(
      this._fieldRootNode,
      nameToFieldNodeSegments(name),
      this,
      fieldOptions,
      scope,
    )
  }

  _applyValidationResult({
    sourceOrIndex,
    result,
    sourceEvent,
    submission,
  }: {
    sourceOrIndex: ValidationErrorSource | number
    result: FormValidationResult<TFormData>
    sourceEvent: ValidatorEvents
    submission?: SubmissionAttempt
  }): void {
    let source: ValidationErrorSource | undefined
    if (typeof sourceOrIndex === 'number') {
      source = this._validatorInstances?.[sourceOrIndex]
    } else {
      source = sourceOrIndex
    }

    if (!source) return

    applyRoutedValidationResult({
      routingRoot: this._fieldRootNode,
      value: this._atoms.values.get(),
      source,
      result,
      sourceEvent,
      submission,
    })
  }

  _runFormValidation(
    event: ClientSideEvents,
    opts: FormValidationOptions,
  ): ClientValidationRun<InternalFormValidatorInstance> | undefined {
    return startFormValidation(this, this._validationRuns, event, opts)
  }

  _setValidationCount(updater: Updater<number>): void {
    this._atoms.meta.validationCount.set((prev) => callUpdater(updater, prev))
  }

  validate = async (
    signal: ClientSideEvents,
    opts?: FieldApiOverrideOptions & {
      onResult?: boolean
      hasFailedBefore?: boolean
    },
  ) => {
    const run = this._runFormValidation(signal, { ...opts, catchErrors: false })
    await run?.pending
    return run?.collector.getErrors<TFormData>() ?? []
  }

  handleSubmit = () => this._submissionHandler.handleSubmit()
}
