import { batch, createAtom } from '@tanstack/store'
import {
  callUpdater,
  cancelPipelineCache,
  createPipelineCache,
} from './utils.lib'
import {
  clearIndexedErrorsFromSource,
  hasIndexedErrorFromSource,
  isErrorResult,
  isValidationTriggerEnabled,
  normalizeValidationError,
  runFieldValidatorPipeline,
  setIndexedError,
} from './validation.lib'
import { runFieldListenerPipeline } from './listeners.lib'
import {
  attachWatchingListenerField,
  attachWatchingValidatorField,
  detachWatchingListenerField,
  detachWatchingValidatorField,
  reconcileWatchedListenerFields,
  reconcileWatchedValidatorFields,
} from './linked-fields.lib'
import { rootCounterContributionKeys } from './RootFieldApi.lib'
import type {
  InternalRootFieldApi,
  RootCounterContributionKey,
} from './RootFieldApi.lib'
import type {
  DeepKeys,
  DeepValue,
  TryGetArrayElementType,
} from './deep-keys.public'
import type {
  AnyFieldListener,
  FieldListenerTriggers,
} from './listeners.public'
import type { PipelineCache } from './utils.lib'
import type {
  FieldValidatorPipelineResult,
  PipelineResult,
} from './validation.lib'
import type { PropagateOptions } from './types.lib'
import type { FieldUpdateOptions, Updater } from './types.public'
import type { AnyInternalFormApi } from './FormApi.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type {
  AnyFieldMeta as AnyPublicFieldMeta,
  BaseFieldMeta,
  FieldApi,
  FieldApiOptions,
  FieldState as PublicFieldState,
  SubfieldsMeta,
} from './FieldApi.public'
import type {
  ErrorVisibility,
  FieldErrors,
  FieldValidateResult,
  FieldValidator,
  FieldValidators,
  FormValidators,
  ValidationIssue,
} from './validation.public'

export type AnyFieldApiOptions = FieldApiOptions<any, any, any, any, any, any>
export type AnyFieldValidator = FieldValidator<any, any, any>

// TODO Should be irrelevant for SSR, but double check please
const metaCache = new WeakMap<InternalBaseFieldMeta, InternalFieldMeta>()

export type NameSegment = string | number
export type NameSegments = Array<NameSegment>

export type ChildContributionKey =
  | RootCounterContributionKey
  | 'dirty'
  | 'error'
type ChildContributionCounts = Record<ChildContributionKey, number>
export type ChildContributionStates = Record<ChildContributionKey, boolean>

const childContributionKeys: Array<ChildContributionKey> = [
  'touched',
  'dirty',
  'error',
  'validating',
]

interface MetaExtension {
  _formValidatorErrors: Array<Array<ValidationIssue>>
  _formValidatorErrorSourceEvents: Array<string | null>
  _fieldValidatorErrors: Array<Array<ValidationIssue>>
  _fieldValidatorErrorSourceEvents: Array<string | null>
  childContributionCounts: ChildContributionCounts
  _validationCount: number
  /**
   * @private
   * Used to rerender for ArrayField components
   */
  _arrayVersion: number
}

export interface InternalBaseFieldMeta extends BaseFieldMeta, MetaExtension {}
export interface InternalFieldMeta extends AnyPublicFieldMeta, MetaExtension {}

export interface InternalFieldState extends PublicFieldState<
  any,
  any,
  any,
  any,
  any,
  any
> {
  meta: InternalFieldMeta
}

export interface FieldAtoms {
  store?: ReadonlyAtom<InternalFieldState>
  meta?: Atom<InternalBaseFieldMeta>
}

/**
 * Convert a name into an array of segments.
 *
 * If it already is an array, it will create a shallow copy.
 */
