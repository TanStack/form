import type { ReadonlyAtom } from '@tanstack/store'
import type { FormApiArrayMethods } from '../FormApi/FormApiArrayMethods.types.public'
import type { FormApiFieldMethods } from '../FormApi/FormApiFieldMethods.types.public'

export interface FieldGroupApi<in out TFieldData>
  extends FormApiFieldMethods<TFieldData>, FormApiArrayMethods<TFieldData> {
  atom: ReadonlyAtom<TFieldData>
}
