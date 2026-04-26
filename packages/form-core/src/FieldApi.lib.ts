import { batch, createAtom } from '@tanstack/store'
import { callUpdater } from './utils'

import type { Updater } from './types.public'
import type { InternalFormApi } from './FormApi.lib'
import type { ReadonlyAtom } from '@tanstack/store'
import type { FieldApi, FieldMeta, FieldState } from './FieldApi.public'
import type { FormApi } from './FormApi.public'

export function nameToFieldNodeSegments(
  nameOrSegments: string | Array<string>,
): Array<string> {
  if (typeof nameOrSegments !== 'string') return nameOrSegments

  const result: Array<string> = []
  let s = ''

  for (const char of nameOrSegments) {
    switch (char) {
      case '.':
      case '[':
        result.push(s)
        s = ''
        break
      case ']':
        break
      default:
        s += char
        break
    }
  }
  result.push(s)

  return result
}

export function getOrCreateFieldApi<TData>(
  trieNode: InternalFieldApi<TData>,
  segments: Array<string>,
  form: FormApi<any>,
): InternalFieldApi<TData> {
  const [segment, ...nextSegments] = segments
  if (!segment) return trieNode

  let childNode = trieNode._getChild(segment)
  if (childNode) {
    return getOrCreateFieldApi(childNode, nextSegments, form)
  }

  childNode = new InternalFieldApi({
    segment,
    parent: trieNode,
    form: form as InternalFormApi<TData>,
  })

  trieNode._setChild(childNode)

  return getOrCreateFieldApi(childNode, nextSegments, form)
}

export const defaultFieldMeta: FieldMeta = {
  isTouched: false,
  errors: [],
}

export interface InternalFieldApiParams<TData> {
  segment: string
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
  _type: 'array' | 'object' | null
  _segment: string
  _parent: InternalFieldApi<TData> | null
  _childrenArray: Array<InternalFieldApi<TData>> = []
  _childrenMap: Map<string, InternalFieldApi<TData>> = new Map()
  _fullPathCache: string | null = null
  _store: ReadonlyAtom<FieldState> | null = null

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
    // The root node is created before the form exists, so we should
    // lazily evaluate isArray to avoid an undefined check
    if (this._type === null) {
      this._type = Array.isArray(this._getValue()) ? 'array' : 'object'
    }
    return this._type === 'array'
  }

  get _children(): Array<InternalFieldApi<TData>> {
    if (this._isArray) {
      return this._childrenArray
    }
    return Array.from(this._childrenMap.values())
  }

  get store(): ReadonlyAtom<FieldState> {
    if (!this._store) {
      const derived = createAtom(() => {
        return getFieldState(this)
      })

      this._store = derived
    }
    return this._store
  }

  get name(): string {
    if (this._fullPathCache) return this._fullPathCache
    let segment: string = this._parent?._segment ?? ''
    // If the parent is the root node
    if (this._parent?._segment) {
      segment += this._parent._isArray
        ? `[${this._segment}]`
        : `.${this._segment}`
    } else {
      segment += this._segment
    }
    this._fullPathCache = segment
    return this._fullPathCache
  }

  constructor({ segment, parent, form }: InternalFieldApiParams<TData>) {
    this._segment = segment
    this._parent = parent
    this.form = form
    // lazily evaluate it since it depends on form state. The root node
    // cannot yet get that state.
    this._type = null
  }

  _invalidateFullPath() {
    this._fullPathCache = null
    this._children.forEach((child) => child._invalidateFullPath())
  }

  /**
   * @private
   * Get a child FieldApi by its segment name.
   */
  _getChild(segment: string): InternalFieldApi<TData> | undefined {
    if (this._isArray) {
      return this._childrenArray[parseInt(segment, 10)]
    }
    return this._childrenMap.get(segment)
  }

  /**
   * @private
   * Set an existing node as a child of this FieldApi.
   */
  _setChild(node: InternalFieldApi<TData>): void {
    if (this._isArray) {
      this._childrenArray[parseInt(node._segment, 10)] = node
    } else {
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

  /**
   * @private
   * Mark this field and its parents as touched.
   */
  _markAsTouched(options?: { doPropagation?: boolean }) {
    const doPropagation = options?.doPropagation ?? true

    let currNode: InternalFieldApi<any> | null = this

    batch(() => {
      while (currNode) {
        if (currNode._isMounted && !currNode.meta.isTouched) {
          currNode._setMeta((prev) => ({ ...prev, isTouched: true }))
        }
        if (doPropagation) {
          currNode = currNode._parent
        } else {
          break
        }
      }
    })
  }

  /**
   * @private
   * Create a new FieldApi with the given segment name and add it as child.
   * @returns the new FieldApi.
   */
  _createChild(segment: string): InternalFieldApi<TData> {
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

  // foo.bar set{{foo, {}}}
  // foo.bar set{{foo:  {bar: 1}}}

  /**
   * parent.getValue().[ourSegment] = value
   * @param value
   * @returns
   */
  _setValue(value: any): any {
    return this.form.setFieldValue(this.name, value)
  }

  get state() {
    // Accessing `store` mounts the field, which we don't necessarily want.
    // Parent or child nodes may simply want some info about a field's state.
    if (this._isMounted) {
      return this.store.get()
    } else {
      return getFieldState(this)
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

  swapValues(oldIndex: number, newIndex: number) {
    if (!this._isArray) {
      console.warn('swapValues: This method can only be used on array fields')
      return
    }

    const oldChild = this._childrenArray[oldIndex]
    const newChild = this._childrenArray[newIndex]

    if (!oldChild || !newChild) {
      console.warn(
        'swapValues: One of the indices does not exist in children array',
      )

      return
    }

    this._childrenArray[oldIndex] = newChild
    this._childrenArray[newIndex] = oldChild
    newChild._segment = String(newIndex)
    oldChild._segment = String(oldIndex)

    oldChild._invalidateFullPath()
    newChild._invalidateFullPath()
  }

  pushValue() {
    if (!this._isArray) {
      console.warn('pushValues can only be used on array nodes')
      return
    }
  }

  handleChange(value: Updater<any>): void {
    this._setValue(value)
    this._markAsTouched()
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

// name="obj1.obj2"
// delete obj1 -> 2 nodes to destroy

// defaultValues: { mode: 'a', data: null }

// foo > bar > foobar > mountsHere
// atoms created: 1 // metaRecord
// derived created: 1

// If we had nodeId:
// metaMap: Partial<Record<nodeId, FieldMetaWithoutError>>
// each Node: nodeId?: string;
// getOrCreateNodeByFieldId(fieldId: string): create Node, get nodeId, create derived, register in metaMap

// validateArray() -> touches all child nodes -> traverse, check for nodeId, if present, set it in the map

function getFieldState(field: InternalFieldApi<any>): FieldState {
  const metaMap = field.form.fieldMetaAtom.get()
  const fieldMeta = metaMap.get(field)
  const fieldValue = field._getValue()

  return {
    value: fieldValue,
    meta: fieldMeta ?? defaultFieldMeta,
  }
}
