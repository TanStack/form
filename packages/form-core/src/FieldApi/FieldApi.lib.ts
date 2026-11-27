import { batch, createAtom } from '@tanstack/store'
import { devtools } from '../devtoolsBridge.lib'
import {
  ValidationErrorStore,
  removeSourceErrors,
  replaceSourceErrors,
  validationSourceScopes,
} from '../validation/errorStorage.lib'
import { ValidationRunTracker } from '../pipeline/runTracker.lib'
import { callUpdater, evaluate, getBy } from '../utils.lib'
import { resolveDefaultOptions } from '../defaultOptions.lib'
import { startFieldValidation } from '../pipeline/validation/ownerValidation.lib'
import { parseValidationResult } from '../validation/results/errors.lib'
import {
  defaultInternalBaseFieldMeta,
  deriveFromBaseFieldMeta,
  getFieldSnapshot,
  getSubfieldsMetaFlags,
} from './fieldState.lib'
import { initializeFieldOptions, updateFieldOptions } from './fieldOptions.lib'
import {
  handleFieldEvent,
  notifyFieldListener,
  notifyFieldValidator,
  triggerValidationFromField,
} from './fieldEvents.lib'
import {
  killField,
  moveFieldToSegment,
  pruneFieldIfUnused,
  updateChildMetaCounts,
} from './fieldTree.lib'
import { visitFieldAndAncestors } from './fieldTraversal.lib'
import type { FieldApi, FieldApiOptions } from './FieldApi.public'
import type {
  FieldValidator,
  FieldValidators,
} from '../pipeline/validation/validation.public'
import type { InternalRootFieldApi } from './RootFieldApi.lib'
import type { NameSegment } from '../utils.lib'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'
import type {
  FieldListenerTriggers,
  FieldListeners,
} from '../pipeline/listeners/listeners.public'
import type {
  NotifyFieldListenerOptions,
  NotifyFieldValidatorOptions,
} from './fieldEvents.lib'
import type {
  DeepKeys,
  DeepValue,
  TryGetArrayElementType,
} from '../deep-keys.public'
import type {
  DerivedMetaMarkers,
  FieldAtoms,
  InternalBaseFieldMeta,
  InternalFieldMeta,
  InternalFieldState,
  SubfieldsMetaFlags,
} from './fieldState.lib'
import type {
  ValidatorInstance,
  ValidatorInstances,
} from '../pipeline/validation/ValidatorInstance.lib'
import type {
  ListenerInstance,
  ListenerInstances,
} from '../pipeline/listeners/ListenerInstance.lib'
import type { ErrorVisibilityFn } from '../FormApi/errorVisibility.public'
import type { AnyInternalFormGroupApi } from '../FormGroupApi/FormGroupApi.lib'
import type { ReadonlyAtom } from '@tanstack/store'
import type { FieldUpdateOptions, Updater } from '../types.public'
import type {
  ClientSideEvents,
  ValidatorEvents,
} from '../pipeline/events.public'
import type { ClientValidationRun } from '../pipeline/validation/clientValidation.lib'
import type { FieldValidationOptions } from '../pipeline/validation/ownerValidation.lib'
import type { PipelineResult } from '../pipeline/state.lib'
import type { FieldEventOptions } from '../types.lib'
import type { FieldErrors } from '../validation/state.public'

export type AnyFieldApiOptions = Omit<
  FieldApiOptions<any, any, any, FieldValidators<any, any, any>, any, any, any>,
  'listeners'
> & {
  // error types would become something like `ValidationIssue[]` for adapter compat.
  // breaks our intended internal usage, though.
  listeners?: FieldListeners<any, any, any, any, any, any>
}
export type AnyFieldValidator = FieldValidator<any, any, any>

export interface DefaultValueCacheEntry {
  name: string
  value: unknown
  defaultValue: unknown
  isDefaultValue: boolean
}

export function getDefaultValueCacheResult(
  cache: DefaultValueCacheEntry | null,
  name: string,
  value: unknown,
  defaultValue: unknown,
): boolean | undefined {
  if (!shouldCacheDefaultValue(value, defaultValue)) return undefined
  if (!cache) return undefined
  if (cache.name !== name) return undefined
  if (!Object.is(cache.value, value)) return undefined
  if (!Object.is(cache.defaultValue, defaultValue)) return undefined
  return cache.isDefaultValue
}

export function shouldCacheDefaultValue(
  value: unknown,
  defaultValue: unknown,
): boolean {
  return isObjectLike(value) || isObjectLike(defaultValue)
}

