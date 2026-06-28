import { batch } from '@tanstack/store'
import { touchAllFieldsAndCollectSubmitValidators } from './fieldTree.lib'
import type { AnyInternalFieldApi, NameSegment } from './FieldApi.lib'
import type { ChildContributionStates } from './fieldState.lib'
import type { AnyInternalFormApi, FormMetaAtoms } from '../FormApi/FormApi.lib'

export type RootCounterContributionKey = 'touched' | 'validating'

export const rootCounterContributionKeys: Array<RootCounterContributionKey> = [
  'touched',
  'validating',
]

const rootCounterMetaKeys: Record<
  RootCounterContributionKey,
  keyof Pick<FormMetaAtoms, 'touchedFieldCount' | 'fieldValidationCount'>
> = {
  touched: 'touchedFieldCount',
  validating: 'fieldValidationCount',
}

export class InternalRootFieldApi {
  readonly _isRoot = true
  #children: Map<NameSegment, AnyInternalFieldApi> = new Map()

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

    this.form._atoms.meta.errorFields.set((prev) => {
      const errorFields = new Set(prev)

      if (newContributes) {
        errorFields.add(node)
      } else {
        errorFields.delete(node)
      }

      return errorFields
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

        if (prevContributes === newContributes) continue

        const atom = this.form._atoms.meta[rootCounterMetaKeys[key]]
        atom.set((prev) => {
          const delta = newContributes ? 1 : -1
          return Math.max(0, prev + delta)
        })
      }
    })
  }

  _removeChild(segment: NameSegment): void {
    this.#children.delete(segment)
  }

  _touchAllFieldsAndCollectSubmitValidators(): Array<AnyInternalFieldApi> {
    return touchAllFieldsAndCollectSubmitValidators(this)
  }
}
