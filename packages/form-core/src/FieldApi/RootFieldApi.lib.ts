import { batch } from '@tanstack/store'
import { ValidationErrorStore } from '../validation/errorStorage.lib'
import type { AnyInternalFormApi, FormMetaAtoms } from '../FormApi/FormApi.lib'
import type { NameSegment } from '../utils.lib'
import type { AnyInternalFieldApi } from './FieldApi.lib'
import type { SubfieldsMetaFlags } from './fieldState.lib'

export type FormMetaCountKey = 'touched' | 'validating'

export const formMetaCountKeys: Array<FormMetaCountKey> = [
  'touched',
  'validating',
]

const formMetaCountAtomKeys: Record<
  FormMetaCountKey,
  keyof Pick<FormMetaAtoms, 'touchedFieldCount' | 'fieldValidationCount'>
> = {
  touched: 'touchedFieldCount',
  validating: 'fieldValidationCount',
}

export class InternalRootFieldApi {
  readonly _isRoot = true
  /**
   * The errors of the form itself (AKA a field with name '').
   */
  readonly _errorStore: ValidationErrorStore = new ValidationErrorStore({
    target: this,
  })
  #children: Map<NameSegment, AnyInternalFieldApi> = new Map()

  form: AnyInternalFormApi

  readonly name = ''

  get _children(): Array<AnyInternalFieldApi> {
    return Array.from(this.#children.values())
  }

  constructor(form: AnyInternalFormApi) {
    this.form = form
  }

  _clearErrors(): void {
    this._errorStore.clearTargetErrors()
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
    wasInvalid: boolean,
    isInvalid: boolean,
  ) {
    if (wasInvalid === isInvalid) return

    this.form._atoms.meta.errorFields.set((prev) => {
      const errorFields = new Set(prev)

      if (isInvalid) {
        errorFields.add(node)
      } else {
        errorFields.delete(node)
      }

      return errorFields
    })
  }

  _updateFormMetaCounts(
    previousFlags: SubfieldsMetaFlags,
    nextFlags: SubfieldsMetaFlags,
  ) {
    batch(() => {
      for (const key of formMetaCountKeys) {
        const wasSet = previousFlags[key]
        const isSet = nextFlags[key]

        if (wasSet === isSet) continue

        const atom = this.form._atoms.meta[formMetaCountAtomKeys[key]]
        atom.set((prev) => {
          const delta = isSet ? 1 : -1
          return Math.max(0, prev + delta)
        })
      }
    })
  }

  _removeChild(segment: NameSegment): void {
    this.#children.delete(segment)
  }
}
