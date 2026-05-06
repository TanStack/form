import type { FieldApi } from './FieldApi.public'
import type { FormValidator, ValidationEvent } from './validation.public'

export interface FieldListenerContext<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> {
  value: any
  fieldApi: FieldApi<TFormData, TFormValidators>
}

export type FieldListenerFn<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> = (context: FieldListenerContext<TFormData, TFormValidators>) => void

export interface FieldListenerConfig<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> {
  listener: FieldListenerFn<TFormData, TFormValidators>
  debounceMs?: number
}

export type FieldListenerEvents = ValidationEvent | 'mount' | 'unmount'

export type FieldListeners<
  TFormData,
  TFormValidators extends Array<FormValidator<TFormData>>,
> = Partial<
  Record<
    FieldListenerEvents,
    | FieldListenerConfig<TFormData, TFormValidators>
    | FieldListenerFn<TFormData, TFormValidators>
  >
>
