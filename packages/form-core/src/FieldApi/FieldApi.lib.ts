import { batch, createAtom } from '@tanstack/store'
import { callUpdater, createPipelineCache, evaluate, getBy } from '../utils.lib'
import {
  clearIndexedErrorsFromSource,
  hasIndexedErrorFromSource,
  isValidationTriggerEnabled,
  parseValidationResult,
  runFieldMountValidatorPipeline,
  runFieldValidatorPipeline,
  setIndexedError,
} from '../validation.lib'
import { runFieldListenerPipeline } from '../listeners.lib'
import { devtools } from '../devtoolsBridge.lib'
import {
  attachWatchingListenerField,
  attachWatchingValidatorField,
  detachWatchingListenerField,
  detachWatchingValidatorField,
  reconcileWatchedListenerFields,
  reconcileWatchedValidatorFields,
} from './linked-fields.lib'
import {
  defaultInternalBaseFieldMeta,
  deriveFromBaseFieldMeta,
  getChildContributionStates,
  getFieldSnapshot,
} from './fieldState.lib'
import {
  killField,
  moveFieldToSegment,
  pruneFieldIfUnused,
  updateChildContributionCount,
} from './fieldTree.lib'
import { visitFieldAndAncestors } from './fieldTraversal.lib'
import type { InternalRootFieldApi } from './RootFieldApi.lib'
import type {
  DeepKeys,
  DeepValue,
  TryGetArrayElementType,
} from '../deep-keys.public'
import type {
  AnyFieldListener,
  FieldListenerTriggers,
} from '../listeners.public'
import type { NameSegment, NameSegments, PipelineCache } from '../utils.lib'
import type {
  FieldValidatorPipelineResult,
  PipelineResult,
} from '../validation.lib'
import type { ResolvedInternalFieldUpdateOptions } from '../types.lib'
import type { FieldUpdateOptions, Updater } from '../types.public'
import type { AnyInternalFormApi } from '../FormApi/FormApi.lib'
import type { ReadonlyAtom } from '@tanstack/store'
import type { FieldApi, FieldApiOptions } from './FieldApi.public'
import type {
  ErrorVisibility,
  FieldErrors,
  FieldValidateResult,
  FieldValidator,
  FieldValidators,
} from '../validation.public'
import type {
  ChildContributionStates,
  DerivedMetaMarkers,
  FieldAtoms,
  InternalBaseFieldMeta,
  InternalFieldMeta,
  InternalFieldState,
} from './fieldState.lib'

export type AnyFieldApiOptions = FieldApiOptions<
  any,
  any,
  any,
  any,
  any,
  any,
  any
>
export type AnyFieldValidator = FieldValidator<any, any, any>

type FieldOptionItemWithWatchedFields = {
  watchFields?: ReadonlyArray<string>
}

type FieldOptionsWithFieldNameReferences = {
  name: string
  validators?: ReadonlyArray<FieldOptionItemWithWatchedFields | undefined>
  listeners?: ReadonlyArray<FieldOptionItemWithWatchedFields | undefined>
}

function transformFieldOptionItemsWithWatchedFields<
  TItem extends FieldOptionItemWithWatchedFields | undefined,
>(
  items: ReadonlyArray<TItem> | undefined,
  transformFieldName: (fieldName: string) => string,
): Array<TItem> | undefined {
  if (!items) return undefined

  return items.map((item) => {
    if (!item?.watchFields) return item

    return {
      ...item,
      watchFields: item.watchFields.map(transformFieldName),
    }
  })
}

export function transformFieldOptionsFieldNames<
  TFieldOptions extends AnyFieldApiOptions,
>(
  fieldOptions: TFieldOptions,
  transformFieldName: (fieldName: string) => string,
  mergeOptions: (
    props: TFieldOptions,
    overrides: Partial<TFieldOptions>,
  ) => TFieldOptions,
): TFieldOptions {
  const options = fieldOptions as TFieldOptions &
    FieldOptionsWithFieldNameReferences

  const overrides = {
    get name() {
      return transformFieldName(options.name)
    },
    get validators() {
      return transformFieldOptionItemsWithWatchedFields(
        options.validators,
        transformFieldName,
      )
    },
    get listeners() {
      return transformFieldOptionItemsWithWatchedFields(
        options.listeners,
        transformFieldName,
      )
    },
  } as Partial<TFieldOptions>

  return mergeOptions(fieldOptions, overrides)
}

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