export function nameToFieldNodeSegments(
  nameOrSegments: string | NameSegments,
): NameSegments {
  if (typeof nameOrSegments !== 'string') return nameOrSegments.slice()

  const result: NameSegments = []
  let s = ''

  for (let i = 0; i < nameOrSegments.length; i++) {
    switch (nameOrSegments.charCodeAt(i)) {
      case 0x2e: // '.'
      case 0x5b: // '['
        if (s.length > 0) {
          result.push(s)
          s = ''
        }
        break
      case 0x5d: // ']'
        if (s.length > 0) {
          result.push(parseInt(s, 10))
          s = ''
        }
        break
      default:
        s += nameOrSegments.charAt(i)
        break
    }
  }
  if (s.length > 0) {
    result.push(s)
  }

  return result
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
    ...options,
  })

  node._setChild(childNode)

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

export const defaultBaseFieldMeta: BaseFieldMeta = {
  isTouched: false,
  isDirty: false,
  isBlurred: false,
  isValidating: false,
}

export const defaultInternalBaseFieldMeta: InternalBaseFieldMeta = {
  ...defaultBaseFieldMeta,
  childContributionCounts: {
    touched: 0,
    dirty: 0,
    error: 0,
    validating: 0,
  },
  _validationCount: 0,
  _fieldValidatorErrors: [],
  _fieldValidatorErrorSourceEvents: [],
  _formValidatorErrors: [],
  _formValidatorErrorSourceEvents: [],
  _arrayVersion: 0,
}

export const defaultFieldMeta: InternalFieldMeta = deriveFromBaseFieldMeta(
  defaultInternalBaseFieldMeta,
  undefined,
  undefined,
)

export interface InternalFieldApiParams extends Omit<
  AnyFieldApiOptions,
  'name'
> {
  segment: NameSegment
  parent: AnyInternalFieldApi | InternalRootFieldApi
  form: AnyInternalFormApi
  validators?: FieldValidators<any, any, any>
}

// Possible plan for performance
// When changing array elements, update the segment name
// keep track of a `pathVersion` per node
// mutation segment increments the pathVersion
// when children access fullPath, it checks if parentVersion === childVersion
// if not, recompute and sync version

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

export type AnyInternalFieldApi = InternalFieldApi<any, any, any, any, any, any>

export class InternalFieldApi<
  TFormData,
  TFormValidators extends FormValidators<TFormData>,
  TSubmitReturn,
  TFieldName extends DeepKeys<TFormData>,
  TFieldValue extends DeepValue<TFormData, TFieldName>,
  TFieldValidators extends FieldValidators<TFormData, TFieldName, TFieldValue>,
> implements FieldApi<
  TFormData,
  TFormValidators,
  TSubmitReturn,
  TFieldName,
  TFieldValue,
  TFieldValidators
