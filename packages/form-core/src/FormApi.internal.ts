import type { FieldApiNode } from './FieldApi.internal'
import type { FormApi } from './FormApi.types'

export interface InternalFormApi<TData> extends FormApi<TData> {
  _requestField: (name: string) => FieldApiNode
  _fieldRootNode: FieldApiNode
}
