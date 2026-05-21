import { fieldBrand } from './createContexts'
import type { FieldWithValue } from '@tanstack/react-form'

interface SelectMenuProps<T extends string> {
  field: FieldWithValue<T>
  options: NoInfer<Array<T>>
}
function SelectMenu<T extends string>(_props: SelectMenuProps<T>) {
  return null // TODO stub
}

export const AppFormSelectMenu = fieldBrand.loose<string>()(SelectMenu)
