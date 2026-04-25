import { createAtom } from '@tanstack/store'

// types
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
  _type: 'array' | null
  _segment
  _parent
  _childrenArray: Array<InternalFieldApi<TData>> = []
  _childrenMap: Map<string, InternalFieldApi<TData>> = new Map()
  _fullPathCache: string | null = null
  _store: ReadonlyAtom<FieldState> | null = null

  form: InternalFormApi<any>

  get _isArray() {
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
        const metaMap = this.form.fieldMetaAtom.get()
        const fieldMeta = metaMap.get(this)
        const fieldValue = this._getValue()

        return {
          value: fieldValue,
          meta: fieldMeta ?? defaultFieldMeta,
        }
      })

      if (this.form.fieldMetaAtom.get().get(this) === undefined) {
        this.form.fieldMetaAtom.set((prev) => {
          const result = new Map(prev)
          result.set(this, defaultFieldMeta)
          return result
        })
      }
      this._store = derived
    }
    return this._store
  }

  get name(): string {
    if (this._fullPathCache) return this._fullPathCache
    let segment: string
    if (this._parent) {
      segment = this._parent._isArray
        ? `[${this._segment}]`
        : `.${this._segment}`
    } else {
      segment = this._segment
    }
    this._fullPathCache = segment
    return this._fullPathCache
  }

  constructor({ segment, parent, form }: InternalFieldApiParams<TData>) {
    this._segment = segment
    this._parent = parent
    this._type = null // Array.isArray(form.getFieldValue())
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
    return this.store.get()
  }

  get value() {
    return this.store.get().value
  }

  get meta() {
    return this.store.get().meta
  }

  get errors() {
    return this.store.get().meta.errors
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
