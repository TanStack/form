import { batch, createAtom } from '@tanstack/store'
import { callUpdater } from './utils'

import type { FieldUpdateOptions, Updater } from './types.public'
import type { InternalFormApi } from './FormApi.lib'
import type { ReadonlyAtom } from '@tanstack/store'
import type {
  BaseFieldMeta,
  FieldApi,
  FieldMeta,
  FieldState,
} from './FieldApi.public'
import type { FormApi } from './FormApi.public'

interface PropagateOptions {
  /**
   * Whether to propagate the action to parent field nodes.
   */
  doPropagate: boolean
}

export type NameSegment = string | number
export type NameSegments = Array<NameSegment>

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
export function getOrCreateFieldApi<TData>(
  trieNode: InternalFieldApi<TData>,
  segments: NameSegments,
  form: FormApi<any>,
): InternalFieldApi<TData> {
  const segment = segments.shift()
  if (segment === undefined) return trieNode

  let childNode = trieNode._getChild(segment)
  if (childNode) {
    return getOrCreateFieldApi(childNode, segments, form)
  }

  childNode = new InternalFieldApi({
    segment,
    parent: trieNode,
    form: form as InternalFormApi<TData>,
  })

  trieNode._setChild(childNode)

  return getOrCreateFieldApi(childNode, segments, form)
}

/**
 * @private
 *
 * @important This mutates the segments array.
 */
export function tryGetFieldApi<TData>(
  trieNode: InternalFieldApi<TData>,
  segments: NameSegments,
): InternalFieldApi<TData> | null {
  const segment = segments.shift()
  if (!segment) return trieNode

  const childNode = trieNode._getChild(segment)
  if (childNode) {
    return tryGetFieldApi(childNode, segments)
  } else {
    return null
  }
}

export const defaultFieldMeta: FieldMeta = {
  isTouched: false,
  isDirty: false,
  isInvalid: false,
  isPristine: true,
  isValid: true,
  errors: [],
}

export interface InternalFieldApiParams<TData> {
  segment: NameSegment
  parent: InternalFieldApi<TData> | null
  form: InternalFormApi<TData>
}

// Possible plan for performance
// When changing array elements, update the segment name
// keep track of a `pathVersion` per node
// mutation segment increments the pathVersion
// when children access fullPath, it checks if parentVersion === childVersion
// if not, recompute and sync version

export class InternalFieldApi<TData> implements FieldApi<TData> {
  _type: 'array' | 'object' | 'leaf' = 'leaf'
  _parent: InternalFieldApi<TData> | null
  _childrenArray: Array<InternalFieldApi<TData>> = []
  _childrenMap: Map<string, InternalFieldApi<TData>> = new Map()
  _fullPathCache: string | null = null
  _store: ReadonlyAtom<FieldState> | null = null

  #segment: NameSegment

  get _segment(): NameSegment {
    return this.#segment
  }

  set _segment(value: NameSegment) {
    if (this.#segment === value) {
      return
    }
    this.#segment = value
    this._invalidateFullPath()
  }

  form: InternalFormApi<any>

  /**
   * @private
   * Whether a derived atom exists for this field. Atoms are only made
   * on-demand if there is an adapter component that needs one.
   */
  get _isMounted(): boolean {
    return this._store !== null
  }

  get _isArray(): boolean {
    return this._type === 'array'
  }

  get _isLeaf(): boolean {
    return this._type === 'leaf'
  }

  get _children(): Array<InternalFieldApi<TData>> {
    switch (this._type) {
      case 'array':
        return this._childrenArray.filter(Boolean)
      case 'object':
        return Array.from(this._childrenMap.values())
      case 'leaf':
        return []
    }
  }

  get store(): ReadonlyAtom<FieldState> {
    if (!this._store) {
      const derived = createAtom<FieldState>((prev) => {
        const baseMeta = getBaseFieldMeta(this)
        const value = this._getValue()

        let meta: FieldMeta
        if (prev && isSameBaseMeta(prev.meta, baseMeta)) {
          meta = prev.meta
        } else {
          meta = {
            ...baseMeta,
            isPristine: !baseMeta.isDirty,
            isInvalid: baseMeta.errors.length > 0,
            isValid: baseMeta.errors.length === 0,
          }
        }

        if (prev?.meta === meta && prev.value === value) {
          return prev
        }

        return {
          meta,
          value,
        }
      })

      this._store = derived
    }
    return this._store
  }

  get name(): string {
    if (this._fullPathCache) return this._fullPathCache
    if (!this._parent) return ''

    const ownSegment =
      typeof this._segment === 'number' ? `[${this._segment}]` : this._segment

    let name = this._parent.name
    // If my parent is root or an array, don't add a dot
    if (this._parent._parent && typeof this._segment !== 'number') {
      name += '.'
    }
    name += ownSegment
    this._fullPathCache = name
    return this._fullPathCache
  }

