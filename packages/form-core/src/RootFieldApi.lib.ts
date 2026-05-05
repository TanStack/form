import type { InternalFieldApi, NameSegment } from './FieldApi.lib'
import type { InternalFormApi } from './FormApi.lib'

export class InternalRootFieldApi<TData> {
  readonly _isRoot = true
  #children: Map<NameSegment, InternalFieldApi<TData, any>> = new Map()
  readonly _pathVersion = 0

  form: InternalFormApi<TData, any>

  readonly name = ''

  get _children(): Array<InternalFieldApi<TData, any>> {
    return Array.from(this.#children.values())
  }

  constructor(form: InternalFormApi<TData, any>) {
    this.form = form
  }

  /**
   * @private
   * Get a child FieldApi by its segment name.
   */
  _getChild(segment: NameSegment): InternalFieldApi<TData, any> | undefined {
    return this.#children.get(segment)
  }

  /**
   * @private
   * Set an existing node as a child of this root node.
   */
  _setChild(node: InternalFieldApi<TData, any>): void {
    this.#children.set(node._segment, node)
  }

  _addToTouchedFields(node: InternalFieldApi<any, any>) {
    this.form._formMetaAtom.set((prev) => {
      if (prev.touchedFields.has(node)) {
        return prev
      }
      const newSet = new Set(prev.touchedFields)
      newSet.add(node)
      return { ...prev, touchedFields: newSet }
    })
  }

  _removeChild(segment: NameSegment): void {
    this.#children.delete(segment)
  }

  _removeFromTouchedFieldsBatch(nodes: Set<InternalFieldApi<any, any>>) {
    this.form._formMetaAtom.set((prev) => {
      const newSet = new Set(prev.touchedFields)
      for (const node of nodes) {
        newSet.delete(node)
      }
      if (newSet.size === prev.touchedFields.size) {
        return prev
      }
      return { ...prev, touchedFields: newSet }
    })
  }
}