function isObjectLike(value: unknown): boolean {
  return (
    (typeof value === 'object' && value !== null) || typeof value === 'function'
  )
}

export interface InternalFieldApiParams extends Omit<
  AnyFieldApiOptions,
  'name'
> {
  segment: NameSegment
  parent: AnyInternalFieldApi | InternalRootFieldApi
  form: AnyInternalFormApi
  validators?: FieldValidators<any, any, any>
}

export type FieldOptionsScope = 'internal' | 'field'

export type AnyInternalFieldApi = InternalFieldApi<any, any, any>
export type InternalFieldListenerInstance = ListenerInstance<'field'>
export type InternalFieldValidatorInstance = ValidatorInstance<'field'>

export class InternalFieldApi<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> implements FieldApi<any, any, any, any, any> {
  readonly _isRoot = false
  // Every field currently creates a store, even if there are no errors yet and there's nothing to render.
  // Perhaps if there's demand, we can change this sometime.
  readonly _errorStore: ValidationErrorStore
  _parent: AnyInternalFieldApi | InternalRootFieldApi
  _childrenMap: Map<NameSegment, AnyInternalFieldApi> = new Map()
  _defaultValueCache: DefaultValueCacheEntry | null = null
  _atoms: FieldAtoms
  /** Validators attached to this field. */
  _validatorInstances: ValidatorInstances<'field'> = null
  /** Listeners attached to this field. */
  _listenerInstances: ListenerInstances<'field'> = null
  _errorVisibility: ErrorVisibilityFn<any> | undefined
  _errorBoundary: boolean
  /** The form group occupying this trie node. */
  _formGroup: AnyInternalFormGroupApi | null = null

  _watchedListenerNames: Set<string> | null = null
  _watchedValidatorNames: Set<string> | null = null

  /**
   * Whether this field has received usage-site options.
   * Some actions like form error-routing or in-between fields could cause
   * field nodes to exist before a render is supposed to create them.
   *
   * The main thing we're avoiding here is avoiding error reports from
   * going from no validators -> N validators (since that'd usually be banned in the update)
   */
  _fieldOptionsInitialized: boolean
  _isKilled = false
  private _validationRuns: ValidationRunTracker | null = null

  _segmentValue: NameSegment
  /**
   * @private
   * How many components have marked this field as desired / registered.
   */
  _refCount = 0

  /**
   * @private
   * This is read-only. Use fieldApi._moveTo() instead for writes.
   */
  get _segment(): NameSegment {
    return this._segmentValue
  }

  form: AnyInternalFormApi

  /**
   * @private
   * Whether a derived atom exists for this field. Atoms are only made
   * on-demand if there is an adapter component that needs one.
   */
  get _isMounted(): boolean {
    return this._refCount > 0
  }

  get _children(): Array<AnyInternalFieldApi> {
    return Array.from(this._childrenMap.values())
  }

  _getOrCreateAtoms(): Required<FieldAtoms> {
    let { meta: metaAtom, store: storeAtom } = this._atoms
    if (!metaAtom) {
      metaAtom = createAtom(defaultInternalBaseFieldMeta)
    }
    if (!storeAtom) {
      const markers: DerivedMetaMarkers = {
        source: undefined,
        canDisplayErrors: undefined,
      }
      storeAtom = createAtom<InternalFieldState>((prev) => {
        const newMeta = metaAtom.get()
        const value = this._getValue()

        const meta = deriveFromBaseFieldMeta(
          newMeta,
          prev?.meta,
          this,
          value,
          markers,
        )

        if (prev?.meta === meta && prev.value === value) {
          return prev
        }

        return {
          meta,
          value,
        }
      })
    }

    const required: Required<FieldAtoms> = { meta: metaAtom, store: storeAtom }

    this._atoms = required
    return required
  }

  get atom(): ReadonlyAtom<InternalFieldState> {
    return this._getOrCreateAtoms().store
  }

  get name(): TFieldName {
    const ownSegment =
      typeof this._segment === 'number' ? `[${this._segment}]` : this._segment

    let name = this._parent.name

    // If my parent is not root and not an array, add a dot
    if (!this._parent._isRoot && typeof this._segment !== 'number') {
      name += '.'
    }
    name += ownSegment

    return name as TFieldName
  }

  _getBaseMeta(): InternalBaseFieldMeta {
    return this._atoms.meta?.get() ?? defaultInternalBaseFieldMeta
  }