  constructor({ segment, parent, form }: InternalFieldApiParams<TData>) {
    this.#segment = segment
    this._parent = parent
    this.form = form
  }

  _invalidateFullPath() {
    this._fullPathCache = null
    this._children.forEach((child) => child._invalidateFullPath())
  }

  /**
   * @private
   * Get a child FieldApi by its segment name.
   */
  _getChild(segment: NameSegment): InternalFieldApi<TData> | undefined {
    switch (this._type) {
      case 'array':
        if (typeof segment !== 'number') return undefined
        return this._childrenArray[segment]
      case 'object':
        if (typeof segment !== 'string') return undefined
        return this._childrenMap.get(segment)
      case 'leaf':
        return undefined
    }
  }

  /**
   * @private
   * Set an existing node as a child of this FieldApi.
   */
  _setChild(node: InternalFieldApi<TData>): void {
    if (this._type === 'leaf') {
      this._type = typeof node._segment === 'number' ? 'array' : 'object'
    }

    if (this._type === 'array') {
      if (typeof node._segment !== 'number') {
        console.warn(
          'Adding a string accessor to an array field is not allowed.',
        )
        return
      }

      this._childrenArray[node._segment] = node
    } else {
      if (typeof node._segment !== 'string') {
        console.warn(
          'Adding a numeric accessor to an object field is not allowed.',
        )
        return
      }

      this._childrenMap.set(node._segment, node)
    }
  }

  /**
   * @private
   * Set this field's meta. If not present, it will create the
   * entry.
   */
  _setMeta(updater: Updater<FieldMeta>) {
    this.form.fieldMetaAtom.set((prevMap) => {
      const map = new Map(prevMap)
      const meta = map.get(this) ?? defaultFieldMeta
      map.set(this, callUpdater(updater, meta))
      return map
    })
  }

  _notifyChange(
    options: FieldUpdateOptions & PropagateOptions = { doPropagate: true },
  ) {
    const { markAsDirty = true, markAsTouched = true, doPropagate } = options

    let currNode: InternalFieldApi<any> | null = this

    batch(() => {
      while (currNode) {
        const { isDirty, isTouched } = currNode.meta
        const shouldUpdateDirty = markAsDirty && !isDirty
        const shouldUpdateTouched = markAsTouched && !isTouched

        if (shouldUpdateDirty || shouldUpdateTouched) {
          currNode._setMeta((prev) => ({
            ...prev,
            isTouched: markAsTouched ? true : prev.isTouched,
            isDirty: markAsDirty ? true : prev.isDirty,
          }))
        }
        if (doPropagate) {
          currNode = currNode._parent
        } else {
          break
        }
      }
    })
  }

  /**
   * @private
   * Kill this field and its children.
   * Removes the affected fields' meta as well.
   */
  _kill() {
    batch(() => {
      const stack: Array<InternalFieldApi<any>> = [this]

      while (stack.length > 0) {
        const currField = stack.pop()!

        currField._store = null

        currField.form.fieldMetaAtom.set((prev) => {
          const map = new Map(prev)
          map.delete(this)
          return map
        })

        stack.push(...currField._children)
      }
    })
  }

  /**
   * @private
   * Create a new FieldApi with the given segment name and add it as child.
   * @returns the new FieldApi.
   */
  _createChild(segment: NameSegment): InternalFieldApi<TData> {
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

  swapValues(indexA: number, indexB: number) {
    this.form.swapFieldValues(this.name, indexA, indexB, {
      fieldApiOverride: this,
    })
  }

  pushValue(value: any, options: FieldUpdateOptions = {}): void {
    return this.form.pushFieldValue(this.name, value, {
      ...options,
      fieldApiOverride: this,
    })
  }

  handleChange(value: Updater<any>, options: FieldUpdateOptions = {}): void {
    return this.form.setFieldValue(this.name, value, {
      ...options,
      fieldApiOverride: this,
    })
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

function getFieldSnapshot(field: InternalFieldApi<any>): FieldState {
  const baseMeta = getBaseFieldMeta(field)
  return {
    value: field._getValue(),
    meta: {
      ...baseMeta,
      isInvalid: baseMeta.errors.length > 0,
      isValid: baseMeta.errors.length === 0,
      isPristine: !baseMeta.isDirty,
    },
  }
}

function getBaseFieldMeta(field: InternalFieldApi<any>): BaseFieldMeta {
  return field.form.fieldMetaAtom.get().get(field) ?? defaultFieldMeta
}

function isSameBaseMeta(metaA: BaseFieldMeta, metaB: BaseFieldMeta): boolean {
  return (
    metaA.isTouched === metaB.isTouched &&
    metaA.isDirty === metaB.isDirty &&
    metaA.errors === metaB.errors
  )
}
