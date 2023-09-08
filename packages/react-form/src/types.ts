import type { FieldOptions } from '@tanstack/form-core'

export type UseFieldOptions<TData, TFormData> = FieldOptions<
  TData,
  TFormData
> & {
  mode?: 'value' | 'array'
}
