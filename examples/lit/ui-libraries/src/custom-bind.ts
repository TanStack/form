import { bind as nativeBind } from '@tanstack/lit-form'
import { getMWCAccessor } from './mwc-accesors.ts'
import type { FieldApi } from '@tanstack/lit-form'

export const bind = (field: FieldApi<any, any, any, any, any>) =>
  nativeBind(field, getMWCAccessor)
