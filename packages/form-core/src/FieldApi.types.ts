import type { FieldApiNode } from './FieldApi.internal'
import type { FormApi } from './FormApi.types'

export interface FieldMeta {
  isTouched: boolean
}

export interface FieldApi {
  /**
   * The name of the field.
   */
  get name(): string
  /**
   * Swap two elements in this field's array.
   * If this field is not an array, this method is ignored.
   */
  swapValues: (indexA: number, indexB: number) => void
}

export interface FieldApiParams {
  segment: string
  parent: FieldApiNode | null
  form: FormApi<any>
}
