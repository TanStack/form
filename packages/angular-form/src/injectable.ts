import { Injectable, inject, signal } from '@angular/core'
import type { FieldApi, FormErrorTypes } from '@tanstack/form-core'

@Injectable({ providedIn: null })
export class TanStackFieldInjectable<
  TFieldValue,
  TFieldName = any,
  TFieldError = any,
  TFormData = any,
  TFormErrorTypes extends FormErrorTypes = any,
> {
  _api = signal<
    FieldApi<
      TFieldName,
      TFieldValue,
      TFieldError,
      TFormData,
      TFormErrorTypes
    >
  >(null as never)

  get api() {
    return this._api()
  }
}

/** Injects the field provided by an ancestor `tanstack-app-field` directive. */
export function injectField<TFieldValue>(): TanStackFieldInjectable<TFieldValue> {
  return inject(TanStackFieldInjectable<TFieldValue>)
}
