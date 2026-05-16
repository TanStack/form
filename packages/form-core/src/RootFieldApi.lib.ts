import { batch } from '@tanstack/store'
import type {
  AnyInternalFieldApi,
  ChildContributionStates,
  NameSegment,
} from './FieldApi.lib'
import type { AnyInternalFormApi, BaseFormMeta } from './FormApi.lib'

export type RootCounterContributionKey = 'touched' | 'validating'

export const rootCounterContributionKeys: Array<RootCounterContributionKey> = [
  'touched',
  'validating',
]

const rootCounterMetaKeys: Record<
  RootCounterContributionKey,
  keyof Pick<BaseFormMeta, 'touchedFieldCount' | 'fieldValidationCount'>
> = {
  touched: 'touchedFieldCount',
  validating: 'fieldValidationCount',
}

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

  _updateFieldContributionCount(
    prevState: ChildContributionStates,
    newState: ChildContributionStates,
  ) {
    batch(() => {
      for (const key of rootCounterContributionKeys) {
        const prevContributes = prevState[key]
        const newContributes = newState[key]

        if (prevContributes === newContributes) return

        this.form._formMetaAtom.set((prev) => {
          const metaKey = rootCounterMetaKeys[key]
          const delta = newContributes ? 1 : -1
          const count = Math.max(0, prev[metaKey] + delta)

          if (prev[metaKey] === count) {
            return prev
          }

          return { ...prev, [metaKey]: count }
        })
      }
    })
  }

  _removeChild(segment: NameSegment): void {
    this.#children.delete(segment)
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
