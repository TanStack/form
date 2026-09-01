import { batch, createAtom } from '@tanstack/store'
import {
  InternalFieldApi,
  getDefaultValueCacheResult,
  getOrCreateFieldApi,
  shouldCacheDefaultValue,
  tryGetFieldApi,
} from '../FieldApi/FieldApi.lib'
import {
  callUpdater,
  evaluate,
  getBy,
  getTargetField,
  nameToFieldNodeSegments,
  resolveFieldUpdateOptions,
  setBy,
  uuid,
} from '../utils.lib'
import { InternalRootFieldApi } from '../FieldApi/RootFieldApi.lib'
import {
  collectFieldSubtree,
  visitAllFormFields,
  visitFieldAndAncestors,
} from '../FieldApi/fieldTraversal.lib'
import { defaultInternalBaseFieldMeta } from '../FieldApi/fieldState.lib'
import {
  clearValidationSourceErrorsFromEvent,
  isErrorResult,
  isValidationTriggerEnabled,
  parseValidationResult,
  reconcileRoutedFieldErrors,
  runFormMountValidatorPipeline,
  runFormValidatorPipeline,
  setValidationSourceError,
} from '../validation'
import { runFormListenerPipeline } from '../listeners.lib'
import { applyServerState } from '../ssr.lib'
import { devtools } from '../devtoolsBridge.lib'
import { reconcileValidatorInstances } from '../ValidatorInstance.lib'
import { reconcileListenerInstances } from '../ListenerInstance.lib'
import { InternalValidationSourceInstance } from '../ValidationSourceInstance.lib'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import { runSubmissionProcess } from './handleSubmit.lib'
import { ArrayMethods } from './array-methods.lib'
import {
  clearFormValidationSourceErrorsFromEvent,
  compareFormStateSnapshots,
  getFormStateSnapshot,
  reconcileFormErrorFields,
} from './formState.lib'
import type {
  FormApi,
  FormOptions,
  FormResetOptions,
  FormState,
} from './FormApi.public'
import type { FormErrorMeta } from './formState.lib'
import type { DeepKeys } from '../deep-keys.public'
import type { FormValidatorPipelineResult, PipelineResult } from '../validation'
import type {
  AnyFieldApiOptions,
  AnyInternalFieldApi,
  DefaultValueCacheEntry,
  FieldOptionsScope,
} from '../FieldApi/FieldApi.lib'
import type {
  InternalBaseFieldMeta,
  InternalFieldMeta,
} from '../FieldApi/fieldState.lib'
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
  FormValidator,
  FormValidators,
  ToFormErrorTypes,
  ValidationIssue,
  ValidationTrigger,
} from '../validation.public'
import type { AnyFormListener, FormListenerTriggers } from '../listeners.public'
import type { InternalListenerInstances } from '../ListenerInstance.lib'
import type { ServerFormState } from '../ssr.public'
import type {
  InternalValidatorInstance,
  InternalValidatorInstances,
} from '../ValidatorInstance.lib'
import type { AnyInternalValidationSourceInstance } from '../ValidationSourceInstance.lib'
import type { DefaultOptions } from '../defaultOptions.public'

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

function createInitialFormErrorMeta(): FormErrorMeta {
  return {
    validationSourceErrors: null,
  }
}

function createInitialFormMetaAtoms(): FormMetaAtoms {
  return {
    isDirty: createAtom(false),
    touchedFieldCount: createAtom(0),
    formErrors: createAtom(createInitialFormErrorMeta()),
    errorFields: createAtom(new Set<AnyInternalFieldApi>()),
    fieldValidationCount: createAtom(0),
    validationCount: createAtom(0),
    isSubmitting: createAtom(false),
    isSubmitSuccessful: createAtom(false),
    submissionAttempts: createAtom(0),
  }
}

export type AnyInternalFormApi = InternalFormApi<any, any, any>
export type InternalFormValidatorInstance = InternalValidatorInstance<
  FormValidator<any>,
  AnyInternalFormApi,
  AnyInternalFieldApi
>

