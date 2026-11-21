import type { FormApiFieldMethods } from '../FormApi/FormApiFieldMethods.types.public'
import type { FormApiArrayMethods } from '../FormApi/FormApiArrayMethods.types.public'
import type { ReadonlyAtom } from '@tanstack/store'

export interface FieldGroupApi<in out TFieldData>
  extends FormApiFieldMethods<TFieldData>, FormApiArrayMethods<TFieldData> {
  atom: ReadonlyAtom<TFieldData>
}