  _setDefaultValueCache(
    value: unknown,
    defaultValue: unknown,
    isDefaultValue: boolean,
  ): boolean {
    if (!shouldCacheDefaultValue(value, defaultValue)) {
      this._defaultValueCache = null
      return isDefaultValue
    }

    this._defaultValueCache = {
      name: this.name,
      value,
      defaultValue,
      isDefaultValue,
    }
    return isDefaultValue
  }

  _getCachedIsDefaultValue(
    value: unknown = this._getValue(),
    defaultValue: unknown = getBy(this.form.defaultValues, this.name),
  ): boolean | undefined {
    return getDefaultValueCacheResult(
      this._defaultValueCache,
      this.name,
      value,
      defaultValue,
    )
  }

  _getIsDefaultValue(value: unknown = this._getValue()): boolean {
    void this.form._atoms.defaultValuesVersion.get()
    const defaultValue = getBy(this.form.defaultValues, this.name)
    const cached = this._getCachedIsDefaultValue(value, defaultValue)
    if (cached !== undefined) return cached

    const isDefaultValue = evaluate(defaultValue, value)
    return this._setDefaultValueCache(value, defaultValue, isDefaultValue)
  }

  constructor(
    options: InternalFieldApiParams,
    scope: FieldOptionsScope = 'field',
  ) {
    this._fieldOptionsInitialized = scope !== 'internal'
    const defaultOptions =
      scope === 'field' ? options.form._defaultOptions?.field : undefined
    const {
      segment,
      parent,
      validators,
      form,
      listeners,
      errorVisibility,
      errorBoundary,
    } = resolveDefaultOptions(options, defaultOptions)

    this._segmentValue = segment
    this._parent = parent
    this.form = form
    this._errorVisibility = errorVisibility
    this._errorBoundary = errorBoundary ?? false
    this._atoms = {}

    this._errorStore = new ValidationErrorStore({
      target: this,
      onChange: (wasInvalid, isInvalid) => {
        if (this._isKilled) return
        const meta = this._getBaseMeta()
        const previous = getSubfieldsMetaFlags(meta, wasInvalid)
        const next = getSubfieldsMetaFlags(meta, isInvalid)
        this._updateParentMeta(previous, next)
        devtools().updateField?.(this)
      },
    })

    initializeFieldOptions(this, { validators, listeners })
  }

  _update(
    options: Omit<AnyFieldApiOptions, 'name' | 'form'>,
    scope: FieldOptionsScope = 'field',
  ) {
    updateFieldOptions(this, options, scope)
  }

  /**
   * @private
   * Get a child FieldApi by its segment name.
   */
  _getChild(segment: NameSegment): AnyInternalFieldApi | undefined {
    return this._childrenMap.get(segment)
  }

  /**
   * @private
   * Set an existing node as a child of this FieldApi.
   */
  _setChild(node: AnyInternalFieldApi): void {
    this._childrenMap.set(node._segment, node)
  }

  /**
   * @private
   * Remove a child node from this FieldApi.
   *
   * @important Does not kill the child node.
   */
  _removeChild(segment: NameSegment): void {
    this._childrenMap.delete(segment)
  }

  /**
   * @private
   * Set this field's meta. If not present, it will create the
   * entry.
   */
  _setMeta(updater: Updater<InternalBaseFieldMeta>) {
    if (this._isKilled) return

    this._getOrCreateAtoms().meta.set((prevMeta) => {
      const newMeta = callUpdater(updater, prevMeta)
      const previousFlags = getSubfieldsMetaFlags(
        prevMeta,
        this._errorStore.hasErrors,
      )
      const nextFlags = getSubfieldsMetaFlags(
        newMeta,
        this._errorStore.hasErrors,
      )

      this._updateParentMeta(previousFlags, nextFlags)

      return newMeta
    })
    devtools().updateField?.(this)
  }

  _updateParentMeta(
    previous: SubfieldsMetaFlags,
    next: SubfieldsMetaFlags,
  ): void {
    if (!this._parent._isRoot) {
      this._parent._updateChildMetaCounts(previous, next)
    } else {
      this._parent._updateFormMetaCounts(previous, next)
      this._parent._updateErrorFields(this, previous.error, next.error)
    }
  }

  /**
   * @private
   * Updates counts of child fields with each meta flag, including their subfields,
   * then updates parent meta.
   */
  _updateChildMetaCounts(
    previousFlags: SubfieldsMetaFlags,
    nextFlags: SubfieldsMetaFlags,
  ): void {
    updateChildMetaCounts(this, previousFlags, nextFlags)
  }