type InternalFormOptions<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> = FormOptions<TFormData, TFormValidators, TSubmitReturn, unknown> & {
  formId: string
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

function notifyDevtoolsFieldValueUpdate(
  field: AnyInternalFieldApi | null | undefined,
): void {
  const updateField = devtools().updateField
  if (!field || !updateField) return

  visitFieldAndAncestors(field, (current) => updateField(current))
}

function notifyDevtoolsDefaultValuesUpdate(form: AnyInternalFormApi): void {
  const updateField = devtools().updateField
  if (!updateField) return

  visitAllFormFields(form._fieldRootNode, (current) => updateField(current))
}

export class InternalFormApi<
  TFormData,
  const TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
> implements FormApi<
  TFormData,
  ToFormErrorTypes<TFormValidators, TSubmitReturn>
> {
  /**
   * Devtools use this to show what version of the library is being used.
   */
  static majorVersion = 2

  // Allows adapters to control which InternalFieldApi subclass creates fields.
  get _FieldApi(): typeof InternalFieldApi {
    return InternalFieldApi
  }
  atom: ReadonlyAtom<
    FormState<TFormData, ToFormErrorTypes<TFormValidators, TSubmitReturn>>
  >
  _atoms: FormAtoms<TFormData>
  _fieldRootNode: InternalRootFieldApi
  _defaultValueCache: DefaultValueCacheEntry | null = null
  readonly _defaultOptions: DefaultOptions | undefined
  _options: InternalFormOptions<TFormData, TFormValidators, any>
  /** Stable runtime instances correlated with `_options.validators` by slot. */
  _validatorInstances: InternalValidatorInstances<
    TFormValidators[number],
    AnyInternalFormApi,
    AnyInternalFieldApi
  >
  /** Stable source for errors returned directly by the form's `onSubmit`. */
  _onSubmitSource: InternalValidationSourceInstance<
    AnyInternalFormApi,
    AnyInternalFieldApi
  >
  _lastUpdateDefaultValues: TFormData
  /** Stable runtime instances correlated with `_options.listeners` by slot. */
  _listenerInstances: InternalListenerInstances<
    AnyFormListener,
    AnyInternalFormApi
  >
  _lastServerState: ServerFormState<TFormData, TFormValidators> | null = null

  get state(): FormState<
    TFormData,
    ToFormErrorTypes<TFormValidators, TSubmitReturn>
  > {
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
    options: FormOptions<TFormData, TFormValidators, any, unknown>,
    defaultOptions?: DefaultOptions,
  ) {
    this._defaultOptions = defaultOptions
    const resolvedOptions = resolveDefaultOptions(options, defaultOptions?.form)

    this._options = {
      ...resolvedOptions,
      formId: resolvedOptions.formId ?? uuid(),
    }
    this._lastUpdateDefaultValues = resolvedOptions.defaultValues
    this._atoms = {
      values: createAtom(resolvedOptions.defaultValues),
      meta: createInitialFormMetaAtoms(),
      resetVersion: createAtom(0),
      defaultValuesVersion: createAtom(0),
    }
    this._fieldRootNode = new InternalRootFieldApi(this)
    this._onSubmitSource = new InternalValidationSourceInstance({
      owner: this,
      scope: 'onSubmit',
    })

    this.atom = createAtom(() => getFormStateSnapshot(this), {
      compare: compareFormStateSnapshots,
    })
    this._listenerInstances = reconcileListenerInstances({
      definitions: this._options.listeners,
      instances: null,
      owner: this,
    })
    this._validatorInstances = reconcileValidatorInstances<
      TFormValidators[number],
      AnyInternalFormApi,
      AnyInternalFieldApi
    >({
      definitions: this._options.validators,
      instances: null,
      owner: this,
      scope: 'form',
      onBeforeDispose: (validatorInstance) =>
        this._removeValidatorInstance(validatorInstance),
    })

    applyServerState(
      this,
      this._options.serverState ?? null,
      resolvedOptions.defaultValues,
    )
    this._runMountValidation()
  }

  mount = () => {
    this._notifyFormListener('mount', null)
    devtools().mountForm?.(this)

    let didCleanup = false

    return () => {
      if (didCleanup) return
      didCleanup = true
      devtools().unmountForm?.(this)
    }
  }

  _clearFormValidationSource(sourceEvent: string): void {
    const validationSources = this._validatorInstances ?? []

    clearFormValidationSourceErrorsFromEvent({
      formErrors: this._atoms.meta.formErrors,
      errorFields: this._atoms.meta.errorFields,
      validationSources,
      sourceEvent,
      fieldScope: { type: 'all' },
      clearFieldEventErrors: (field, instances, eventSource) =>
        this._clearFieldEventErrors(field, instances, eventSource),
      reconcileErrorFields: true,
    })
  }

  reset = (values?: TFormData, opts?: FormResetOptions) => {
    const shouldUpdateDefaultValues =
      values !== undefined && opts?.updateDefaultValues !== false

    if (shouldUpdateDefaultValues) {
      this._options = { ...this._options, defaultValues: values }
    }

    this._listenerInstances?.forEach((instance) => instance.resetRuntime())
    this._validatorInstances?.forEach((instance) => instance.resetRuntime())
    this._onSubmitSource.resetRuntime()
    this._defaultValueCache = null

    batch(() => {
      this._atoms.resetVersion.set((version) => version + 1)
      if (shouldUpdateDefaultValues) {
        this._atoms.defaultValuesVersion.set((version) => version + 1)
      }
      this._fieldRootNode._children.forEach((child) =>
        child._kill({ listenerEvent: 'reset' }),
      )
      this._atoms.meta.isDirty.set(false)
      this._atoms.meta.touchedFieldCount.set(0)
      this._atoms.meta.formErrors.set(createInitialFormErrorMeta())
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

  _update(options: FormOptions<TFormData, TFormValidators, any, unknown>) {
    const resolvedOptions = resolveDefaultOptions(
      options,
      this._defaultOptions?.form,
    )
    const oldOptions = this._options
    const didDefaultValuesChange = !evaluate(
      resolvedOptions.defaultValues,
      this._lastUpdateDefaultValues,
    )

    this._lastUpdateDefaultValues = resolvedOptions.defaultValues
    this._defaultValueCache = null
    this._options = {
      ...resolvedOptions,
      defaultValues: didDefaultValuesChange
        ? resolvedOptions.defaultValues
        : oldOptions.defaultValues,
      formId: resolvedOptions.formId ?? oldOptions.formId,
    }

    this._listenerInstances = reconcileListenerInstances({
      definitions: this._options.listeners,
      previousDefinitions: oldOptions.listeners ?? null,
      instances: this._listenerInstances,
      owner: this,
    })

    this._validatorInstances = reconcileValidatorInstances<
      TFormValidators[number],
      AnyInternalFormApi,
      AnyInternalFieldApi
    >({
      definitions: this._options.validators,
      previousDefinitions: oldOptions.validators ?? null,
      instances: this._validatorInstances,
      owner: this,
      scope: 'form',
      onBeforeDispose: (validatorInstance) =>
        this._removeValidatorInstance(validatorInstance),
    })

    if (didDefaultValuesChange) {
      batch(() => {
        this._atoms.defaultValuesVersion.set((version) => version + 1)
        if (this._atoms.meta.touchedFieldCount.get() === 0) {
          this._atoms.values.set(resolvedOptions.defaultValues)
        } else {
          this._atoms.values.set((prev) =>
            applyDefaultValuesPreservingTouchedFields(
              prev,
              resolvedOptions.defaultValues,
              this,
            ),
          )
        }
      })
    }

    applyServerState(
      this,
      this._options.serverState ?? null,
      resolvedOptions.defaultValues,
    )
    if (didDefaultValuesChange) notifyDevtoolsDefaultValuesUpdate(this)
    devtools().updateForm?.(this)
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

      for (let index = fields.length - 1; index >= 0; index--) {
        const current = fields[index]!

        current._defaultValueCache = null
        current._listenerInstances?.forEach((instance) =>
          instance.resetRuntime(),
        )
        current._validatorInstances?.forEach((instance) =>
          instance.resetRuntime(),
        )
        current._setMeta(() => defaultInternalBaseFieldMeta)
      }
    })

    for (const current of fields) {
      current._notifyListener('reset', new WeakSet())
    }

    notifyDevtoolsFieldValueUpdate(field)
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
    this._clearEventErrors(field, 'server', 'change')
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

  _clearEventErrors(
    field: AnyInternalFieldApi | null,
    sourceEvent: string,
    event: Exclude<ValidationTrigger, 'submit'>,
  ) {
    const validatorInstancesToClear: Array<InternalFormValidatorInstance> = []

    for (const validatorInstance of this._validatorInstances ?? []) {
      const validator = validatorInstance.definition

      const runsOnEvent = validator.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          scope: 'form',
          event,
          formApi: this as never,
          triggerFieldApi: field ?? undefined,
        }),
      )

      if (!runsOnEvent) {
        validatorInstancesToClear.push(validatorInstance)
      }
    }

    if (sourceEvent === 'submit') {
      this._clearSubmitErrors(field)
    }

    clearFormValidationSourceErrorsFromEvent({
      formErrors: this._atoms.meta.formErrors,
      errorFields: this._atoms.meta.errorFields,
      validationSources: validatorInstancesToClear,
      sourceEvent,
      fieldScope: field ? { type: 'field', field } : { type: 'none' },
      clearFieldEventErrors: (targetField, instances, eventSource) =>
        this._clearFieldEventErrors(targetField, instances, eventSource),
    })
  }

  _clearSubmitErrors(field: AnyInternalFieldApi | null): void {
    batch(() => {
      this._setFormValidationSourceError(this._onSubmitSource, [], '')

      if (!field || !this._onSubmitSource.errorTargets?.has(field)) return

      this._clearFieldValidationSourceError(field, this._onSubmitSource)
      this._atoms.meta.errorFields.set((prev) =>
        reconcileFormErrorFields(prev, [field]),
      )
      field._pruneIfUnused()
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

  /**
   * Resolve relative field errors from a validation scope to their concrete
   * field targets, coalescing errors captured by the same boundary.
   */
  _resolveRoutedFieldErrors(
    fieldErrors: Iterable<readonly [string, Array<ValidationIssue>]>,
    routingRoot: AnyInternalFieldApi | InternalRootFieldApi = this
      ._fieldRootNode,
  ): Map<AnyInternalFieldApi, Array<ValidationIssue>> {
    const resolvedFieldErrors = new Map<
      AnyInternalFieldApi,
      Array<ValidationIssue>
    >()

    for (const [fieldName, errors] of fieldErrors) {
      const segments = nameToFieldNodeSegments(fieldName)
      let current = routingRoot
      let boundary: AnyInternalFieldApi | null =
        routingRoot._isRoot || !routingRoot._errorBoundary ? null : routingRoot

      for (const segment of segments) {
        const child: AnyInternalFieldApi | undefined =
          current._getChild(segment)
        if (!child) break

        if (child._errorBoundary) {
          boundary = child
        }
        current = child
      }

      const target =
        boundary ??
        getOrCreateFieldApi(
          routingRoot,
          segments.slice(),
          this,
          undefined,
          'internal',
        )

      resolvedFieldErrors.set(
        target,
        (resolvedFieldErrors.get(target) ?? []).concat(errors),
      )
    }

    return resolvedFieldErrors
  }

  _setFormValidationSourceError(
    validationSource: AnyInternalValidationSourceInstance,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    this._atoms.meta.formErrors.set((prev) => {
      const nextErrors = setValidationSourceError(
        prev.validationSourceErrors,
        validationSource,
        errors,
        sourceEvent,
      )

      if (!nextErrors) return prev

      return {
        ...prev,
        validationSourceErrors: nextErrors.errorMap,
      }
    })
  }

  _setFieldValidationSourceError(
    field: AnyInternalFieldApi,
    validationSource: AnyInternalValidationSourceInstance,
    errors: Array<ValidationIssue>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const nextErrors = setValidationSourceError(
        prev._validationSourceErrors,
        validationSource,
        errors,
        sourceEvent,
      )

      if (!nextErrors) return prev

      return {
        ...prev,
        _validationSourceErrors: nextErrors.errorMap,
      } satisfies InternalBaseFieldMeta
    })
  }

  _clearFieldValidationSourceError(
    field: AnyInternalFieldApi,
    validationSource: AnyInternalValidationSourceInstance,
  ) {
    this._setFieldValidationSourceError(field, validationSource, [], '')
    validationSource.deleteErrorTarget(field)
    field._pruneIfUnused()
  }

  /** Removes all form-owned state associated with a disposed validator. */
  _removeValidatorInstance(
    validatorInstance: InternalFormValidatorInstance,
  ): void {
    const affectedFields = new Set(validatorInstance.errorTargets ?? [])

    batch(() => {
      this._setFormValidationSourceError(validatorInstance, [], '')
      for (const field of affectedFields) {
        this._clearFieldValidationSourceError(field, validatorInstance)
      }
      if (affectedFields.size > 0) {
        this._atoms.meta.errorFields.set((prev) =>
          reconcileFormErrorFields(prev, affectedFields),
        )
      }
    })
  }

  _clearFieldEventErrors(
    field: AnyInternalFieldApi,
    validationSources: ReadonlyArray<AnyInternalValidationSourceInstance>,
    sourceEvent: string,
  ) {
    field._setMeta((prev) => {
      const clearedErrors = clearValidationSourceErrorsFromEvent(
        prev._validationSourceErrors,
        validationSources,
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

  _processValidationResult(
    result: PipelineResult<FormValidateResult<TFormData>>,
    sourceEvent: string,
  ) {
    const validatorInstance =
      result.validatorInstance as InternalFormValidatorInstance

    const parsedResult = parseValidationResult(result.result)
    const resolvedFieldErrors = this._resolveRoutedFieldErrors(
      Object.entries(parsedResult.subfields ?? {}),
    )

    batch(() => {
      this._setFormValidationSourceError(
        validatorInstance,
        parsedResult.self ?? [],
        sourceEvent,
      )

      const oldFieldRefs = validatorInstance.errorTargets ?? undefined
      const { fieldRefs, affectedFields, didFieldRefsChange } =
        reconcileRoutedFieldErrors(
          validatorInstance,
          resolvedFieldErrors,
          oldFieldRefs,
          (field, instance, errors) =>
            this._setFieldValidationSourceError(
              field,
              instance as InternalFormValidatorInstance,
              errors,
              sourceEvent,
            ),
          (field, instance) =>
            this._clearFieldValidationSourceError(
              field,
              instance as InternalFormValidatorInstance,
            ),
        )

      if (didFieldRefsChange)
        validatorInstance.errorTargets = fieldRefs.size > 0 ? fieldRefs : null

      if (affectedFields.size > 0) {
        this._atoms.meta.errorFields.set((prev) =>
          reconcileFormErrorFields(prev, affectedFields),
        )
      }
    })
  }

  _processSubmitValidationResult(
    result: FormValidateResult<TFormData>,
    sourceEvent: string,
  ): void {
    const parsedResult = parseValidationResult(result)
    const resolvedFieldErrors = this._resolveRoutedFieldErrors(
      Object.entries(parsedResult.subfields ?? {}),
    )

    batch(() => {
      this._setFormValidationSourceError(
        this._onSubmitSource,
        parsedResult.self ?? [],
        sourceEvent,
      )

      const oldFieldRefs = this._onSubmitSource.errorTargets ?? undefined
      const { fieldRefs, affectedFields, didFieldRefsChange } =
        reconcileRoutedFieldErrors(
          this._onSubmitSource,
          resolvedFieldErrors,
          oldFieldRefs,
          (field, validationSource, errors) =>
            this._setFieldValidationSourceError(
              field,
              validationSource,
              errors,
              sourceEvent,
            ),
          (field, validationSource) =>
            this._clearFieldValidationSourceError(field, validationSource),
        )

      if (didFieldRefsChange) {
        this._onSubmitSource.errorTargets =
          fieldRefs.size > 0 ? fieldRefs : null
      }

      if (affectedFields.size > 0) {
        this._atoms.meta.errorFields.set((prev) =>
          reconcileFormErrorFields(prev, affectedFields),
        )
      }
    })
  }

  _runMountValidation(): void {
    const pipeline = this._validatorInstances?.filter(
      (validatorInstance) => !validatorInstance.didRunOnMount,
    )
    if (!pipeline || pipeline.length === 0) return

    pipeline.forEach((validatorInstance) =>
      validatorInstance.markMountValidationRan(),
    )

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
    const pipeline = this._validatorInstances
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
          scope: 'form',
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
