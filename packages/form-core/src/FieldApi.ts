import { createAtom } from '@tanstack/store'
import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApi } from './FormApi.types'
import type { FieldApiNode } from './FieldApi.internal'
import type { FieldApiParams, FieldMeta } from './FieldApi.types'

function tryGetIndexOfSegment(segment: string): number | null {
  // `name` might be `[0]` or `.1`, but cannot be `[0][1]`, because we only look for direct children
  const indexMatch = segment.match(/^\[?(\d+)\]?$/)
  if (indexMatch && indexMatch[1]) {
    return parseInt(indexMatch[1], 10)
  }
  return null
}

export const defaultFieldMeta: FieldMeta = {
  isTouched: false,
}

class FieldApiImpl implements FieldApiNode {
  _type: 'array' | null
  _segment
  _parent
  _childrenArray: Array<FieldApiNode> = []
  _childrenMap: Map<string, FieldApiNode> = new Map()
  _fullPathCache: string | null = null
  _store: ReadonlyAtom<any> | null = null

  form: FormApi<any>

  get _isArray() {
    return this._type === 'array'
  }

  get _children(): Array<FieldApiNode> {
    if (this._isArray) {
      return this._childrenArray
    }
    return Array.from(this._childrenMap.values())
  }

  get store(): ReadonlyAtom<any> {
    if (!this._store) {
      const derived = createAtom(() => {
        const metaMap = this.form.fieldMetaAtom.get()
        const fieldMeta = metaMap[this.name]

        return {
          meta: fieldMeta ?? defaultFieldMeta,
        }
      })

      if (this.form.fieldMetaAtom.get()[this.name] === undefined) {
        this.form.fieldMetaAtom.set((prev) => {
          return { ...prev, [this.name]: defaultFieldMeta }
        })
      }
      this._store = derived
    }
    return this._store
  }

  get name(): string {
    if (this._fullPathCache) return this._fullPathCache
    this._fullPathCache = this._parent?.name + this._segment
    return this._fullPathCache
  }

  constructor({ segment, parent, form }: FieldApiParams) {
    this._segment = segment
    this._parent = parent
    this._type = null // Array.isArray(form.getFieldValue())
    this.form = form
  }

  _invalidateFullPath = () => {
    this._fullPathCache = null
    this._children.forEach((child) => child._invalidateFullPath())
  }

  _getFieldBySegmentName(name: string): FieldApiNode | undefined {
    if (this._isArray) {
      const index = tryGetIndexOfSegment(name)
      if (index !== null) {
        return this._childrenArray[index]
      }
      return undefined
    }
    return this._childrenMap.get(name)
  }

  _setChild = (node: FieldApiNode): void => {
    if (this._isArray) {
      const index = tryGetIndexOfSegment(node._segment)
      if (index !== null) {
        this._childrenArray[index] = node
      }
    } else {
      this._childrenMap.set(node._segment, node)
    }
  }

  _createChild = (segment: string): FieldApiNode => {
    const node = createFieldNode({ segment, parent: this, form: this.form })
    this._setChild(node)
    return node
  }

  // data: ['a', 'b']
  // name="data[0]" -> node created, meta created
  // data.swapValues(0, 1) -> valid, but node errors
  // -> swapValues or other arary mutations need to check runtime -> swap values in the array -> THAT's where the check has to occur.
  // after we made the form data update, we getOrCreateNode() of the two elements

  swapValues = (oldIndex: number, newIndex: number) => {
    if (!this._isArray) {
      console.warn('swapValues can only be used on array nodes')
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
    newChild._segment = `[${newIndex}]`
    oldChild._segment = `[${oldIndex}]`

    oldChild._invalidateFullPath()
    newChild._invalidateFullPath()
  }

  pushValue = () => {
    if (!this._isArray) {
      console.warn('pushValues can only be used on array nodes')
      return
    }
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

export function createFieldNode(fieldOptions: FieldApiParams): FieldApiNode {
  return new FieldApiImpl(fieldOptions)
}
