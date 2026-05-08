import { batch, createAtom } from '@tanstack/store'
import { callUpdater, evaluate, normalizeToArray } from './utils'
import {
  createValidatorPipelineCache,
  isErrorResult,
  runFieldValidatorPipeline,
} from './validation.lib'
import type { PipelineResult, ValidatorPipelineCache } from './validation.lib'

import type { PropagateOptions } from './types.lib'
import type { InternalRootFieldApi } from './RootFieldApi.lib'
import type { FieldUpdateOptions, Updater } from './types.public'
import type { AnyInternalFormApi, InternalFormApi } from './FormApi.lib'
import type { Atom, ReadonlyAtom } from '@tanstack/store'
import type {
  BaseFieldMeta,
  FieldApi,
  FieldApiOptions,
  FieldMeta as PublicFieldMeta,
  FieldState as PublicFieldState,
} from './FieldApi.public'
import type {
  ErrorWithMessage,
  FieldValidateResult,
  FieldValidator,
  FormValidator,
  ValidationError,
} from './validation.public'

export type AnyFieldApiOptions = FieldApiOptions<any, any, any>
export type AnyFieldValidator = FieldValidator<any, any>

// TODO Should be irrelevant for SSR, but double check please
const metaCache = new WeakMap<InternalBaseFieldMeta, InternalFieldMeta>()

export type NameSegment = string | number
export type NameSegments = Array<NameSegment>

interface MetaExtension {
  _formValidatorErrors: Array<Array<ValidationError>>
  _fieldValidatorErrors: Array<Array<ValidationError>>
  /**
   * @private
   * Used to rerender for ArrayField components
   */
  _arrayVersion: number
}

export interface InternalBaseFieldMeta extends BaseFieldMeta, MetaExtension {}
export interface InternalFieldMeta extends PublicFieldMeta, MetaExtension {}

export interface InternalFieldState extends PublicFieldState {
  meta: InternalFieldMeta
}

export interface FieldAtoms {
  store: ReadonlyAtom<InternalFieldState>
  meta: Atom<InternalBaseFieldMeta>
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

  const flush = (asNumber: boolean) => {
    if (s.length > 0) {
      result.push(asNumber ? parseInt(s, 10) : s)
      s = ''
    }
  }

  for (const char of nameOrSegments) {
    switch (char) {
      case '.':
      case '[':
        flush(false)
        break
      case ']':
        flush(true)
        break
      default:
        s += char
        break
    }
  }
  flush(false)

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
  childErrorCount: 0,
}

export const defaultInternalBaseFieldMeta: InternalBaseFieldMeta = {
  ...defaultBaseFieldMeta,
  _fieldValidatorErrors: [],
  _formValidatorErrors: [],
  _arrayVersion: 0,
}

export const defaultFieldMeta: InternalFieldMeta = deriveFromBaseFieldMeta(
  defaultInternalBaseFieldMeta,
)

export type AnyInternalFieldApiParams = InternalFieldApiParams<any, any>

export interface InternalFieldApiParams<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> extends Omit<AnyFieldApiOptions, 'name'> {
  segment: NameSegment
  parent: InternalFieldApi<TFormData, TFormValidators> | InternalRootFieldApi
  form: InternalFormApi<TFormData, TFormValidators>
  validators?: Array<AnyFieldValidator>
}

// Possible plan for performance
// When changing array elements, update the segment name
// keep track of a `pathVersion` per node
// mutation segment increments the pathVersion
// when children access fullPath, it checks if parentVersion === childVersion
// if not, recompute and sync version

export type AnyInternalFieldApi = InternalFieldApi<any, any>

