import { createFieldNode } from './FieldApi'
import type { FieldApi, FieldApiParams } from './FieldApi.types'

export function nameToFiedNodeSegments(
  nameOrSegments: string | Array<string>,
): Array<string> {
  if (typeof nameOrSegments !== 'string') return nameOrSegments

  const result: Array<string> = []
  let s = ''
  for (const char of nameOrSegments) {
    if (char === '.' || char === '[') {
      result.push(s)
      s = char
    } else {
      s += char
    }
  }
  result.push(s)
  return result
}

export function getOrCreateFieldApiNode(
  trieNode: FieldApiNode,
  segments: Array<string>,
): FieldApiNode {
  const [segment, ...nextSegments] = segments
  if (!segment) return trieNode

  let childNode = trieNode._getFieldBySegmentName(segment)
  if (childNode) {
    return getOrCreateFieldApiNode(childNode, nextSegments)
  }

  childNode = createFieldNode({ segment, parent: trieNode })

  trieNode._setChild(childNode)

  return getOrCreateFieldApiNode(childNode, nextSegments)
}

export interface FieldApiNode extends FieldApi {
  _type: 'array' | null

  get _isArray(): boolean

  /**
   * @private
   * Only used when `this._isArray()`
   */
  _childrenArray: Array<FieldApiNode>
  /**
   * @private
   * Only used when `this._isArray()` is false
   */
  _childrenMap: Map<string, FieldApiNode>

  _getFieldBySegmentName: (name: string) => FieldApiNode | undefined

  _setChild: (node: FieldApiNode) => void

  _createChild: (segment: string) => FieldApiNode

  get _children(): Array<FieldApiNode>

  /**
   * @private
   * The segment of this node, representing the current accessor.
   *
   * @example
   * - 'root'
   * - '.nested'
   * - '[0]'
   * - '[15]'
   */
  _segment: string
  /**
   * @private
   * The parent of this node. `null` if this node is a root.
   */
  _parent: FieldApi | null
}