/**
 * @private
 * Get a field api at the specified location. If it doesn't exist,
 * it will create the necessary nodes to get it.
 *
 * @important This mutates the segments array.
 */
export function getOrCreateFieldApi(
  node: AnyInternalFieldApi | InternalRootFieldApi,
  segments: NameSegments,
  form: AnyInternalFormApi,
  options?: Omit<AnyFieldApiOptions, 'name'>,
): AnyInternalFieldApi {
  const segment = segments.shift()
  if (segment === undefined) {
    // If trieNode is the root, we need to return a field node, not the root
    if (node._isRoot) {
      throw new Error('Root node cannot be a field API')
    }
    // Say we internally make a field for data storage:
    // form._getOrCreateFieldApi({ name: 'foo' })

    // later in the render cycle, a user renders a component that actually does
    // form._getOrCreateFieldApi({ name: 'foo', validators: [...] })

    // This would be too late! Even worse, we're going to send an error that validators
    // changed length when the user did nothing wrong
    // TODO
    if (options) {
      node._update(options)
    }
    return node
  }

  let childNode = node._getChild(segment)
  if (childNode) {
    return getOrCreateFieldApi(childNode, segments, form, options)
  }

  childNode = new InternalFieldApi({
    segment,
    parent: node,
    form: form,
    // We're creating fields on our way to the leaf, so don't
    // pass options like listeners etc.
    ...(segments.length === 0 ? options : {}),
  })

  node._setChild(childNode)
  devtools().fieldAdded?.(childNode)

  return getOrCreateFieldApi(childNode, segments, form, options)
}

/**
 * @private
 *
 * @important This mutates the segments array.
 */
