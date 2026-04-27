import type { InternalFieldApi, NameSegment } from './FieldApi.lib'
import type { InternalFormApi } from './FormApi.lib'

export class InternalRootFieldApi<TData> {
  readonly _isRoot = true
  #children: Map<NameSegment, InternalFieldApi<TData>> = new Map()

  form: InternalFormApi<TData>

  readonly name = ''

  get _children(): Array<InternalFieldApi<TData>> {
    return Array.from(this.#children.values())
  }

  constructor(form: InternalFormApi<TData>) {
    this.form = form
  }

  /**
   * @private
   * Get a child FieldApi by its segment name.
   */
  _getChild(segment: NameSegment): InternalFieldApi<TData> | undefined {
    return this.#children.get(segment)
  }

  /**
   * @private
   * Set an existing node as a child of this root node.
   */
  _setChild(node: InternalFieldApi<TData>): void {
    this.#children.set(node._segment, node)
  }

  _addToTouchedFields(node: InternalFieldApi<any>) {
    this.form._formMetaAtom.set((prev) => {
      if (prev.touchedFields.has(node)) {
        return prev
      }
      const newSet = new Set(prev.touchedFields)
      newSet.add(node)
      return { ...prev, touchedFields: newSet }
    })
  }

  _removeFromTouchedFields(node: InternalFieldApi<any>) {
    this.form._formMetaAtom.set((prev) => {
      if (!prev.touchedFields.has(node)) {
        return prev
      }
      const newSet = new Set(prev.touchedFields)
      newSet.delete(node)
      return { ...prev, touchedFields: newSet }
    })
  }
}