  /**
   * @private
   * Validates this field and its ancestors within its group, then validates
   * the containing group or form.
   */
  _triggerValidationFromField(
    event: ClientSideEvents,
    group: AnyInternalFormGroupApi | null,
  ): void {
    triggerValidationFromField(this, event, group)
  }

  /**
   * @private
   * Runs this field's validation pipeline. Undefined if an error occurred that was caught.
   */
  _runFieldValidation(
    event: 'mount' | 'change' | 'blur' | 'submit',
    options: FieldValidationOptions,
  ): ClientValidationRun<InternalFieldValidatorInstance> | undefined {
    const isFieldOwnedRun = !options.submission
    const hasLiveValidators =
      !this._isKilled && this._validatorInstances !== null

    if (isFieldOwnedRun && hasLiveValidators) {
      this._validationRuns ??= new ValidationRunTracker()
    }

    return startFieldValidation(this, this._validationRuns, event, options)
  }

  /** Cancels this node's runs, including those owned by its form group. */
  _cancelValidation(): void {
    batch(() => {
      this._validationRuns?.cancelAll()
      this._formGroup?._cancelOwnedValidation()
    })
  }

  _resetValidation(): void {
    batch(() => {
      this._cancelValidation()
      this._errorStore.clearTargetErrors()
    })
  }

  _setValidationCount(updater: Updater<number>): void {
    this._setMeta((prev) => {
      const _validationCount = callUpdater(updater, prev._validationCount)
      const isValidating = _validationCount > 0

      if (
        prev._validationCount === _validationCount &&
        prev.isValidating === isValidating
      ) {
        return prev
      }

      return {
        ...prev,
        _validationCount,
        isValidating,
      }
    })
  }

  _processValidationResult(
    { value, instance }: PipelineResult<InternalFieldValidatorInstance>,
    sourceEvent: ValidatorEvents,
  ) {
    if (this._isKilled) return
    const selfErrors = parseValidationResult(value.result).self ?? []

    replaceSourceErrors(instance, sourceEvent, [[this, selfErrors]])
  }

  _removeValidatorInstance(
    validatorInstance: InternalFieldValidatorInstance,
  ): void {
    removeSourceErrors(validatorInstance)
    this._pruneIfUnused()
  }

  _clearStaleErrors(
    shouldClear: (instance: InternalFieldValidatorInstance) => boolean = () =>
      true,
  ): void {
    this._errorStore.clearStaleErrors(
      (source) =>
        source.scope === validationSourceScopes.field && shouldClear(source),
    )
  }

  _handleEvent(
    options: FieldEventOptions,
    event: 'change' | 'blur' | 'submit',
  ): void {
    handleFieldEvent(this, options, event)
  }

  _notifyListener(options: NotifyFieldListenerOptions) {
    notifyFieldListener(this, options)
  }

  _notifyValidator(options: NotifyFieldValidatorOptions) {
    notifyFieldValidator(this, options)
  }

  /**
   * @private
   * Register as a component that you're using this field.
   *
   */
  _register(): () => void {
    if (this._isKilled) {
      return () => {}
    }

    const isMountTransition = this._refCount === 0

    this._refCount++
    this._getOrCreateAtoms()
    if (isMountTransition) {
      devtools().mountField?.(this)
    }

    this._notifyListener({ trigger: 'mount', seenFields: new WeakSet() })

    if (isMountTransition) {
      this._runFieldValidation('mount', { catchErrors: true })
    }

    return () => this._unregister()
  }

  /**
   * @private
   * Unregister as a component that you're using this field.
   *
   */
  _unregister(): void {
    if (this._isKilled) return

    // TODO we have an RFC for what unmounts should do with validators and listeners.

    const previousPath = this.name
    const isUnmountTransition = this._refCount === 1
    this._refCount--
    if (isUnmountTransition) {
      devtools().unmountField?.(this, previousPath)
    }
    this._notifyListener({ trigger: 'unmount', seenFields: new WeakSet() })

    if (this._refCount <= 0) {
      setTimeout(() => {
        if (this._refCount > 0) return

        this._atoms.store = undefined

        if (this._atoms.meta?.get() === defaultInternalBaseFieldMeta) {
          this._atoms.meta = undefined
        }

        this._pruneIfUnused()
      }, 0)
    }
  }

  reset = () => {
    this.form.resetField(this.name, { fieldApiOverride: this })
  }