export class InternalFieldApi<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> implements FieldApi<TFormData, TFormValidators> {
  readonly _isRoot = false
  _parent: AnyInternalFieldApi | InternalRootFieldApi
  #children: Map<NameSegment, AnyInternalFieldApi> = new Map()
  _pathVersion = 0
  _parentPathVersion = 0
  _fullPathCache: string | null = null
  _atoms: FieldAtoms | null = null
  _validators: Array<AnyFieldValidator>
  _validatorCache: ValidatorPipelineCache<any> | null = null

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
    return this._atoms !== null
  }

  get _children(): Array<AnyInternalFieldApi> {
    return Array.from(this.#children.values())
  }

  _getOrCreateAtoms(): FieldAtoms {
    if (!this._atoms) {
      const metaAtom = createAtom<InternalBaseFieldMeta>(
        defaultInternalBaseFieldMeta,
      )
      const derived = createAtom<InternalFieldState>((prev) => {
        const newMeta = metaAtom.get()
        const value = this._getValue()

        const meta = deriveFromBaseFieldMeta(newMeta, prev?.meta)

        if (prev?.meta === meta && prev.value === value) {
          return prev
        }

        return {
          meta,
          value,
        }
      })

      this._atoms = {
        store: derived,
        meta: metaAtom,
      }
    }
    return this._atoms
  }

  _getOrCreateValidatorCache(): ValidatorPipelineCache<any> {
    if (!this._validatorCache) {
      this._validatorCache = createValidatorPipelineCache()
    }
    return this._validatorCache
  }

  get store(): ReadonlyAtom<InternalFieldState> {
    return this._getOrCreateAtoms().store
  }

  get name(): string {
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
    return this._fullPathCache
  }

  _getBaseMeta(): InternalBaseFieldMeta {
    if (this._atoms) {
      return this._atoms.meta.get()
    } else {
      return defaultInternalBaseFieldMeta
    }
  }

  constructor({
    segment,
    parent,
    validators,
    form,
  }: AnyInternalFieldApiParams) {
    this.#segment = segment
    this._parent = parent
    this.form = form
    this._validators = validators ?? []
  }

  _update(params: Pick<AnyInternalFieldApiParams, 'validators'>) {
    if (params.validators) {
      this._validators = params.validators
    }
  }

  _invalidateFullPath() {
    this._pathVersion++
    this._fullPathCache = null
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
    this._getOrCreateAtoms().meta.set((prevMeta) => {
      const newMeta = callUpdater(updater, prevMeta)

      // Inform parent if error count changed
      const prevContributes =
        prevMeta._fieldValidatorErrors.length > 0 ||
        prevMeta._formValidatorErrors.length > 0 ||
        prevMeta.childErrorCount > 0
      const newContributes =
        newMeta._fieldValidatorErrors.length > 0 ||
        newMeta._formValidatorErrors.length > 0 ||
        newMeta.childErrorCount > 0

      if (!this._parent._isRoot) {
        this._parent._updateChildErrorCount(prevContributes, newContributes)
      }

      return newMeta
    })
  }

  /**
   * @private
   * Called when a child's error contribution changes.
   * Increments/decrements childErrorCount and propagates up.
   */
  _updateChildErrorCount(
    prevContributes: boolean,
    newContributes: boolean,
  ): void {
    if (prevContributes === newContributes) return

    const delta = newContributes ? 1 : -1

    this._setMeta((prev) => ({
      ...prev,
      childErrorCount: prev.childErrorCount + delta,
    }))
  }

  /**
   * @private
   * Triggers validation for this field and all parent fields,
   * eventually calling form validation.
   */
  _triggerValidationCascade(event: 'change' | 'blur' | 'submit'): void {
    let current: AnyInternalFieldApi | InternalRootFieldApi = this

    while (!current._isRoot) {
      current._runFieldValidation(event)
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
  ): Promise<Array<PipelineResult<FieldValidateResult>>> {
    if (this._validators.length === 0) return []

    const results = await runFieldValidatorPipeline({
      pipeline: this._validators,
      context: {
        event,
        fieldApi: this,
        formApi: this.form,
      },
      onResult: (result) => this._processValidationResult(result),
    })

    return results
  }

  _processValidationResult(result: PipelineResult<FieldValidateResult>) {
    this._setMeta((prev) => {
      const prevErrors = prev._fieldValidatorErrors
      const newError = isErrorResult(result.result)
        ? normalizeToArray(result.result)
        : []
      const prevError = prevErrors[result.validatorIndex] ?? []

      // TODO this could be a hot path, but we avoid rerenders if this succeeds.
      // Perhaps change it to a prev.length === 0 === new.length?
      if (evaluate(prevError, newError)) {
        return prev
      }

      const errors = [...prevErrors]
      errors[result.validatorIndex] = newError
      return {
        ...prev,
        _fieldValidatorErrors: errors,
      } satisfies InternalBaseFieldMeta
    })
  }

  _notifyChange(
    options: FieldUpdateOptions & PropagateOptions,
    event: 'change' | 'blur' | 'submit',
  ): void {
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
      if (markAsTouched && originalField._isMounted) {
        originalField.form._fieldRootNode._addToTouchedFields(originalField)
      }

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

      while (!currNode._isRoot) {
        const { isDirty, isTouched, isBlurred } = currNode.meta
        const shouldUpdateDirty = markAsDirty && !isDirty
        const shouldUpdateTouched = markAsTouched && !isTouched
        const shouldUpdateBlurred = markAsBlurred && !isBlurred

        if (shouldUpdateDirty || shouldUpdateTouched || shouldUpdateBlurred) {
          currNode._setMeta((prev) => ({
            ...prev,
            isTouched: markAsTouched ? true : prev.isTouched,
            isDirty: markAsDirty ? true : prev.isDirty,
            isBlurred: markAsBlurred ? true : prev.isBlurred,
          }))
        }
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

  /**
   * @private
   * Register as a component that you're using this field.
   *
   */
  _register() {
    this.#refCount++
  }

  /**
   * @private
   * Unregister as a component that you're using this field.
   *
   */
  _unregister() {
    this.#refCount--

    if (this.#refCount === 0) {
      setTimeout(() => {
        if (this.#refCount === 0) {
          this._atoms = null
        }
      }, 0)
    }
  }

  /**
   * @private
   */
  _moveTo(newSegment: NameSegment): void {
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

      for (const node of nodesToKill) {
        node._parent._removeChild(node._segment)
      }

      this.form._formMetaAtom.set((prev) => {
        let touchedFields = prev.touchedFields

        if (touchedFields.size > 0) {
          const nextTouchedFields = new Set(touchedFields)

          for (const node of nodesToKill) {
            nextTouchedFields.delete(node)
          }

          if (nextTouchedFields.size !== touchedFields.size) {
            touchedFields = nextTouchedFields
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

        return { ...prev, fieldErrors }
      })

      for (const node of nodesToKill) {
        const nodeMeta = node._atoms?.meta.get()

        if (!node._parent._isRoot && nodeMeta) {
          const nodeErrors = getErrorsFromBaseMeta(nodeMeta)
          const wasContributing =
            nodeErrors.length > 0 || nodeMeta.childErrorCount > 0
          if (wasContributing) {
            node._parent._updateChildErrorCount(true, false)
          }
        }

        node._atoms = null
        node._validatorCache = null
        node.#children.clear()
      }
    })
  }

  /**
   * @private
   * Create a new FieldApi with the given segment name and add it as child.
   * @returns the new FieldApi.
   */
  _createChild(segment: NameSegment): AnyInternalFieldApi {
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

  get state() {
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

  get meta() {
    return this.state.meta
  }

  get errors() {
    return this.state.meta.errors
  }

  // data: ['a', 'b']
  // name="data[0]" -> node created, meta created
  // data.swapValues(0, 1) -> valid, but node errors
  // -> swapValues or other arary mutations need to check runtime -> swap values in the array -> THAT's where the check has to occur.
  // after we made the form data update, we getOrCreateNode() of the two elements

  swapValues = (indexA: number, indexB: number) => {
    this.form.swapFieldValues(this.name, indexA, indexB, {
      fieldApiOverride: this,
    })
  }

  clearValues = (options: FieldUpdateOptions = {}): void => {
    this.form.clearFieldValues(this.name, {
      ...options,
      fieldApiOverride: this,
    })
  }

  pushValue = (value: any, options: FieldUpdateOptions = {}): void => {
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
    return this.form.insertFieldValue(this.name, index, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  removeValue = (index: number, options: FieldUpdateOptions = {}): void => {
    return this.form.removeFieldValue(this.name, index, {
      ...options,
      fieldApiOverride: this,
    })
  }

  filterValues = (
    predicate: (value: any, index: number, array: Array<any>) => boolean,
    options?: FieldUpdateOptions & { thisArg?: any },
  ) => {
    return this.form.filterFieldValues(this.name, predicate, {
      ...options,
      fieldApiOverride: this,
    })
  }

  handleChange = (
    value: Updater<any>,
    options: FieldUpdateOptions = {},
  ): void => {
    return this.form.setFieldValue(this.name, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  handleBlur = (): void => {
    this._notifyChange(
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
    meta: deriveFromBaseFieldMeta(field._getBaseMeta()),
  }
}

function deriveFromBaseFieldMeta(
  baseMeta: InternalBaseFieldMeta,
  previousMeta?: InternalFieldMeta,
): InternalFieldMeta {
  const cached = metaCache.get(baseMeta)
  if (cached) return cached

  const errors = getErrorsFromBaseMeta(baseMeta, previousMeta)
  const isInvalid = errors.length > 0 || baseMeta.childErrorCount > 0

  const result: InternalFieldMeta = {
    ...baseMeta,
    isInvalid,
    errors,
    isValid: !isInvalid,
    isPristine: !baseMeta.isDirty,
  }
  metaCache.set(baseMeta, result)
  return result
}

function getErrorsFromBaseMeta(
  baseMeta: InternalBaseFieldMeta,
  previousMeta?: InternalFieldMeta,
): Array<ErrorWithMessage> {
  let result: Array<ErrorWithMessage>
  if (
    previousMeta?._fieldValidatorErrors === baseMeta._fieldValidatorErrors &&
    previousMeta._formValidatorErrors === baseMeta._formValidatorErrors
  ) {
    result = previousMeta.errors
  } else {
    result = baseMeta._fieldValidatorErrors
      .concat(baseMeta._formValidatorErrors)
      // ValidationError is OneOrMany, TypeScript doesn't realize that
      // flat also takes care of that
      .flat() as Array<ErrorWithMessage>
  }
  return result
}
