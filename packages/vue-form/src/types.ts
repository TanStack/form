import type { FieldOptions, RestrictTName } from '@tanstack/form-core'

export type UseFieldOptions<
  _TData,
  TFormData,
  ValidatorType,
  TName extends RestrictTName<TFormData>,
  TData,
> = FieldOptions<_TData, TFormData, ValidatorType, TName, TData> & {
  mode?: 'value' | 'array'
}