export function tryGetFieldApi(
  trieNode: AnyInternalFieldApi | InternalRootFieldApi,
  segments: NameSegments,
): AnyInternalFieldApi | null {
  const segment = segments.shift()
  if (segment === undefined) {
    // If trieNode is the root, we cannot return it as a field API
    if (!trieNode._isRoot) {
      return trieNode
    }
    return null
  }

  const childNode = trieNode._getChild(segment)
  if (childNode) {
    return tryGetFieldApi(childNode, segments)
  } else {
    return null
  }
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

interface ListenToFieldsMeta {
  field: AnyInternalFieldApi
  name: string
}

export type FieldWatchingFields = Map<AnyInternalFieldApi, Set<number>>
export type FieldListenToFields = Array<Array<ListenToFieldsMeta>>

function hasFieldValidatorErrors(
  meta: InternalBaseFieldMeta,
  indexes: Array<number>,
  sourceEvent: string,
): boolean {
  for (const i of indexes) {
    if (
      hasIndexedErrorFromSource(
        meta._fieldValidatorErrors,
        meta._fieldValidatorErrorSourceEvents,
        i,
        sourceEvent,
      )
    ) {
      return true
    }
  }

  return false
}

export type AnyInternalFieldApi = InternalFieldApi<any, any, any>

export class InternalFieldApi<
  TFormData,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
> implements FieldApi<any, any, any, any, any> {
  readonly _isRoot = false
  _parent: AnyInternalFieldApi | InternalRootFieldApi
  _childrenMap: Map<NameSegment, AnyInternalFieldApi> = new Map()
  _defaultValueCache: DefaultValueCacheEntry | null = null
  _atoms: FieldAtoms
  _validators: Array<AnyFieldValidator> | null
  _listeners: Array<AnyFieldListener> | null
  _errorVisibility: ErrorVisibility<any, any> | undefined
  _errorBoundary: boolean

  // TODO implement
  /**
   * @private
   * Fields that are listening to this one.
   */
  _watchingFields: FieldWatchingFields | null
  _listenToFields: FieldListenToFields | null
  _watchingValidatorFields: FieldWatchingFields | null
  _validateOnFields: FieldListenToFields | null
  _pipelineCache: PipelineCache<any> | null = null
  _isKilled = false
  _mountValidationRan = false

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

  _getOrCreatePipelineCache(): PipelineCache<any> {
    if (this._isKilled) {
      return createPipelineCache()
    }

    if (!this._pipelineCache) {
      this._pipelineCache = createPipelineCache()
    }
    return this._pipelineCache
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

  constructor({
    segment,
    parent,
    validators,
    form,
    listeners,
    errorVisibility,
    errorBoundary,
  }: InternalFieldApiParams) {
    this._segmentValue = segment
    this._parent = parent
    this.form = form
    this._validators =
      validators && validators.length > 0
        ? (validators as Array<AnyFieldValidator>)
        : null
    this._errorVisibility = errorVisibility
    this._errorBoundary = errorBoundary ?? false
    this._atoms = {}
    this._listeners = null
    this._watchingFields = null
    this._listenToFields = null
    this._watchingValidatorFields = null
    this._validateOnFields = null

    const reconciledListeners = reconcileWatchedListenerFields({
      field: this,
      prevListenToFields: this._listenToFields,
      nextListeners: listeners,
      form,
    })

    reconciledListeners.attach.forEach(attachWatchingListenerField)
    this._listeners = reconciledListeners.items
    this._listenToFields = reconciledListeners.listenToFields

    const reconciledValidators = reconcileWatchedValidatorFields({
      field: this,
      prevListenToFields: this._validateOnFields,
      nextValidators: validators as Array<AnyFieldValidator> | undefined,
      form,
    })

    reconciledValidators.attach.forEach(attachWatchingValidatorField)
    this._validators = reconciledValidators.items
    this._validateOnFields = reconciledValidators.listenToFields
  }

  _update(options: Omit<AnyFieldApiOptions, 'name' | 'form'>) {
    if (this._isKilled) return

    this._errorVisibility = options.errorVisibility
    this._errorBoundary = options.errorBoundary ?? false

    const reconciledListeners = reconcileWatchedListenerFields({
      field: this,
      prevListenToFields: this._listenToFields,
      nextListeners: options.listeners,
      form: this.form,
    })

    reconciledListeners.detach.forEach((operation) =>
      detachWatchingListenerField(operation),
    )
    reconciledListeners.attach.forEach(attachWatchingListenerField)

    this._listeners = reconciledListeners.items
    this._listenToFields = reconciledListeners.listenToFields
    const notifyDependencyChanges = devtools().fieldDependenciesChanged
    const dependencyChanges = notifyDependencyChanges
      ? [...reconciledListeners.attach, ...reconciledListeners.detach]
      : null

    if (options.validators) {
      const reconciledValidators = reconcileWatchedValidatorFields({
        field: this,
        prevListenToFields: this._validateOnFields,
        nextValidators: options.validators as Array<AnyFieldValidator>,
        form: this.form,
      })

      reconciledValidators.detach.forEach((operation) =>
        detachWatchingValidatorField(operation),
      )
      reconciledValidators.attach.forEach(attachWatchingValidatorField)

      this._validators = reconciledValidators.items
      this._validateOnFields = reconciledValidators.listenToFields
      dependencyChanges?.push(
        ...reconciledValidators.attach,
        ...reconciledValidators.detach,
      )
    }

    if (dependencyChanges && dependencyChanges.length > 0) {
      notifyDependencyChanges?.(dependencyChanges)
    }
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
      const prevContributions = getChildContributionStates(prevMeta)
      const newContributions = getChildContributionStates(newMeta)

      if (!this._parent._isRoot) {
        this._parent._updateChildContributionCount(
          prevContributions,
          newContributions,
        )
      } else {
        this._parent._updateFieldContributionCount(
          prevContributions,
          newContributions,
        )

        this._parent._updateErrorFields(
          this,
          prevContributions.error,
          newContributions.error,
        )
      }

      return newMeta
    })
    devtools().updateField?.(this)
  }

  /**
   * @private
   * Called when a child's meta contribution changes.
   * Increments/decrements the relevant child contribution count and propagates up.
   */
  _updateChildContributionCount(
    prevState: ChildContributionStates,
    newState: ChildContributionStates,
  ): void {
    updateChildContributionCount(this, prevState, newState)
  }

  /**
   * @private
   * Triggers validation for this field and all parent fields,
   * eventually calling form validation.
   */
  _triggerValidationCascade(event: 'change' | 'blur' | 'submit'): void {
    if (this._isKilled) return

    const seenValidatorFields = new WeakSet<AnyInternalFieldApi>()

    visitFieldAndAncestors(this, (current) => {
      if (current._isKilled) return false

      current._runFieldValidation(event)
      current._notifyValidator(event, seenValidatorFields)
      return undefined
    })

    const group = this.form._getNearestFormGroupForField(this.name)
    if (group) {
      group.validate(event, { triggerFieldApi: this })
      return
    }

    this.form.validate(event, { fieldApiOverride: this })
  }

  /**
   * @private
   * Runs this field's validation pipeline.
   */
  async _runFieldValidation(
    event: 'change' | 'blur' | 'submit',
    options?: {
      onResult?: boolean
      onlyRunValidatorIndeces?: Array<number> | null
    },
  ): Promise<FieldValidatorPipelineResult> {
    if (this._isKilled)
      return {
        results: [],
        hasErrors: false,
        thrownError: null,
      }

    const validators = this._validators

    if (!validators)
      return {
        results: [],
        hasErrors: false,
        thrownError: null,
      }

    this._setValidationCount((count) => count + 1)
    try {
      return await runFieldValidatorPipeline({
        pipeline: validators,
        context: {
          scope: 'field',
          event,
          fieldApi: this,
          formApi: this.form,
        },
        onResult:
          options?.onResult !== false
            ? (result) => this._processValidationResult(result, event)
            : undefined,
        validatorIndecesToRun: options?.onlyRunValidatorIndeces ?? null,
      })
    } finally {
      this._setValidationCount((count) => Math.max(0, count - 1))
    }
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
    result: PipelineResult<FieldValidateResult>,
    sourceEvent: string,
  ) {
    if (this._isKilled) return

    this._setMeta((prev) => {
      const { self } = parseValidationResult(result.result)
      const nextErrors = setIndexedError(
        prev._fieldValidatorErrors,
        prev._fieldValidatorErrorSourceEvents,
        result.validatorIndex,
        self ?? [],
        sourceEvent,
      )

      if (!nextErrors) return prev

      return {
        ...prev,
        _fieldValidatorErrors: nextErrors.errors,
        _fieldValidatorErrorSourceEvents: nextErrors.errorSourceEvents,
      } satisfies InternalBaseFieldMeta
    })
  }

  _clearEventErrors(event: 'change' | 'blur', sourceEvent: string): void {
    if (this._isKilled) return

    const validators = this._validators
    if (!validators) return

    const eventErrorIndexes: Array<number> = []

    for (let i = 0; i < validators.length; i++) {
      const runsOnEvent = validators[i]!.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          scope: 'field',
          event,
          fieldApi: this,
          formApi: this.form,
        }),
      )

      if (!runsOnEvent) {
        eventErrorIndexes.push(i)
      }
    }

    if (eventErrorIndexes.length === 0) return
    if (
      !hasFieldValidatorErrors(
        this._getBaseMeta(),
        eventErrorIndexes,
        sourceEvent,
      )
    ) {
      return
    }

    this._setMeta((prev) => {
      const clearedErrors = clearIndexedErrorsFromSource(
        prev._fieldValidatorErrors,
        prev._fieldValidatorErrorSourceEvents,
        eventErrorIndexes,
        sourceEvent,
      )

      if (!clearedErrors) return prev

      return {
        ...prev,
        _fieldValidatorErrors: clearedErrors.errors,
        _fieldValidatorErrorSourceEvents: clearedErrors.errorSourceEvents,
      } satisfies InternalBaseFieldMeta
    })
    this._pruneIfUnused()
  }

  _notifyEvent(
    options: Omit<
      ResolvedInternalFieldUpdateOptions,
      'fieldApiOverride' | '_skipFieldCreation'
    >,
    event: 'change' | 'blur' | 'submit',
  ): void {
    if (this._isKilled) return

    if (event === 'change' || event === 'blur') {
      this._clearEventErrors(event, 'submit')

      if (event === 'blur') {
        this._clearEventErrors('blur', 'mount')
        this.form._clearEventErrors(this, 'submit', event)
        this.form._clearEventErrors(this, 'server', event)
        this.form._clearEventErrors(this, 'mount', event)
      }
    }

    const {
      markAsDirty,
      markAsTouched,
      causeValidation,
      markAsBlurred,
      doPropagate,
    } = options
    // Not sure if we lose this context, so might as well
    const originalField = this

    batch(() => {
      const seenListenerFields = new WeakSet<AnyInternalFieldApi>()

      visitFieldAndAncestors(this, (currNode) => {
        const isOriginalField = currNode === originalField
        const { isSelfDirty, isSelfTouched, isBlurred } = currNode.meta
        const shouldUpdateDirty = isOriginalField && markAsDirty && !isSelfDirty
        const shouldUpdateTouched =
          isOriginalField && markAsTouched && !isSelfTouched

        const shouldUpdateBlurred = markAsBlurred && !isBlurred

        if (shouldUpdateDirty || shouldUpdateTouched || shouldUpdateBlurred) {
          currNode._setMeta((prev) => ({
            ...prev,
            isTouched: shouldUpdateTouched ? true : prev.isTouched,
            isDirty: shouldUpdateDirty ? true : prev.isDirty,
            isBlurred: markAsBlurred ? true : prev.isBlurred,
          }))
        }

        currNode._notifyListener(event, seenListenerFields)

        if (!doPropagate) return false
        return undefined
      })
    })

    if (causeValidation) {
      this._triggerValidationCascade(event)
    }
  }

  _notifyListener(
    trigger: FieldListenerTriggers,
    seenFields: WeakSet<AnyInternalFieldApi>,
    onlyRunListenerIndeces: Array<number> | null = null,
  ) {
    if (this._isKilled) return

    // Field A listens to Field B listens to field A
    // FieldA.notifyListener -> fieldB.notifyListener -> fieldA.notifyLister
    if (seenFields.has(this)) {
      console.warn(
        `Field listener: cyclical listener cycle detected. Check around the field ${this.name}`,
      )
      return
    }

    seenFields.add(this)

    if (this._listeners) {
      runFieldListenerPipeline({
        pipeline: this._listeners,
        context: {
          event: trigger,
          fieldApi: this,
          formApi: this.form,
        },
        listenerIndecesToRun: onlyRunListenerIndeces,
      })
    }

    const watchingFields = this._watchingFields
    if (!watchingFields) return

    for (const [watchingField, listenerIndeces] of watchingFields) {
      if (watchingField._isKilled) {
        watchingFields.delete(watchingField)
        continue
      }

      watchingField._notifyListener(trigger, seenFields, [...listenerIndeces])
    }

    if (watchingFields.size === 0) {
      this._watchingFields = null
    }
  }

  _notifyValidator(
    trigger: 'change' | 'blur' | 'submit',
    seenFields: WeakSet<AnyInternalFieldApi>,
    onlyRunValidatorIndeces: Array<number> | null = null,
  ) {
    if (this._isKilled) return

    if (seenFields.has(this)) {
      console.warn(
        `Field validator: cyclical validator cycle detected. Check around the field ${this.name}`,
      )
      return
    }

    seenFields.add(this)

    if (this._validators && onlyRunValidatorIndeces) {
      this._runFieldValidation(trigger, { onlyRunValidatorIndeces })
    }

    const watchingFields = this._watchingValidatorFields
    if (!watchingFields) return

    for (const [watchingField, validatorIndeces] of watchingFields) {
      if (watchingField._isKilled) {
        watchingFields.delete(watchingField)
        continue
      }

      watchingField._notifyValidator(trigger, seenFields, [...validatorIndeces])
    }

    if (watchingFields.size === 0) {
      this._watchingValidatorFields = null
    }
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
    const isFirstMount = isMountTransition && !this._mountValidationRan
    this._refCount++
    this._getOrCreateAtoms()
    if (isMountTransition) {
      devtools().mountField?.(this)
    }

    this._notifyListener('mount', new WeakSet())

    if (isFirstMount) {
      this._mountValidationRan = true
      this._runMountValidation()
    }

    return () => this._unregister()
  }

  /**
   * @private
   * Runs validators marked with runOnMount on the first component mount.
   */
  _runMountValidation(): void {
    const validators = this._validators
    if (!validators || validators.length === 0) return

    this._setValidationCount((count) => count + 1)

    const { didRun, asyncPromise } = runFieldMountValidatorPipeline({
      pipeline: validators,
      fieldApi: this,
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

  /**
   * @private
   * Unregister as a component that you're using this field.
   *
   */
  _unregister(): void {
    if (this._isKilled) return

    const previousPath = this.name
    const isUnmountTransition = this._refCount === 1
    this._refCount--
    if (isUnmountTransition) {
      devtools().unmountField?.(this, previousPath)
    }
    this._notifyListener('unmount', new WeakSet())

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

    this._notifyEvent(
      {
        markAsDirty: false,
        causeValidation: true,
        doPropagate: true,
        markAsTouched: true,
        markAsBlurred: true,
      },
      'blur',
    )

    this.form._notifyFormListener('blur', this)
  }
}