> {
  readonly _isRoot = false
  _parent: AnyInternalFieldApi | InternalRootFieldApi
  #children: Map<NameSegment, AnyInternalFieldApi> = new Map()
  _pathVersion = 0
  _parentPathVersion = 0
  _fullPathCache: TFieldName | null = null
  _atoms: FieldAtoms
  _validators: Array<AnyFieldValidator> | null
  _listeners: Array<AnyFieldListener> | null
  _errorVisibility: ErrorVisibility | undefined

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

  #segment: NameSegment
  /**
   * @private
   * How many components have marked this field as desired / registered.
   */
  #refCount = 0

  /**
   * @private
   * This is read-only. Use fieldApi._moveTo() instead for writes.
   */
  get _segment(): NameSegment {
    return this.#segment
  }

  form: AnyInternalFormApi

  /**
   * @private
   * Whether a derived atom exists for this field. Atoms are only made
   * on-demand if there is an adapter component that needs one.
   */
  get _isMounted(): boolean {
    return this.#refCount > 0
  }

  get _children(): Array<AnyInternalFieldApi> {
    return Array.from(this.#children.values())
  }

  _getOrCreateAtoms(): Required<FieldAtoms> {
    let { meta: metaAtom, store: storeAtom } = this._atoms
    if (!metaAtom) {
      metaAtom = createAtom(defaultInternalBaseFieldMeta)
    }
    if (!storeAtom) {
      storeAtom = createAtom<InternalFieldState>((prev) => {
        const newMeta = metaAtom.get()
        const value = this._getValue()

        const meta = deriveFromBaseFieldMeta(newMeta, prev?.meta, this)

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

  get store(): ReadonlyAtom<InternalFieldState> {
    return this._getOrCreateAtoms().store
  }

  get name(): TFieldName {
    if (this._parentPathVersion !== this._parent._pathVersion) {
      this._fullPathCache = null
    }

    if (this._fullPathCache) return this._fullPathCache

    const ownSegment =
      typeof this._segment === 'number' ? `[${this._segment}]` : this._segment

    let name = this._parent.name

    // If my parent is not root and not an array, add a dot
    if (!this._parent._isRoot && typeof this._segment !== 'number') {
      name += '.'
    }
    name += ownSegment

    this._fullPathCache = name
    this._parentPathVersion = this._parent._pathVersion
    return this._fullPathCache!
  }

  _getBaseMeta(): InternalBaseFieldMeta {
    return this._atoms.meta?.get() ?? defaultInternalBaseFieldMeta
  }

  constructor({
    segment,
    parent,
    validators,
    form,
    listeners,
    errorVisibility,
  }: InternalFieldApiParams) {
    this.#segment = segment
    this._parent = parent
    this.form = form
    this._validators =
      validators && validators.length > 0
        ? (validators as Array<AnyFieldValidator>)
        : null
    this._errorVisibility = errorVisibility
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

    const reconciledListeners = reconcileWatchedListenerFields({
      field: this,
      prevListenToFields: this._listenToFields,
      nextListeners: options.listeners,
      form: this.form,
    })

    reconciledListeners.detach.forEach(detachWatchingListenerField)
    reconciledListeners.attach.forEach(attachWatchingListenerField)

    this._listeners = reconciledListeners.items
    this._listenToFields = reconciledListeners.listenToFields

    if (options.validators) {
      const reconciledValidators = reconcileWatchedValidatorFields({
        field: this,
        prevListenToFields: this._validateOnFields,
        nextValidators: options.validators as Array<AnyFieldValidator>,
        form: this.form,
      })

      reconciledValidators.detach.forEach(detachWatchingValidatorField)
      reconciledValidators.attach.forEach(attachWatchingValidatorField)

      this._validators = reconciledValidators.items
      this._validateOnFields = reconciledValidators.listenToFields
    }
  }

  _invalidateFullPath() {
    this._pathVersion++
    this._fullPathCache = null
  }

  _invalidateMeta() {
    if (this._atoms.meta) {
      this._atoms.meta.set((prev) => ({ ...prev }))
    }

    for (const child of this.#children.values()) {
      child._invalidateMeta()
    }
  }

  /**
   * @private
   * Get a child FieldApi by its segment name.
   */
  _getChild(segment: NameSegment): AnyInternalFieldApi | undefined {
    return this.#children.get(segment)
  }

  /**
   * @private
   * Set an existing node as a child of this FieldApi.
   */
  _setChild(node: AnyInternalFieldApi): void {
    this.#children.set(node._segment, node)
  }

  /**
   * @private
   * Remove a child node from this FieldApi.
   *
   * @important Does not kill the child node.
   */
  _removeChild(segment: NameSegment): void {
    this.#children.delete(segment)
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
    if (this._isKilled) return

    batch(() => {
      for (const key of childContributionKeys) {
        const prevContributes = prevState[key]
        const newContributes = newState[key]

        if (prevContributes === newContributes) return

        const delta = newContributes ? 1 : -1

        this._setMeta((prev) => ({
          ...prev,
          childContributionCounts: {
            ...prev.childContributionCounts,
            [key]: prev.childContributionCounts[key] + delta,
          },
        }))
      }
    })
  }

  /**
   * @private
   * Triggers validation for this field and all parent fields,
   * eventually calling form validation.
   */
  _triggerValidationCascade(event: 'change' | 'blur' | 'submit'): void {
    if (this._isKilled) return

    let current: AnyInternalFieldApi | InternalRootFieldApi = this
    const seenValidatorFields = new WeakSet<AnyInternalFieldApi>()

    while (!current._isRoot) {
      if (current._isKilled) {
        break
      }

      current._runFieldValidation(event)
      current._notifyValidator(event, seenValidatorFields)
      current = current._parent
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
      const newError = isErrorResult(result.result)
        ? normalizeValidationError(result.result)
        : []
      const nextErrors = setIndexedError(
        prev._fieldValidatorErrors,
        prev._fieldValidatorErrorSourceEvents,
        result.validatorIndex,
        newError,
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

  _clearEventErrors(sourceEvent: string): void {
    if (this._isKilled) return

    const validators = this._validators
    if (!validators) return

    const eventErrorIndexes: Array<number> = []

    for (let i = 0; i < validators.length; i++) {
      const runsOnChange = validators[i]!.triggers.some((trigger) =>
        isValidationTriggerEnabled(trigger, {
          event: 'change',
          fieldApi: this,
          formApi: this.form,
        }),
      )

      if (!runsOnChange) {
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
    options: FieldUpdateOptions & PropagateOptions,
    event: 'change' | 'blur' | 'submit',
  ): void {
    if (this._isKilled) return

    if (event === 'change') {
      this._clearEventErrors('submit')
    }

    const {
      markAsDirty = true,
      markAsTouched = true,
      causeValidation = true,
      markAsBlurred = false,
      doPropagate,
    } = options
    // Not sure if we lose this context, so might as well
    const originalField = this

    let currNode: AnyInternalFieldApi | InternalRootFieldApi = this

    batch(() => {
      // -> it triggered a change
      // -> foo.bar is dirty

      // arrayField -> users
      // fieldA -> users[0] // for now
      // fieldB -> users[1]

      // arrayField.swapValues(0, 1)
      // arrayField.isDirty
      // -> fieldA is not dirty
      // -> fieldA changes -> arrayField was changed -> form is changed

      /**
       * We need meta dataflow to go from:
       *
       * Child -> parent
       *
       * Rather than:
       *
       * Parent -> child
       *
       * This is because a child can access a parent's dataset, but the parent cannot access the child easily:
       *
       * @example <form.Field name="users" children={arrayField => <form.Field name={"users[0]"} children={fieldA => { "fieldA can access arrayField but not vice-versa" }} />} />
       *
       */
      // arrayField.isSelfDirty -> somebody called arrayField.handleChange()
      // arrayField.isAChildDirty -> somebody called fieldA.handleChange() or fieldB.handleChange()
      // arrayField.isDirty -> arrayField.isSelfDirty || arrayField.isAChildDirty

      // arrayField.pushValue()

      // arrayField represents itself + fieldA + fieldB
      // fieldA can have special "override" meta
      // -> field-level validators

      const seenListenerFields = new WeakSet<AnyInternalFieldApi>()

      while (!currNode._isRoot) {
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

        if (doPropagate) {
          currNode = currNode._parent
        } else {
          break
        }
      }
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

    this.#refCount++
    this._getOrCreateAtoms()

    this._notifyListener('mount', new WeakSet())
    return () => this._unregister()
  }

  /**
   * @private
   * Unregister as a component that you're using this field.
   *
   */
  _unregister(): void {
    if (this._isKilled) return

    this.#refCount--
    this._notifyListener('unmount', new WeakSet())

    if (this.#refCount <= 0) {
      setTimeout(() => {
        this._atoms.store = undefined

        if (this._atoms.meta?.get() === defaultInternalBaseFieldMeta) {
          this._atoms.meta = undefined
        }

        this._pruneIfUnused()
      }, 0)
    }
  }

  reset = () => {
    // TODO: add reset functionality
    this.form.resetField(this.name, { fieldApiOverride: this })

    this._notifyListener('reset', new WeakSet())
  }

  /**
   * @private
   */
  _moveTo(newSegment: NameSegment): void {
    if (this._isKilled) return

    if (this.#segment === newSegment) {
      return
    }
    /**
     * swapFieldValues 0 (indexA) and 1 (indexB)
     * arrayField.moveChild(indexA, indexB) -> moves fieldA to fieldB's segment but replaces it
     * arrayField.moveChild(1, 0)
     *
     * fieldA.moveTo(indexB)
     * fieldB.moveTo(indexA)
     *
     * fieldA removes 0 and sets 1
     * fieldB removes 1 and sets 0
     * -> fieldA was lost
     */
    const oldSegment = this.#segment
    this.#segment = newSegment
    this._invalidateFullPath()
    if (this._parent._getChild(oldSegment) === this) {
      this._parent._removeChild(oldSegment)
    }
    this._parent._setChild(this)
  }

  /**
   * @private
   * Kill this field and its children.
   * Removes the affected fields' meta as well.
   */
  _kill() {
    batch(() => {
      const stack: Array<AnyInternalFieldApi> = [this]
      const nodesToKill: Array<AnyInternalFieldApi> = []
      const nodesToKillSet = new Set<AnyInternalFieldApi>()

      while (stack.length > 0) {
        const node = stack.pop()!
        nodesToKill.push(node)
        nodesToKillSet.add(node)
        stack.push(...node._children)
      }

      this._parent._removeChild(this._segment)

      const killedRootCounterContributions: Record<
        RootCounterContributionKey,
        number
      > = {
        touched: 0,
        validating: 0,
      }

      for (const node of nodesToKill) {
        const nodeMeta = node._atoms.meta?.get()

        if (!node._parent._isRoot && nodeMeta) {
          node._parent._updateChildContributionCount(
            getChildContributionStates(nodeMeta),
            {
              dirty: false,
              error: false,
              touched: false,
              validating: false,
            },
          )
        } else if (nodeMeta) {
          const contributions = getChildContributionStates(nodeMeta)
          for (const key of rootCounterContributionKeys) {
            if (contributions[key]) {
              killedRootCounterContributions[key]++
            }
          }
        }

        node._isKilled = true
        node.#refCount = 0
        node._atoms.store = undefined
        if (node._pipelineCache) {
          cancelPipelineCache(node._pipelineCache)
          node._pipelineCache = null
        }
        node.#children.clear()

        node._parent._removeChild(node._segment)
      }

      this.form._formMetaAtom.set((prev) => {
        let errorFields = prev.errorFields
        const touchedFieldCount = Math.max(
          0,
          prev.touchedFieldCount - killedRootCounterContributions.touched,
        )
        const fieldValidationCount = Math.max(
          0,
          prev.fieldValidationCount - killedRootCounterContributions.validating,
        )

        if (errorFields.size > 0) {
          const nextErrorFields = new Set(errorFields)

          for (const node of nodesToKill) {
            nextErrorFields.delete(node)
          }

          if (nextErrorFields.size !== errorFields.size) {
            errorFields = nextErrorFields
          }
        }

        const fieldErrors = [...prev.fieldErrors]

        for (let i = 0; i < fieldErrors.length; i++) {
          const currFieldErrors = fieldErrors[i]
          if (!currFieldErrors || currFieldErrors.size === 0) continue

          let next: Set<AnyInternalFieldApi> | undefined

          for (const node of currFieldErrors) {
            if (nodesToKillSet.has(node)) {
              if (!next) {
                next = new Set(currFieldErrors)
              }
              next.delete(node)
            }
          }

          if (next) {
            fieldErrors[i] = next
          }
        }

        return {
          ...prev,
          touchedFieldCount,
          errorFields,
          fieldValidationCount,
          fieldErrors,
        }
      })
    })
  }

  _canPrune(): boolean {
    if (this._isKilled) return false

    if (this.#refCount > 0) return false
    if (this.#children.size > 0) return false
    if (this._watchingFields) return false
    if (this._watchingValidatorFields) return false
    const meta = this._atoms.meta?.get() ?? defaultInternalBaseFieldMeta
    if (!isPrunableMeta(meta)) return false

    return true
  }

  _pruneIfUnused(): void {
    let node: AnyInternalFieldApi | InternalRootFieldApi = this

    while (!node._isRoot) {
      if (!node._canPrune()) {
        break
      }

      node._parent._removeChild(node._segment)

      node = node._parent
    }
  }

  /**
   * @private
   * Create a new FieldApi with the given segment name and add it as child.
   * @returns the new FieldApi.
   */
  _createChild(segment: NameSegment): AnyInternalFieldApi {
    if (this._isKilled) {
      throw new Error('Cannot create a child field from a killed field')
    }

    const node = new InternalFieldApi({
      segment,
      parent: this,
      form: this.form,
    })
    this._setChild(node)
    return node
  }

  _getValue(): any {
    return this.form.getFieldValue(this.name)
  }

  get state(): InternalFieldState {
    // Accessing `store` mounts the field, which we don't necessarily want.
    // Parent or child nodes may simply want some info about a field's state.
    if (this._isMounted) {
      return this.store.get()
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

  get errors(): FieldErrors<TFormValidators, TFieldValidators, TSubmitReturn> {
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
  }
}

// On-demand (useStore or field children) -> create Derived
// You need state changes anyways -> baseAtom for meta -> (?derived from form and baseAtom)

// v1: FieldMeta record atom
// v1: field Derived from form atom and fieldMeta atom

// foo > bar > foobar
//           > barfoo

// useForm({ unusedField: '' })
// <Field name="usedField" />

// const obj1 = { child: null }
// const obj2 = { child: obj1 }
// obj1.child = obj2

// On form creation, run node generation based on defaultValues
// If defaultValues changes, run diffing algo to add nodes if missing -> untouched fields will have their value updated
// dropdown: selects mode, then query for options

// Virtualized rows
// onSubmit: checks the whole schema
// render: only what's visible -> only Field with name="users[5-10]" -> onComponentUnmount listener destroys the field
// but if we did eager evaluation of tree, we would have 100000 nodes with lazy created meta

// defaultValues: { mode: 'a', data: null }

// foo > bar > foobar > mountsHere
// atoms created: 1 // metaRecord
// derived created: 1

// If we had nodeId:
// metaMap: Partial<Record<nodeId, FieldMetaWithoutError>>
// each Node: nodeId?: string;
// getOrCreateNodeByFieldId(fieldId: string): create Node, get nodeId, create derived, register in metaMap

// validateArray() -> touches all child nodes -> traverse, check for nodeId, if present, set it in the map

function getFieldSnapshot(field: AnyInternalFieldApi): InternalFieldState {
  return {
    value: field._getValue(),
    meta: deriveFromBaseFieldMeta(field._getBaseMeta(), undefined, field),
  }
}

function deriveFromBaseFieldMeta(
  baseMeta: InternalBaseFieldMeta,
  previousMeta: InternalFieldMeta | undefined,
  field: AnyInternalFieldApi | undefined,
): InternalFieldMeta {
  const errorVisibility = getErrorVisibility(field)
  const canDisplayErrors = shouldDisplayErrors(errorVisibility, field, baseMeta)
  const canUseMetaCache = errorVisibility === 'always'
  const cached = canUseMetaCache ? metaCache.get(baseMeta) : undefined
  if (cached) return cached

  const originalErrors = getErrorsFromBaseMeta(baseMeta, previousMeta)
  const errors = canDisplayErrors ? originalErrors : []
  const isSelfTouched = baseMeta.isTouched
  const isSelfDirty = baseMeta.isDirty
  const isSelfValid = errors.length === 0
  const isOriginalSelfValid = originalErrors.length === 0
  const subfields: SubfieldsMeta = {
    isEveryValid: baseMeta.childContributionCounts.error === 0,
    isAnyInvalid: baseMeta.childContributionCounts.error > 0,
    isEveryPristine: baseMeta.childContributionCounts.dirty === 0,
    isSomeDirty: baseMeta.childContributionCounts.dirty > 0,
    isSomeTouched: baseMeta.childContributionCounts.touched > 0,
    isSomeValidating: baseMeta.childContributionCounts.validating > 0,
  }
  const isTouched = isSelfTouched || subfields.isSomeTouched
  const isDirty = isSelfDirty || subfields.isSomeDirty
  const isSelfValidating = baseMeta.isValidating
  const isValidating = isSelfValidating || subfields.isSomeValidating
  const isValid = isSelfValid && subfields.isEveryValid
  const isInvalid = !isValid

  const result: InternalFieldMeta = {
    ...baseMeta,
    isTouched,
    isSelfTouched,
    isDirty,
    isSelfDirty,
    isInvalid,
    isSelfValid,
    isSelfValidating,
    isValidating,
    errors,
    original: {
      errors: originalErrors,
      isValid: isOriginalSelfValid && subfields.isEveryValid,
      isInvalid: !(isOriginalSelfValid && subfields.isEveryValid),
    },
    isValid,
    subfields,
    isPristine: !isDirty,
  }
  if (canUseMetaCache) {
    metaCache.set(baseMeta, result)
  }
  return result
}

function getErrorVisibility(
  field: AnyInternalFieldApi | undefined,
): ErrorVisibility {
  return (
    field?._errorVisibility ?? field?.form.options.errorVisibility ?? 'always'
  )
}

function shouldDisplayErrors(
  errorVisibility: ErrorVisibility,
  field: AnyInternalFieldApi | undefined,
  baseMeta: InternalBaseFieldMeta,
): boolean {
  if (!field) return true
  const hasSubmitBeenAttempted = field.form._submissionAttemptsAtom.get() > 0

  switch (errorVisibility) {
    case 'always':
      return true
    case 'touched':
      return baseMeta.isTouched || baseMeta.childContributionCounts.touched > 0
    case 'blurred':
      return baseMeta.isBlurred
    case 'blurred-or-submit-attempted':
      return baseMeta.isBlurred || hasSubmitBeenAttempted
    case 'submit-attempted':
      return hasSubmitBeenAttempted
  }
}

function getChildContributionStates(
  meta: InternalBaseFieldMeta,
): ChildContributionStates {
  return {
    touched: meta.isTouched || meta.childContributionCounts.touched > 0,
    dirty: meta.isDirty || meta.childContributionCounts.dirty > 0,
    validating:
      meta.isValidating || meta.childContributionCounts.validating > 0,
    error:
      getErrorsFromBaseMeta(meta).length > 0 ||
      meta.childContributionCounts.error > 0,
  }
}

function hasValidatorErrors(errors: Array<Array<ValidationIssue>>): boolean {
  return errors.some((validatorErrors) => validatorErrors.length > 0)
}

function isPrunableMeta(meta: InternalBaseFieldMeta): boolean {
  if (meta.isTouched) return false
  if (meta.isDirty) return false
  if (meta.isBlurred) return false
  if (meta.isValidating) return false
  if (meta._validationCount !== 0) return false
  if (meta._arrayVersion !== 0) return false
  if (hasValidatorErrors(meta._fieldValidatorErrors)) return false
  if (hasValidatorErrors(meta._formValidatorErrors)) return false

  return childContributionKeys.every(
    (key) => meta.childContributionCounts[key] === 0,
  )
}
function getErrorsFromBaseMeta(
  baseMeta: InternalBaseFieldMeta,
  previousMeta?: InternalFieldMeta,
): Array<ValidationIssue> {
  let result: Array<ValidationIssue>
  if (
    previousMeta?._fieldValidatorErrors === baseMeta._fieldValidatorErrors &&
    previousMeta._formValidatorErrors === baseMeta._formValidatorErrors
  ) {
    result = previousMeta.original.errors
  } else {
    result = baseMeta._fieldValidatorErrors
      .concat(baseMeta._formValidatorErrors)
      // ValidationError is OneOrMany, TypeScript doesn't realize that
      // flat also takes care of that
      .flat()
  }
  return result
}
