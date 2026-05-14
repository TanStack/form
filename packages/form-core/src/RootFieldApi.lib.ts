import type { AnyInternalFieldApi, NameSegment } from './FieldApi.lib'
import type { AnyInternalFormApi } from './FormApi.lib'

export class InternalRootFieldApi {
  readonly _isRoot = true
  #children: Map<NameSegment, AnyInternalFieldApi> = new Map()
  readonly _pathVersion = 0

  form: AnyInternalFormApi

  readonly name = ''

  get _children(): Array<AnyInternalFieldApi> {
    return Array.from(this.#children.values())
  }

  constructor(form: AnyInternalFormApi) {
    this.form = form
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
   * Set an existing node as a child of this root node.
   */
  _setChild(node: AnyInternalFieldApi): void {
    this.#children.set(node._segment, node)
  }

  _addToTouchedFields(node: AnyInternalFieldApi) {
    this.form._formMetaAtom.set((prev) => {
      if (prev.touchedFields.has(node)) {
        return prev
      }
      const newSet = new Set(prev.touchedFields)
      newSet.add(node)
      return { ...prev, touchedFields: newSet }
    })
  }

  _updateErrorFields(
    node: AnyInternalFieldApi,
    prevContributes: boolean,
    newContributes: boolean,
  ) {
    if (prevContributes === newContributes) return

    this.form._formMetaAtom.set((prev) => {
      const errorFields = new Set(prev.errorFields)

      if (newContributes) {
        errorFields.add(node)
      } else {
        errorFields.delete(node)
      }

      return { ...prev, errorFields }
    })
  }

  _removeChild(segment: NameSegment): void {
    this.#children.delete(segment)
  }

  _removeFromTouchedFieldsBatch(nodes: Set<AnyInternalFieldApi>) {
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

  _touchAllFieldsAndCollectSubmitValidators(): Array<AnyInternalFieldApi> {
    const fieldsWithValidators: Array<AnyInternalFieldApi> = []
    const stack = [...this._children]

    while (stack.length > 0) {
      const field = stack.pop()!

      field._notifyEvent(
        {
          causeValidation: false,
          markAsBlurred: false,
          markAsDirty: false,
          // Touch all fields
          markAsTouched: true,
          // We're doing DFS, so propagation is useless
          doPropagate: false,
        },
        'submit',
      )

      stack.push(...field._children)

      if (field._validators && field._validators.length > 0) {
        fieldsWithValidators.push(field)
      }
    }

    return fieldsWithValidators
  }
}
