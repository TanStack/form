import type { Atom } from '@tanstack/store'
import type { FieldApiNode } from './FieldApi.internal'
import type { FieldApiParams } from './FieldApi.types'

function tryGetIndexOfSegment(segment: string): number | null {
  // `name` might be `[0]` or `.1`, but cannot be `[0][1]`, because we only look for direct children
  const indexMatch = segment.match(/^\[?(\d+)\]?$/)
  if (indexMatch && indexMatch[1]) {
    return parseInt(indexMatch[1], 10)
  }
  return null
}

class FieldApiImpl implements FieldApiNode {
  _type: 'array' | null = null
  _segment: string
  _parent: FieldApiNode | null
  _childrenArray: Array<FieldApiNode> = []
  _childrenMap: Map<string, FieldApiNode> = new Map()

  get _isArray() {
    return this._type === 'array'
  }

  get _children(): Array<FieldApiNode> {
    if (this._isArray) {
      return this._childrenArray
    }
    return Array.from(this._childrenMap.values())
  }

  get name(): string {
    if (!this._parent) return this._segment
    return this._parent.name + this._segment
  }

  constructor({ segment, parent }: FieldApiParams) {
    this._segment = segment
    this._parent = parent
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
    const node = createFieldNode({ segment, parent: this })
    this._setChild(node)
    return node
  }

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
  }
}

export function createFieldNode(fieldOptions: FieldApiParams): FieldApiNode {
  return new FieldApiImpl(fieldOptions)
}