  /**
   * @private
   */
  _moveTo(newSegment: NameSegment): void {
    const previousPath = this.name
    moveFieldToSegment(this, newSegment)
    if (this.name !== previousPath) {
      devtools().moveField?.(this, previousPath)
    }
  }

  /**
   * @private
   * Kill this field and its children.
   * Removes the affected fields' meta as well.
   */
  _kill(
    options: {
      listenerEvent?: FieldListenerTriggers
    } = {},
  ) {
    killField(this, options)
  }

  _pruneIfUnused(): void {
    pruneFieldIfUnused(this)
  }

  /** Updates the form group occupying this trie node. */
  _setFormGroup(formGroup: AnyInternalFormGroupApi | null): void {
    if (this._formGroup === formGroup) return

    this._formGroup = formGroup
    devtools().updateField?.(this)

    if (!formGroup) this._pruneIfUnused()
  }

  /** Returns the form group containing this trie node, if one exists. */
  _getFormGroup(): AnyInternalFormGroupApi | null {
    let formGroup: AnyInternalFormGroupApi | null = null

    visitFieldAndAncestors(this, (field, stop) => {
      if (!field._formGroup) return

      formGroup = field._formGroup
      return stop
    })

    return formGroup
  }

  _getValue(): any {
    return this.form.getFieldValue(this.name)
  }

  get state(): InternalFieldState {
    // Accessing `atom` mounts the field, which we don't necessarily want.
    // Parent or child nodes may simply want some info about a field's state.
    if (this._isMounted) {
      return this.atom.get()
    } else {
      return getFieldSnapshot(this)
    }
  }

  get value() {
    return this.state.value
  }

  get meta(): InternalFieldMeta {
    return this.state.meta
  }

  get errors(): FieldErrors<any> {
    return this.state.meta.errors
  }

  // data: ['a', 'b']
  // name="data[0]" -> node created, meta created
  // data.swapValues(0, 1) -> valid, but node errors
  // -> swapValues or other arary mutations need to check runtime -> swap values in the array -> THAT's where the check has to occur.
  // after we made the form data update, we getOrCreateNode() of the two elements

  swapValues = (indexA: number, indexB: number) => {
    if (this._isKilled) return

    this.form.swapFieldValues(this.name, indexA, indexB, {
      fieldApiOverride: this,
    })
  }

  moveValue = (
    fromIndex: number,
    toIndex: number,
    options: FieldUpdateOptions = {},
  ) => {
    if (this._isKilled) return

    this.form.moveFieldValue(this.name, fromIndex, toIndex, {
      ...options,
      fieldApiOverride: this,
    })
  }

  clearValues = (options: FieldUpdateOptions = {}): void => {
    if (this._isKilled) return

    this.form.clearFieldValues(this.name, {
      ...options,
      fieldApiOverride: this,
    })
  }

  pushValue = (value: any, options: FieldUpdateOptions = {}): void => {
    if (this._isKilled) return

    return this.form.pushFieldValue(this.name, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  insertValue = (
    index: number,
    value: any,
    options: FieldUpdateOptions = {},
  ): void => {
    if (this._isKilled) return

    return this.form.insertFieldValue(this.name, index, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  replaceValue = (
    index: number,
    value: any,
    options: FieldUpdateOptions = {},
  ): void => {
    if (this._isKilled) return

    return this.form.replaceFieldValue(this.name, index, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  removeValue = (index: number, options: FieldUpdateOptions = {}): void => {
    if (this._isKilled) return

    return this.form.removeFieldValue(this.name, index, {
      ...options,
      fieldApiOverride: this,
    })
  }

  filterValues = (
    predicate: (
      value: TryGetArrayElementType<TFieldValue>,
      index: number,
      array: TFieldValue,
    ) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => {
    if (this._isKilled) return

    return this.form.filterFieldValues(this.name, predicate as never, {
      ...options,
      fieldApiOverride: this,
    })
  }

  handleChange = (
    value: Updater<TFieldValue>,
    options: FieldUpdateOptions = {},
  ): void => {
    if (this._isKilled) return

    return this.form.setFieldValue(this.name, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  handleBlur = (): void => {
    if (this._isKilled) return

    // TODO A workplan could let users configure whether listeners run before or after validation.
    // not overly important but could be useful.

    this._handleEvent(
      {
        markAsDirty: false,
        causeValidation: true,
        notifyParentFields: true,
        markAsTouched: true,
        markAsBlurred: true,
      },
      'blur',
    )
  }
}
